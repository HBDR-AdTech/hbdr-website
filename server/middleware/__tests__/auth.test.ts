import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { accessGuard, protectAdmin, type AccessConfig } from "../auth";
import { csvCell } from "../../routes/admin";

const TEAM = "team.cloudflareaccess.com";
const AUD = "app-aud-tag";
let privateJwk: JsonWebKey;
let publicJwk: any;
let otherPrivateJwk: JsonWebKey;

async function rsaPair() {
  const kp = (await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true, ["sign", "verify"],
  )) as CryptoKeyPair;
  return [await crypto.subtle.exportKey("jwk", kp.privateKey), await crypto.subtle.exportKey("jwk", kp.publicKey)] as const;
}

beforeAll(async () => {
  const [priv, pub] = await rsaPair();
  privateJwk = { ...priv, kid: "k1", alg: "RS256" } as JsonWebKey;
  publicJwk = { ...pub, kid: "k1", alg: "RS256" };
  const [otherPriv] = await rsaPair();
  otherPrivateJwk = { ...otherPriv, kid: "k1", alg: "RS256" } as JsonWebKey;
});

const now = () => Math.floor(Date.now() / 1000);
const token = (claims: Record<string, unknown> = {}, key: JsonWebKey = privateJwk) =>
  sign({ iss: `https://${TEAM}`, aud: [AUD], email: "matt@hbdr.com", iat: now(), exp: now() + 600, ...claims }, key as any, "RS256");

function app(config: Partial<AccessConfig> = {}) {
  const a = new Hono();
  protectAdmin(a, accessGuard(() => ({ teamDomain: TEAM, aud: AUD, keys: [publicJwk], ...config })));
  for (const p of ["/admin/leads", "/api/leads", "/api/blog/1", "/blog"]) a.all(p, (c) => c.text("ok"));
  return a;
}

const call = async (a: Hono, path: string, jwt?: string, method = "GET") =>
  (await a.request(path, { method, headers: jwt ? { "Cf-Access-Jwt-Assertion": jwt } : {} })).status;

describe("Cloudflare Access guard on admin routes", () => {
  it("rejects admin routes with no Access token", async () => {
    for (const p of ["/admin/leads", "/api/leads"]) expect(await call(app(), p)).toBe(403);
    expect(await call(app(), "/api/blog/1", undefined, "DELETE")).toBe(403);
  });

  it("allows a valid Access token", async () => {
    expect(await call(app(), "/admin/leads", await token())).toBe(200);
    expect(await call(app(), "/api/blog/1", await token(), "DELETE")).toBe(200);
  });

  it("rejects wrong audience, wrong issuer, expired, and foreign-key tokens", async () => {
    expect(await call(app(), "/admin/leads", await token({ aud: ["other-app"] }))).toBe(403);
    expect(await call(app(), "/admin/leads", await token({ iss: "https://evil.cloudflareaccess.com" }))).toBe(403);
    expect(await call(app(), "/admin/leads", await token({ exp: now() - 60 }))).toBe(403);
    expect(await call(app(), "/admin/leads", await token({}, otherPrivateJwk))).toBe(403);
    expect(await call(app(), "/admin/leads", "not.a.jwt")).toBe(403);
  });

  it("fails closed when Access config is missing", async () => {
    expect(await call(app({ aud: undefined }), "/admin/leads", await token())).toBe(403);
    expect(await call(app({ teamDomain: undefined }), "/admin/leads", await token())).toBe(403);
  });

  it("leaves public routes alone", async () => {
    expect(await call(app(), "/blog")).toBe(200);
  });
});

describe("csvCell", () => {
  it("neutralizes spreadsheet formulas and quotes every cell", () => {
    expect(csvCell('=HYPERLINK("http://x","y")')).toBe(`"'=HYPERLINK(""http://x"",""y"")"`);
    expect(csvCell("+1")).toBe(`"'+1"`);
    expect(csvCell("@sum")).toBe(`"'@sum"`);
    expect(csvCell("Acme, Inc")).toBe(`"Acme, Inc"`);
    expect(csvCell(null)).toBe(`""`);
  });
});
