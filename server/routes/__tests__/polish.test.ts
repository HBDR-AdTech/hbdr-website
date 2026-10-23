import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { registerErrorHandlers } from "../errors";
import { MemStorage } from "../../services/mem-storage";
import { PAGE_ROUTES } from "../../config";
import { renderAdminLeadsPage } from "../../templates/admin/leads";
import { renderFormSettingsPage } from "../../templates/admin/form";

const app = new Hono();
const storage = new MemStorage();
beforeAll(async () => {
  await storage.seedBlogPosts();
  registerPageRoutes(app, () => storage);
  registerErrorHandlers(app);
});

// The spotlight script: one passive pointermove listener that writes --mx/--my on the hovered frame
const SPOTLIGHT = /setProperty\('--mx'[\s\S]*?setProperty\('--my'[\s\S]*?addEventListener\('pointermove'[\s\S]*?\{ passive: true \}/;

describe("frame spotlight (D-025)", () => {
  PAGE_ROUTES.forEach((route) => {
    it(`${route} carries the spotlight script once`, async () => {
      const html = await (await app.request(route)).text();
      expect(html).toMatch(SPOTLIGHT);
      // other pointermove listeners (the home timeout drag) are fine; the spotlight itself appears once
      expect(html.match(/var FRAMES = '\.bp-frame/g)).toHaveLength(1);
    });
  });

  it("the 404 page carries it too", async () => {
    expect(await (await app.request("/no-such-page")).text()).toMatch(SPOTLIGHT);
  });

  it("admin pages never carry it", () => {
    for (const html of [renderAdminLeadsPage([]), renderFormSettingsPage()]) {
      expect(html).toContain('class="is-admin');
      expect(html).not.toMatch(/pointermove|--mx/);
    }
  });

  it("nav dropdowns use the glass menu instead of a solid fill", async () => {
    const html = await (await app.request("/")).text();
    for (const id of ["solutions-dropdown", "company-dropdown"]) {
      const tag = html.match(new RegExp(`<div[^>]*data-testid="${id}"`))![0];
      expect(tag).toContain("glass-menu");
      expect(tag).not.toContain("bg-[var(--surface-elevated)]");
    }
  });
});
