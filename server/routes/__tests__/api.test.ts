import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { registerApiRoutes } from "../api";

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
