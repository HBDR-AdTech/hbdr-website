// Admin auth is Cloudflare Access (D-008). The Worker re-verifies the Access JWT on every admin request,
// so a hostname Access doesn't cover, or a misconfigured Access app, still can't reach admin routes.
import type { Hono, MiddlewareHandler } from "hono";
import { verifyWithJwks } from "hono/jwt";
import type { HonoJsonWebKey } from "hono/utils/jwt/jws";

export const ADMIN_PATHS = ["/admin", "/admin/*", "/api/blog", "/api/blog/*", "/api/leads", "/api/leads/*"];

export interface AccessConfig {
  teamDomain?: string; // e.g. securehbdr.cloudflareaccess.com
  aud?: string; // the Access application's AUD tag
  keys?: HonoJsonWebKey[]; // tests only; production fetches the team's JWKS
}

export function accessGuard(getConfig: (c: any) => AccessConfig): MiddlewareHandler {
  return async (c, next) => {
    const { teamDomain, aud, keys } = getConfig(c);
    const token = c.req.header("Cf-Access-Jwt-Assertion");
    // Missing config fails closed: no Access configuration means no admin access
    if (!teamDomain || !aud || !token) return c.text("Forbidden", 403);
    try {
      await verifyWithJwks(token, {
        ...(keys ? { keys } : { jwks_uri: `https://${teamDomain}/cdn-cgi/access/certs` }),
        allowedAlgorithms: ["RS256"],
        verification: { iss: `https://${teamDomain}`, aud },
      });
    } catch {
      return c.text("Forbidden", 403);
    }
    await next();
  };
}

export function protectAdmin(app: Hono<any>, guard: MiddlewareHandler) {
  for (const path of ADMIN_PATHS) app.use(path, guard);
}
