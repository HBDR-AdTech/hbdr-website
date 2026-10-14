// Validation schemas — pure Zod, no Drizzle dependency
import { z } from "zod";

// Monthly-impressions select values; the support form sends "support-request" (CLAUDE.md gotcha 3)
const IMPRESSION_VALUES = ["under-10m", "10m-50m", "50m-100m", "100m-500m", "500m-1b", "over-1b", "support-request"] as const;

// The fields every lead must have (locked in the form config). Every other answer, phone and message
// included, is checked against the operator's form config by validateAnswers (server/services/form-config.ts).
export const insertContactLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().max(254).email("Please enter a valid email address"),
  company: z.string().min(2, "Company name is required").max(300),
  impressions: z.enum(IMPRESSION_VALUES, "Please select your monthly impressions"),
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
