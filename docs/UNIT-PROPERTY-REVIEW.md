# Unit property review — Development 8

Available in the development executable:

`A:/Everon-ORBAT-Development/experiments/gm-desktop/COMMAND Planner.exe`

This workflow was introduced in **Development 8** and remains available in **Development 9**, which additionally accepts indices from the desktop metadata importer. The latest consolidated package is Preview 5; Development 9 is not a new release ZIP or Workshop update. These controls edit the offline planner mission; they do not modify live Reforger components or start a connection.

## Steps in the Companion application

1. Open your mission in the **Companion planner** and choose **Units**.
2. Expand **Review unit property changes**. You can also open it through **Settings → Game Master → Open unit property review**, or Sarge's **Review offline unit property changes → Show me where**.
3. Use **Load property request JSON**, or paste the request into **Property request JSON** and click **Review changes**. This file is a `companion-property-request` v1 document, up to 256 KiB; it is not a Project JSON plan. Do not send it through the main **Import plan** button.
4. Inspect the declared source, blocking issues and before/after values. Expand each finding to see full values; use **Previous findings / Next findings** for batches above 50 rows. There can be up to 1,000 requested changes.
5. If the request declares a source resource ID, load the corresponding **Optional source resource index** first, then review again. This checks declared metadata identity, not installed game resources or server permission. An invalid index leaves the previous valid index available and shows a rejection message.
6. **Apply reviewed changes** becomes available only for a valid batch with actual changes. Missing/locked units, unsupported fields, duplicate edits and invalid values block the entire batch. No-op requests need no Apply.
7. A manual mission edit, request edit or source-index replacement disables Apply immediately. Click **Review changes** again against the current mission. The loaded request remains available; reimporting the file is not required. Apply also performs its own baseline check.

Supported fields: name, strength/notes, exact planner affiliation, unit type and local map position. Position uses `lat` = northing and `lng` = easting in metres. It is not geographic latitude/longitude or an automatic native transform adapter. See [the property contract](PROPERTY-ADAPTER-FOUNDATION.md).

## Atomic Undo and Redo

Applying a property batch makes one mission history entry. One **mission Undo** restores all prior unit attributes together with the scenario builder's validated draft and unapplied form/JSON text. One **mission Redo** reapplies the complete batch and restores the cleared builder state from immediately after Apply. Unit IDs, command-parent links and embedded resource/GUID metadata remain intact.

These paired history entries are session-only. The scenario builder's own draft-history stack resets when its contents are restored; it is distinct from mission Undo. The active rehearsal is unloaded on mission edits and remains unloaded after Undo/Redo. No simulation journal is silently resumed. Export scenario/journal data before editing if you need a portable copy.

Builder snapshots share a **2 MiB aggregate limit** across paired mission Undo/Redo entries. This includes unapplied JSON text. An oversized capture is rejected before the property edit or history movement; reduce/export large builder text rather than expecting silent loss. Normal mission history remains bounded by the existing 50-entry limit. Builder snapshots and provenance are not added to saved mission JSON or normal exports.

If local saving fails after a valid edit, the panel states **Applied in memory; save failed. Export a backup.** Undo remains available. The UI does not claim a successful disk save.

## Context and languages

Request text and optional resource metadata remain session-only and are not automatically restored on startup. Switching EN/FR/DE in Settings retains the active request and valid review while Sarge updates its guidance. **Clear review** removes the request and report; **Clear resource index** separately removes the source index. Restart clears both. All imported source labels and values are displayed as text; they are never inserted as HTML.

## Verification — 13 October 2026

Actual Electron checks used isolated profiles, preserving normal user plans/settings. Evidence: `docs/test-evidence/property-review-desktop.json`. The targeted checks passed:

- Review leaves the mission unchanged; Apply produces one whole-batch history step.
- One Undo restores the original mission and builder, including unapplied editor/form text; one Redo reapplies the batch. Rehearsal remains unloaded.
- Manual background edits instantly mark a file-loaded review stale and disable Apply; fresh review enables a valid current batch.
- Unit IDs, parent references and embedded asset GUIDs survive Apply/Undo/Redo without orphan references.
- Unsupported batches and no-ops cannot apply. Oversized builder history rejects without mutation or a new Undo entry.
- Injected local-save failure produces an honest in-memory warning; Undo still works.
- Long Unicode notes, quotes, special characters and script/image-like text produce no executable HTML nodes or renderer errors.
- Settings shortcut, 50-row pagination, exact Sarge translations and destinations work in EN/FR/DE without losing the loaded valid request.
- Three focused localization tests pass with **44 translated Sarge topics**. Earlier passing headless adapter tests were not repeated because the adapter itself was unchanged.

On a 400-unit fixture, reviewing a 400-change request and building the first 50 rows took **15.4 ms**, with the next paint at **51.5 ms** in the sample. The same existing eight-edit authoring sequence averaged 123.1 ms in the Development 7 baseline (maximum 609 ms), and 54.3 ms in Development 8 (maximum 89.6 ms). Reported JS heap was 20.5 MB versus 24.5 MB. These short measurements include warm-up effects and are not evidence of a causal speedup or universal limits. No map renderer was redesigned; unrelated map/bridge/native compile gates were not repeated.

Reproducible desktop harnesses are under `planner/tools/check-property-*.cjs`. They require the local development executable and Playwright test runtime; neither is a new native dependency of the app. They create test profiles under the development work directory and close only their own launched test app.

Native property mappings, component capability checks and game-authoritative acknowledgements remain separate integration gates. No writable server command or native importer is claimed by this release increment.
