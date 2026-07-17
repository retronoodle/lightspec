---
name: ls-propose
description: Propose a new LightSpec change. Creates a single compact spec.md covering what, why, scope, delta specs, risks, and tasks. Use when the user wants to plan a feature or fix before implementing.
---

Create a LightSpec change proposal.

**Input**: A change name (kebab-case) or description. If a description is given, derive a kebab-case name (e.g. "add user auth" → `add-user-auth`).

If no input at all, ask: "What do you want to build or fix?"

---

**Steps**

1. **Create the directory**
   ```
   lightspec/changes/<name>/
   ```

2. **Scan prior specs** — before touching the codebase, search for related prior decisions:
   - Tokenize the change name (e.g. `add-user-auth` → `user`, `auth`)
   - Scan every `spec.md` in `lightspec/archive/` and `lightspec/changes/` (excluding the new one)
   - A spec matches if its filename, `## Scope` section, or `## Tags` line contains any of the tokens (token overlap only — do not broaden matching)
   - Note matched specs for Step 2b; if none match, skip silently

3. **Extract prior decisions** from each matched spec:
   - List each `### Requirement:` name from `## Deltas`
   - List each bullet from `## Risks`
   - These become inputs to the new spec's `## Prior Art` section and inform `## Risks`

4. **Explore the codebase** to understand scope — read relevant files, grep for related symbols. Do enough to fill the spec accurately.

5. **Write `lightspec/changes/<name>/spec.md`** with exactly these sections:

---

```markdown
# <name>

## Tags: <comma-separated keywords>
_(Optional single line — keywords for prior-spec research. Omit if none apply.)_

## What
<one sentence>

## Why
- <bullet>
- <bullet>

## Scope
Files and areas this change touches:
- <file or area>
- <file or area>

## Design
_(Include only when a real architectural choice exists — a new module, schema, or interface with alternatives. Omit for trivial edits.)_
<one paragraph: the chosen approach and why, over the alternatives>

## Deltas
Behavioral contract for this change.

### Requirement: <name>
<one-line description of what must now be true>

#### Scenario: <scenario name>
- Given: <precondition>
- When: <action>
- Then: <expected outcome>

(repeat for each requirement and scenario — aim for 1–3 requirements, 2–5 scenarios total)

## Prior Art
_(Omit this section if no related specs were found)_
- `<archived-spec-name>`: Requirement: <name> / Risk: <bullet>

## Risks
What existing behaviour could regress. Be specific — name files, functions, or flows.
- <specific risk>
- <specific risk>

## Tasks
- [ ] <task>
- [ ] <task>
```

---

**Rules**
- `## Risks` must be specific. Not "could break auth" — "could break `verifyToken()` in `src/auth/jwt.ts` if token shape changes". If you can't find specific risks, grep for callers of the touched functions.
- If a matching spec is from `lightspec/changes/` (active, not archived), add it as a `## Risks` entry: "conflicts with in-progress change `<name>`" — do not list it only in `## Prior Art`.
- `## Deltas` must have at least one requirement and one scenario. These are the behavioral tests for verify.
- Include `## Design` only when a real architectural choice exists (new module, schema, or interface with alternatives). Omit it for trivial edits so the token budget is unaffected.
- `## Deltas` must include at least one failure/edge scenario, not only success cases.
- Every `Then` must be observable/assertable — never "works correctly" or similar. If a Then has nothing observable, rewrite it as a concrete, checkable outcome.
- Keep the whole file under 400 tokens. Bullet lists, not prose.
- Before writing, if a key acceptance boundary is genuinely underspecified, ask up to 2–3 targeted questions; otherwise proceed. Don't interrogate — flow by default and make reasonable decisions.

**Done** — tell the user the spec is at `lightspec/changes/<name>/spec.md` and they can edit it before implementing. Suggest `/ls:implement` when ready.
