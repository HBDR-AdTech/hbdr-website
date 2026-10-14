// Server-side Cloudflare Turnstile check for the contact form (D-016)
import { TURNSTILE_HOSTNAMES } from "../config";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
// Error codes caused by our secret or by Cloudflare, not by the visitor: the lead is kept and flagged
const OUR_SIDE = ["missing-input-secret", "invalid-input-secret", "bad-request", "internal-error"];

// 'failed' refuses the submission; 'unverified' keeps the lead when siteverify can't answer (D-011)
export type BotCheck = "passed" | "unverified" | "failed";

export async function verifyTurnstile(secret: string, token: string, ip: string): Promise<BotCheck> {
  let data: { success?: boolean; action?: string; hostname?: string; "error-codes"?: string[] };
  try {
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // idempotency_key makes a retried call return the first result instead of "timeout-or-duplicate"
      body: JSON.stringify({ secret, response: token, remoteip: ip, idempotency_key: crypto.randomUUID() }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`Turnstile siteverify returned ${res.status}; lead kept as unverified`);
      return "unverified";
    }
    data = await res.json();
  } catch (error) {
    console.error("Turnstile siteverify unreachable; lead kept as unverified:", error);
    return "unverified";
  }
  if (data.success === true) {
    return data.action === "contact" && TURNSTILE_HOSTNAMES.includes(data.hostname ?? "") ? "passed" : "failed";
  }
  const codes = data["error-codes"] ?? [];
  if (codes.some((code) => OUR_SIDE.includes(code))) {
    console.error(`Turnstile siteverify error ${codes.join(",")}; lead kept as unverified`);
    return "unverified";
  }
  return "failed";
}
