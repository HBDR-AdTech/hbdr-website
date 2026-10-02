// Cloudflare Workers entry point — production
// Uses shared route modules (single source of truth)

import { Hono } from "hono";
import { logger } from "hono/logger";
import { siteSecurityHeaders } from "./server/middleware/security-headers";
import { accessGuard, protectAdmin } from "./server/middleware/auth";
import { D1Storage } from "./server/d1Storage";
import { registerPageRoutes } from "./server/routes/pages";
import { registerApiRoutes } from "./server/routes/api";
import { registerAdminRoutes } from "./server/routes/admin";
import { registerSeoRoutes } from "./server/routes/seo";
import { registerErrorHandlers } from "./server/routes/errors";

type Env = {
  DB: D1Database;
  ACCESS_TEAM_DOMAIN: string;
  ACCESS_AUD: string;
  ENVIRONMENT: string;
  EMAIL: SendEmail;
};

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());
app.use("*", siteSecurityHeaders);
protectAdmin(app, accessGuard((c) => ({ teamDomain: c.env.ACCESS_TEAM_DOMAIN, aud: c.env.ACCESS_AUD })));

// Storage factory — creates D1Storage per-request
function getStorage(c: any) {
  return new D1Storage(c.env.DB);
}

// Register all routes from shared modules
registerPageRoutes(app, getStorage);
registerApiRoutes(app, getStorage, (c) => ({
  email: c.env.EMAIL,
  db: c.env.DB,
}));
registerAdminRoutes(app, getStorage);
registerSeoRoutes(app, getStorage);
registerErrorHandlers(app);

export default app;
