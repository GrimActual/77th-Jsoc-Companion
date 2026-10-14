# Version 2.4 — first roadmap increment

Use the existing planner as before. New editing commands are in the collapsed Selection tools section. Select multiple units and drag one to move the unlocked group. Ctrl+D duplicates; Ctrl+C/V copies/pastes within the current app session. Lock/Unlock protects objects. Alignment and distribution apply to unlocked selected units. Undo reverses each group action in one step.

Use Space+drag or Alt+drag to pan. Fit ORBAT fits visible objects. Briefing mode hides editing panels and requests fullscreen; Exit briefing/Escape restores the editor.

Settings adds Light theme, interface scale, imperial display, snap grid (off/10/100 meters), default startup zoom and partial-enclosure box selection. Coordinates and radius inputs remain game meters. No translation or full shortcut remapping has been added yet.

The app now starts without a CDN connection. A bundled lower-detail Everon background supports offline work and desktop presentation export. Online tiles still provide sharper detail. Settings → General → Use bundled offline terrain chooses the local background explicitly. Workshop and hosted catalog URLs remain optional online services.

Save state reports Saved/Unsaved/Saving/Failed. Backup remains manual, timestamped and checked against the import validator. There is no automatic backup scheduler. The full imported asset catalog is still session-only; marker asset snapshots persist in plans.

Project schema stays v4. New optional lock flags are preserved in this build. Earlier builds may read the geometry but drop locks; use v2.4 when editing locked projects. Existing v1–v4 projects still import.

Verification: 18 automated core/editing/backend tests passed. Desktop checks covered real group dragging, undo, copy/duplicate hierarchy, locking/deletion, alignment, snap, fit, briefing, typography/scale, save failure and text-input shortcut safety. Offline reload/import/background PNG, all existing presentation formats, and four close/reopen cycles passed using separate test profiles.

See ROADMAP.md for remaining immediate targets and later TOC features. The 20-name location registry has no verified coordinates and is not a project import.

Install: export a JSON backup, close the old version, extract the entire Windows ZIP into a new folder, and run COMMAND Planner.exe. Do not remove the application data folder containing your local saves.
