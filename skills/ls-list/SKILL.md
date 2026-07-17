---
name: ls-list
description: List all active LightSpec changes with task completion ratios and current phase. Use when the user wants to see what's in-flight.
---

List all active LightSpec changes.

---

**Steps**

1. **Run `lightspec list`** and show its output verbatim. It prints each change with its `done/total` ratio and phase (`propose`/`implement`/`verify`), or `No active changes.`

2. **Fallback** — only if `lightspec list` errors (e.g. an older global CLI without the command):
   - **Check `lightspec/changes/`** — if empty or missing, output "No active changes." and stop.
   - **For each subdirectory**, read its `spec.md` and extract:
     - **Name**: directory name
     - **Task ratio**: count `- [x]` (done) and total checkboxes, compute `done/total`
     - **Phase**: `propose` (done = 0 or no tasks), `implement` (0 < done < total), `verify` (done = total)
   - **Output a table** of name, ratio, and phase.

---

**Rules**
- Prefer the CLI — it is the canonical implementation, so its output never diverges from the skill
- In the fallback, read each spec.md once — no re-reads
- If a spec has no tasks at all, show `0/0` and phase `propose`
- No extra commentary — just the output (or "No active changes.")
