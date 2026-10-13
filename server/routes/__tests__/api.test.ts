import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { registerApiRoutes } from "../api";
import { MemStorage } from "../../services/mem-storage";

// A missing D1 table once made every submission throw while the form still showed "Message Sent!"
describe("POST /api/contact failure status", () => {
  it("returns 500 when the rate limiter's D1 query throws", async () => {
    const app = new Hono();
    const brokenDb = { prepare: () => { throw new Error("D1_ERROR: no such table: rate_limits"); } };
    registerApiRoutes(app, () => { throw new Error("unused"); }, () => ({ db: brokenDb }));

    const res = await app.request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost", Host: "localhost" },
      body: JSON.stringify({ name: "Jane", email: "jane@publisher.com", company: "Pub", impressions: "10m-50m" }),
    });

    expect(res.status).toBe(500);
    expect(await res.text()).toContain("Something went wrong");
  });
});

describe("POST /api/contact qualifying fields", () => {
  function setup() {
    const app = new Hono();
    const storage = new MemStorage();
    registerApiRoutes(app, () => storage, () => ({ db: null }));
    const post = (body: object, ip: string) => app.request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost", Host: "localhost", "CF-Connecting-IP": ip },
      body: JSON.stringify(body),
    });
    return { storage, post };
  }
  const base = { name: "Jane", email: "jane@publisher.com", company: "Pub", impressions: "10m-50m" };

  it("stores every qualifying answer, blank selects as null", async () => {
    const { storage, post } = setup();
    const res = await post({
      ...base, phone: "+1 (305) 555-0100", inventoryTypes: ["Website", "CTV / OTT"], property: "pub.com",
      appStoreUrls: "https://apps.apple.com/app/id1\nhttps://play.google.com/store/apps/details?id=com.pub",
      adsTxtUrl: "pub.com/ads.txt", currentSetup: "Google Ad Manager", role: "Ad Operations",
      timeline: "ASAP", topGeo: "United States", referral: "", _source: "contact",
    }, "198.51.100.1");
    expect(res.status).toBe(200);
    const [lead] = await storage.getContactLeads();
    expect(lead).toMatchObject({
      phone: "+1 (305) 555-0100", inventoryTypes: "Website, CTV / OTT", property: "pub.com",
      adsTxtUrl: "pub.com/ads.txt", currentSetup: "Google Ad Manager", role: "Ad Operations",
      timeline: "ASAP", topGeo: "United States", referral: null,
    });
    expect(lead.appStoreUrls).toContain("\n");
  });

  // A visitor on a cached pre-change page posts the old shape; the lead must still land (D-011)
  it("accepts the old payload without qualifying fields", async () => {
    const { storage, post } = setup();
    expect((await post(base, "198.51.100.2")).status).toBe(200);
    const [lead] = await storage.getContactLeads();
    expect(lead.property).toBeNull();
    expect(lead.inventoryTypes).toBeNull();
  });

  it("rejects choices outside the allowed lists and bad phone numbers", async () => {
    const { post } = setup();
    expect((await post({ ...base, currentSetup: "<script>" }, "198.51.100.3")).status).toBe(400);
    expect((await post({ ...base, inventoryTypes: ["Billboard"] }, "198.51.100.4")).status).toBe(400);
    expect((await post({ ...base, phone: "call me maybe" }, "198.51.100.5")).status).toBe(400);
  });
});
