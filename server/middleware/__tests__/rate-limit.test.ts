import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { checkRateLimit, getClientIp, bucketKey } from "../rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows first request (in-memory)", async () => {
    const ip = `test-${Date.now()}-${Math.random()}`;
    const result = await checkRateLimit(ip);
    expect(result.allowed).toBe(true);
  });

  it("allows up to 5 requests in window", async () => {
    const ip = `test-allow5-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      expect((await checkRateLimit(ip)).allowed).toBe(true);
    }
  });

  it("blocks after 5 requests", async () => {
    const ip = `test-block-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(ip);
    }
    const result = await checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("resets after window expires", async () => {
    const ip = `test-reset-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(ip);
    }
    expect((await checkRateLimit(ip)).allowed).toBe(false);

    // Advance past the 15-minute window
    vi.advanceTimersByTime(16 * 60 * 1000);
    expect((await checkRateLimit(ip)).allowed).toBe(true);
  });

  it("falls back to in-memory when db is null", async () => {
    const ip = `test-null-db-${Date.now()}`;
    const result = await checkRateLimit(ip, null);
    expect(result.allowed).toBe(true);
  });

  it("falls back to in-memory when db is undefined", async () => {
    const ip = `test-undef-db-${Date.now()}`;
    const result = await checkRateLimit(ip, undefined);
    expect(result.allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("uses cf-connecting-ip", () => {
    const headers = new Headers({
      "cf-connecting-ip": "1.2.3.4",
      "x-real-ip": "5.6.7.8",
      "x-forwarded-for": "9.10.11.12",
    });
    expect(getClientIp(headers)).toBe("1.2.3.4");
  });

  it("ignores client-supplied x-real-ip and x-forwarded-for", () => {
    const headers = new Headers({ "x-real-ip": "5.6.7.8", "x-forwarded-for": "1.1.1.1, 2.2.2.2" });
    expect(getClientIp(headers)).toBe("no-ip");
  });

  it("returns no-ip when no headers", () => {
    expect(getClientIp(new Headers())).toBe("no-ip");
  });
});

describe("bucketKey", () => {
  it("keeps IPv4 addresses whole", () => {
    expect(bucketKey("1.2.3.4")).toBe("1.2.3.4");
  });

  it("keys IPv6 by /64, expanding :: and leading zeros", () => {
    const key = "2001:db8:1:2::/64";
    expect(bucketKey("2001:db8:1:2::1")).toBe(key);
    expect(bucketKey("2001:0DB8:0001:0002:ffff:eeee:dddd:cccc")).toBe(key);
    expect(bucketKey("2001:db8:1:3::1")).not.toBe(key);
    expect(bucketKey("2001:db8::1")).toBe("2001:db8:0:0::/64");
    expect(bucketKey("fe80::1:2:3:4:5")).toBe("fe80:0:0:1::/64");
    expect(bucketKey("::1")).toBe("0:0:0:0::/64");
  });

  it("blocks a bot rotating addresses inside one /64", async () => {
    for (let i = 1; i <= 5; i++) {
      expect((await checkRateLimit(`2001:db8:aa:bb::${i}`)).allowed).toBe(true);
    }
    expect((await checkRateLimit("2001:db8:aa:bb:ffff::6")).allowed).toBe(false);
    expect((await checkRateLimit("2001:db8:aa:bc::1")).allowed).toBe(true);
  });
});

// D1-shaped wrapper over real SQLite with the real migrations, so the SQL itself is under test
function d1() {
  const sqlite = new DatabaseSync(":memory:");
  const migrations = join(__dirname, "..", "..", "..", "migrations");
  for (const f of ["0002_rate_limits.sql", "0005_rate_limit_index.sql"]) sqlite.exec(readFileSync(join(migrations, f), "utf8"));
  const prepare = (sql: string) => ({
    bind: (...args: any[]) => ({
      all: () => ({ results: sqlite.prepare(sql).all(...args) }),
      run: async () => sqlite.prepare(sql).run(...args),
      first: async () => sqlite.prepare(sql).get(...args) ?? null,
    }),
  });
  // Runs synchronously when called, like a D1 batch landing on the database before the caller resumes
  const batch = async (stmts: any[]) => stmts.map((s) => s.all());
  return { sqlite, db: { prepare, batch } };
}

describe("checkRateLimit (D1)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows 5 then blocks with retryAfter", async () => {
    const { db } = d1();
    for (let i = 0; i < 5; i++) {
      expect((await checkRateLimit("198.51.100.7", db)).allowed).toBe(true);
    }
    const blocked = await checkRateLimit("198.51.100.7", db);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(15 * 60);
  });

  it("lets exactly 5 of 10 concurrent requests through", async () => {
    const { db } = d1();
    const results = await Promise.all(Array.from({ length: 10 }, () => checkRateLimit("198.51.100.8", db)));
    expect(results.filter((r) => r.allowed)).toHaveLength(5);
  });

  it("starts a new window after 15 minutes and deletes expired rows", async () => {
    const { sqlite, db } = d1();
    for (let i = 0; i < 6; i++) await checkRateLimit("198.51.100.9", db);
    await checkRateLimit("198.51.100.10", db);
    vi.advanceTimersByTime(16 * 60 * 1000);
    expect((await checkRateLimit("198.51.100.9", db)).allowed).toBe(true);
    expect(sqlite.prepare("SELECT ip, count FROM rate_limits").all()).toEqual([{ ip: "198.51.100.9", count: 1 }]);
  });

  it("expired-row cleanup uses the window_start index, not a table scan", () => {
    const { sqlite } = d1();
    const plan = sqlite.prepare("EXPLAIN QUERY PLAN DELETE FROM rate_limits WHERE window_start < ?").all(0)
      .map((r: any) => r.detail).join("\n");
    expect(plan).not.toMatch(/SCAN rate_limits/);
    expect(plan).toContain("idx_rate_limits_window");
  });
});
