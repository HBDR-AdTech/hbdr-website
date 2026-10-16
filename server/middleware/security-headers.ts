// Response security headers for every page and API route (static assets are served by Workers Assets, not this).
import { secureHeaders } from "hono/secure-headers";

export const siteSecurityHeaders = secureHeaders({
  // Alpine.js (CDN build) evaluates x-data/x-on expressions, so 'unsafe-eval' is required; inline scripts
  // are string templates without nonces. The host allowlist, frame-ancestors, form-action and object-src still hold.
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    // cdnjs: GSAP + ScrollTrigger (SRI-pinned, D-020). challenges.cloudflare.com: the Turnstile script and its iframe, loaded only while the operator has it on (D-016)
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://static.cloudflareinsights.com", "https://challenges.cloudflare.com"],
    frameSrc: ["https://challenges.cloudflare.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://cloudflareinsights.com"],
    frameAncestors: ["'none'"],
    formAction: ["'self'"],
    baseUri: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
  // No includeSubDomains: some hbdr.com subdomains (e.g. monitor.) are not served over HTTPS
  strictTransportSecurity: "max-age=31536000",
  xFrameOptions: "DENY",
  // no-referrer would make same-origin form POSTs send "Origin: null" and fail validateOrigin
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: { camera: [], microphone: [], geolocation: [], payment: [], usb: [] },
});
