import { describe, it, expect, beforeEach, vi } from "vitest";
import { Hono } from "hono";
import { registerApiRoutes } from "../api";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";
import { invalidateFormConfig, DEFAULT_FORM_FIELDS } from "../../services/form-config";
import { renderContactFormSection } from "../../templates/components/contact-form";
import { renderAdminLeadsPage } from "../../templates/admin/leads";

// The rate limiter is per IP and in memory: every submission gets its own address
let ipCounter = 0;
const SAME_ORIGIN = { Origin: "http://localhost", Host: "localhost" };
const base = { name: "Jane", email: "jane@publisher.com", company: "Pub", impressions: "10m-50m" };

function setup(config: { turnstileSecret?: string } = {}) {
  const app = new Hono();
  const storage = new MemStorage();
  const send = vi.fn().mockResolvedValue({ messageId: "m1" });
  // stands in for accessGuard, which sets the verified Access email in production
  app.use("*", async (c, next) => { c.set("accessEmail", "ops@hbdr.com"); await next(); });
  registerPageRoutes(app, () => storage);
  registerApiRoutes(app, () => storage, () => ({ db: null, email: { send } as unknown as SendEmail, ...config }));
  const admin = (path: string, body: unknown, headers: Record<string, string> = SAME_ORIGIN) =>
    app.request(path, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  const submit = async (body: object) => {
    const pending: Promise<unknown>[] = [];
    const res = await app.request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...SAME_ORIGIN, "CF-Connecting-IP": `203.0.113.${++ipCounter}` },
      body: JSON.stringify(body),
    }, {}, { waitUntil: (p: Promise<unknown>) => pending.push(p), passThroughOnException: () => {} } as any);
    await Promise.all(pending);
    return res;
  };
  const page = async () => (await app.request("/contact")).text();
  return { app, storage, send, admin, submit, page };
}

beforeEach(() => invalidateFormConfig());

describe("form config admin: locked fields", () => {
  it("refuses to hide, unrequire or move a locked field and writes nothing", async () => {
    const { admin, storage } = setup();
    for (const change of [{ visible: false }, { required: false }, { order: 5 }]) {
      const res = await admin("/api/form-config/fields/email", change);
      expect(res.status).toBe(400);
      expect((await res.json()).message).toContain("always shown and required");
    }
    expect(await storage.getFieldOverrides()).toEqual({});
    expect(await storage.getFormConfigChanges(50)).toEqual([]);
  });

  it("lets the operator relabel a locked field, with an audit row naming the Access user", async () => {
    const { admin, storage, page } = setup();
    expect((await admin("/api/form-config/fields/email", { label: "Business email" })).status).toBe(200);
    expect(await page()).toContain("Business email");
    const [change] = await storage.getFormConfigChanges(50);
    expect(change).toMatchObject({ actor: "ops@hbdr.com", target: "field:email", before: null, after: JSON.stringify({ label: "Business email" }) });
  });

  it("404s an unknown field and 400s a body with unknown keys", async () => {
    const { admin } = setup();
    expect((await admin("/api/form-config/fields/nope", { label: "x" })).status).toBe(404);
    expect((await admin("/api/form-config/fields/phone", { locked: false })).status).toBe(400);
  });
});

describe("form config admin: options", () => {
  const roleOptions = (retire: string) => ["Owner / Founder", "Ad Operations", "Revenue / Monetization", "Product / Engineering", "Agency / Consultant", "Other"]
    .map((value) => ({ value, active: value !== retire }));

  it("refuses to delete an option, and to add one with markup", async () => {
    const { admin } = setup();
    expect((await admin("/api/form-config/fields/role", { options: [{ value: "Other", active: true }] })).status).toBe(400);
    expect((await admin("/api/form-config/fields/role", { options: [...roleOptions(""), { value: "<b>x</b>", active: true }] })).status).toBe(400);
  });

  it("hides a retired option from the form but still accepts it from a cached page", async () => {
    const { admin, submit, storage, page } = setup();
    expect((await admin("/api/form-config/fields/role", { options: roleOptions("Agency / Consultant") })).status).toBe(200);
    const html = await page();
    expect(html).not.toContain('value="Agency / Consultant"');
    expect(html).toContain('value="Ad Operations"');
    expect((await submit({ ...base, role: "Agency / Consultant" })).status).toBe(200);
    expect((await storage.getContactLeads())[0].role).toBe("Agency / Consultant");
  });
});

describe("POST /api/contact against the operator's config", () => {
  it("refuses a required field sent blank but accepts it absent (cached page, D-011)", async () => {
    const { admin, submit, storage } = setup();
    expect((await admin("/api/form-config/fields/topGeo", { required: true })).status).toBe(200);
    const blank = await submit({ ...base, topGeo: " " });
    expect(blank.status).toBe(400);
    expect((await blank.json()).message).toBe("Top Traffic Region is required.");
    expect((await submit(base)).status).toBe(200);
    expect(await storage.getContactLeads()).toHaveLength(1);
  });

  it("treats null as blank: refused when required, stored null when optional", async () => {
    const { admin, submit, storage } = setup();
    expect((await admin("/api/form-config/fields/topGeo", { required: true })).status).toBe(200);
    expect((await submit({ ...base, topGeo: null })).status).toBe(400);
    expect((await submit({ ...base, message: null, role: null })).status).toBe(200);
    expect((await submit({ ...base, inventoryTypes: null })).status).toBe(400);
    expect((await storage.getContactLeads())[0]).toMatchObject({ message: null, role: null });
  });

  // Only the admin API writes these rows; a hand edit in D1 must not stop lead capture or reach markup
  it("skips an override row that is not JSON and a custom key outside [a-z0-9_]", async () => {
    const { submit, storage, page } = setup();
    await storage.saveFieldOverride("phone", "{not json", null, "hand-edit");
    await storage.saveFieldOverride('custom_x" x-init="alert(1)', JSON.stringify({ custom: true, type: "text", label: "Evil", placeholder: "", required: false, visible: true, order: 150, maxLength: 300 }), null, "hand-edit");
    expect((await submit({ ...base, phone: "+1 305 555 0100" })).status).toBe(200);
    expect((await storage.getContactLeads())[0].phone).toBe("+1 305 555 0100");
    const html = await page();
    expect(html).toContain('data-testid="input-phone"');
    expect(html).not.toContain("alert(1)");
  });

  it("ignores whatever is sent for a hidden field and drops it from the form", async () => {
    const { admin, submit, storage, page } = setup();
    expect((await admin("/api/form-config/fields/property", { visible: false })).status).toBe(200);
    expect(await page()).not.toContain('data-testid="input-property"');
    expect((await submit({ ...base, property: "pub.com" })).status).toBe(200);
    expect((await storage.getContactLeads())[0].property).toBeNull();
  });

  it("checks support posts against the code defaults, not the contact form config", async () => {
    const { admin, submit, storage } = setup();
    expect((await admin("/api/form-config/fields/message", { visible: false })).status).toBe(200);
    expect((await submit({ ...base, impressions: "support-request", message: "Login broken", _source: "support" })).status).toBe(200);
    expect((await storage.getContactLeads())[0]).toMatchObject({ source: "support", message: "Login broken" });
  });
});

describe("custom fields", () => {
  it("validates, stores escaped once, and shows answers under their labels in the email and admin", async () => {
    const { app, admin, submit, storage, send, page } = setup();
    const budget = await admin("/api/form-config/fields", { label: "Monthly <budget>", type: "text" });
    expect(budget.status).toBe(201);
    expect(await budget.json()).toEqual({ key: "custom_monthly_budget" });
    expect((await admin("/api/form-config/fields", { label: "Ad formats", type: "checkboxes", options: ["Video", "Native"] })).status).toBe(201);

    const html = await page();
    expect(html).toContain('x-model="formData.custom.custom_monthly_budget"');
    expect(html).toContain("Monthly &lt;budget&gt;");
    expect(html).not.toContain("Monthly <budget>");

    expect((await submit({ ...base, custom: { custom_ad_formats: ["Banner"] } })).status).toBe(400);
    expect((await submit({ ...base, custom: { custom_monthly_budget: "x".repeat(301) } })).status).toBe(400);
    const ok = await submit({ ...base, custom: { custom_monthly_budget: "<script>1</script>", custom_ad_formats: ["Video"], custom_unknown: "dropped" } });
    expect(ok.status).toBe(200);

    const [lead] = await storage.getContactLeads();
    expect(JSON.parse(lead.customFields!)).toEqual({ custom_monthly_budget: "&lt;script&gt;1&lt;/script&gt;", custom_ad_formats: "Video" });

    const email = send.mock.calls.at(-1)![0].html as string;
    expect(email).toContain("Monthly &lt;budget&gt;");
    expect(email).toContain("&lt;script&gt;1&lt;/script&gt;");
    expect(email).not.toContain("<script>");
    expect(email).not.toContain("&amp;lt;");

    const { fields } = await (await app.request("/api/form-config")).json();
    const adminHtml = renderAdminLeadsPage([lead], fields);
    expect(adminHtml).toContain("Monthly &lt;budget&gt;: &lt;script&gt;1&lt;/script&gt;");
    expect(adminHtml).toContain("Ad formats: Video");
    expect(adminHtml).not.toContain("&amp;lt;");

    // a field no longer in the config falls back to its key
    expect(renderAdminLeadsPage([lead], [])).toContain("custom_monthly_budget: &lt;script&gt;");
  });

  it("refuses options on a text field and a 21st custom field", async () => {
    const { admin } = setup();
    expect((await admin("/api/form-config/fields", { label: "Bad", type: "text", options: ["x"] })).status).toBe(400);
    expect((await admin("/api/form-config/fields", { label: "Pick", type: "select" })).status).toBe(400);
    for (let i = 0; i < 20; i++) expect((await admin("/api/form-config/fields", { label: `Q${i}`, type: "text" })).status).toBe(201);
    const res = await admin("/api/form-config/fields", { label: "One too many", type: "text" });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toBe("At most 20 custom fields.");
  });
});

describe("contact form rendering", () => {
  it("escapes operator placeholders and option text", () => {
    const fields = DEFAULT_FORM_FIELDS.map((f) => f.key === "phone" ? { ...f, placeholder: '"><img src=x>' }
      : f.key === "role" ? { ...f, options: [{ value: '"><script>', active: true }] } : f);
    const html = renderContactFormSection({ fields, turnstileSiteKey: null });
    expect(html).not.toContain("<img src=x>");
    expect(html).not.toContain("<script>");
    expect(html).toContain('placeholder="&quot;&gt;&lt;img src=x&gt;"');
    expect(html).toContain('value="&quot;&gt;&lt;script&gt;"');
  });
});

describe("form config admin: Turnstile settings", () => {
  it("refuses to turn Turnstile on without the Worker secret", async () => {
    const { admin, storage } = setup();
    const res = await admin("/api/form-config/settings", { turnstileEnabled: true, turnstileSiteKey: "0x4AAAAAAAkey" });
    expect(res.status).toBe(409);
    expect(await storage.getFormConfigChanges(50)).toEqual([]);
  });

  it("refuses to turn it on without a site key, then audits each setting it changes", async () => {
    const { app, admin, storage } = setup({ turnstileSecret: "s3cret-value" });
    expect((await admin("/api/form-config/settings", { turnstileEnabled: true })).status).toBe(409);
    expect((await admin("/api/form-config/settings", { turnstileEnabled: true, turnstileSiteKey: "0x4AAAAAAAkey" })).status).toBe(200);
    const changes = await storage.getFormConfigChanges(50);
    expect(changes.map((c) => [c.target, c.before, c.after]).sort()).toEqual([
      ["setting:turnstile_enabled", null, "true"], ["setting:turnstile_site_key", null, "0x4AAAAAAAkey"],
    ]);
    // saving the same values again writes nothing
    expect((await admin("/api/form-config/settings", { turnstileEnabled: true })).status).toBe(200);
    expect(await storage.getFormConfigChanges(50)).toHaveLength(2);

    const body = await (await app.request("/api/form-config")).text();
    expect(JSON.parse(body)).toMatchObject({ turnstileSecretSet: true, settings: { turnstileEnabled: true, turnstileSiteKey: "0x4AAAAAAAkey" } });
    expect(body).not.toContain("s3cret-value");
  });
});

describe("form config admin: Origin", () => {
  it("refuses a mutation without a same-origin Origin header, even with a matching Referer", async () => {
    const { admin, storage } = setup();
    expect((await admin("/api/form-config/fields/phone", { visible: false }, { Host: "localhost" })).status).toBe(403);
    expect((await admin("/api/form-config/fields/phone", { visible: false }, { Host: "localhost", Referer: "http://localhost/admin/form" })).status).toBe(403);
    expect((await admin("/api/form-config/settings", { turnstileEnabled: false }, { Host: "localhost", Origin: "https://evil.example" })).status).toBe(403);
    expect((await admin("/api/form-config/fields", { label: "x", type: "text" }, { Host: "localhost" })).status).toBe(403);
    expect(await storage.getFormConfigChanges(50)).toEqual([]);
  });
});

describe("form config cache", () => {
  it("an admin write shows on the next page view in the same isolate", async () => {
    const { admin, page, storage } = setup();
    expect(await page()).toContain("Full Name");
    // a write that bypasses the admin API stays invisible until the cache is cleared: the page is cached
    await storage.saveFieldOverride("name", JSON.stringify({ label: "Direct write" }), null, "test");
    expect(await page()).not.toContain("Direct write");
    expect((await admin("/api/form-config/fields/name", { label: "Your name" })).status).toBe(200);
    expect(await page()).toContain("Your name");
  });

  it("renders the default form when the config can't be read", async () => {
    const app = new Hono();
    const storage = new MemStorage();
    storage.getFieldOverrides = () => Promise.reject(new Error("D1_ERROR: network"));
    registerPageRoutes(app, () => storage);
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('data-testid="input-ads-txt"');
  });
});
