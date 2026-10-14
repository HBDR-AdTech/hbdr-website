import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  DEFAULT_FORM_FIELDS, resolveFormFields, getFormConfig, invalidateFormConfig, validateAnswers, newCustomField, type FieldOverride,
} from "../form-config";
import { MemStorage } from "../mem-storage";

const byKey = (fields: ReturnType<typeof resolveFormFields>, key: string) => fields.find((f) => f.key === key)!;

describe("resolveFormFields", () => {
  it("returns the defaults in order when nothing is overridden", () => {
    const fields = resolveFormFields(DEFAULT_FORM_FIELDS, {});
    expect(fields.map((f) => f.key)).toEqual(DEFAULT_FORM_FIELDS.map((f) => f.key));
    expect(fields.at(-1)!.key).toBe("message");
  });

  it("merges an override per key and re-sorts by order", () => {
    const fields = resolveFormFields(DEFAULT_FORM_FIELDS, { referral: { order: 5, label: "Source", required: true } });
    expect(fields[0]).toMatchObject({ key: "referral", label: "Source", required: true, type: "select" });
  });

  it("appends custom fields and sorts them in by order", () => {
    const custom: FieldOverride = { custom: true, type: "text", label: "Budget", placeholder: "", required: false, visible: true, order: 150, maxLength: 300 };
    const keys = resolveFormFields(DEFAULT_FORM_FIELDS, { custom_budget: custom }).map((f) => f.key);
    expect(keys.slice(-2)).toEqual(["custom_budget", "message"]);
    expect(byKey(resolveFormFields(DEFAULT_FORM_FIELDS, { custom_budget: custom }), "custom_budget")).toMatchObject({ custom: true, locked: false });
  });

  it("takes only label and placeholder for a locked field, whatever the row says", () => {
    const email = byKey(resolveFormFields(DEFAULT_FORM_FIELDS, { email: { label: "Business email", visible: false, required: false, order: 999 } }), "email");
    expect(email).toMatchObject({ label: "Business email", visible: true, required: true, order: 20 });
  });

  it("keeps the operator's option list and still shows options the code adds later", () => {
    const role = byKey(resolveFormFields(DEFAULT_FORM_FIELDS, { role: { options: [{ value: "Other", active: true }, { value: "Ad Operations", active: false }] } }), "role");
    expect(role.options!.slice(0, 2)).toEqual([{ value: "Other", active: true }, { value: "Ad Operations", active: false }]);
    expect(role.options!.map((o) => o.value)).toContain("Owner / Founder");
  });
});

describe("validateAnswers", () => {
  const fields = resolveFormFields(DEFAULT_FORM_FIELDS, { topGeo: { required: true }, timeline: { visible: false } });

  it("accepts an absent required field but refuses a present blank one", () => {
    expect(validateAnswers({}, fields)).not.toHaveProperty("error");
    expect(validateAnswers({ topGeo: "" }, fields)).toEqual({ error: "Top Traffic Region is required." });
  });

  it("ignores a hidden field's value", () => {
    const result = validateAnswers({ timeline: "<script>" }, fields);
    expect(result).toMatchObject({ values: { timeline: null } });
  });
});

describe("newCustomField", () => {
  it("derives an immutable slug key and never reuses one", () => {
    const first = newCustomField(DEFAULT_FORM_FIELDS, { label: "Monthly <Budget>!", type: "text" });
    expect(first).toMatchObject({ key: "custom_monthly_budget", config: { order: 150, maxLength: 300 } });
    const taken = resolveFormFields(DEFAULT_FORM_FIELDS, { custom_monthly_budget: (first as { config: FieldOverride }).config });
    expect(newCustomField(taken, { label: "Monthly budget", type: "textarea" })).toMatchObject({ key: "custom_monthly_budget_2", config: { maxLength: 5000 } });
  });
});

describe("getFormConfig cache", () => {
  beforeEach(() => invalidateFormConfig());

  it("reads storage once per 60 seconds and again after invalidation", async () => {
    const storage = new MemStorage();
    const reads = vi.spyOn(storage, "getFieldOverrides");
    await getFormConfig(storage);
    await storage.saveFieldOverride("name", JSON.stringify({ label: "Your name" }), null, "test");
    expect(byKey((await getFormConfig(storage)).fields, "name").label).toBe("Full Name");
    expect(reads).toHaveBeenCalledTimes(1);

    invalidateFormConfig();
    expect(byKey((await getFormConfig(storage)).fields, "name").label).toBe("Your name");
    expect(reads).toHaveBeenCalledTimes(2);
  });

  it("expires after 60 seconds", async () => {
    vi.useFakeTimers();
    try {
      const storage = new MemStorage();
      const reads = vi.spyOn(storage, "getFieldOverrides");
      await getFormConfig(storage);
      vi.advanceTimersByTime(61_000);
      await getFormConfig(storage);
      expect(reads).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("serves the Turnstile site key only while Turnstile is on", async () => {
    const storage = new MemStorage();
    await storage.saveFormSettings([{ key: "turnstile_site_key", value: "0xKEY", before: null }], "test");
    expect((await getFormConfig(storage)).turnstileSiteKey).toBeNull();
    await storage.saveFormSettings([{ key: "turnstile_enabled", value: "true", before: null }], "test");
    invalidateFormConfig();
    expect((await getFormConfig(storage)).turnstileSiteKey).toBe("0xKEY");
  });
});
