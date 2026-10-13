# Roadmap navigation — updated 13 October 2026

The current future programme is [the master roadmap](../ROADMAP.md), with [all 200 backlog items](../docs/FUTURE-FEATURE-WISHLIST.md) and [package ownership](../docs/FUTURE-FEATURE-MAPPING.json).

Current development executable: v2.9.1 Development 14. Latest consolidated local package: Preview 5. Catalog portability is described below; dedicated runtime verification remains pending. Earlier desktop/relay/fullscreen evidence: [test debrief](../docs/V2.9.1-TEST-REPORT.md).

The notes below are retained historical release notes. Their older pending/current labels are not the status of the latest build.

---

## v2.8.1 delivery
Scaling preferences, five source-verified side-mission planning templates, manual mission clock/event log and Excel-compatible planner CSV delivered. Native XLSX and GeoJSON/KML/KMZ/MilX are pending validated interoperability and, for geographic formats, a verified game-to-WGS84 mapping. Live game objectives/timers remain out of scope.

# 77th JSOC — development roadmap, 10 October 2026

## Current tested increment: v2.6.1

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

- Native-speaker translation review and full localization of technical diagnostics remain pending. Generated brief/legend labels, selected brief distance units and form hints are covered in v2.6.1.
- Keyboard customization delivered in v2.4.2 for canvas actions and movement, with validated alternatives, disable/reset and typing guards. Mouse gestures, Shift boost and dialog/fullscreen Escape stay fixed.
- Individual unit patches and multiple named branding profiles remain pending. One opt-in community default (name/logo/watermark/stamp) is saved locally in v2.6.1, excluding operation title/date. SVG, export community logo/patch, watermark, operation date and fictional exercise stamps are delivered in v2.6.0. Preview and selected unit/route/area export are delivered in v2.5.0.
- Verify all 20 locations against the correct Reforger Everon world, record version/source and coordinate conversion controls. Then implement search, jumps, coordinate copy, objective creation and export labels. Do not activate unverified targets.

## Next phases after this release is stable

Radio/callsign management → OPORD generator → expanded mission phases → templates → transport/logistics → GM/player redaction → documented Reforger interchange.

Elevation/LOS requires verified terrain data. TOC connections, collaboration, live game sync and simulation are future work, not current functionality. No implied real-time connection or verified ballistic model.

## Compatibility and verification

Project schema stays at v4. Optional true `locked` properties are preserved by this release on units, routes and areas; earlier builds can open the geometry but discard lock flags. Older v1–v3 imports are still supported. Preferences remain local and separate from plans. Offline base imagery uses the pre-existing map transform; it does not establish independently verified world-coordinate calibration.

Full UI scale is native in the Windows EXE; browser fallback enlarges controls. Copy/paste is within the app session, not a cross-application system clipboard. Snap changes new placement/drag targets, not existing geometry automatically.

## Reviewed prefab planning assets — 13 October 2026
Development 11 advances Package 12 from identity review to usable planning references. Prefab rows offer explicit name/type selection and prepare the existing Units asset selector; applying/placing embeds GUID, addon ID, path, provenance and target warnings. Preparation is mission-neutral; assignments use existing save and one-step Undo/Redo. Conflicting duplicates are rejected, locale changes retain draft values, and Sarge/Settings guidance is synchronized in EN/FR/DE. Focused contracts and actual desktop assignment/reload passed; the same 400-unit/500-resource sample stayed near 59 FPS. [Guide and validation](../docs/REVIEWED-PREFAB-ASSETS.md). Engine spawning/component adapters and server verification remain separate unfinished milestones. Preview 5 archives remain unchanged.

## Portable planning catalogs — 13 October 2026
Development 12 continues Package 12: Assets can export the session catalog plus assigned unit snapshots through a validated native Save dialog, then reimport them after restart. GUID/provenance and warnings survive; conflicts stop export before saving, and no mission/Undo/live-state changes occur. Sarge and Settings guidance are synchronized in EN/FR/DE. Sixteen relevant checks, actual desktop save/reimport/error workflows and a narrow post-optimization save check passed. Operation timings were compared against Development 11; a redundant renderer validation pass was removed while retaining native validation. [Steps and measured limits](../docs/PORTABLE-PLANNING-CATALOGS.md). Preview 5 archives are unchanged. The separate manifest-copy experiment is not promoted into release source or treated as verified prefab GUID data.

## Downloaded-addon project identity review — 13 October 2026
Development 13 extends Package 12 with opaque bounded GameProject Configurations acceptance and a one-picker project-only review. Real copied Invade & Annex identity/dependencies now import without sidecars, exporting zero resource records rather than inventing GUIDs. Sarge/Settings are synchronized in EN/FR/DE. Twenty-three relevant checks and the actual desktop copy workflow passed; parser timing was compared with Development 12. All 12 original installed addon files remain hash-identical. [Steps and compatibility limits](../docs/PROJECT-IDENTITY-COMPATIBILITY.md). The isolated manifest test stays preserved; binary resource mapping and native engine adapters remain future gates. Preview 5 packages are unchanged.

## Resource index reuse in Assets — 13 October 2026
Development 14 advances Package 12 with a one-picker worker-backed resource-index JSON load, multiple-addon owner review, bounded unresolved-reference findings and the existing prefab-to-unit preparation flow. Imported observations are explicitly declarations; referenced files are not rechecked and target-warning filtering is disabled. Empty indexes and cancel/rejection retention work. Sarge/Settings are synchronized in EN/FR/DE. Thirteen relevant checks and the actual 501-resource desktop workflow passed. The review retains its audit instead of rebuilding it during paging/preferences; matching 500/5,000-reference timings and zero UI rebuilds were recorded. [Steps and evidence](../docs/RESOURCE-INDEX-REVIEW-UI.md). Native GUID extraction from RDB and engine/server adapters remain subsequent gates; Preview 5 archives are unchanged.
