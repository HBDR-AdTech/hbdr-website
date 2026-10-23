import { describe, it, expect, beforeEach } from "vitest";
import { Hono } from "hono";
import { registerApiRoutes } from "../api";
import { registerAdminRoutes } from "../admin";
import { registerSeoRoutes } from "../seo";
import { registerErrorHandlers } from "../errors";
import { accessGuard, protectAdmin } from "../../middleware/auth";
import { MemStorage } from "../../services/mem-storage";
import { invalidateSupply, getPublisherAdsTxtLines } from "../../services/supply";
import { renderSupplyPage } from "../../templates/admin/supply";

const SAME_ORIGIN = { Origin: "http://localhost", Host: "localhost" };

function setup() {
  const app = new Hono();
  const storage = new MemStorage();
  // stands in for accessGuard, which sets the verified Access email in production
  app.use("*", async (c, next) => { c.set("accessEmail", "ops@hbdr.com"); await next(); });
  registerApiRoutes(app, () => storage, () => ({ db: null }));
  registerAdminRoutes(app, () => storage);
  registerSeoRoutes(app, () => storage);
  registerErrorHandlers(app);
  const admin = (path: string, body: unknown = {}, headers: Record<string, string> = SAME_ORIGIN) =>
    app.request(path, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  const sellersJson = async () => {
    const res = await app.request("/sellers.json");
    return { res, json: JSON.parse(await res.text()) };
  };
  return { app, storage, admin, sellersJson };
}

const seller = (over: Record<string, unknown> = {}) => ({ sellerId: "111", name: "CDKitchen Inc", domain: "cdkitchen.com", sellerType: "PUBLISHER", ...over });

beforeEach(() => invalidateSupply());

describe("GET /sellers.json (sellers.json 1.0)", () => {
  it("serves application/json with version 1.0, the contact settings and the required seller fields", async () => {
    const { admin, sellersJson } = setup();
    expect((await admin("/admin/api/supply/settings", { contactEmail: "contact@hbdr.com", contactAddress: "HeaderBiddr LLC, 1200 Brickell Ave, Ste 1950, Miami, FL 33131" })).status).toBe(200);
    expect((await admin("/admin/api/supply/sellers", seller())).status).toBe(201);
    expect((await admin("/admin/api/supply/sellers", seller({ sellerId: "8201HB", name: "Air Byte Technology", domain: null, sellerType: "INTERMEDIARY", comment: "No web presence" }))).status).toBe(201);
    const { res, json } = await sellersJson();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/json; charset=utf-8");
    expect(json).toEqual({
      contact_email: "contact@hbdr.com",
      contact_address: "HeaderBiddr LLC, 1200 Brickell Ave, Ste 1950, Miami, FL 33131",
      version: "1.0",
      sellers: [
        { seller_id: "111", seller_type: "PUBLISHER", name: "CDKitchen Inc", domain: "cdkitchen.com" },
        { seller_id: "8201HB", seller_type: "INTERMEDIARY", name: "Air Byte Technology", comment: "No web presence" },
      ],
    });
  });

  it("leaves name, domain and comment out for a confidential seller", async () => {
    const { admin, sellersJson } = setup();
    expect((await admin("/admin/api/supply/sellers", seller({ isConfidential: true, comment: "CDKitchen O&O" }))).status).toBe(201);
    const { json } = await sellersJson();
    expect(json.sellers).toEqual([{ seller_id: "111", is_confidential: 1, seller_type: "PUBLISHER" }]);
    expect(JSON.stringify(json)).not.toContain("CDKitchen");
  });

  it("omits contact fields that are not set and still lists every active seller", async () => {
    const { admin, sellersJson } = setup();
    expect((await admin("/admin/api/supply/sellers", seller())).status).toBe(201);
    const { json } = await sellersJson();
    expect(Object.keys(json)).toEqual(["version", "sellers"]);
  });

  it("returns 500, never an empty seller list, when D1 can't be read", async () => {
    const { app, storage } = setup();
    storage.getActiveSellers = () => Promise.reject(new Error("D1_ERROR: network"));
    const res = await app.request("/sellers.json");
    expect(res.status).toBe(500);
    expect(await res.text()).not.toContain('"sellers"');
  });
});

describe("GET /ads.txt (ads.txt 1.1)", () => {
  it("serves text/plain with the no-ads placeholder record, contact and OWNERDOMAIN", async () => {
    const { app, admin } = setup();
    expect((await admin("/admin/api/supply/settings", { contactEmail: "contact@hbdr.com" })).status).toBe(200);
    // partner lines are for publishers' files, never hbdr.com's own
    expect((await admin("/admin/api/supply/lines", { adSystemDomain: "google.com", accountId: "pub-1", relationship: "RESELLER", certAuthorityId: "f08c47fec0942fa0" })).status).toBe(201);
    const res = await app.request("/ads.txt");
    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe([
      "# hbdr.com shows no ads: no advertising system is authorized to sell ads on this site.",
      "placeholder.example.com, placeholder, DIRECT, placeholder",
      "contact=contact@hbdr.com",
      "OWNERDOMAIN=hbdr.com",
      "",
    ].join("\n"));
  });
});

describe("publisher ads.txt lines", () => {
  it("are the publisher's DIRECT line to HBDR, then the active partner lines", async () => {
    const { admin, storage } = setup();
    expect((await admin("/admin/api/supply/sellers", seller())).status).toBe(201);
    expect(await getPublisherAdsTxtLines(storage, "111")).toBeNull(); // no direct_line_domain yet
    expect((await admin("/admin/api/supply/settings", { directLineDomain: "HeaderBiddr.com" })).status).toBe(200);
    const google = await (await admin("/admin/api/supply/lines", { adSystemDomain: "google.com", accountId: "pub-1234", relationship: "RESELLER", certAuthorityId: "f08c47fec0942fa0" })).json();
    expect((await admin("/admin/api/supply/lines", { adSystemDomain: "rubiconproject.com", accountId: "1000", relationship: "RESELLER", comment: "Magnite" })).status).toBe(201);
    expect(await getPublisherAdsTxtLines(storage, "111")).toEqual([
      "headerbiddr.com, 111, DIRECT",
      "google.com, pub-1234, RESELLER, f08c47fec0942fa0",
      "rubiconproject.com, 1000, RESELLER # Magnite",
    ]);
    expect((await admin(`/admin/api/supply/lines/${google.id}/retire`)).status).toBe(200);
    expect(await getPublisherAdsTxtLines(storage, "111")).toEqual(["headerbiddr.com, 111, DIRECT", "rubiconproject.com, 1000, RESELLER # Magnite"]);
    expect(await getPublisherAdsTxtLines(storage, "999")).toBeNull();
  });

  it("refuses the same line twice while it is active", async () => {
    const { admin } = setup();
    const line = { adSystemDomain: "google.com", accountId: "pub-1", relationship: "RESELLER" };
    expect((await admin("/admin/api/supply/lines", line)).status).toBe(201);
    expect((await admin("/admin/api/supply/lines", line)).status).toBe(409);
  });
});

describe("supply admin: sellers are retired, never deleted or reused", () => {
  it("writes an audit row naming the Access user for each change", async () => {
    const { admin, storage } = setup();
    expect((await admin("/admin/api/supply/sellers", seller())).status).toBe(201);
    expect((await admin("/admin/api/supply/sellers/111", { name: "CDKitchen, Inc." })).status).toBe(200);
    const [update, create] = await storage.getSupplyChanges(50);
    expect(create).toMatchObject({ actor: "ops@hbdr.com", target: "seller:111", before: null });
    expect(JSON.parse(update.before!).name).toBe("CDKitchen Inc");
    expect(JSON.parse(update.after!).name).toBe("CDKitchen, Inc.");
    // saving the same values again writes nothing
    expect((await admin("/admin/api/supply/sellers/111", { name: "CDKitchen, Inc." })).status).toBe(200);
    expect(await storage.getSupplyChanges(50)).toHaveLength(2);
  });

  it("retires a seller out of /sellers.json, keeps the row, and never hands its ID to anyone else", async () => {
    const { admin, storage, sellersJson } = setup();
    expect((await admin("/admin/api/supply/sellers", seller())).status).toBe(201);
    expect((await admin("/admin/api/supply/sellers/111/retire")).status).toBe(200);
    expect((await sellersJson()).json.sellers).toEqual([]);
    expect((await storage.getRetiredSellers()).map((s) => s.sellerId)).toEqual(["111"]);

    const reuse = await admin("/admin/api/supply/sellers", seller({ name: "Someone Else LLC", domain: "else.com" }));
    expect(reuse.status).toBe(409);
    expect((await reuse.json()).message).toContain("never reused");
    expect((await admin("/admin/api/supply/sellers/111", { name: "Someone Else LLC" })).status).toBe(409);
    expect((await admin("/admin/api/supply/sellers/111/retire")).status).toBe(409);
    expect((await storage.getSeller("111"))!.name).toBe("CDKitchen Inc");
    expect((await storage.getSupplyChanges(50)).map((c) => c.target)).toEqual(["seller:111", "seller:111"]);
  });

  it("refuses an active seller ID too, and 404s an unknown one", async () => {
    const { admin } = setup();
    expect((await admin("/admin/api/supply/sellers", seller())).status).toBe(201);
    expect((await admin("/admin/api/supply/sellers", seller())).status).toBe(409);
    expect((await admin("/admin/api/supply/sellers/nope", { name: "x" })).status).toBe(404);
    expect((await admin("/admin/api/supply/sellers/nope/retire")).status).toBe(404);
  });
});

describe("supply admin: validation", () => {
  const refused = async (path: string, body: unknown, field: string) => {
    const { admin, storage } = setup();
    const res = await admin(path, body);
    expect(res.status).toBe(400);
    expect((await res.json()).message).toContain(`"${field}"`);
    expect(await storage.getSupplyChanges(50)).toEqual([]);
  };

  it("400s a bad seller, naming the field", async () => {
    await refused("/admin/api/supply/sellers", seller({ domain: "https://cdkitchen.com" }), "domain");
    await refused("/admin/api/supply/sellers", seller({ domain: "cdkitchen.com/path" }), "domain");
    await refused("/admin/api/supply/sellers", seller({ sellerType: "publisher" }), "sellerType");
    await refused("/admin/api/supply/sellers", seller({ sellerId: "1, 2" }), "sellerId");
    await refused("/admin/api/supply/sellers", seller({ sellerId: "" }), "sellerId");
    await refused("/admin/api/supply/sellers", seller({ name: "CricTracker\rPvt Ltd" }), "name");
    await refused("/admin/api/supply/sellers", seller({ name: "x".repeat(201) }), "name");
    await refused("/admin/api/supply/sellers", seller({ comment: "two\nlines" }), "comment");
    await refused("/admin/api/supply/sellers", seller({ isConfidential: 1 }), "isConfidential");
  });

  it("400s a body with unknown keys", async () => {
    const { admin } = setup();
    expect((await admin("/admin/api/supply/sellers", seller({ retiredAt: null }))).status).toBe(400);
    expect((await admin("/admin/api/supply/sellers", "not json")).status).toBe(400);
  });

  it("400s a bad ads.txt line, naming the field", async () => {
    const line = (over: Record<string, unknown>) => ({ adSystemDomain: "google.com", accountId: "pub-1", relationship: "RESELLER", ...over });
    await refused("/admin/api/supply/lines", line({ accountId: "pub 1" }), "accountId");
    await refused("/admin/api/supply/lines", line({ accountId: "pub-1,DIRECT" }), "accountId");
    await refused("/admin/api/supply/lines", line({ relationship: "reseller" }), "relationship");
    await refused("/admin/api/supply/lines", line({ certAuthorityId: "f08c, x" }), "certAuthorityId");
    await refused("/admin/api/supply/lines", line({ adSystemDomain: "google" }), "adSystemDomain");
    await refused("/admin/api/supply/lines", line({ comment: "x\ngoogle.com, pub-2, DIRECT" }), "comment");
  });

  it("400s bad settings, naming the field", async () => {
    await refused("/admin/api/supply/settings", { contactEmail: "not an email" }, "contactEmail");
    await refused("/admin/api/supply/settings", { contactAddress: "line\nbreak" }, "contactAddress");
    await refused("/admin/api/supply/settings", { directLineDomain: "https://hbdr.com" }, "directLineDomain");
  });

  it("audits each setting it changes, once", async () => {
    const { admin, storage } = setup();
    expect((await admin("/admin/api/supply/settings", { contactEmail: "contact@hbdr.com", directLineDomain: "headerbiddr.com" })).status).toBe(200);
    expect((await admin("/admin/api/supply/settings", { contactEmail: "contact@hbdr.com", directLineDomain: "hbdr.com" })).status).toBe(200);
    expect((await storage.getSupplyChanges(50)).map((c) => [c.target, c.before, c.after])).toEqual([
      ["setting:direct_line_domain", "headerbiddr.com", "hbdr.com"],
      ["setting:direct_line_domain", null, "headerbiddr.com"],
      ["setting:contact_email", null, "contact@hbdr.com"],
    ]);
  });
});

describe("supply admin: Access and Origin", () => {
  it("needs Cloudflare Access for the page and API; the two public files do not", async () => {
    const app = new Hono();
    const storage = new MemStorage();
    // no Access config: accessGuard fails closed
    protectAdmin(app, accessGuard(() => ({})));
    registerApiRoutes(app, () => storage, () => ({ db: null }));
    registerAdminRoutes(app, () => storage);
    registerSeoRoutes(app, () => storage);
    expect((await app.request("/admin/supply")).status).toBe(403);
    expect((await app.request("/admin/api/supply")).status).toBe(403);
    expect((await app.request("/admin/api/supply/sellers", { method: "POST", headers: SAME_ORIGIN, body: JSON.stringify(seller()) })).status).toBe(403);
    expect(await storage.getActiveSellers()).toEqual([]);
    expect((await app.request("/sellers.json")).status).toBe(200);
    expect((await app.request("/ads.txt")).status).toBe(200);
  });

  it("refuses a mutation without a same-origin Origin header, even with a matching Referer", async () => {
    const { admin, storage } = setup();
    expect((await admin("/admin/api/supply/sellers", seller(), { Host: "localhost" })).status).toBe(403);
    expect((await admin("/admin/api/supply/sellers", seller(), { Host: "localhost", Referer: "http://localhost/admin/supply" })).status).toBe(403);
    expect((await admin("/admin/api/supply/settings", { contactEmail: "x@evil.example" }, { Host: "localhost", Origin: "https://evil.example" })).status).toBe(403);
    expect((await admin("/admin/api/supply/lines", { adSystemDomain: "google.com", accountId: "pub-1", relationship: "RESELLER" }, { Host: "localhost" })).status).toBe(403);
    expect(await storage.getSupplyChanges(50)).toEqual([]);
  });
});

describe("supply admin page", () => {
  // Seller names come from publishers: the page must never print them into markup or an Alpine expression
  it("is static: stored values only reach the browser as JSON and render through x-text", async () => {
    const { app, storage } = setup();
    await storage.createSeller({ sellerId: "x1", name: '<img src=x onerror=alert(1)>', domain: null, sellerType: "PUBLISHER", isConfidential: false, comment: "'); alert(2); ('", createdAt: "2026-10-23T00:00:00.000Z", retiredAt: null }, "test");
    const res = await app.request("/admin/supply");
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toBe(renderSupplyPage());
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("alert(2)");
    expect(html).not.toContain("x-html");
    expect(html).toContain('x-text="s.name"');
  });
});

describe("supply cache", () => {
  it("serves a 60-second copy, and an admin write shows on the next request in the same isolate", async () => {
    const { admin, storage, sellersJson } = setup();
    expect((await sellersJson()).json.sellers).toEqual([]);
    // a write that bypasses the admin API stays invisible until the cache is cleared
    await storage.createSeller({ sellerId: "direct", name: "Direct", domain: null, sellerType: "PUBLISHER", isConfidential: false, comment: null, createdAt: "2026-10-23T00:00:00.000Z", retiredAt: null }, "test");
    expect((await sellersJson()).json.sellers).toEqual([]);
    expect((await admin("/admin/api/supply/sellers", seller())).status).toBe(201);
    expect((await sellersJson()).json.sellers.map((s: any) => s.seller_id)).toEqual(["111", "direct"]);
  });
});
