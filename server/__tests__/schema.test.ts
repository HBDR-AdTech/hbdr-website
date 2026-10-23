import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { LEAD_DETAIL_COLUMNS } from "../services/storage";

// Code that queries a table no migration creates fails every request in production (D-010, D-011)
const root = join(__dirname, "..", "..");

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "__tests__" ? [] : sources(path);
    return path.endsWith(".ts") ? [path] : [];
  });
}

describe("D1 schema", () => {
  it("every table the server queries is created by a migration", () => {
    const created = new Set(
      readdirSync(join(root, "migrations"))
        .flatMap((f) => [...readFileSync(join(root, "migrations", f), "utf8").matchAll(/CREATE TABLE IF NOT EXISTS (\w+)/g)])
        .map((m) => m[1]),
    );
    const used = new Set(
      [...sources(join(root, "server")), join(root, "worker.ts")]
        .flatMap((f) => [...readFileSync(f, "utf8").matchAll(/\b(?:FROM|INTO|UPDATE|JOIN) ([a-z_]+)\b/g)])
        .map((m) => m[1]),
    );
    expect(used.size).toBeGreaterThan(0);
    expect([...used].filter((t) => !created.has(t))).toEqual([]);
  });

  // A column the insert writes but no migration adds makes every lead insert throw (D-011)
  it("every contact_leads column the insert writes is created by a migration", () => {
    const sql = readdirSync(join(root, "migrations")).map((f) => readFileSync(join(root, "migrations", f), "utf8")).join("\n");
    const createBody = sql.match(/CREATE TABLE IF NOT EXISTS contact_leads \(([\s\S]*?)\n\);/)![1];
    const columns = new Set([
      ...[...createBody.matchAll(/^\s*(\w+) /gm)].map((m) => m[1]),
      ...[...sql.matchAll(/ALTER TABLE contact_leads ADD COLUMN (\w+)/g)].map((m) => m[1]),
    ]);
    const base = ["id", "name", "email", "company", "impressions", "message", "ip", "source", "status", "created_at"];
    expect([...base, ...LEAD_DETAIL_COLUMNS.map(([, c]) => c)].filter((c) => !columns.has(c))).toEqual([]);
  });

  // Leads are append-only (D-013): nothing in code or migrations may remove them
  it("never deletes, drops or truncates contact_leads", () => {
    const files = [...sources(join(root, "server")), join(root, "worker.ts"),
      ...readdirSync(join(root, "migrations")).map((f) => join(root, "migrations", f))];
    const offenders = files.filter((f) =>
      /\b(DELETE\s+FROM|DROP\s+TABLE(\s+IF\s+EXISTS)?|TRUNCATE(\s+TABLE)?)\s+contact_leads\b/i.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  // The form config audit log is append-only (D-016): rows are inserted, never changed or removed
  it("never deletes, updates, drops or truncates form_config_changes", () => {
    const files = [...sources(join(root, "server")), join(root, "worker.ts"),
      ...readdirSync(join(root, "migrations")).map((f) => join(root, "migrations", f))];
    const offenders = files.filter((f) =>
      /\b(DELETE\s+FROM|UPDATE|DROP\s+TABLE(\s+IF\s+EXISTS)?|TRUNCATE(\s+TABLE)?)\s+form_config_changes\b/i.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  // sellers.json / ads.txt (D-031): sellers and lines are retired, never deleted, so a seller_id is never reused;
  // supply_changes is append-only
  it("never deletes supply rows, and never changes supply_changes", () => {
    const files = [...sources(join(root, "server")), join(root, "worker.ts"),
      ...readdirSync(join(root, "migrations")).map((f) => join(root, "migrations", f)),
      ...readdirSync(join(root, "seed")).map((f) => join(root, "seed", f))];
    const removes = /\b(DELETE\s+FROM|DROP\s+TABLE(\s+IF\s+EXISTS)?|TRUNCATE(\s+TABLE)?|REPLACE\s+INTO|INSERT\s+OR\s+REPLACE\s+INTO)\s+(supply_sellers|supply_ads_txt_lines|supply_changes)\b/i;
    const changesAudit = /\bUPDATE\s+supply_changes\b/i;
    const offenders = files.filter((f) => {
      const sql = readFileSync(f, "utf8");
      return removes.test(sql) || changesAudit.test(sql);
    });
    expect(offenders).toEqual([]);
  });
});
