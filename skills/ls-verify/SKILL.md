---
name: ls-verify
description: Regression-first verification of a LightSpec change. Checks task completeness, delta scenario correctness, caller impact of changed symbols, risk checklist, and test coverage. Use before archiving a change.
---

Verify a LightSpec change — with a hard focus on regression.

**Input**: Optional change name. If omitted, auto-select if only one active change. If multiple, run `lightspec list` to show them and ask.

---

**Steps**

1. **Read `lightspec/changes/<name>/spec.md`**
   Extract: `## Tasks`, `## Deltas`, `## Risks`, `## Scope`

2. **Task completeness**
   Count unchecked `- [ ]` items.
   If any exist → report CRITICAL for each and **stop**. No point verifying incomplete work.

3. **Changed-file map**
   Get the actual changed files via `git diff --name-only HEAD` (or fall back to `## Scope` if not a git repo).

4. **Caller / dependent scan** — this is the regression core
   For each changed file:
   - Identify every function, method, class, or exported symbol that was modified or removed
   - `grep` for each symbol name across the project (outside the changed file)
   - For each caller found:
     - Check if the call-site still matches the current signature (args, return type usage)
     - Flag anything that looks broken or mismatched
   - Mark each: ✅ OK / ⚠️ Needs review / ❌ Likely broken

5. **Delta correctness**
   For each scenario in `## Deltas`:
   - Search the implementation for code satisfying the Given/When/Then
   - Check for a test covering it
   - Mark: ✅ Satisfied + tested / ⚠️ Implemented but untested / ❌ Not implemented

6. **Risk checklist**
   For each bullet in `## Risks`:
   - Search for evidence it was handled (a guard, a test, a comment, unchanged code)
   - Mark: ✅ Mitigated / ⚠️ Unverified / ❌ Likely broken

7. **Test coverage**
   For each changed file, check whether a corresponding test file exists and whether it exercises the changed code paths.
   Flag files with no test coverage.

---

**Output**

```
## Regression Report: <name>

### Task Completeness
X/Y complete — [PASS / CRITICAL: N incomplete]

### Changed Files
- <file>
- <file>

### Caller Impact
| Symbol | Callers | Status |
|---|---|---|
| <symbol>() | <file>:<line> | ✅ OK |
| <symbol>() | <file>:<line> | ⚠️ Return shape changed — verify caller |
| <symbol>() | <file>:<line> | ❌ Missing required arg |

### Delta Correctness
| Scenario | Status | Notes |
|---|---|---|
| <scenario> | ✅ Satisfied + tested | <file>:<line> |
| <scenario> | ⚠️ Untested | code at <file>:<line>, no test |
| <scenario> | ❌ Not implemented | — |

### Risk Checklist
- ✅ <risk> — <evidence>
- ⚠️ <risk> — no verification found
- ❌ <risk> — <what broke and where>

### Test Coverage
- <file> → <test file> ✅
- <file> → no test file found ⚠️

### Verdict
CRITICAL: N | WARNING: N | OK: N

[Ready to archive. / Fix N critical item(s) before archiving.]
```

---

**Rules**
- Be specific in every finding — file paths and line numbers, not vague statements
- Prefer ⚠️ over ❌ when uncertain; prefer ⚠️ over ✅ when evidence is thin
- A missing test is always at least a ⚠️, never silently OK
- If `## Risks` had vague entries, note that in the report and still attempt verification
- CRITICAL items = must fix before archive; WARNING = should fix; OK = clear
