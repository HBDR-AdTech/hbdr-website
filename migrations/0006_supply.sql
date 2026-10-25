-- hbdr.com /sellers.json and /ads.txt (D-031), written only by /admin/api/supply*. Rows are retired, never deleted:
-- a buyer may have cached a seller_id, and the spec forbids one seller_id standing for two entities.
CREATE TABLE IF NOT EXISTS supply_sellers (
  seller_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  -- null only when the seller has no web presence (sellers.json 1.0 lets domain be omitted then)
  domain TEXT,
  seller_type TEXT NOT NULL CHECK (seller_type IN ('PUBLISHER', 'INTERMEDIARY', 'BOTH')),
  is_confidential INTEGER NOT NULL DEFAULT 0 CHECK (is_confidential IN (0, 1)),
  comment TEXT,
  created_at TEXT NOT NULL,
  retired_at TEXT
);

-- /sellers.json reads the active rows in seller_id order: a SEARCH on retired_at IS NULL with no sort step
CREATE INDEX IF NOT EXISTS supply_sellers_active ON supply_sellers (retired_at, seller_id);

-- The shared lines every HBDR publisher adds to its own ads.txt, besides its own DIRECT line to HBDR
CREATE TABLE IF NOT EXISTS supply_ads_txt_lines (
  id TEXT PRIMARY KEY,
  ad_system_domain TEXT NOT NULL,
  account_id TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('DIRECT', 'RESELLER')),
  cert_authority_id TEXT,
  comment TEXT,
  created_at TEXT NOT NULL,
  retired_at TEXT
);

CREATE INDEX IF NOT EXISTS supply_ads_txt_lines_active ON supply_ads_txt_lines (retired_at, created_at);

-- contact_email, contact_address (sellers.json), direct_line_domain (field #1 of each publisher's DIRECT line to HBDR)
CREATE TABLE IF NOT EXISTS supply_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

-- Append-only audit of every admin change (server/__tests__/schema.test.ts): target is 'seller:<id>', 'line:<id>' or 'setting:<key>'
CREATE TABLE IF NOT EXISTS supply_changes (
  id TEXT PRIMARY KEY,
  at TEXT NOT NULL,
  actor TEXT NOT NULL,
  target TEXT NOT NULL,
  before TEXT,
  after TEXT
);

CREATE INDEX IF NOT EXISTS supply_changes_at ON supply_changes (at);
