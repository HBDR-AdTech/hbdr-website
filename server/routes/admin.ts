// Admin routes — leads panel, blog admin, CSV export. Auth: protectAdmin() in the entry point (Cloudflare Access)
// Single source of truth for both entry points

import type { Hono } from "hono";
import type { IStorage } from "../services/storage";
import { renderAdminLeadsPage } from "../templates/admin/leads";
import { renderBlogAdminPage, renderBlogEditorPage } from "../templates/admin/blog";
import { render404Page } from "../templates/pages/error";

// Quote every cell; a leading = + - @ would run as a formula when the export is opened in Excel/Sheets
export function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/^[=+\-@\t\r]/, "'$&");
  return `"${text.replace(/"/g, '""')}"`;
}

export function registerAdminRoutes(
  app: Hono<any>,
  getStorage: (c: any) => IStorage
) {
  app.get("/admin", (c) => c.redirect("/admin/leads"));

  // Leads panel
  app.get("/admin/leads", async (c) => {
    const storage = getStorage(c);
    const leads = await storage.getContactLeads();
    return c.html(renderAdminLeadsPage(leads));
  });

  // CSV export
  app.get("/admin/leads/export", async (c) => {
    const storage = getStorage(c);
    const leads = await storage.getContactLeads();
    const headers = ["ID", "Name", "Email", "Company", "Impressions", "Message", "Source", "Status", "IP", "Date"];
    const csvRows = [headers.join(",")];
    for (const lead of leads) {
      csvRows.push([
        lead.id, lead.name, lead.email, lead.company, lead.impressions, lead.message,
        lead.source || "contact", lead.status || "new", lead.ip,
        lead.createdAt ? new Date(lead.createdAt).toISOString() : "",
      ].map(csvCell).join(","));
    }
    return new Response(csvRows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="hbdr-leads-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  });

  // Blog admin
  app.get("/admin/blog", async (c) => {
    const storage = getStorage(c);
    const posts = await storage.getBlogPosts(false);
    return c.html(renderBlogAdminPage(posts));
  });

  app.get("/admin/blog/new", (c) => {
    return c.html(renderBlogEditorPage());
  });

  app.get("/admin/blog/edit/:id", async (c) => {
    const storage = getStorage(c);
    const id = c.req.param("id");
    const post = await storage.getBlogPostById(id);
    if (!post) return c.html(render404Page(), 404);
    return c.html(renderBlogEditorPage(post));
  });
}
