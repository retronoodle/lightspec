---
name: ls-implement
description: Implement tasks from a LightSpec change. Reads spec.md and works through the task checklist. Use when the user is ready to build.
---

Implement tasks from a LightSpec change.

**Input**: Optional change name. If omitted:
- Auto-select if only one active change exists in `lightspec/changes/`
- If multiple, list them and ask which one

Always confirm: "Implementing: `<name>`"

---

**Steps**

1. **Read `lightspec/changes/<name>/spec.md`** — this is the only context file needed.

2. **Check tasks** — if all tasks are already checked, say so and suggest `/ls:verify`.

3. **Implement each unchecked task in order:**
   - Announce the task: `Working on: <task description>`
   - Make the code change — minimal, scoped, no scope creep
   - Mark it done in spec.md: `- [ ]` → `- [x]`
   - Show: `✓ Done`
   - Move to the next

4. **Pause and describe the blocker if:**
   - A task is ambiguous
   - Implementation reveals a conflict with the spec
   - An error occurs

   Do not guess through blockers. State what's unclear and wait.

5. **When all tasks are done**, show a brief summary and suggest `/ls:verify`.

---

**Rules**
- Read the spec once at the start — do not re-read between tasks
- Keep changes minimal and scoped to each task
- Update the checkbox in spec.md immediately after completing each task
- No padding, no progress theatre — just current task and result
