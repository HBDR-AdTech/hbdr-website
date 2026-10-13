-- Qualifying fields on the contact form (all nullable: the support form and pre-existing leads leave them empty)
ALTER TABLE contact_leads ADD COLUMN phone TEXT;
ALTER TABLE contact_leads ADD COLUMN inventory_types TEXT;
ALTER TABLE contact_leads ADD COLUMN property TEXT;
ALTER TABLE contact_leads ADD COLUMN app_store_urls TEXT;
ALTER TABLE contact_leads ADD COLUMN ads_txt_url TEXT;
ALTER TABLE contact_leads ADD COLUMN current_setup TEXT;
ALTER TABLE contact_leads ADD COLUMN role TEXT;
ALTER TABLE contact_leads ADD COLUMN timeline TEXT;
ALTER TABLE contact_leads ADD COLUMN top_geo TEXT;
ALTER TABLE contact_leads ADD COLUMN referral TEXT;
