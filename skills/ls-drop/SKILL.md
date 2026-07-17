---
name: ls-drop
description: Abandon an in-flight LightSpec change. Moves it from lightspec/changes/ to lightspec/abandoned/. Use to kill a change that isn't happening while preserving the record.
---

Abandon a LightSpec change.

**Input**: Optional change name. If omitted, auto-select if only one active change. If multiple, run `lightspec list` to show them and ask which to drop.

---

**Steps**

1. Check that `lightspec/changes/<name>/` exists. If not, report no such change and move nothing.

2. Create `lightspec/abandoned/` if it doesn't exist.

3. Move the change:
   ```bash
   mv lightspec/changes/<name> lightspec/abandoned/<YYYY-MM-DD>-<name>
   ```
   Use today's date for the prefix.

4. Confirm: "Abandoned to `lightspec/abandoned/<date>-<name>/`"

---

**Rules**
- Do not delete — move only. Offer deletion only on explicit user confirmation.
- Never move to `archive/` — that reads as completed. Abandoned changes go to `abandoned/`.
