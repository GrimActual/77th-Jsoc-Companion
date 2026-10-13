# Offline GM desktop increment — 13 October 2026

Launch experiments/gm-desktop/Everon ORBAT Planner.exe. This development copy contains the new GM panel; the previously packaged Preview 1 ZIP does not. Export a mission backup before changing builds; the normal desktop profile is shared with the previous app unless you launch with a separate --user-data-dir.

1. Open/import a plan containing units. Choose the new GM tab on the right.
2. Click Create rehearsal from this plan for a small demonstration, or Load scenario JSON for a custom validated scenario.
3. Click Resume, then Advance 10 seconds. Time advances by explicit steps only.
4. Click an enabled scenario event. The default demonstration unlocks Advance first unit after securing the checkpoint. Purple markers represent rehearsal state; saved markers remain at their original plan positions.
5. Inspect objectives and reports. Show rehearsal markers toggles the temporary layer; Fit rehearsal finds its units.
6. Export journal before resetting or closing. The export includes the original mission, scenario and ordered commands. It is separate from Project JSON.
7. Move Replay command revision to inspect an earlier state; Return to GM restores the active run. Load journal restores against the exact same saved mission. Invalid files preserve the current rehearsal.
8. Reset rehearsal starts a new journal. Unload clears the session and markers. Editing the plan unloads the rehearsal. App reload clears it; export/import a journal to retain a run.

Validation: actual packaged Electron workflow tested with an isolated profile and Operation Sea Serpent. Tested prerequisites, 10-second step, synthetic movement, visibility, export/import, revision replay, reset, invalid import preservation, unchanged mission, edit-triggered unload, undo and reload. Full planner regression suite: 101 passing tests. No renderer errors observed.

Scope: offline GM event execution and inspection only. Does not send game commands. GM event undo, durable automatic recovery, continuous-time playback, scenario authoring UI, and the full integrated campaign/GM milestone remain future increments. Existing offline core guide documents scenario v1 JSON.
