---
name: ls-list
description: List all active LightSpec changes with task completion ratios and current phase. Use when the user wants to see what's in-flight.
---

List all active LightSpec changes.

---

**Steps**

1. **Check `lightspec/changes/`** — if empty or missing, output "No active changes." and stop.

2. **For each subdirectory**, read its `spec.md` and extract:
   - **Name**: directory name
   - **Task ratio**: count `- [x]` (done) and `- [ ]` (total unchecked), compute `done/total`
   - **Phase**:
     - `propose` — all tasks unchecked (done = 0)
     - `implement` — some tasks checked (0 < done < total)
     - `verify` — all tasks checked (done = total)

3. **Output a table**:

```
Name                    Tasks   Phase
----------------------  ------  ---------
add-auth-flow           2/5     implement
fix-login-redirect      0/3     propose
refactor-api-client     4/4     verify
```

---

**Rules**
- Read each spec.md once — no re-reads
- If a spec has no tasks at all, show `0/0` and phase `propose`
- No extra commentary — just the table (or "No active changes.")
