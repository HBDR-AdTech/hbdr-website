-- Operator-controlled contact form (D-016). Defaults live in code (server/services/form-config.ts);
-- a row here exists only for a field the operator changed or created (custom fields: config.custom = true).
CREATE TABLE IF NOT EXISTS form_field_overrides (
  key TEXT PRIMARY KEY,
  config TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

-- turnstile_enabled ('true'/'false'), turnstile_site_key. The Turnstile secret is a Worker secret, never stored here.
CREATE TABLE IF NOT EXISTS form_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

-- Append-only audit of every admin change (server/__tests__/schema.test.ts): target is 'field:<key>' or 'setting:<key>'
CREATE TABLE IF NOT EXISTS form_config_changes (
  id TEXT PRIMARY KEY,
  at TEXT NOT NULL,
  actor TEXT NOT NULL,
  target TEXT NOT NULL,
  before TEXT,
  after TEXT
);

-- The admin page lists the latest 50 changes; the index keeps that read at 50 rows as the log grows
CREATE INDEX IF NOT EXISTS form_config_changes_at ON form_config_changes (at);

-- custom_fields: JSON object of custom field key -> answer. bot_check: 'passed' | 'unverified', null when Turnstile is off
ALTER TABLE contact_leads ADD COLUMN custom_fields TEXT;
ALTER TABLE contact_leads ADD COLUMN bot_check TEXT;
