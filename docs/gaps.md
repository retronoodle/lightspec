# LightSpec — Gaps & Improvements

Prioritized list of improvements to close the distance between "lite SDD" and the
full spec-driven-development experience, without breaking the token-light goal.

## Medium impact — quality & correctness

1. **Note grep's limits in `ls-verify`**
   The caller/dependent scan misses dynamic dispatch, re-exports, string-keyed
   calls, and cross-language boundaries, and false-positives on same-named
   symbols. Add one line: this is a heuristic; verify dynamic call patterns
   manually.

2. **Abort/drop a change**
   No way to kill a change that isn't happening. A small `ls-drop` skill, or a
   `--drop` path in `ls-done` that moves to an `abandoned/` dir (or deletes with
   confirmation).

## Low impact — polish

3. **Scenario ↔ task linkage**
   Optionally tag tasks with the scenario they satisfy, so `ls-verify` can map
   coverage precisely instead of searching blind.

## Shipped

- ✅ **Optional `## Design` section in `ls-propose`** — conditional one-paragraph
  design record so `ls-implement` isn't making silent design decisions.
- ✅ **Require ≥1 failure/edge scenario in `## Deltas`** — raises the scenario
  floor and gives `ls-verify` something real to check.
- ✅ **Lightweight clarification gate in `ls-propose`** — ask up to 2–3 questions
  only when a requirement is genuinely underspecified.
- ✅ **Enforce testable scenarios in `ls-propose`** — every Given/When/Then `Then`
  must be observable/assertable.
- ✅ **Init / bootstrap script** — `lightspec init` scaffolds skills into a project.
- ✅ **CLAUDE.md integration** — loop commands surfaced to the model.
