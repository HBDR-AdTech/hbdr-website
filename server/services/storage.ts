// IStorage interface — the contract that both D1Storage and MemStorage implement
// Import types directly to avoid Drizzle dependency in production path

export interface User {
  id: string;
  username: string;
  password: string;
}

// Qualifying answers from the contact form; null when not asked (support form) or left blank
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
}

// LeadDetails key -> contact_leads column (migrations/0003_lead_details.sql)
export const LEAD_DETAIL_COLUMNS: [keyof LeadDetails, string][] = [
  ["phone", "phone"], ["inventoryTypes", "inventory_types"], ["property", "property"],
  ["appStoreUrls", "app_store_urls"], ["adsTxtUrl", "ads_txt_url"], ["currentSetup", "current_setup"],
  ["role", "role"], ["timeline", "timeline"], ["topGeo", "top_geo"], ["referral", "referral"],
];

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
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: { username: string; password: string }): Promise<User>;
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
}
