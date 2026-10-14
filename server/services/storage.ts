// IStorage interface — the contract that both D1Storage and MemStorage implement
// Import types directly to avoid Drizzle dependency in production path

// Qualifying answers from the contact form; null when not asked (support form), hidden or left blank
export interface LeadDetails {
  phone: string | null;
  inventoryTypes: string | null;
  property: string | null;
  appStoreUrls: string | null;
  adsTxtUrl: string | null;
  currentSetup: string | null;
  role: string | null;
  timeline: string | null;
  topGeo: string | null;
  referral: string | null;
  customFields: string | null; // JSON object: custom field key -> answer (already HTML-escaped)
  botCheck: string | null; // 'passed' | 'unverified'; null when Turnstile is off
}

// LeadDetails key -> contact_leads column (migrations/0003_lead_details.sql, 0004_form_config.sql)
export const LEAD_DETAIL_COLUMNS: [keyof LeadDetails, string][] = [
  ["phone", "phone"], ["inventoryTypes", "inventory_types"], ["property", "property"],
  ["appStoreUrls", "app_store_urls"], ["adsTxtUrl", "ads_txt_url"], ["currentSetup", "current_setup"],
  ["role", "role"], ["timeline", "timeline"], ["topGeo", "top_geo"], ["referral", "referral"],
  ["customFields", "custom_fields"], ["botCheck", "bot_check"],
];

// One row of the append-only form_config_changes audit log
export interface FormConfigChange {
  id: string;
  at: string;
  actor: string;
  target: string; // 'field:<key>' | 'setting:<key>'
  before: string | null;
  after: string | null;
}

export interface ContactLead extends LeadDetails {
  id: string;
  name: string;
  email: string;
  company: string;
  impressions: string;
  message: string | null;
  ip: string | null;
  source: string | null;
  status: string | null;
  createdAt: Date | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  category: string;
  tags: string | null;
  published: string;
  publishedAt: Date | null;
  updatedAt: Date | null;
}

export interface InsertContactLead extends Partial<LeadDetails> {
  name: string;
  email: string;
  company: string;
  impressions: string;
  message?: string | null;
}

export interface InsertBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  author: string;
  category: string;
  tags?: string | null;
  published?: string;
}

export interface IStorage {
  createContactLead(lead: InsertContactLead & { ip?: string; source?: string }): Promise<ContactLead>;
  getContactLeads(): Promise<ContactLead[]>;
  getContactLeadById(id: string): Promise<ContactLead | undefined>;
  updateContactLeadStatus(id: string, status: string): Promise<ContactLead | undefined>;
  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost & { publishedAt?: string | Date }): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  // Contact form config (D-016): raw JSON per overridden field, raw value per setting
  getFieldOverrides(): Promise<Record<string, string>>;
  getFormSettings(): Promise<Record<string, string>>;
  // Each write lands with its audit row atomically
  saveFieldOverride(key: string, config: string, before: string | null, actor: string): Promise<void>;
  saveFormSettings(changes: { key: string; value: string; before: string | null }[], actor: string): Promise<void>;
  getFormConfigChanges(limit: number): Promise<FormConfigChange[]>;
}
