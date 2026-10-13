# Scenario builder, playback and AAR — 13 October 2026

Available in the GM development desktop app. Existing release ZIPs have not been replaced.

## Build reusable scenario rules
Open GM → Build a scenario. Start with the current mission. Add objective ID/name; each new objective starts pending. Add event ID/name, manual or simulated-time trigger, optional completed-objective prerequisite, and one typed action: set objective status, move a known mission unit (local northing/easting), issue a report, or select a mission phase. All additions/removals validate against the shared scenario core. Duplicate IDs and deleting an objective still referenced by an event are rejected without losing the draft.

Export scenario JSON saves the rules. Start built scenario explicitly starts a new run; export the existing journal first. Copy active scenario into builder reuses loaded rules, including multiple-action events imported from JSON. The current form adds single-action events; richer editing remains future work. Export scenario before editing the mission, which clears the draft to avoid stale unit references.

## Replay playback
Play replay walks command revisions at 0.5, 1 or 2 seconds per command. At the end of the journal it starts again from revision zero. Pause replay holds the current revision; Return to GM restores the active rehearsal. Playback never appends commands, writes replay state into the plan, or advances the active GM clock. Loading/unloading/changing a mission cancels playback. Automatic playback is capped at 1,000 commands; larger journals can still use manual revision inspection. This is command playback, not continuous interpolation of motion.

## After-action report
Open GM → After-action report. Export printable AAR downloads a standalone HTML file that can be opened in a browser and printed. Export AAR JSON downloads structured results. Both derive from the complete active journal, independently of the replay slider. They include final objectives, starting/final rehearsal unit positions, reports retained in final state, and ordered commands with fired/reversed events. Reset and undo remain visible; simulation time can move backwards after those commands. These exports represent offline rehearsal only.

Validation: actual desktop authoring, duplicate rejection, dependency deletion guard, scenario download/import-compatible JSON, event prerequisites/execution, playback/pause/completion, unchanged active journal, and actual escaped HTML/JSON AAR downloads passed. Imported text is escaped in HTML and never evaluated as markup. Original mission remains unchanged. Two new pure AAR tests check deterministic derivation, reset/undo histories and invalid journals. Final regression transcript is in test-evidence/gm-authoring-regression.txt.
