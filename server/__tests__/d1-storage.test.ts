import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { D1Storage } from "../d1Storage";
import type { SupplySeller, AdsTxtLine } from "../services/storage";

// D1Storage's real SQL against SQLite with every migration applied, so a typo, a missing column or a
// write split out of its batch fails here rather than on the first production request.
const migrations = join(__dirname, "..", "..", "migrations");

// Enough of D1Database (prepare/bind/first/all/run/batch) to run D1Storage; batch() is one transaction, as in D1
function d1(db: DatabaseSync, seen: string[]) {
  const statement = (sql: string, params: unknown[] = []) => ({
    bind: (...p: unknown[]) => statement(sql, p),
    first: async () => db.prepare(sql).get(...(params as [])) ?? null,
    all: async () => ({ results: db.prepare(sql).all(...(params as [])) }),
    run: async () => ({ meta: { changes: Number(db.prepare(sql).run(...(params as [])).changes) } }),
    exec: () => db.prepare(sql).run(...(params as [])),
  });
  return {
    prepare: (sql: string) => (seen.push(sql), statement(sql)),
    batch: async (stmts: ReturnType<typeof statement>[]) => {
      db.exec("BEGIN");
      try {
        stmts.forEach((s) => s.exec());
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      return [];
    },
  } as unknown as D1Database;
}

let db: DatabaseSync;
let storage: D1Storage;
let seen: string[];

beforeEach(() => {
  db = new DatabaseSync(":memory:");
  for (const file of readdirSync(migrations).sort()) db.exec(readFileSync(join(migrations, file), "utf8"));
  seen = [];
  storage = new D1Storage(d1(db, seen));
});

describe("D1Storage form config", () => {
  it("upserts a field override and writes one audit row per change, newest first", async () => {
    await storage.saveFieldOverride("phone", '{"visible":false}', null, "ops@hbdr.com");
    await storage.saveFieldOverride("phone", '{"visible":true}', '{"visible":false}', "matt@hbdr.com");
    expect(await storage.getFieldOverrides()).toEqual({ phone: '{"visible":true}' });
    const changes = await storage.getFormConfigChanges(50);
    expect(changes.map((c) => ({ ...c }))).toMatchObject([
      { actor: "matt@hbdr.com", target: "field:phone", before: '{"visible":false}', after: '{"visible":true}' },
      { actor: "ops@hbdr.com", target: "field:phone", before: null, after: '{"visible":false}' },
    ]);
  });

  it("writes neither the change nor its audit row when the batch fails", async () => {
    db.exec("ALTER TABLE form_config_changes RENAME TO form_config_changes_gone");
    await expect(storage.saveFieldOverride("phone", '{"visible":false}', null, "ops@hbdr.com")).rejects.toThrow();
    await expect(storage.saveFormSettings([{ key: "turnstile_enabled", value: "true", before: null }], "ops@hbdr.com")).rejects.toThrow();
    expect(await storage.getFieldOverrides()).toEqual({});
    expect(await storage.getFormSettings()).toEqual({});
  });

  it("stores settings with an audit row each", async () => {
    await storage.saveFormSettings([
      { key: "turnstile_site_key", value: "0x4AAAAAAAkey", before: null },
      { key: "turnstile_enabled", value: "true", before: null },
    ], "ops@hbdr.com");
    expect(await storage.getFormSettings()).toEqual({ turnstile_site_key: "0x4AAAAAAAkey", turnstile_enabled: "true" });
    expect((await storage.getFormConfigChanges(50)).map((c) => c.target).sort()).toEqual(["setting:turnstile_enabled", "setting:turnstile_site_key"]);
  });

  // 50 index rows per admin page view however long the log grows (a full SCAN would read every row)
  it("reads recent changes through the at index", async () => {
    await storage.getFormConfigChanges(50);
    const sql = seen.find((s) => s.includes("FROM form_config_changes"))!;
    const plan = db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all(50).map((r: any) => r.detail).join("\n");
    expect(plan).toContain("USING INDEX form_config_changes_at");
    expect(plan).not.toContain("TEMP B-TREE");
  });
});

describe("D1Storage sellers.json / ads.txt", () => {
  const seller = (sellerId: string, over: Partial<SupplySeller> = {}): SupplySeller => ({
    sellerId, name: `Seller ${sellerId}`, domain: `s${sellerId}.com`, sellerType: "PUBLISHER", isConfidential: false,
    comment: null, createdAt: "2026-10-23T00:00:00.000Z", retiredAt: null, ...over,
  });
  const line = (id: string): AdsTxtLine => ({
    id, adSystemDomain: "google.com", accountId: `pub-${id}`, relationship: "RESELLER", certAuthorityId: "f08c47fec0942fa0",
    comment: null, createdAt: `2026-10-23T00:00:0${id}.000Z`, retiredAt: null,
  });

  it("stores, updates and retires sellers with an audit row each; active reads are in seller_id order", async () => {
    await storage.createSeller(seller("2"), "ops@hbdr.com");
    await storage.createSeller(seller("1", { domain: null, isConfidential: true }), "ops@hbdr.com");
    await storage.updateSeller(seller("2", { name: "Renamed" }), seller("2"), "matt@hbdr.com");
    await storage.retireSeller(seller("1", { domain: null, isConfidential: true }), "matt@hbdr.com");
    expect((await storage.getActiveSellers()).map((s) => ({ ...s }))).toEqual([seller("2", { name: "Renamed" })]);
    const [retired] = await storage.getRetiredSellers();
    expect({ ...retired }).toMatchObject({ sellerId: "1", domain: null, isConfidential: true });
    expect(retired.retiredAt).toMatch(/^\d{4}-/);
    // a retired row is never changed again
    await storage.updateSeller(seller("1", { name: "Someone else" }), retired, "x");
    expect((await storage.getSeller("1"))!.name).toBe("Seller 1");
    expect((await storage.getSupplyChanges(50)).length).toBe(5);
  });

  it("refuses a second row for a taken seller_id at the database, retired or not, and writes no audit row", async () => {
    await storage.createSeller(seller("1"), "ops@hbdr.com");
    await storage.retireSeller(seller("1"), "ops@hbdr.com");
    await expect(storage.createSeller(seller("1", { name: "Someone else" }), "ops@hbdr.com")).rejects.toThrow(/UNIQUE|PRIMARY/);
    expect((await storage.getSeller("1"))!.name).toBe("Seller 1");
    expect(await storage.getSupplyChanges(50)).toHaveLength(2);
  });

  it("writes neither the change nor its audit row when the batch fails", async () => {
    db.exec("ALTER TABLE supply_changes RENAME TO supply_changes_gone");
    await expect(storage.createSeller(seller("1"), "ops@hbdr.com")).rejects.toThrow();
    await expect(storage.createAdsTxtLine(line("1"), "ops@hbdr.com")).rejects.toThrow();
    await expect(storage.saveSupplySettings([{ key: "contact_email", value: "contact@hbdr.com", before: null }], "ops@hbdr.com")).rejects.toThrow();
    expect(await storage.getActiveSellers()).toEqual([]);
    expect(await storage.getActiveAdsTxtLines()).toEqual([]);
    expect(await storage.getSupplySettings(["contact_email"])).toEqual({});
  });

  it("stores lines and settings; reads only the named settings", async () => {
    await storage.createAdsTxtLine(line("2"), "ops@hbdr.com");
    await storage.createAdsTxtLine(line("1"), "ops@hbdr.com");
    await storage.retireAdsTxtLine(line("2"), "ops@hbdr.com");
    expect((await storage.getActiveAdsTxtLines()).map((l) => ({ ...l }))).toEqual([line("1")]);
    expect((await storage.getAdsTxtLine("2"))!.retiredAt).not.toBeNull();
    await storage.saveSupplySettings([{ key: "contact_email", value: "contact@hbdr.com", before: null }, { key: "other", value: "x", before: null }], "ops@hbdr.com");
    expect(await storage.getSupplySettings(["contact_email", "direct_line_domain"])).toEqual({ contact_email: "contact@hbdr.com" });
  });

  // Doctrine 5: every supply query is an index SEARCH. The one exception is the audit log's newest-50 read, an
  // index walk that stops at LIMIT (50 rows however long the log grows), the same plan as form_config_changes.
  it("runs every supply query on an index: no table SCAN", async () => {
    await storage.createSeller(seller("1"), "a");
    await storage.updateSeller(seller("1", { name: "B" }), seller("1"), "a");
    await storage.retireSeller(seller("1"), "a");
    await storage.createAdsTxtLine(line("1"), "a");
    await storage.retireAdsTxtLine(line("1"), "a");
    await storage.saveSupplySettings([{ key: "contact_email", value: "contact@hbdr.com", before: null }], "a");
    seen.length = 0;
    await Promise.all([
      storage.getActiveSellers(), storage.getRetiredSellers(), storage.getSeller("1"), storage.getActiveAdsTxtLines(),
      storage.getAdsTxtLine("1"), storage.getSupplySettings(["contact_email", "contact_address", "direct_line_domain"]), storage.getSupplyChanges(50),
    ]);
    await storage.updateSeller(seller("1", { name: "C" }), seller("1"), "a");
    await storage.retireSeller(seller("1"), "a");
    await storage.retireAdsTxtLine(line("1"), "a");
    const queries = [...new Set(seen.filter((s) => /\bsupply_/.test(s) && !/^INSERT/.test(s)))];
    expect(queries.length).toBe(10);
    const params = (sql: string) => Array((sql.match(/\?/g) ?? []).length).fill("1");
    const plans = Object.fromEntries(queries.map((sql) =>
      [sql, db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all(...params(sql)).map((r: any) => r.detail).join(" | ")]));
    for (const [sql, plan] of Object.entries(plans)) {
      if (sql.includes("FROM supply_changes")) {
        expect(plan).toBe("SCAN supply_changes USING INDEX supply_changes_at");
        expect(sql).toMatch(/ORDER BY at DESC LIMIT \?$/);
        continue;
      }
      expect(plan, sql).toMatch(/^SEARCH /);
      expect(plan, sql).not.toMatch(/\bSCAN\b|TEMP B-TREE/);
    }
    const active = Object.entries(plans).find(([sql]) => sql.includes("WHERE retired_at IS NULL ORDER BY seller_id"))![1];
    expect(active).toBe("SEARCH supply_sellers USING INDEX supply_sellers_active (retired_at=?)");
  });
});

describe("D1Storage contact leads", () => {
  it("stores and reads back custom answers and the bot check", async () => {
    await storage.createContactLead({
      name: "Jane", email: "jane@publisher.com", company: "Pub", impressions: "10m-50m",
      customFields: '{"custom_budget":"10k"}', botCheck: "unverified", ip: "203.0.113.1", source: "contact",
    });
    const [lead] = await storage.getContactLeads();
    expect(lead).toMatchObject({ customFields: '{"custom_budget":"10k"}', botCheck: "unverified", phone: null });
  });
});
