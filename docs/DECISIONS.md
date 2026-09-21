# Decisions

Append-only. One line of context per decision, dated, with who decided it and what it supersedes. A PR that changes a rule cites the id in its body. A builder (human or agent) reads this file before starting and writes the directive here first, not in chat.

Format: `## D-NNN — YYYY-MM-DD — who — one-line title`, then the decision in plain words, then `Supersedes:` when it replaces an earlier rule. Same convention as buyleads-dashboard/docs/DECISIONS.md.

No decisions recorded yet. The first change that sets a rule for this repo adds D-001.
