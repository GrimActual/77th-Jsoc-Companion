# Workbench metadata import — Development 9

This usable **desktop workflow** was introduced in Development 9 and remains available in Development 10, following the source-only reader. It does not replace the tested Preview 5 archives yet.

Use:

`A:/Everon-ORBAT-Development/experiments/gm-desktop/COMMAND Planner.exe`

## In the Companion application

1. Choose **Assets**, then expand **Import Workbench metadata**. Settings → Game Master → **Open Workbench metadata import** and Sarge's new metadata topic open the same panel.
2. Click **Select project and sidecars**. In the first native file picker, choose the addon's `addon.gproj`. In the second, choose up to 500 `.meta` files inside that project directory. You can select multiple files.
3. Wait for **Metadata review ready. Mission unchanged.** Reading/parsing happens in a worker, with a ten-second timeout; the map can remain responsive. Another simultaneous selection is blocked.
4. Inspect the resource list. Expand a row for its stable resource ID, GUID, declared source, local observation and target size. Use **Previous resources / Next resources** for 50-row pages. **Show target warnings only** filters for empty or missing target files.
5. Read **Dependency not indexed** messages. These describe gaps in the selected catalogue. Configurations, resource dependency references, native loadability and server installation are not verified by this workflow.
6. Click **Export resource index** to open a native Save dialog. Choose a JSON destination. **Resource index saved** appears only after the write succeeds. A temporary-file/rename operation avoids partially replacing an existing chosen index on a failed write. Cancel or save failure retains the current review. The exported index contains resource identities and provenance; the target-size warnings and inspection flags stay in the current review rather than being added as unsupported fields to the index contract.
7. To use the identities with an offline property request, click **Use reviewed resource index**. The app opens **Units → Review unit property changes**, expands its source-index section and installs the validated index. Any older property review becomes stale, requiring a fresh **Review changes**. This step does not apply the property changes.
8. **Clear metadata review** clears this panel's session state. It does not clear an index already installed in property review; use that panel's **Clear resource index** separately. Restart clears session reviews. None of this data is added to Project JSON automatically.

For the existing local bridge addon, the project is at `A:/Everon-ORBAT-Development/mods/JSOC_ORBAT_Bridge/addon.gproj`. Its observed `BridgeTest.ent.ent.meta` references a zero-byte target; the app should report **Empty target file**. This warning does not alter that file or claim a playable world. Other project variants may be rejected until their readable identity format is supported.

Resource indices are a reference catalogue. They are not the existing planning asset-catalog JSON, and do not automatically create unit cards, place entities or execute game commands. See [the supported reader subset](WORKBENCH-METADATA-READER.md) and [offline property workflow](UNIT-PROPERTY-REVIEW.md).

## Preservation and desktop permissions

Cancellation or a rejected file preserves the previous metadata review. Selected files are checked against the resolved project root; missing targets remain metadata-only, existing regular targets are observations only. No recursive scans, source modifications, resource loading or dependency downloads occur. The renderer cannot supply arbitrary file/export paths: only the trusted main window can request native pickers, and paths come from those selections.

Import and index transfer preserve the mission, scenario builder, active rehearsal/journal and normal Undo history. Only explicit later property Apply edits the mission through its existing authoring/history flow. Reload/quit cancels the reader and late results are ignored.

The browser-style export was found to fail in Electron during testing and replaced with the native Save flow. Export validation occurs again in the main process before prompting or writing; failed writes report an error rather than claiming a download.

## Verification — 13 October 2026

Twelve focused checks passed across native-selection authority/cancellation/bounds, worker execution/lifecycle, native export validation/cancel/save errors/atomic file replacement, application startup shutdown handling and localization. Sarge now has **45 topics in EN/FR/DE**.

The actual Electron workflow passed with native picker choices injected by the test harness; worker parsing, target observations and export used real disposable filesystem paths. Checks covered empty-target/dependency warnings, safe HTML-like source titles, saved index contents, transfer to property review and stale invalidation, unchanged mission/builder/journal, cancellation/rejection preservation, 500-resource paging/filtering, translated Settings/Sarge destinations, clearing and reopening. No renderer errors were captured. The 500-sidecar selection and first page took **1,028 ms** in that sample.

The same six-second, offline 400-unit map-pan fixture was compared with Preview 5; Development 9 additionally inspected 500 selected sidecars during the sample:

| Metric | Preview 5 baseline | Development 9 during import |
| --- | --- | --- |
| Average FPS | 58.67 | 58.67 |
| 95th percentile frame | 17.1 ms | 16.8 ms |
| Maximum frame | 57.8 ms | 47.7 ms |
| Frames above 100 ms | 0 | 0 |
| Reported renderer JS heap | 14.3 MB | 19.3 MB |

Both had 400 marker elements and two terrain tiles. The import finished during the measured window, and mission data and stored plan text remained unchanged. These short samples show the checked workload, not a causal speedup, memory-leak guarantee or native/server capacity result. Worker memory is not included in the renderer heap figure.

Evidence: `docs/test-evidence/metadata-import-ui.json`; harnesses: `planner/tools/check-metadata-import.cjs` and `check-metadata-performance.cjs`. Existing full Preview 5 tests were retained; only relevant changed integration/lifecycle/localization gates were rerun. No new release ZIP or Workshop publication is implied by this development increment.

Development 13 adds [Review project identity only](PROJECT-IDENTITY-COMPATIBILITY.md), using one project picker without sidecars. The full project-and-sidecars mode remains available.

Development 14 also supports [Load resource index JSON](RESOURCE-INDEX-REVIEW-UI.md). Imported observations are declarations, not fresh local-file checks; multiple-addon/empty indexes are supported.
