import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Hono } from "hono";
import { registerApiRoutes } from "../api";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";
import { invalidateFormConfig } from "../../services/form-config";
import { renderAdminLeadsPage } from "../../templates/admin/leads";
import { siteSecurityHeaders } from "../../middleware/security-headers";

let ipCounter = 0;
const SAME_ORIGIN = { Origin: "http://localhost", Host: "localhost" };
const base = { name: "Jane", email: "jane@publisher.com", company: "Pub", impressions: "10m-50m" };
const verdict = (body: object, status = 200) => vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

async function setup(enabled: boolean) {
  const app = new Hono();
  const storage = new MemStorage();
  const send = vi.fn().mockResolvedValue({ messageId: "m1" });
  registerPageRoutes(app, () => storage);
  registerApiRoutes(app, () => storage, () => ({ db: null, email: { send } as unknown as SendEmail, turnstileSecret: "s3cret" }));
  if (enabled) {
    await storage.saveFormSettings([
      { key: "turnstile_site_key", value: "0x4AAAAAAAkey", before: null },
      { key: "turnstile_enabled", value: "true", before: null },
    ], "test");
  }
  const submit = async (body: object) => {
    const pending: Promise<unknown>[] = [];
    const res = await app.request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...SAME_ORIGIN, "CF-Connecting-IP": `198.18.0.${++ipCounter}` },
      body: JSON.stringify(body),
    }, {}, { waitUntil: (p: Promise<unknown>) => pending.push(p), passThroughOnException: () => {} } as any);
    await Promise.all(pending);
    return res;
  };
  return { app, storage, send, submit };
}

beforeEach(() => invalidateFormConfig());
afterEach(() => vi.unstubAllGlobals());

describe("Turnstile off", () => {
  it("never calls siteverify, leaves bot_check empty and loads no widget", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { app, submit, storage } = await setup(false);
    expect((await submit(base)).status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
    expect((await storage.getContactLeads())[0].botCheck).toBeNull();
    expect(await (await app.request("/contact")).text()).not.toContain("challenges.cloudflare.com");
  });
});

describe("Turnstile on", () => {
  it("renders the widget with the contact action", async () => {
    const { app } = await setup(true);
    const html = await (await app.request("/")).text();
    expect(html).toContain('src="https://challenges.cloudflare.com/turnstile/v0/api.js"');
    expect(html).toContain('data-sitekey="0x4AAAAAAAkey" data-action="contact"');
    expect(html).toContain("body.turnstileToken");
  });

  it("refuses a submission without a token before calling siteverify", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { submit, storage } = await setup(true);
    const res = await submit(base);
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ message: "Verification failed, please retry" });
    expect(fetch).not.toHaveBeenCalled();
    expect(await storage.getContactLeads()).toEqual([]);
  });

  it("saves the lead as passed when siteverify confirms action and hostname", async () => {
    const fetch = verdict({ success: true, action: "contact", hostname: "hbdr.com" });
    vi.stubGlobal("fetch", fetch);
    const { submit, storage } = await setup(true);
    expect((await submit({ ...base, turnstileToken: "tok" })).status).toBe(200);
    expect((await storage.getContactLeads())[0].botCheck).toBe("passed");
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(JSON.parse(init.body)).toMatchObject({ secret: "s3cret", response: "tok", remoteip: `198.18.0.${ipCounter}`, idempotency_key: expect.any(String) });
  });

  it.each([
    ["a rejected token", { success: false, "error-codes": ["invalid-input-response"] }],
    ["a token solved on another hostname", { success: true, action: "contact", hostname: "evil.example" }],
    ["a token for another action", { success: true, action: "login", hostname: "hbdr.com" }],
  ])("refuses %s and stores nothing", async (_, body) => {
    vi.stubGlobal("fetch", verdict(body));
    const { submit, storage } = await setup(true);
    expect((await submit({ ...base, turnstileToken: "tok" })).status).toBe(403);
    expect(await storage.getContactLeads()).toEqual([]);
  });

  // D-011: a vendor outage must never cost a lead
  it.each([
    ["siteverify is unreachable", vi.fn().mockRejectedValue(new TypeError("fetch failed"))],
    ["siteverify returns 500", verdict({}, 500)],
    ["Cloudflare reports an internal error", verdict({ success: false, "error-codes": ["internal-error"] })],
  ])("keeps the lead as unverified when %s, and says so in the email and admin", async (_, fetch) => {
    vi.stubGlobal("fetch", fetch);
    const { submit, storage, send } = await setup(true);
    expect((await submit({ ...base, turnstileToken: "tok" })).status).toBe(200);
    const [lead] = await storage.getContactLeads();
    expect(lead.botCheck).toBe("unverified");
    expect(send.mock.calls[0][0].html).toMatch(/Bot check<\/td><td[^>]*>unverified/);
    expect(renderAdminLeadsPage([lead])).toContain("Bot check: unverified");
  });

  // Another isolate switched Turnstile off; this one still holds "on" for up to 60s while the page has no widget
  it("re-reads a stale 'on' config before refusing a submission without a token", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { submit, storage } = await setup(true);
    expect((await submit(base)).status).toBe(403);
    await storage.saveFormSettings([{ key: "turnstile_enabled", value: "false", before: "true" }], "other-isolate");
    expect((await submit(base)).status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
    expect((await storage.getContactLeads())[0].botCheck).toBeNull();
  });

  it("leaves support requests to the honeypot and rate limit: the support form has no widget", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { submit, storage } = await setup(true);
    expect((await submit({ ...base, impressions: "support-request", message: "help", _source: "support" })).status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
    expect((await storage.getContactLeads())[0].botCheck).toBeNull();
  });
});

describe("CSP", () => {
  it("allows the Turnstile script and iframe", async () => {
    const app = new Hono();
    app.use("*", siteSecurityHeaders);
    app.get("/", (c) => c.text("ok"));
    const csp = (await app.request("/")).headers.get("Content-Security-Policy")!;
    expect(csp).toMatch(/script-src [^;]*https:\/\/challenges\.cloudflare\.com/);
    expect(csp).toMatch(/frame-src https:\/\/challenges\.cloudflare\.com/);
  });
});
