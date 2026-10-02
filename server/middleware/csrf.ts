// Cross-origin protection for JSON API mutations (admin auth itself is Cloudflare Access)

/**
 * Validate that the Origin or Referer header matches the request Host.
 * Protects JSON API endpoints from cross-origin requests.
 */
export function validateOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  const host = headers.get("host");

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      return originHost === host;
    } catch {
      return false;
    }
  }

  // Fall back to Referer
  const referer = headers.get("referer");
  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      return refererHost === host;
    } catch {
      return false;
    }
  }

  // No Origin or Referer — allow (e.g. same-origin navigation, curl, Postman)
  // CSRF tokens provide defense in depth for form POSTs
  return true;
}
