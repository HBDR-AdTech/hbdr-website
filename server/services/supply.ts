// hbdr.com /sellers.json and /ads.txt (D-031). Operators change them from /admin/supply, which writes
// supply_sellers / supply_ads_txt_lines / supply_settings plus a supply_changes audit row per change.
// Spec rules and quotes: docs/research/ads-txt-sellers-json.md
import { z } from "zod";
import type { IStorage, SupplySeller, AdsTxtLine } from "./storage";
import { SITE_URL } from "../config";

// direct_line_domain: field #1 of each publisher's own DIRECT line to HBDR
export const SUPPLY_SETTING_KEYS = ["contact_email", "contact_address", "direct_line_domain"] as const;

export interface SupplyData {
  sellers: SupplySeller[];
  lines: AdsTxtLine[];
  settings: Record<string, string>;
}

// Per-isolate cache, as for the form config (D-016 rule 5). A miss costs 3 queries: the active sellers,
// the active ads.txt lines and the 3 settings. An admin write clears it in its own isolate; other isolates
// serve the change within 60 seconds.
const CACHE_MS = 60_000;
let cache: { at: number; data: SupplyData } | null = null;

export async function getSupply(storage: IStorage): Promise<SupplyData> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;
  const [sellers, lines, settings] = await Promise.all([
    storage.getActiveSellers(), storage.getActiveAdsTxtLines(), storage.getSupplySettings(SUPPLY_SETTING_KEYS),
  ]);
  cache = { at: Date.now(), data: { sellers, lines, settings } };
  return cache.data;
}

export function invalidateSupply() {
  cache = null;
}

// sellers.json 1.0: version is the string "1.0"; name and domain are left out for a confidential seller.
// The spec does not say whether comment may stay on a confidential seller; it is left out so it cannot name them.
export function renderSellersJson({ sellers, settings }: SupplyData): string {
  return JSON.stringify({
    ...(settings.contact_email ? { contact_email: settings.contact_email } : {}),
    ...(settings.contact_address ? { contact_address: settings.contact_address } : {}),
    version: "1.0",
    sellers: sellers.map((s) => s.isConfidential
      ? { seller_id: s.sellerId, is_confidential: 1, seller_type: s.sellerType }
      : {
        seller_id: s.sellerId, seller_type: s.sellerType, name: s.name,
        ...(s.domain ? { domain: s.domain } : {}),
        ...(s.comment ? { comment: s.comment } : {}),
      }),
  });
}

// hbdr.com shows no ads, so its own ads.txt is the ads.txt 1.1 placeholder record (section 3.2.1)
export function renderAdsTxt({ settings }: SupplyData): string {
  const lines = [
    "# hbdr.com shows no ads: no advertising system is authorized to sell ads on this site.",
    "placeholder.example.com, placeholder, DIRECT, placeholder",
    ...(settings.contact_email ? [`contact=${settings.contact_email}`] : []),
    `OWNERDOMAIN=${new URL(SITE_URL).hostname}`,
  ];
  return lines.join("\n") + "\n";
}

export function adsTxtRecord(line: Pick<AdsTxtLine, "adSystemDomain" | "accountId" | "relationship" | "certAuthorityId" | "comment">): string {
  const fields = [line.adSystemDomain, line.accountId, line.relationship, ...(line.certAuthorityId ? [line.certAuthorityId] : [])];
  return fields.join(", ") + (line.comment ? ` # ${line.comment}` : "");
}

// The exact lines an HBDR publisher adds to its own ads.txt: its DIRECT line to HBDR, then the shared partner
// lines. Null when the seller is unknown or retired, or no direct_line_domain is set (the list would be wrong).
export async function getPublisherAdsTxtLines(storage: IStorage, sellerId: string): Promise<string[] | null> {
  const { sellers, lines, settings } = await getSupply(storage);
  if (!settings.direct_line_domain || !sellers.some((s) => s.sellerId === sellerId)) return null;
  return [
    adsTxtRecord({ adSystemDomain: settings.direct_line_domain, accountId: sellerId, relationship: "DIRECT", certAuthorityId: null, comment: null }),
    ...lines.map(adsTxtRecord),
  ];
}

// Admin request bodies. Values reach JSON, ads.txt lines and the admin page, so line breaks and control
// characters are refused everywhere (a newline in an ads.txt field would inject a record).
const CONTROL = /[\u0000-\u001f\u007f-\u009f]/;
const text = (max: number) => z.string().trim().min(1).max(max).refine((v) => !CONTROL.test(v), "Line breaks and control characters are not allowed");

// A bare DNS name (RFC 1123 labels), lowercased: no scheme, path, port or spaces. sellers.json and ads.txt want the
// root domain (public suffix + 1); that is not checked here, as it needs the Public Suffix List.
const DOMAIN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const domain = z.string().trim().toLowerCase().regex(DOMAIN, "Use a domain name like example.com, with no https://, path or spaces");

// seller_id is field #2 of a publisher's ads.txt line, where commas, whitespace, '#', ';' and '=' all change the meaning
const sellerId = z.string().trim().regex(/^[A-Za-z0-9._-]{1,64}$/, "Seller ID may use letters, digits, '.', '_' and '-' only (64 at most)");
const accountId = z.string().trim().regex(/^[A-Za-z0-9._:-]{1,100}$/, "Account ID may use letters, digits, '.', '_', ':' and '-' only (100 at most)");
// TAG IDs are 16 hex characters; other certification authorities are allowed, but only as a plain token
const certAuthorityId = z.string().trim().regex(/^[A-Za-z0-9]{1,64}$/, "Certification authority ID may use letters and digits only (64 at most)");

const sellerType = z.enum(["PUBLISHER", "INTERMEDIARY", "BOTH"]);

export const sellerCreateSchema = z.strictObject({
  sellerId,
  name: text(200),
  domain: domain.nullable().optional(),
  sellerType,
  isConfidential: z.boolean().optional(),
  comment: text(200).nullable().optional(),
});

export const sellerUpdateSchema = z.strictObject({
  name: text(200).optional(),
  domain: domain.nullable().optional(),
  sellerType: sellerType.optional(),
  isConfidential: z.boolean().optional(),
  comment: text(200).nullable().optional(),
});

export const adsTxtLineSchema = z.strictObject({
  adSystemDomain: domain,
  accountId,
  relationship: z.enum(["DIRECT", "RESELLER"]),
  certAuthorityId: certAuthorityId.nullable().optional(),
  comment: text(200).nullable().optional(),
});

export const supplySettingsSchema = z.strictObject({
  contactEmail: z.email("Use an email address").max(254).optional(),
  contactAddress: text(300).optional(),
  directLineDomain: domain.optional(),
});
