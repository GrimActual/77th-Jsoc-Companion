# Undo and redo scenario drafts

Delivered 13 October 2026 in **2.9.1 Development 6**, following Development 5. This continues the scenario-authoring and recovery roadmap; it does not add game commands.

## Steps
1. Open GM → Build a scenario. Apply an objective/event addition, edit or removal as usual.
2. Undo draft change restores the previous applied draft. Redo draft change restores the undone change.
3. Complete JSON applications, scenario ID changes, Copy active scenario into builder and library loads also enter draft history. Merely validating JSON, failed edits and unchanged validated snapshots do not create a history step.
4. A new applied change after Undo replaces the redo branch. Undo cancels form-edit mode but retains JSON editor text. Use Refresh editor from draft explicitly when you want the restored draft copied into that editor.
5. Settings → Game Master → Scenario draft undo steps chooses 10, 20 or 50 retained changes. Save settings applies the limit; Cancel retains the previous setting. Reducing the limit keeps the current draft and trims older history.
6. Export scenario JSON or save the draft to the library for a persistent copy. Draft history is session-only and resets on mission change or app restart.

## Boundaries
Draft history is separate from mission Undo and Undo GM action. It never changes the source mission, active rehearsal journal, live state or recovery copies. Start built scenario remains the explicit way to start edited rules.

Stored history has a 2 MiB serialized UTF-8 budget in addition to the current draft, which is limited to 5 MiB by the history module. Actual JavaScript heap use includes string representations and temporary validation objects; the serialized budget is not a process-RAM limit. Large drafts may retain fewer changes. Undoing to a smaller current draft may trim an oversized redo copy to preserve the budget. The status identifies when history was trimmed.

Applied draft replacements are validated before history changes. Unknown references, invalid data and failed resets preserve the previous valid draft/history. The existing scenario library stores rules independently; Undo of a library load changes the draft, not the saved library entry.

## Completed checks
- 15 relevant tests passed: six new history tests plus authoring validation, GM preferences and English/French/German help coverage. See test-evidence/draft-history-regression.txt.
- Actual Electron workflow passed edit/removal undo, redo branching, invalid/no-op edits, library/JSON/scenario-ID changes, preservation of unapplied JSON, Settings save/cancel, Sarge destination, mission/restart reset and preference persistence. Mission saves, active journal and GM recovery copies stayed unchanged during draft operations.
- Storage/authoring performance used 400 units, 100 objectives and 200 draft events, with 25 equivalent replacements and two animation frames to paint. The baseline used prior Development 5 source commit 98cd188 with the same runtime. Mean edit-to-paint: baseline 72.22 ms, history-enabled 77 ms; p95: 87.3 versus 116.2 ms. Twenty retained undo steps occupied 638,354 serialized bytes, with old snapshots trimmed as intended. No local-storage writes, source-mission changes, active rehearsal or renderer errors occurred. This short sample records additional history cost; it does not claim a speedup or universal latency. See test-evidence/draft-history-performance.json.
- Removed duplicate validation from the builder's complete-JSON Apply and shared replacement wrapper; the history store performs the authoritative validation. Validate-only still validates without recording a step.

No map, bridge or Enfusion source changed, so their previously passing gates were not repeated. Preview 4 remains the latest consolidated package; Development 6 includes Development 5 edits plus this history feature. The next consolidated release package still needs its normal release checks.
