# LightSpec

A lean, regression-first spec workflow for [Claude Code](https://claude.com/claude-code).

LightSpec keeps a **single compact `spec.md` per change** — what, why, scope, behavioral deltas, risks, and tasks — instead of the sprawling multi-file artifacts of heavier spec-driven workflows. It uses less token budget and makes "what did this change break?" a first-class step, not an afterthought.

## Why

- **Token-light** — one short spec file per change; minimal skill prompts.
- **Regression-first** — `/ls-verify` checks caller impact and risks before you archive.
- **Native to Claude Code** — plain skills (`SKILL.md` files), driven by slash commands.

## Install

Requires **Node.js ≥ 18**.

LightSpec is distributed via **git tags** on GitHub (the npm name `lightspec` belongs to an unrelated package), so install the global CLI directly from the repo:

```sh
npm install -g 'retronoodle/lightspec#semver:*'
```

This resolves to the newest release tag. Then, inside any project you want to use it in:

```sh
cd your-project
lightspec init
```

`init` copies the skills into `.claude/skills/`, scaffolds `lightspec/changes/` and `lightspec/archive/`, stamps `lightspec/.version`, and wires a LightSpec block into your `CLAUDE.md`.

## CLI commands

| Command | What it does |
| --- | --- |
| `lightspec init` | Install LightSpec skills into the current project. |
| `lightspec update` | Sync skill files from source into `.claude/skills/`. |
| `lightspec upgrade` | Reinstall the global CLI from the latest GitHub release tag. |

- **`update`** refreshes only `.claude/skills/*/SKILL.md` — it never touches `lightspec/`, `CLAUDE.md`, or your changes.
- **`upgrade`** reinstalls the CLI via `npm install -g 'retronoodle/lightspec#semver:*'`. Run `update` afterward to re-copy the newer skills into your project. (A linked dev checkout is detected and left untouched — pull the source instead.)

## Workflow

Once installed, drive everything from slash commands in Claude Code:

```
/ls-propose  →  /ls-implement  →  /ls-verify  →  /ls-done
```

| Command | Purpose |
| --- | --- |
| `/ls-propose <name>` | Create a compact `spec.md` for a change (what, why, scope, deltas, risks, tasks). |
| `/ls-implement` | Work through the spec's task checklist, marking tasks done. |
| `/ls-verify` | Regression-first check: task completeness, delta scenarios, caller impact, risks, test coverage. |
| `/ls-done` | Archive the completed change (`lightspec/changes/` → `lightspec/archive/`). |
| `/ls-list` | List active changes with task-completion ratios and current phase. |
| `/ls-spec` | Regenerate `lightspec/SPEC.md`, a read-only digest of every requirement across active + archived changes. |
| `/ls-drop` | Abandon an in-flight change (`lightspec/changes/` → `lightspec/abandoned/`), preserving the record. |

Always run `/ls-verify` before `/ls-done`.

## Quickstart

```sh
cd your-project
lightspec init
```

Then in Claude Code:

```
/ls-propose add-user-auth     # writes lightspec/changes/add-user-auth/spec.md
                              # edit the spec if you like
/ls-implement                 # builds it, checking off tasks
/ls-verify                    # regression + coverage check
/ls-done                      # archive it
```

## License

MIT
