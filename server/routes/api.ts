// All API routes — single source of truth
// Handles contact form, form config admin, blog CRUD, lead management

import type { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { IStorage } from "../services/storage";
import { insertContactLeadSchema, insertBlogPostSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { sanitizeHtml, sanitizeText } from "../middleware/sanitize";
import { checkRateLimit, getClientIp } from "../middleware/rate-limit";
import { sendContactNotification } from "../services/email";
import { validateOrigin, requireSameOrigin } from "../middleware/csrf";
import { isDisposableEmail } from "../middleware/email-blocklist";
import {
  DEFAULT_FORM_FIELDS, SETTING_DEFAULTS, getFormConfig, readFormConfig, invalidateFormConfig, validateAnswers,
  fieldUpdateSchema, customFieldSchema, settingsSchema, applyFieldUpdate, newCustomField,
} from "../services/form-config";
import { verifyTurnstile } from "../services/turnstile";

interface ApiConfig {
  email?: SendEmail;
  db?: any;
  turnstileSecret?: string; // Worker secret TURNSTILE_SECRET; never stored, logged or sent to the browser
}

const VERIFY_FAILED = "Verification failed, please retry";

export function registerApiRoutes(
  app: Hono<any>,
  getStorage: (c: any) => IStorage,
  getConfig: (c: any) => ApiConfig
) {
  // Origin validation for all API mutations
  app.use("/api/*", async (c, next) => {
    if (["POST", "PUT", "DELETE"].includes(c.req.method)) {
      if (!validateOrigin(c.req.raw.headers)) {
        return c.json({ message: "Forbidden" }, 403);
      }
    }
    await next();
  });

  // Contact form submission; a full submission is a few KB, the cap stops multi-MB rows and emails
  app.post("/api/contact", bodyLimit({ maxSize: 64 * 1024, onError: (c) => c.json({ message: "Submission too large" }, 413) }), async (c) => {
    try {
      const ip = getClientIp(c.req.raw.headers);

      const config = getConfig(c);
      const rateCheck = await checkRateLimit(ip, config.db);
      if (!rateCheck.allowed) {
        return c.html(`
          <div id="contact-form-result" class="glass-card p-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4">
              <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-white mb-2">Too Many Requests</h3>
            <p class="text-white/50">Please wait a few minutes before submitting again.</p>
          </div>
        `, 429);
      }

      const body = await c.req.json();

      // Honeypot check
      // any non-empty value, string or not, is a bot (a non-string used to throw and return 500)
      if (body._hp_website != null && String(body._hp_website).trim() !== "") {
        console.log(`Bot detected via honeypot from IP: ${ip}`);
        return c.html(`
          <div id="contact-form-result" class="glass-card p-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-white mb-2">Message Sent!</h3>
            <p class="text-white/50">We'll get back to you within 24 hours.</p>
          </div>
        `);
      }

      // _source is visitor-controlled and printed in the admin table: only two values exist
      const source = body._source === "support" ? "support" : "contact";
      delete body._hp_website;
      delete body._source;

      const validatedData = insertContactLeadSchema.safeParse(body);
      if (!validatedData.success) {
        const validationError = fromError(validatedData.error);
        return c.json({ message: validationError.toString(), errors: validatedData.error.flatten().fieldErrors }, 400);
      }

      const storage = getStorage(c);
      let form = await getFormConfig(storage);
      const token = typeof body.turnstileToken === "string" ? body.turnstileToken.trim() : "";
      // A page rendered after Turnstile was switched off sends no token, while this isolate may still hold the
      // "on" config for up to 60 seconds: re-read it before refusing (2 extra reads, only on this path)
      if (form.turnstileSiteKey && source === "contact" && !token) {
        invalidateFormConfig();
        form = await getFormConfig(storage);
      }
      // The support form is not operator-configured: its posts are checked against the code defaults
      const answers = validateAnswers(body, source === "support" ? DEFAULT_FORM_FIELDS : form.fields);
      if ("error" in answers) return c.json({ message: answers.error }, 400);

      if (isDisposableEmail(validatedData.data.email)) {
        return c.html(`
          <div id="contact-form-result" class="glass-card p-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4">
              <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-white mb-2">Invalid Email</h3>
            <p class="text-white/50">Please use a permanent email address. Temporary or disposable email addresses are not accepted.</p>
          </div>
        `, 422);
      }

      // Turnstile (D-016): after the rate limit and honeypot so bots can't spend siteverify calls, before the insert
      // so a failed check stores nothing. Both forms carry the widget, so both sources are checked.
      let botCheck: string | null = null;
      if (form.turnstileSiteKey) {
        if (!token || token.length > 2048) return c.json({ message: VERIFY_FAILED }, 403);
        if (!config.turnstileSecret) console.error("Turnstile is on but TURNSTILE_SECRET is not set; lead kept as unverified");
        const result = config.turnstileSecret ? await verifyTurnstile(config.turnstileSecret, token, ip) : "unverified";
        if (result === "failed") return c.json({ message: VERIFY_FAILED }, 403);
        botCheck = result;
      }

      // Free-text answers come back from validateAnswers already escaped; choices are allowlisted values
      const lead = await storage.createContactLead({
        name: sanitizeText(validatedData.data.name),
        email: validatedData.data.email.toLowerCase().trim(),
        company: sanitizeText(validatedData.data.company),
        impressions: validatedData.data.impressions,
        ...answers.values,
        customFields: Object.keys(answers.custom).length ? JSON.stringify(answers.custom) : null,
        botCheck,
        ip,
        source,
      });

      // waitUntil keeps the Worker alive for the send after the response returns; a bare promise gets cancelled
      if (config.email) {
        c.executionCtx.waitUntil(sendContactNotification(config.email, lead, form.fields));
      }

      return c.html(`
        <div id="contact-form-result" class="glass-card p-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-white mb-2">Message Sent!</h3>
          <p class="text-white/50">We'll get back to you within 24 hours. Thank you for your interest in HBDR.</p>
        </div>
      `);
    } catch (error) {
      console.error("Error creating contact lead:", error);
      return c.html(`
        <div id="contact-form-result" class="glass-card p-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-white mb-2">Something went wrong</h3>
          <p class="text-white/50">Please try again or email us directly at contact@hbdr.com</p>
        </div>
      `, 500);
    }
  });

  // Form config admin (D-016). Cloudflare Access covers /admin/api/form-config* (ADMIN_PATHS); a mutation must also
  // carry a same-origin Origin header. Reads here skip the 60s cache so the admin sees what is stored.
  app.use("/admin/api/form-config/*", async (c, next) => {
    if (c.req.method !== "GET" && !requireSameOrigin(c.req.raw.headers)) return c.json({ message: "Forbidden" }, 403);
    await next();
  });

  // the verified Access email; the dev server runs without Access
  const actor = (c: any): string => c.get("accessEmail") ?? "local-dev";

  app.get("/admin/api/form-config", async (c) => {
    const storage = getStorage(c);
    const [{ fields, settings }, changes] = await Promise.all([readFormConfig(storage), storage.getFormConfigChanges(50)]);
    return c.json({
      fields,
      settings: { turnstileEnabled: settings.turnstile_enabled === "true", turnstileSiteKey: settings.turnstile_site_key },
      turnstileSecretSet: Boolean(getConfig(c).turnstileSecret),
      changes,
    });
  });

  app.post("/admin/api/form-config/fields/:key", async (c) => {
    const parsed = fieldUpdateSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ message: fromError(parsed.error).toString() }, 400);
    const storage = getStorage(c);
    const key = c.req.param("key");
    const { overrides, fields } = await readFormConfig(storage);
    const field = fields.find((f) => f.key === key);
    if (!field) return c.json({ message: "Unknown field" }, 404);
    const result = applyFieldUpdate(field, overrides[key] ? JSON.parse(overrides[key]) : {}, parsed.data);
    if ("error" in result) return c.json({ message: result.error }, 400);
    await storage.saveFieldOverride(key, JSON.stringify(result.config), overrides[key] ?? null, actor(c));
    invalidateFormConfig();
    return c.json({ ok: true });
  });

  app.post("/admin/api/form-config/fields", async (c) => {
    const parsed = customFieldSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ message: fromError(parsed.error).toString() }, 400);
    const storage = getStorage(c);
    const { fields } = await readFormConfig(storage);
    const result = newCustomField(fields, parsed.data);
    if ("error" in result) return c.json({ message: result.error }, 400);
    await storage.saveFieldOverride(result.key, JSON.stringify(result.config), null, actor(c));
    invalidateFormConfig();
    return c.json({ key: result.key }, 201);
  });

  app.post("/admin/api/form-config/settings", async (c) => {
    const parsed = settingsSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ message: fromError(parsed.error).toString() }, 400);
    const storage = getStorage(c);
    const stored = await storage.getFormSettings();
    const current = { ...SETTING_DEFAULTS, ...stored };
    const next: Record<string, string> = {
      turnstile_enabled: parsed.data.turnstileEnabled === undefined ? current.turnstile_enabled : String(parsed.data.turnstileEnabled),
      turnstile_site_key: parsed.data.turnstileSiteKey ?? current.turnstile_site_key,
    };
    // A widget without a working secret would refuse or mislabel every lead
    if (next.turnstile_enabled === "true" && (!getConfig(c).turnstileSecret || !next.turnstile_site_key)) {
      return c.json({ message: "Turnstile needs the TURNSTILE_SECRET Worker secret and a site key before it can be on." }, 409);
    }
    const changes = Object.entries(next)
      .filter(([key, value]) => current[key] !== value)
      .map(([key, value]) => ({ key, value, before: stored[key] ?? null }));
    await storage.saveFormSettings(changes, actor(c));
    invalidateFormConfig();
    return c.json({ ok: true });
  });

  // Blog CRUD API
  app.post("/api/blog", async (c) => {
    try {
      const storage = getStorage(c);
      const body = await c.req.json();
      const validated = insertBlogPostSchema.safeParse(body);
      if (!validated.success) {
        const validationError = fromError(validated.error);
        return c.json({ message: validationError.toString(), errors: validated.error.flatten().fieldErrors }, 400);
      }
      const existing = await storage.getBlogPostBySlug(validated.data.slug);
      if (existing) return c.json({ message: "A post with this slug already exists" }, 400);
      validated.data.content = sanitizeHtml(validated.data.content);
      const post = await storage.createBlogPost(validated.data);
      return c.json(post, 201);
    } catch (error) {
      console.error("Error creating blog post:", error);
      return c.json({ message: "Internal server error" }, 500);
    }
  });

  app.put("/api/blog/:id", async (c) => {
    try {
      const storage = getStorage(c);
      const id = c.req.param("id");
      const body = await c.req.json();
      const existing = await storage.getBlogPostById(id);
      if (!existing) return c.json({ message: "Post not found" }, 404);
      const updateSchema = insertBlogPostSchema.partial();
      const validated = updateSchema.safeParse(body);
      if (!validated.success) {
        const validationError = fromError(validated.error);
        return c.json({ message: validationError.toString(), errors: validated.error.flatten().fieldErrors }, 400);
      }
      if (validated.data.slug && validated.data.slug !== existing.slug) {
        const slugExists = await storage.getBlogPostBySlug(validated.data.slug);
        if (slugExists) return c.json({ message: "A post with this slug already exists" }, 400);
      }
      if (validated.data.content) validated.data.content = sanitizeHtml(validated.data.content);
      const updated = await storage.updateBlogPost(id, validated.data);
      return c.json(updated);
    } catch (error) {
      console.error("Error updating blog post:", error);
      return c.json({ message: "Internal server error" }, 500);
    }
  });

  app.delete("/api/blog/:id", async (c) => {
    try {
      const storage = getStorage(c);
      const id = c.req.param("id");
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) return c.json({ message: "Post not found" }, 404);
      return c.json({ message: "Post deleted" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return c.json({ message: "Internal server error" }, 500);
    }
  });

  // Lead list lives under /api/leads so Cloudflare Access covers it; /api/contact stays public for the form POST
  app.get("/api/leads", async (c) => {
    try {
      const storage = getStorage(c);
      const leads = await storage.getContactLeads();
      return c.json(leads);
    } catch (error) {
      console.error("Error fetching contact leads:", error);
      return c.json({ message: "Internal server error" }, 500);
    }
  });

  // Lead status update
  app.post("/api/leads/:id/status", async (c) => {
    const storage = getStorage(c);
    const id = c.req.param("id");
    const body = await c.req.json();
    if (!["new", "contacted", "qualified", "converted", "archived"].includes(body.status)) {
      return c.json({ message: "Invalid status" }, 400);
    }
    const updated = await storage.updateContactLeadStatus(id, body.status);
    if (!updated) return c.json({ message: "Lead not found" }, 404);
    return c.json(updated);
  });
}
