# Roadmap navigation — updated 13 October 2026

The current future programme is [the master roadmap](../ROADMAP.md), with [all 200 backlog items](../docs/FUTURE-FEATURE-WISHLIST.md) and [package ownership](../docs/FUTURE-FEATURE-MAPPING.json).

Current development executable: **2.9.1-dev.gm.4 — COMMAND compact GM workspace pilot**. It retains the placement fix, searchable vanilla catalog and existing reviewed spawn/remove workflow. Earlier release notes below are historical; current scope is recorded in [the compact workspace guide](../docs/COMPACT-GM-WORKSPACE.md).

The notes below are retained historical release notes. Their older pending/current labels are not the status of the latest build.

---

## v2.8.1 delivery
Scaling preferences, five source-verified side-mission planning templates, manual mission clock/event log and Excel-compatible planner CSV delivered. Native XLSX and GeoJSON/KML/KMZ/MilX are pending validated interoperability and, for geographic formats, a verified game-to-WGS84 mapping. Live game objectives/timers remain out of scope.

# COMMAND — development roadmap, 10 October 2026

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

## Native read-only bridge runtime gate — 13 October 2026
The real diagnostic local-server executable sent native Enforce position updates through temporary HTTPS into Companion. Movement, unchanged mission JSON, same-stream interval reload after a reproduced counter-reset fix, native authentication rejection and cleanup were verified. Changed Enforce source compiled for PC/WORKBENCH. Server profile-path instructions are corrected in the guide, Settings and translated Sarge guidance. [Native runtime scope/evidence](../docs/NATIVE-BRIDGE-RUNTIME.md). Standalone dedicated-server runtime, endpoint-preserving revocation/retry-limit checks and Workshop candidate publication remain pending. No new feature-build number or package was created; consolidate after the remaining release gates.

## RC2 — bounded live tracking and deployment preview

Packages 01/04/11 now carry 60 opt-in named-entity batches with native HTTPS evidence. Package 12/14 adds a desktop deployment review/export with GUID provenance and stale checks; execution remains pending. Settings and 47 EN/FR/DE Sarge topics accompany delivery. Automatic opt-in player discovery, respawn lifecycle, 120-player scaling, server-reviewed spawn/remove and optional compact GM workspace remain future milestones. See docs/RELEASE-CANDIDATE-2.md.

## Unpublished player-source pilot

Explicit positive session player IDs, stable telemetry aliases, controller-bound leases, respawn baseline resets and disconnect retirement compile in PC/Workbench. Synthetic native policy and real empty-player-source HTTPS checks passed. Actual connected-player validation is pending; Workshop 0.3.0 and RC2 remain unchanged. See ../docs/PLAYER-TRACKING-PILOT.md.

### Asset browser usability — 14 October 2026
Searchable, paged asset cards replace the full catalog dropdown. Unit type links to troop/armoured/APC/light-vehicle/aircraft/logistics filters; prefab faction filters and variant visibility remain independent of mission faction. Exact asset snapshots and GUIDs are retained. Settings opens the browser; Sarge and EN/FR/DE guidance cover the workflow. Deployment review explains missing or invalid names. Native spawn availability remains separate from classification hints.

## Package 14.1 — compact GM workspace, 14 October 2026
The optional layout is implemented in 2.9.1-dev.gm.4: existing asset chooser in a collapsible drawer, capped read-only planned-selection inspector, existing deployment/results links and explicitly offline rehearsal controls. Mode/drawer preferences stay outside mission JSON; layout-only changes skip map/asset rebuilds and leave active replay running. Existing forms, pending edits, selection, Undo/Redo and full-map behavior are retained. Settings and 50 Sarge topics have EN/FR/DE guidance. The active MagicPath design is COMMAND — Compact GM Workspace. See [the workflow guide](../docs/COMPACT-GM-WORKSPACE.md). Native AI orders, properties and environment adapters remain the next integration milestones; this layout does not implement them.

## Native AI-order pilot — 14 October 2026

Package 14 now adds Move to position and timed Hold for bridge-created on-foot infantry AI groups in desktop 2.9.1-dev.gm.5 / Workshop candidate 0.5.0. In-game host review remains mandatory. Versioned requests, capability negotiation, same-pair ownership and stale desktop reviews accompany the adapter. Native PC/Workbench compilation and an isolated actual-server waypoint lifecycle gate passed; physical travel/arrival, combat behaviour and occupied/mounted rejection in real Host Local sessions remain pending. The new runtime test used loopback, not public HTTPS. Desktop context/localization/mission isolation and all 215 regression tests passed. Settings and the existing 50 Sarge topics include EN/FR/DE guidance. Vehicle transport/crew, route chains, properties and environment remain separate roadmap milestones. See [the pilot guide](../docs/NATIVE-AI-ORDERS-PILOT.md).

## Package 14.2–14.5 — squad-command expansion, 14 October 2026

The requested friendly-squad selection/recruitment, Follow Me, ground/map Move and chained routes, Force Move, Attack, Defend, Halt, formations, stances, strict fire control, suppression/look, vehicles/healing, attach/detach/convoys and stack/breach/garrison/clear are retained in [the implementation and native-binding specification](../docs/AI-COMMAND-EXPANSION.md). Advanced AI Command 69A404653EE3F3C4 is inspiration only; no code/assets/dependency is imported. The existing published Move/timed-Hold pilot is unchanged. New source rejects missing native group utility, incompatible waypoint classes and unknown actions rather than guessing a movement behaviour. Diagnostic work now traces waypoint selection, activity and resolved behaviour-tree resource; arrival/combat/interior completion remain separate gates. Undelivered controls stay unavailable, and Settings/Sarge state that explicitly in EN/FR/DE.

### First tactical adapters — development source
Defend position and cancellation of the Companion-owned waypoint are connected through a separate capability, strict contract, stale-reviewed desktop form and native host approval. Actual isolated-server traces confirm the defend state/activity/ActivityDefend.bt, cancellation, subsequent Move and old-relay fallback. EN/FR/DE desktop checks pass. Source is dev.gm.6 / native 0.6.0 candidate; published dev.gm.5 and Workshop 0.5.0 remain intact. Physical navigation/defence and the broader squad-control stages are still open. See [the complete scope and evidence](../docs/AI-COMMAND-EXPANSION.md).


## Additive milestone — Arma 3 / SQF to Enfusion migration

Retain every existing roadmap package. Extend shared contracts, resource identity/adapters and the GM workspace with drop-file migration review, then explicit Arma 3 class-to-prefab mapping, supported-pattern parsing, terrain calibration, reviewed neutral intents and native export/validation. The first source workflow inventories selected SQF/SQM/EXT/HPP files without execution, offers verified movement binding candidates, and marks unresolved classes, control flow and engine semantics for review. Full SQF translation and native mission export remain unfinished. See [migration foundation](../docs/SQF-MIGRATION-FOUNDATION.md). Current published releases and the user’s test copy remain unchanged.

Migration release checkpoint: 2.9.1-dev.gm.7 consolidates this read-only workflow and the previously tested tactical Defend/cancellation candidate. 226 release regressions, offline worker/drop/picker, localization/context, safe display, paged findings and validated native JSON Save passed. Existing native source hashes match retained compilation/runtime evidence. Full automatic SQF conversion and chained AI routes remain separate unfinished milestones; no earlier roadmap content was removed.


## Additive migration checkpoint — reviewed class mappings

The next source candidate adds explicit Arma 3 classname-to-prefab confirmation against the validated resource index, searchable typed cards, repeated-class reuse, portable mapping export/reload and transactional rejection of incompatible index changes. Exact addon/GUID/path, provenance and declared dependencies are preserved; mappings remain non-executable and gameplay equivalence/native availability unverified. 27 focused checks and actual offline desktop/large-list gates passed, including a quote-scanner hardening found by the large-file test. Sarge/Settings guidance remains synchronized in EN/FR/DE. Cached 2,721-resource searches measured p95 0.341 ms. The published dev.gm.7 release is unchanged. Supported-pattern neutral intent translation, terrain/native validation and chained AI waypoints remain retained unfinished milestones. See [mapping guide](../docs/SQF-CLASS-MAPPINGS.md).


## Additive migration checkpoint — source-linked neutral intent drafts

The next source candidate recognizes a bounded straight-line SQF subset and emits non-executable mapped spawn/movement/basic-waypoint drafts, literal bindings and source-local object links. Source hashes/references, exact resource-map snapshots, mandatory review gates, source/mapping stale locks and validated native JSON export accompany worker preparation. Conditional/dynamic/unsupported constructs remain unresolved and are never flattened into actions. 39 focused JS checks, 13 independent schema cases and actual offline desktop isolation/export/race gates passed. Sarge and Settings guidance is synchronized in EN/FR/DE. A 400-intent/200-definition preparation fixture measured median 16.32 ms / p95 18.17 ms. Published releases and earlier candidates are preserved. Terrain calibration, planning transfer, native export, complete SQF conversion and chained AI routes remain retained unfinished milestones. See [draft guide](../docs/SQF-MISSION-INTENT-DRAFTS.md).


## COMMAND dev.gm.8 release checkpoint

Reviewed reusable Arma 3 class mappings and bounded source-linked non-executable mission drafts are packaged together. 247 release regression tests and isolated offline package export passed. Terrain calibration, full mission conversion and reviewed native execution remain future additive milestones.


## Reviewed migration placement checkpoint (unreleased)

Completed manual ground-anchor/rotation preview and selected mapped-spawn transfer into the existing planner as one Undo/Redo batch (1–60 planning units). Source/mapping/mission changes stale the preview. Exact prefab/source/dependency provenance retained; height, grouping, movement and native execution remain unresolved. Multi-anchor terrain verification, linked routes and native approval adapters remain future additions. See docs/MIGRATION-PLANNING-TRANSFER.md.


## Linked migration planning routes checkpoint (unreleased)

Optional reviewed doMove points now form proposed planning routes linked to selected source-created units. Source order is retained without claiming original execution timing. Units/routes apply and Undo/Redo as one batch; limits remain 60 planning units and 240 selected movement points. Exact source/route/unit provenance is retained. Group waypoints, native AI execution and terrain calibration remain future additions. See docs/MIGRATION-LINKED-ROUTES.md.


## Multi-landmark planning alignment checkpoint (unreleased)

Completed optional rigid horizontal fitting from 3–12 source/Everon landmark pairs with per-point/RMS/maximum mismatch, user tolerance gate, narrow-coverage warning and explicit review. Fitted provenance is retained in imported units; manual placement remains available. Height and terrain identity remain unverified. Independent check landmarks, reusable profiles, native authority/lifecycle adapters and all earlier milestones remain additive future work. See docs/MIGRATION-TERRAIN-LANDMARKS.md.


## Terrain identity and ground-height review checkpoint (unreleased)

Added optional declared world addon/GUID/path review, exact-position imported ground samples, sampler-query export and atomic planning provenance. Missing samples/world conflicts block sampled imports; the older native deployment flow rejects explicit terrain-context units rather than dropping the requirement. Separate read-only native sampler passed bounded empty-world API/serialization and wrong-path rejection tests. Runtime GUID/addon authority, real Everon elevation accuracy and native world-enforced deployment remain future additions. See docs/MIGRATION-TERRAIN-CONTEXT.md.


## Native Everon sampling checkpoint (unreleased, 15 October 2026)

Completed actual read-only GetSurfaceY sampling in installed EmptyEden 1.8.0.13, packed-addon namespace validation, wrong-addon/path rejection and a bounded Windows diagnostic runner. Four launch/file/memory guard tests passed; final native runner validated all three returned positions and stopped its server (668.1 MiB sampled peak, 1000 MiB limit). Full Eden stopped at its 2000 MiB limit without a report. This is terrain sampling evidence, not full-scene stability or authenticated live identity. Exact world GUID/terrain lineage, live session negotiation and approved native world-enforced deployment remain pending; the deployment block and all existing roadmap goals remain. See tools/terrain-sampler/README.md and docs/test-evidence/native-everon-terrain.json.


Final packed-path boundary check: a shortened addon-relative suffix was rejected without a report. The stricter source then sampled all three points successfully at 461.71 MiB sampled peak, validated report positions and confirmed server cleanup. The earlier 668.1 MiB runner result is retained above as observed variation, not a memory guarantee. No desktop renderer changes were made, so previously completed desktop performance gates were not repeated.


## Exact native world lookup and deterministic diagnostic receipts (unreleased)

The separate diagnostic now matches the loaded packed world's addon/path to one exact runtime resource-database GUID before sampling. Wrong GUID and unproven loose-world ownership reject; equivalent casing passes. SHA-256 query/source/report receipts and an offline integrity checker detect changed files without claiming authenticated origin. Ten focused tool checks and actual native positive/negative runs passed; final run measured 6 ms for one lookup and 462.69 MiB sampled peak, with server cleanup. Imported files remain unverified planning data and the native deployment block stays in place. Parent-terrain lineage, session-bound capability negotiation and host-approval-time enforcement remain next additive milestones; all prior goals are retained. No Workshop or desktop executable update is included. See docs/test-evidence/native-world-identity.json and tools/terrain-sampler/README.md. Existing Settings/Sarge guidance and EN/FR/DE runtime-unverified labels remain correct because no desktop workflow changed.


## SQF-to-Enforce block transpilation audit and staged plan (additive)

Source audit confirms bounded inspection, explicit asset mapping, a small straight-line AST and non-executable spawn/movement drafts; no full SQF block parser, control-flow/type/locality analysis or general Enforce `.c` emitter has been delivered. Full migration remains retained. Added docs/SQF-ENSCRIPT-TRANSPILATION-PLAN.md to detail source packaging, full syntax representation, semantic analysis, typed control-flow IR, verified native adapters, Enforce generation, deterministic build fingerprints/source maps and isolated native validation. Unsupported or unresolved semantics stay explicit blockers; parser recognition and compilation alone do not prove equivalent execution. No existing goals were removed and no compiler capability is advertised in the current app.


## Structural SQF AST inspector checkpoint (unreleased)

Delivered a separate read-only structural AST worker/Assets inspector for nested brace conditions, code-scope exits, while, range/three-block for, forEach and stored code assignments. Source locations/hashes, opaque expressions, unsupported findings, paged safe display, guarded native JSON export, source-stale/cancellation gates and EN/FR/DE Sarge/Settings guidance are included. 27 focused checks, nine schema cases and actual offline desktop tests passed; a 1,401-node fixture prepared at 23.88 ms median / 27.55 ms p95, with same-fixture map frame/storage checks recorded. This is not the full grammar, semantic/type/scope analysis, typed IR lowering or Enforce code generation. Existing migration intents/deployment safeguards and all prior goals remain unchanged. See docs/SQF-STRUCTURAL-AST.md.


## Arma 3 PBO / WRP inventory and identity resolver (planned, separate pipeline)

Added docs/ARMA3-ARCHIVE-WORLD-INVENTORY-PLAN.md: read-only PBO manifest/prefix/compression inventory, streaming/canonical content fingerprints, config/CfgWorlds-to-WRP resolution, version-aware WRP metadata and optional object-reference decoding. Distinguish listed, header-inspected, decoded and unsupported evidence. WRP object lists require an actual decoder; config.bin is not SQF text. The current text/AST inspector does not support these binaries. Full terrain recreation into Enfusion remains a separate potential conversion workflow, not an inventory claim. Existing goals remain retained.
