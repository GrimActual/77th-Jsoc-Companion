# 77th JSOC ORBAT Planner v2.8.1

## Added
- Settings sliders (50–200%) for interface scale, map icons, map labels, route/boundary thickness and presentation-export symbols/labels. Adaptive zoom scaling can be switched off. Preferences stay on this device; coordinates and saved object styles are unchanged.
- Draw → Side missions reads five planning templates from the installed Invade & Annex - Reforged 1.0.66 mod: eliminate HVT, ambush convoy, retrieve intel, rescue downed pilot and destroy weapons cache. Choose a template, click Place selected objective, then click the map. These are objective markers, not catalog assets. Their descriptions are preserved in the plan.
- Brief → Mission clock & event log provides Start/Resume, Pause and timestamped event/phase entries. A running clock continues across app closure using the computer clock. Pause it before closing if that is not wanted. JSON and planner CSV preserve the clock and log; Undo can restore previous clock actions.
- Brief → Spreadsheet exchange provides validated Excel-compatible CSV export/import. Visible name and local easting/northing columns are editable. Embedded JSON columns preserve assets, hierarchy, geometry, phases and styles. Import validates the entire plan before replacing it; Undo restores the previous plan.

## Performance and reliability
- Mod archive decoding runs in a background worker with a 20-second timeout, avoiding a synchronous archive read on the desktop main thread.
- Map movement/zoom symbol adjustments are coalesced into one animation-frame update; redundant preference redraw was removed.
- Export symbol spacing follows the selected export scale. Overcrowded exports still report a clear error instead of moving project coordinates.
- Existing layout, JSON schema v4, AO chooser, presentation formats, asset preservation and close/reopen handling retained.

## Boundaries
- Side-mission locations are generated during gameplay. The planner supplies manually placed planning objectives, not live positions, mission spawning or server control. It reads the installed PAK without changing it.
- The planner clock is independent of the mod's engagement-based timeout. It is not a synchronized game timer; changing the computer clock affects a running timer. It supports up to 200 events.
- CSV uses this planner's documented six-column layout, not arbitrary spreadsheets. Keep the `plan` row and `record_json` column. Use Project JSON as the primary editable backup. In Excel, save edits as UTF-8 comma-separated CSV; localized semicolon CSV is not accepted.
- Native XLSX, GeoJSON, KML/KMZ and MilX are deferred. Everon uses local game metres; geographic exchange needs verified georeferencing, and MilX needs schema/interoperability tests. No invented geographic conversion is included.
- Full interface scaling is native in the Windows EXE; browser fallback scales form controls. New tools and mod text may remain English; existing French/German support is retained.
- Optional `operation.timing` is additive to schema v4. Older releases may discard the timer/log when resaving. Existing files without timing remain unchanged.

## Install
Extract the entire Windows ZIP to a new folder, then run `Everon ORBAT Planner.exe`. Keep all files and both resource folders together. Export a Project JSON backup before moving between versions. The source ZIP is for GitHub and development; do not upload the installed mod's PAK or research script copies.

## Verification
45 automated checks cover existing plan/asset round-trips, editing, backend safeguards, translations, export scopes, lifecycle and the new timer, CSV and scaling preferences. Desktop checks cover the actual installed mod, all five objective templates, AO filtering, Undo/Redo, native interface scaling, persistence, CSV downloads and malformed imports. Presentation checks cover PNG/JPEG/PDF/SVG. Packaged release checks and ZIP integrity results are recorded in TEST-RESULTS.md.
