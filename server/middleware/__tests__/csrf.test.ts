import { describe, it, expect } from "vitest";
import { validateOrigin, requireSameOrigin } from "../csrf";

describe("validateOrigin", () => {
  it("validates matching origin", () => {
    const headers = new Headers({ origin: "https://hbdr.com", host: "hbdr.com" });
    expect(validateOrigin(headers)).toBe(true);
  });

  it("rejects mismatched origin", () => {
    const headers = new Headers({ origin: "https://evil.com", host: "hbdr.com" });
    expect(validateOrigin(headers)).toBe(false);
  });

  it("falls back to referer when no origin", () => {
    const headers = new Headers({ referer: "https://hbdr.com/page", host: "hbdr.com" });
    expect(validateOrigin(headers)).toBe(true);
  });

  it("allows requests with no origin or referer", () => {
    const headers = new Headers({ host: "hbdr.com" });
    expect(validateOrigin(headers)).toBe(true);
  });

  it("rejects malformed origin", () => {
    const headers = new Headers({ origin: "not-a-url", host: "hbdr.com" });
    expect(validateOrigin(headers)).toBe(false);
  });
});

describe("requireSameOrigin", () => {
  it("accepts only a present, matching Origin", () => {
    expect(requireSameOrigin(new Headers({ origin: "https://hbdr.com", host: "hbdr.com" }))).toBe(true);
    expect(requireSameOrigin(new Headers({ host: "hbdr.com" }))).toBe(false);
    expect(requireSameOrigin(new Headers({ referer: "https://hbdr.com/admin/form", host: "hbdr.com" }))).toBe(false);
    expect(requireSameOrigin(new Headers({ origin: "https://evil.com", host: "hbdr.com" }))).toBe(false);
  });
});
