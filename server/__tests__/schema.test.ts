import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

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

  // Leads are append-only (D-013): nothing in code or migrations may remove them
  it("never deletes, drops or truncates contact_leads", () => {
    const files = [...sources(join(root, "server")), join(root, "worker.ts"),
      ...readdirSync(join(root, "migrations")).map((f) => join(root, "migrations", f))];
    const offenders = files.filter((f) =>
      /\b(DELETE\s+FROM|DROP\s+TABLE(\s+IF\s+EXISTS)?|TRUNCATE(\s+TABLE)?)\s+contact_leads\b/i.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
