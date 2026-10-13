# GM undo and local recovery — 13 October 2026

Available in experiments/gm-desktop/Everon ORBAT Planner.exe, on the GM tab. The previously released Preview 1 ZIP is unchanged.

- Undo GM action reverses the last applied rehearsal command, including an event, clock step or pause/resume. It adds an undo record instead of deleting history. You can continue from the restored state, and replay reconstructs the same branch.
- Reset rehearsal returns to the initial scenario state and is recorded in the journal. Reset establishes a new undo root and cannot itself be undone; earlier history remains available to export and replay.
- Recovery saved locally confirms a validated journal was written separately from the mission. Two alternating copies preserve the previous valid run if a new write fails or is corrupt. This is local browser-profile storage, not an external backup or a tamper-proof log.
- After reopening, the app starts with no rehearsal overlay. Open GM and click Recover saved rehearsal to restore against the same mission. A changed mission is rejected; import the original mission or its backup first.
- A storage failure leaves the running rehearsal usable and reports Recovery failed. Export journal to preserve that current run. Its last successfully saved copy remains recoverable.
- Delete recovery removes both local copies. It does not erase the active rehearsal; its next change writes new recovery. Export journal remains the portable backup.
- Journal exports now use version 2 for undo/reset. Version 1 journals without those commands still import and migrate. Older GM cores cannot read version 2 exports. Scenario definitions remain version 1 and mission JSON remains unchanged.

Tests: 105 complete planner tests pass, including four new undo/recovery tests. Actual Electron UI tested with a disposable profile: movement undo, recorded reset, explicit recovery after reload, corrupt newest-slot fallback, injected storage quota failure, different-mission rejection, recovery deletion, and unchanged mission. No renderer errors observed.

Still pending: scenario authoring interface, richer rules and AAR/reporting, recovery across arbitrary mission revisions, continuous replay playback. Local recovery offers the newest valid copy for this desktop profile, not a library of multiple saved rehearsal runs.
