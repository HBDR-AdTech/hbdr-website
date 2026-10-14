-- The per-request expired-row cleanup filters on window_start; without this index it scans the table
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);
