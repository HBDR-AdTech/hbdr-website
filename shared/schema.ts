// Validation schemas — pure Zod, no Drizzle dependency
import { z } from "zod";

// Qualifying-field choices; the contact form renders these and the API accepts only these
export const LEAD_OPTIONS = {
  inventoryTypes: ["Website", "Mobile app", "CTV / OTT"],
  currentSetup: ["Google AdSense", "Google Ad Manager", "Another ad network or wrapper", "In-house header bidding", "Not monetized yet"],
  role: ["Owner / Founder", "Ad Operations", "Revenue / Monetization", "Product / Engineering", "Agency / Consultant", "Other"],
  timeline: ["ASAP", "Within 1-3 months", "3+ months", "Just exploring"],
  topGeo: ["United States", "UK / Europe", "Latin America", "Asia-Pacific", "Global mix"],
  referral: ["Google search", "LinkedIn", "Referral / word of mouth", "Industry event", "Other"],
} as const;

// An unselected <select> posts "", which means "not answered"
const blankToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);
const optionalText = (max: number) => z.preprocess(blankToNull, z.string().trim().max(max).nullable().optional());
const optionalChoice = <T extends readonly [string, ...string[]]>(values: T) => z.preprocess(blankToNull, z.enum(values).nullable().optional());

// Contact lead validation. Qualifying fields are optional here (the form marks the key ones required):
// a visitor on a cached pre-change page must still get through, never lose the lead (D-011).
export const insertContactLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name is required"),
  impressions: z.string().min(1, "Please select your monthly impressions"),
  message: z.string().nullable().optional(),
  phone: z.preprocess(blankToNull, z.string().trim().max(40).regex(/^[0-9+().\-\s]+$/, "Please enter a valid phone number").nullable().optional()),
  inventoryTypes: z.array(z.enum(LEAD_OPTIONS.inventoryTypes)).max(LEAD_OPTIONS.inventoryTypes.length).optional(),
  property: optionalText(300),
  appStoreUrls: optionalText(2000),
  adsTxtUrl: optionalText(300),
  currentSetup: optionalChoice(LEAD_OPTIONS.currentSetup),
  role: optionalChoice(LEAD_OPTIONS.role),
  timeline: optionalChoice(LEAD_OPTIONS.timeline),
  topGeo: optionalChoice(LEAD_OPTIONS.topGeo),
  referral: optionalChoice(LEAD_OPTIONS.referral),
});

// Blog post validation
export const insertBlogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().nullable().optional(),
  author: z.string().min(2, "Author name is required"),
  category: z.string().min(2, "Category is required"),
  tags: z.string().nullable().optional(),
  published: z.string().optional().default("true"),
});

// Inferred types (for callers that need the insert shape)
export type InsertContactLead = z.infer<typeof insertContactLeadSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
