import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// A moved tag can swap the code that runs with our Cloudflare token; a commit SHA cannot move
const dir = join(__dirname, "..", "..", ".github", "workflows");
const workflows = readdirSync(dir).filter((f) => f.endsWith(".yml")).map((f) => [f, readFileSync(join(dir, f), "utf8")]);

describe("GitHub workflows", () => {
  it("pin every action to a full commit SHA with its version tag", () => {
    const uses = workflows.flatMap(([, yml]) => [...yml.matchAll(/^\s*-?\s*uses:\s*(.+)$/gm)].map((m) => m[1].trim()));
    expect(uses.length).toBeGreaterThan(0);
    expect(uses.filter((u) => !/^[\w.-]+\/[\w.\/-]+@[0-9a-f]{40} # v\d+\.\d+\.\d+$/.test(u))).toEqual([]);
  });

  it("default the token to read-only", () => {
    expect(workflows.filter(([, yml]) => !/^permissions:\n  contents: read$/m.test(yml)).map(([f]) => f)).toEqual([]);
  });
});
