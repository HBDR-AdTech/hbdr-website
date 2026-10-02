// Site-wide configuration constants
export const SITE_URL = "https://hbdr.com";
export const SITE_NAME = "HBDR";
export const CONTACT_EMAIL = "contact@hbdr.com";
// hbdr.com is onboarded for Cloudflare Email Sending (DKIM selector cf-bounce)
// Object form: the binding's allowed_sender_addresses matches the bare address, not "Name <addr>"
export const EMAIL_FROM = { name: "HBDR Website", email: "noreply@hbdr.com" };

// Where notification emails are sent (these receive the lead notifications)
export const CONTACT_NOTIFY_EMAIL = "contact@hbdr.com";
export const SUPPORT_NOTIFY_EMAIL = "support@hbdr.com";

// All page routes for sitemap generation and nav building
export const PAGE_ROUTES = [
  "/", "/about", "/how-it-works", "/careers", "/press", "/contact",
  "/solutions/header-bidding", "/solutions/display-ads", "/solutions/ctv-ott",
  "/solutions/in-app-ads", "/solutions/mcm", "/solutions/manage-account",
  "/solutions/manage-inventory", "/solutions/open-bidding", "/solutions/ad-exchange-adx",
  "/solutions/video-player", "/blog", "/publishers", "/advertisers", "/partners",
  "/dashboard", "/trust", "/tools", "/support",
  "/privacy-policy", "/terms", "/gdpr-cookie-policy",
] as const;
