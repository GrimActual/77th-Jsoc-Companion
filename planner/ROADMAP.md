# COMMAND — development roadmap, 10 October 2026

## Current tested increment: v2.6.0

Keep the existing planner and manual backups. This release covers the first priority batch, not the complete pasted roadmap.

- Offline editor startup: Leaflet bundled locally; a 16-tile lower-detail Everon background is available offline. Online tiles add detail. The desktop presentation exporter uses the bundled fallback too. Workshop, URL catalogs and online terrain still need a connection.
- Settings: light/dark/high-contrast options, desktop scaling, metric/imperial display, snap-to-grid, default zoom, partial-enclosure selection, WASD preference. English, French and German interfaces and Sarge help are available.
- Saving: Saved/Unsaved/Saving/Failed states; existing timestamped, validated manual backups retained. No automatic backup scheduler.
- Editing: selected-unit group movement, session copy/paste, duplicate, alignment/distribution, locks, Space-drag pan, fit visible ORBAT. Group mutations use one undo step; locked objects reject mutation and deletion. Imports intentionally replace the whole plan and are not constrained by old object locks.
- Briefing: expand map and request fullscreen; restore editor with Exit briefing/Escape. The saved operation is unchanged.
- Locations: a research registry records the requested 20 names with null coordinates. Nothing is guessed. It is not exposed as verified navigation data or a project JSON file.

## Performance pass before continuing

v2.4.3 retains map objects through zoom, reuses unit markers during edits, reduces grid/cursor work, bounds terrain requests, and reports GPU compositing status. See UPDATE-2.4.3.md for measurements and limits.

## Still pending from immediate targets

- Native-speaker translation review and localization of technical diagnostics and generated briefing/legend labels.
- Keyboard customization delivered in v2.4.2 for canvas actions and movement, with validated alternatives, disable/reset and typing guards. Mouse gestures, Shift boost and dialog/fullscreen Escape stay fixed.
- Individual unit patches and persistent branding profiles remain pending. SVG, export community logo/patch, watermark, operation date and fictional exercise stamps are delivered in v2.6.0. Preview and selected unit/route/area export are delivered in v2.5.0.
- Verify all 20 locations against the correct Reforger Everon world, record version/source and coordinate conversion controls. Then implement search, jumps, coordinate copy, objective creation and export labels. Do not activate unverified targets.

## Next phases after this release is stable

Radio/callsign management → OPORD generator → expanded mission phases → templates → transport/logistics → GM/player redaction → documented Reforger interchange.

Elevation/LOS requires verified terrain data. TOC connections, collaboration, live game sync and simulation are future work, not current functionality. No implied real-time connection or verified ballistic model.

## Compatibility and verification

Project schema stays at v4. Optional true `locked` properties are preserved by this release on units, routes and areas; earlier builds can open the geometry but discard lock flags. Older v1–v3 imports are still supported. Preferences remain local and separate from plans. Offline base imagery uses the pre-existing map transform; it does not establish independently verified world-coordinate calibration.

Full UI scale is native in the Windows EXE; browser fallback enlarges controls. Copy/paste is within the app session, not a cross-application system clipboard. Snap changes new placement/drag targets, not existing geometry automatically.
