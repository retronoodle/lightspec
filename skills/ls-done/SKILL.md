---
name: ls-done
description: Archive a completed LightSpec change. Moves it from lightspec/changes/ to lightspec/archive/. Use after verify passes.
---

Archive a LightSpec change.

**Input**: Optional change name. If omitted, auto-select if only one active change. If multiple, run `lightspec list` to show them and ask.

---

**Steps**

1. Check that `lightspec/changes/<name>/` exists.

2. Create `lightspec/archive/` if it doesn't exist.

3. Move the change:
   ```bash
   mv lightspec/changes/<name> lightspec/archive/<YYYY-MM-DD>-<name>
   ```
   Use today's date for the prefix.

4. Confirm: "Archived to `lightspec/archive/<date>-<name>/`"

---

**Rules**
- If verify hasn't been run (no report exists in the session), warn the user and ask if they want to proceed anyway
- Do not delete — move only
