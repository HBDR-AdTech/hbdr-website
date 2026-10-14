// Rate limiting with optional D1 persistence
// Falls back to in-memory Map when no D1 database is provided

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

/**
 * Check and increment rate limit for an IP.
 * If a D1 database is provided, persists counters across Worker evictions.
 * Otherwise falls back to in-memory (resets on eviction).
 */
export async function checkRateLimit(
  ip: string,
  db?: { prepare: (sql: string) => any; batch?: (stmts: any[]) => Promise<any[]> } | null
): Promise<RateLimitResult> {
  const key = bucketKey(ip);
  if (db) {
    return checkRateLimitD1(key, db);
  }
  return checkRateLimitMemory(key);
}

// One IPv6 subscriber usually holds a whole /64, so per-address buckets let a bot rotate past the limit
export function bucketKey(ip: string): string {
  if (!ip.includes(":") || ip.includes(".")) return ip;
  const [head, tail = ""] = ip.toLowerCase().split("::");
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  const hextets = [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill("0"), ...t];
  return hextets.slice(0, 4).map((x) => parseInt(x, 16).toString(16)).join(":") + "::/64";
}

function checkRateLimitMemory(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

async function checkRateLimitD1(
  ip: string,
  db: { prepare: (sql: string) => any; batch?: (stmts: any[]) => Promise<any[]> }
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // One statement reads and bumps the counter, so concurrent requests cannot both see the old count
  const cleanStmt = db.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(windowStart);
  const upsertStmt = db.prepare(
    `INSERT INTO rate_limits (ip, count, window_start) VALUES (?, 1, ?)
     ON CONFLICT(ip) DO UPDATE SET
       count = CASE WHEN window_start < ? THEN 1 ELSE count + 1 END,
       window_start = CASE WHEN window_start < ? THEN ? ELSE window_start END
     RETURNING count, window_start`
  ).bind(ip, now, windowStart, windowStart, now);

  let row: any;
  if (db.batch) {
    const [, upsertResult] = await db.batch([cleanStmt, upsertStmt]);
    row = (upsertResult as any).results?.[0];
  } else {
    await cleanStmt.run();
    row = await upsertStmt.first();
  }

  if (row.count > MAX_REQUESTS) {
    const resetAt = row.window_start + WINDOW_MS;
    const retryAfter = Math.ceil((resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  return { allowed: true };
}

// Cloudflare sets cf-connecting-ip on every Worker request; X-Forwarded-For and X-Real-IP are whatever the
// client sent, so trusting them would let a bot pick its own bucket. Without the header (local dev only)
// every request shares one bucket instead of failing.
export function getClientIp(headers: Headers): string {
  return headers.get("cf-connecting-ip") || "no-ip";
}
