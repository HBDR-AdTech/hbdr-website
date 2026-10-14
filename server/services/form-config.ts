// Operator-controlled contact form (D-016). Defaults live here; operators change them from /admin/form,
// which writes form_field_overrides / form_settings plus an audit row per change.
import { z } from "zod";
import type { IStorage } from "./storage";
import { sanitizeText } from "../middleware/sanitize";

export type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "checkboxes";
// label only on the fixed impressions values; every other option shows its value
export interface FieldOption { value: string; active: boolean; label?: string }

export interface FormField {
  key: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  visible: boolean;
  order: number;
  options?: FieldOption[];
  locked: boolean;
  maxLength: number;
  custom?: boolean;
}

export type FieldOverride = Partial<Omit<FormField, "key">>;

export interface FormConfig {
  fields: FormField[];
  turnstileSiteKey: string | null; // set only when Turnstile is enabled
}

const opts = (...values: string[]): FieldOption[] => values.map((value) => ({ value, active: true }));

// Locked fields are the lead itself (name, email, company, volume): always shown and required.
// message sorts last so custom fields land before it.
export const DEFAULT_FORM_FIELDS: FormField[] = [
  { key: "name", type: "text", label: "Full Name", placeholder: "John Smith", required: true, visible: true, order: 10, locked: true, maxLength: 100 },
  { key: "email", type: "email", label: "Work Email", placeholder: "john@company.com", required: true, visible: true, order: 20, locked: true, maxLength: 254 },
  { key: "company", type: "text", label: "Company Name", placeholder: "Your Company", required: true, visible: true, order: 30, locked: true, maxLength: 300 },
  { key: "phone", type: "tel", label: "Phone", placeholder: "+1 (555) 123-4567", required: false, visible: true, order: 40, locked: false, maxLength: 40 },
  { key: "role", type: "select", label: "Your Role", placeholder: "Select one", required: false, visible: true, order: 50, locked: false, maxLength: 100,
    options: opts("Owner / Founder", "Ad Operations", "Revenue / Monetization", "Product / Engineering", "Agency / Consultant", "Other") },
  { key: "impressions", type: "select", label: "Monthly Impressions", placeholder: "Select volume", required: true, visible: true, order: 60, locked: true, maxLength: 100,
    options: [["under-10m", "Under 10M"], ["10m-50m", "10M - 50M"], ["50m-100m", "50M - 100M"], ["100m-500m", "100M - 500M"], ["500m-1b", "500M - 1B"], ["over-1b", "Over 1B"]]
      .map(([value, label]) => ({ value, label, active: true })) },
  { key: "inventoryTypes", type: "checkboxes", label: "Inventory Type", placeholder: "", required: true, visible: true, order: 70, locked: false, maxLength: 100,
    options: opts("Website", "Mobile app", "CTV / OTT") },
  { key: "property", type: "text", label: "Domain, Bundle ID or App URL", placeholder: "example.com or com.example.app", required: true, visible: true, order: 80, locked: false, maxLength: 300 },
  { key: "adsTxtUrl", type: "text", label: "ads.txt or app-ads.txt URL", placeholder: "example.com/ads.txt", required: true, visible: true, order: 90, locked: false, maxLength: 300 },
  { key: "appStoreUrls", type: "textarea", label: "App Store URLs", placeholder: "One per line: Apple App Store, Google Play, Roku, Amazon Fire TV, Samsung, LG...", required: false, visible: true, order: 100, locked: false, maxLength: 2000 },
  { key: "currentSetup", type: "select", label: "Current Monetization", placeholder: "Select one", required: true, visible: true, order: 110, locked: false, maxLength: 100,
    options: opts("Google AdSense", "Google Ad Manager", "Another ad network or wrapper", "In-house header bidding", "Not monetized yet") },
  { key: "topGeo", type: "select", label: "Top Traffic Region", placeholder: "Select one", required: false, visible: true, order: 120, locked: false, maxLength: 100,
    options: opts("United States", "UK / Europe", "Latin America", "Asia-Pacific", "Global mix") },
  { key: "timeline", type: "select", label: "Timeline", placeholder: "Select one", required: false, visible: true, order: 130, locked: false, maxLength: 100,
    options: opts("ASAP", "Within 1-3 months", "3+ months", "Just exploring") },
  { key: "referral", type: "select", label: "How Did You Hear About Us?", placeholder: "Select one", required: false, visible: true, order: 140, locked: false, maxLength: 100,
    options: opts("Google search", "LinkedIn", "Referral / word of mouth", "Industry event", "Other") },
  { key: "message", type: "textarea", label: "Message", placeholder: "Tell us about your current ad setup and goals...", required: false, visible: true, order: 1000, locked: false, maxLength: 10000 },
];

export const DEFAULT_FORM_CONFIG: FormConfig = { fields: DEFAULT_FORM_FIELDS, turnstileSiteKey: null };
export const MAX_CUSTOM_FIELDS = 20;

const EDITABLE = ["label", "placeholder", "required", "visible", "order", "options"] as const;
const LOCKED_EDITABLE = ["label", "placeholder"] as const;

// Defaults with operator overrides merged per key, custom fields appended, sorted by order.
// Only operator-editable properties are taken from a row, so a bad row can never unlock a locked field.
export function resolveFormFields(defaults: FormField[], overrides: Record<string, FieldOverride>): FormField[] {
  const builtIn = defaults.map((field) => {
    const row = overrides[field.key];
    if (!row) return field;
    const allowed: readonly string[] = field.locked ? LOCKED_EDITABLE : EDITABLE;
    const merged: FormField = { ...field, ...Object.fromEntries(Object.entries(row).filter(([k]) => allowed.includes(k))) };
    // the operator's list keeps its order; an option added to the code later still appears
    if (field.options && row.options && !field.locked) {
      merged.options = [...row.options, ...field.options.filter((d) => !row.options!.some((o) => o.value === d.value))];
    }
    return merged;
  });
  // custom keys reach Alpine x-model paths and element ids: only the shape newCustomField makes is used
  const custom = Object.entries(overrides)
    .filter(([key, row]) => row.custom && /^custom_[a-z0-9_]+$/.test(key) && !defaults.some((d) => d.key === key))
    .map(([key, row]) => ({ ...row, key, locked: false, custom: true }) as FormField);
  return [...builtIn, ...custom].sort((a, b) => a.order - b.order);
}

export const SETTING_DEFAULTS: Record<string, string> = { turnstile_enabled: "false", turnstile_site_key: "" };

// Uncached: admin reads and writes must see the latest rows, not a 60-second-old copy
export async function readFormConfig(storage: IStorage) {
  const [overrides, stored] = await Promise.all([storage.getFieldOverrides(), storage.getFormSettings()]);
  const settings = { ...SETTING_DEFAULTS, ...stored };
  // A row only the admin API writes can still be broken by a hand edit in D1: skip it rather than fail every lead
  const parsed: Record<string, FieldOverride> = {};
  for (const [key, json] of Object.entries(overrides)) {
    try {
      parsed[key] = JSON.parse(json);
    } catch {
      console.error(`form_field_overrides row ${key} is not JSON; using the default`);
    }
  }
  return { overrides, settings, fields: resolveFormFields(DEFAULT_FORM_FIELDS, parsed) };
}

// Per-isolate cache: the form is read on every home/contact view and every submission. A miss costs two
// queries (under 40 rows). An admin write clears it in its own isolate; other isolates see a change within 60 seconds.
const CACHE_MS = 60_000;
let cache: { at: number; config: FormConfig } | null = null;

export async function getFormConfig(storage: IStorage): Promise<FormConfig> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.config;
  const { fields, settings } = await readFormConfig(storage);
  const enabled = settings.turnstile_enabled === "true" && settings.turnstile_site_key !== "";
  cache = { at: Date.now(), config: { fields, turnstileSiteKey: enabled ? settings.turnstile_site_key : null } };
  return cache.config;
}

export function invalidateFormConfig() {
  cache = null;
}

const PHONE = /^[0-9+().\-\s]+$/;
type Answer = { value: string | null } | { error: string };

function readAnswer(field: FormField, raw: unknown): Answer {
  const invalid = { error: `${field.label}: please choose from the list.` };
  const blank = field.required ? { error: `${field.label} is required.` } : { value: null };
  if (raw === null) return blank;
  if (field.type === "checkboxes") {
    if (!Array.isArray(raw)) return invalid;
    // retired options stay valid: a visitor on a cached page may still send them
    if (raw.some((v) => !field.options!.some((o) => o.value === v))) return invalid;
    return raw.length ? { value: [...new Set(raw)].join(", ") } : blank;
  }
  if (typeof raw !== "string") return { error: `${field.label} must be text.` };
  const text = raw.trim();
  if (!text) return blank;
  if (field.type === "select") return field.options!.some((o) => o.value === text) ? { value: text } : invalid;
  if (text.length > field.maxLength) return { error: `${field.label} is too long (${field.maxLength} characters at most).` };
  if (field.type === "tel" && !PHONE.test(text)) return { error: "Please enter a valid phone number." };
  return { value: sanitizeText(text) };
}

// Every non-locked field (locked ones are the Zod core schema). Rules (D-016):
// hidden -> ignored and stored null; absent from the JSON -> accepted (a cached page predates the field, D-011);
// present but blank and required -> refused. Custom answers arrive under body.custom; unknown keys are dropped.
export function validateAnswers(body: Record<string, unknown>, fields: FormField[]):
  { values: Record<string, string | null>; custom: Record<string, string> } | { error: string } {
  const posted = body.custom && typeof body.custom === "object" && !Array.isArray(body.custom) ? body.custom as Record<string, unknown> : {};
  const values: Record<string, string | null> = {};
  const custom: Record<string, string> = {};
  for (const field of fields) {
    if (field.locked) continue;
    const raw = field.custom ? posted[field.key] : body[field.key];
    let value: string | null = null;
    if (field.visible && raw !== undefined) {
      const answer = readAnswer(field, raw);
      if ("error" in answer) return answer;
      value = answer.value;
    }
    if (!field.custom) values[field.key] = value;
    else if (value !== null) custom[field.key] = value;
  }
  return { values, custom };
}

// [label, answer] for a lead's custom answers; the key stands in for a field no longer in the config.
// Labels are raw operator text (escape on render); answers were escaped at the API boundary.
export function customAnswers(customFields: string | null, fields: FormField[]): [string, string][] {
  if (!customFields) return [];
  return Object.entries(JSON.parse(customFields) as Record<string, string>)
    .map(([key, value]) => [fields.find((f) => f.key === key)?.label ?? key, value]);
}

// Admin request bodies
const label = z.string().trim().min(1, "Label is required").max(120);
const placeholder = z.string().trim().max(120);
// Option values are stored on the lead and printed in the form, email and admin: a plain character set, no commas
// (checkbox answers are stored comma-joined)
const optionValue = z.string().trim().min(1).max(100)
  .regex(/^[A-Za-z0-9][A-Za-z0-9 /+().-]*$/, "Options may use letters, digits, spaces and / + ( ) . - only");

export const fieldUpdateSchema = z.strictObject({
  label: label.optional(),
  placeholder: placeholder.optional(),
  required: z.boolean().optional(),
  visible: z.boolean().optional(),
  order: z.number().int().min(0).max(100000).optional(),
  options: z.array(z.strictObject({ value: optionValue, active: z.boolean() })).max(50).optional(),
});

export const customFieldSchema = z.strictObject({
  label,
  type: z.enum(["text", "textarea", "select", "checkboxes"]),
  placeholder: placeholder.optional(),
  required: z.boolean().optional(),
  options: z.array(optionValue).max(50).optional(),
});

export const settingsSchema = z.strictObject({
  turnstileEnabled: z.boolean().optional(),
  turnstileSiteKey: z.string().trim().regex(/^[0-9A-Za-z_-]{0,100}$/, "Site key looks wrong").optional(),
});

const LOCKED_MESSAGE = "Name, work email, company and monthly impressions are always shown and required; only their label and placeholder can change.";

// The new override row for a field, or why the change is refused
export function applyFieldUpdate(field: FormField, current: FieldOverride, update: z.infer<typeof fieldUpdateSchema>):
  { config: FieldOverride } | { error: string } {
  if (field.locked && (update.visible === false || update.required === false || update.order !== undefined || update.options !== undefined)) {
    return { error: LOCKED_MESSAGE };
  }
  if (update.options) {
    if (!field.options) return { error: "This field has no options." };
    const values = update.options.map((o) => o.value);
    if (new Set(values).size !== values.length) return { error: "Option values must be unique." };
    // a lead may hold a removed value and cached pages may still send it: options are retired, never deleted
    if (field.options.some((o) => !values.includes(o.value))) return { error: "Options cannot be deleted; retire them instead." };
    if (!update.options.some((o) => o.active)) return { error: "Keep at least one active option." };
  }
  return { config: { ...current, ...update } };
}

// The key and row for a new custom field, or why it is refused
export function newCustomField(fields: FormField[], input: z.infer<typeof customFieldSchema>):
  { key: string; config: FieldOverride } | { error: string } {
  if (fields.filter((f) => f.custom).length >= MAX_CUSTOM_FIELDS) return { error: `At most ${MAX_CUSTOM_FIELDS} custom fields.` };
  const choice = input.type === "select" || input.type === "checkboxes";
  const values = input.options ?? [];
  if (choice && !values.length) return { error: "Add at least one option." };
  if (!choice && values.length) return { error: "Only select and checkbox fields have options." };
  if (new Set(values).size !== values.length) return { error: "Option values must be unique." };
  // keys are immutable and spliced into Alpine x-model paths: [a-z0-9_] only
  const base = `custom_${input.label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40) || "field"}`;
  let key = base;
  for (let n = 2; fields.some((f) => f.key === key); n++) key = `${base}_${n}`;
  const order = Math.max(...fields.filter((f) => f.key !== "message").map((f) => f.order)) + 10;
  return {
    key,
    config: {
      custom: true, type: input.type, label: input.label, placeholder: input.placeholder ?? "",
      required: input.required ?? false, visible: true, order,
      maxLength: input.type === "textarea" ? 5000 : input.type === "text" ? 300 : 100,
      ...(choice ? { options: values.map((value) => ({ value, active: true })) } : {}),
    },
  };
}
