import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { D1Storage } from "../d1Storage";

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
