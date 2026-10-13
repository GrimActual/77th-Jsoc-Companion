# 77th JSOC Companion — future development roadmap

Updated 13 October 2026. Ordered by technical dependencies, with no dates or delivery promises. This is future planning; it does not authorize implementing all 200 items in one release.

## Current foundations and immediate validation gate
- v2.8.2 is the prior stable release; RC2 has a user-tested single-host position feed.
- v2.9.1 Preview 1 adds experimental dedicated profiles/sender source, bounded reconnects, diagnostics, and full map/fullscreen. Its desktop and relay tests pass. The bridge candidate now compiles for PC and WORKBENCH on engine 1.8.0.13; a real dedicated-server test remains pending.
- Existing headless validation, ORBAT hierarchy, map geometry, phases, imports/exports, simulation fixtures, backups and bridge protocols are foundations to reuse. Package completion must be based on evidence, not assumed from feature names.
- Complete the v2.9.1 engine/server validation gate before calling its dedicated path stable. Future architectural work can proceed offline without waiting for a live server.

## First core increment — 13 October 2026
Headless mission validation is reused by a new offline scenario module and CLI. Typed actions, prerequisites, ordered journals and replay are implemented and tested; see [core guide](docs/OFFLINE-SCENARIO-CORE.md). GM UI and temporary overlay are now implemented; GM undo and validated two-copy local recovery are now implemented; see [recovery guide](docs/GM-UNDO-RECOVERY.md). Broader persistence/recovery requirements remain future work. See [desktop GM guide](docs/OFFLINE-GM-DESKTOP.md). This development increment does not alter the packaged preview.

## Scenario authoring / replay / AAR increment — 13 October 2026
A validated objective/event builder, command playback controls, and printable HTML/JSON after-action report exports are implemented in the GM development desktop. See [guide](docs/GM-AUTHORING-AAR.md). Inside-radius conditions and temporary zone boundaries are now implemented in scenario version 2; see [spatial guide](docs/GM-SPATIAL-RULES.md). Validated complete JSON scenario editing and versioned schema contracts are now delivered; see [editing guide](docs/GM-SCENARIO-EDITING.md). Additional visual editing, conditions and campaign mechanics remain future work.

## GM preferences and continuous performance checks — 13 October 2026
Game Master settings now cover recovery, overlay/zone visibility, marker scaling, time steps and replay defaults, with a Sarge destination. Performance and maintenance gates are recorded in AGENTS.md; measured results and removed redundant work are in [the debrief](docs/GM-SETTINGS-PERFORMANCE.md).

## Mission recovery and scenario library — 13 October 2026
Rotating bounded mission recovery, explicit restore with Undo, and a named rules library are delivered. The desktop/Enfusion responsibility split and future deployment package pipeline are recorded in [the future integration note](docs/ENFUSION-MISSION-PACKAGE-ROADMAP.md); they add scope without changing current priorities.

## Integrated offline milestone and remaining gates
An offline JSON-driven Game Master scenario: headless mission loading without data loss; versioned units/objectives/phases/events; allowlisted conditions/actions; GM controls; append-only event journal; deterministic replay; save/reload/undo/recovery; regression and malformed-input checks. Develop this in small verified increments, starting with an audit/extraction of existing core logic. Do not rebuild existing systems or replace Electron before an alternative passes the same workflows.

## Event inspection and compile assurance — 13 October 2026
GM event readiness, prerequisite/zone/time/action inspection, session filters and a saved default filter are delivered, with 40 translated Sarge topics. PC and WORKBENCH compilation passed using the repeatable isolated validation tool. The 122-test regression gate and dense 400-unit / 200-event performance comparison passed; see [inspection and validation guide](docs/GM-EVENT-INSPECTION.md). Dedicated runtime and Workshop packaging remain separate uncompleted gates. Passing gates are not repeatedly rerun without a relevant change or failure.

## How the two proposals fit
The 16 engineering packages below are the delivery structure. The [200-item catalogue](docs/FUTURE-FEATURE-WISHLIST.md) retains every numbered [D]/[E] item as a traceable backlog, not 200 separate release tasks. The [package mapping](docs/FUTURE-FEATURE-MAPPING.json) assigns each item a primary package; many also have cross-package dependencies. Specific priorities and acceptance criteria are set when a package enters development.

## Package/backlog ownership
| Package | Primary backlog items |
|---|---|
| 01 Core architecture | 56–58, 64, 66–68, 70–71, 73–75 |
| 02 Persistence/recovery | 43, 72, 197 |
| 03 Force/ORBAT model | 1–20 |
| 04 Geospatial/map model | 21–35, 40 |
| 05 Mission authoring/briefing | 36–39, 41–42, 44–55 |
| 06 Scenario/rules engine | 59, 81–85, 88–90 |
| 07 Game Master | 60, 76–80, 86–87, 91–100 |
| 08 Simulation/campaigns | 61, 69, 101–120 |
| 09 Event journal/replay/AAR | 63, 190–192 |
| 10 Integration/security | 164–185 |
| 11 Enfusion/server adapter | 62, 65, 121–140 |
| 12 Resource imports | 141–160 |
| 13 Collaboration | 161–163 |
| 14 UI/renderer | 186–189, 196 |
| 15 Plugins/ecosystem | 193–195, 199–200 |
| 16 Release assurance | 198; continuous checks across all packages |

Package 16 starts immediately and runs throughout, despite depending on evidence from the other packages. Package 11's full event/GM scope depends on 04 and 09–10; the existing read-only bridge is retained during that work. Items 121 and 176 require external verification/cooperation: supported APIs do not imply Bohemia endorsement or an established cooperation agreement. Native UI alternatives and AI assistance remain optional evaluations. No hidden tracking, blanket execution or game-process manipulation is permitted.

---

# 77th JSOC Companion — Master Implementation Plan

TARGET ARCHITECTURE

Companion Desktop

Map • ORBAT • Mission Editor • GM Console • Replay

Companion Core

Data Models • Events • Scenario Rules • Simulation • Permissions

Storage

Plans and replay

Importers

Permitted resources

Adapters

Enfusion and others

## The 16 implementation packages

## Package 01 — Core architecture and shared schemas

Foundation

Extract existing logic from Electron, define versioned JSON schemas, engine APIs, command validation, event bus, module boundaries and state separation.

DEFINITION OF DONE

A headless Companion Core that can load and validate a mission without launching the desktop interface.

Dependencies: Existing application

## Package 02 — Persistence, migrations and recovery

Foundation

Unify plan storage, snapshots, undo, backups, schema migrations, revision history, import/export validation and recovery.

DEFINITION OF DONE

Plans survive upgrades, corrupted inputs and interrupted saves without losing the last valid version.

Dependencies: 01

## Package 03 — Unified force and ORBAT model

Foundation

Combine hierarchy, personnel, units, vehicles, equipment, readiness, attachments, reserves, templates and force reporting.

DEFINITION OF DONE

One canonical force model used by planning, simulation, GM and live integrations.

Dependencies: 01–02

## Package 04 — Unified geospatial and map model

Foundation

Consolidate terrain coordinates, layers, objectives, routes, zones, symbols, annotations, measurements and map exports.

DEFINITION OF DONE

All map features operate on the same coordinate and entity model.

Dependencies: 01–02

## Package 05 — Mission authoring and briefing pipeline

Product

Connect ORBAT and map data to phases, dependencies, contingencies, briefing templates, annexes, revision summaries and exports.

DEFINITION OF DONE

A mission package generated consistently from one authoritative plan.

Dependencies: 03–04

## Package 06 — Scenario definitions and rule engine

Foundation

Define JSON scenarios, triggers, conditions, action allowlists, event scheduling, phases, prerequisites and validation.

DEFINITION OF DONE

A deterministic scenario can run headlessly from a JSON file.

Dependencies: 01, 03–04

## Package 07 — Manual and automated Game Master

Product

Build GM console, event library, simulated unit controls, hidden information, approvals, undo, pause/reset and automated triggers.

DEFINITION OF DONE

A GM can operate an offline scenario entirely inside Companion.

Dependencies: 06

## Package 08 — Simulation and campaign state

Product

Implement synthetic movement, logistics, readiness, event outcomes, simulation clocks, persistent campaigns and branching.

DEFINITION OF DONE

A repeatable scenario whose units, resources and outcomes change according to defined rules.

Dependencies: 03–04, 06

## Package 09 — Event journal, replay and AAR

Product

Capture events from GM, simulation and authorized game sources; build timeline, playback, state reconstruction and AAR exports.

DEFINITION OF DONE

An operation can be reconstructed and reviewed without modifying its original plan.

Dependencies: 02, 06–08

## Package 10 — Secure integration and permission framework

Security

Unify tokens, roles, capabilities, server ownership, rate limits, audit trails, command validation, revocation and shutdown.

DEFINITION OF DONE

No external adapter can read or change state beyond explicitly granted permissions.

Dependencies: 01, 06

## Package 11 — Enfusion server adapter and live synchronization

Integration

Extend the existing host-position bridge toward authorized server events, friendly-unit state, objectives and acknowledged GM requests.

DEFINITION OF DONE

A tested server can exchange permitted data with Companion while Enfusion remains authoritative.

Dependencies: 04, 09–10

## Package 12 — Workbench and resource import pipeline

Integration

Build local file discovery, permitted metadata extraction, coordinate conversion, format detection, indexing, provenance and licensing checks.

DEFINITION OF DONE

Supported local resources become validated Companion metadata without unauthorized asset redistribution.

Dependencies: 01, 04

## Package 13 — Multi-operator collaboration

Platform

Introduce shared sessions, presence, annotations, revision merging, role-specific views, conflict resolution and session diagnostics.

DEFINITION OF DONE

Two or more authorized operators can work on the same mission without silently overwriting changes.

Dependencies: 02, 09–10

## Package 14 — Desktop UI and renderer modernization

Platform

Introduce clean engine-facing UI APIs, map rendering improvements, GM workspace, role layouts, onboarding and optional native UI prototypes.

DEFINITION OF DONE

The interface can evolve independently of Companion Core; an Electron-to-native rewrite is optional.

Dependencies: 01, 03–09

## Package 15 — Plugins, adapters and ecosystem

Expansion

Define plugin manifests, sandboxed permissions, terrain packs, external adapters, version compatibility and extension documentation.

DEFINITION OF DONE

A third-party module can add a supported capability without editing the engine core.

Dependencies: 01, 10, 12–14

## Package 16 — Release engineering, security assurance and adoption

Continuous

Automate builds and tests, dependency checks, artifact hashes, signing where feasible, diagnostics, threat modeling, documentation and external testing.

DEFINITION OF DONE

Repeatable releases with evidence that important user workflows and security boundaries work.

Dependencies: All packages

## Which packages should be developed together?

This is where you can save the most duplicated work.

Bundle A — The shared foundation

Packages 01 + 02 + 03 + 04

Build your engine contracts, storage, force model and map model as one coordinated effort. A unit should have one stable ID whether it appears in the ORBAT, on the map or in a simulation.

This prevents you from building three incompatible unit systems.

Bundle B — Mission editor + scenario engine + GM

Packages 05 + 06 + 07

Let the mission editor produce the same structured data that the Game Master executes. Objectives, phases and triggers should not need to be re-entered into a separate GM file.

Build the scenario schema and GM console against each other.

Bundle C — Simulation + events + replay

Packages 08 + 09

Every meaningful simulation change becomes a validated event. The replay system consumes those events, so you don't have to reverse-engineer what happened later.

Use deterministic tests to verify that identical initial states and event sequences produce identical results.

Bundle D — Security + live Enfusion adapter

Packages 10 + 11

Design the permissions and server protocol together. Don't build powerful GM commands first and bolt security on afterward.

Start with read-only events, then add narrowly scoped commands only where the server can validate and acknowledge them.

Bundle E — Resource import + map compatibility

Packages 04 + 12

Build coordinate conversion, terrain indexing and importer validation together so imported resources land in the correct map representation.

Keep provenance and redistribution restrictions part of the importer itself.

Bundle F — Collaboration + UI + plugins

Packages 13 + 14 + 15

Once engine interfaces are stable, develop shared operator views, role-based workspaces and extensibility against those same APIs.

This avoids hardcoding collaboration into one particular desktop renderer.

## Dependency map

Simplified technical dependency diagram. Release engineering and testing should operate throughout, not only at the end.

## What I'd actually build first

I'd make the first integrated deliverable a fully offline, JSON-driven Game Master scenario.

It would demonstrate the new architecture without depending on game APIs, tunnels or external servers.

First integrated build checklist

Extract mission and ORBAT logic into a headless core

Define versioned schemas for units, objectives, phases and events

Load an existing mission into the new core without losing data

Create a JSON scenario with conditions and actions

Build a GM panel to trigger and inspect events

Record an append-only event history

Replay the scenario deterministically

Verify save, reload, undo and recovery

Run regression and malformed-input tests

Once that works, your architecture has proven it can support the core idea: one mission can be planned, executed in simulation, controlled by a GM and replayed afterward.

That's a meaningful milestone.

## Non-negotiable engineering rules

Across every package, I'd enforce these principles:

1. One source of truth per entity. Don't maintain separate, incompatible representations of the same unit or objective.
2. Versioned data contracts. Old mission files must be migratable, and unsupported formats must fail safely.
3. Offline-first. A live connection is an enhancement, never a requirement to open a saved plan.
4. Server authority. The Companion can request permitted game actions; it cannot assume the game executed them.
5. Permissioned resource access. Import only data you're authorized to use, and don't redistribute proprietary game assets without permission.
6. Event-driven history. Every important state change should be observable and testable.
7. Test before replacing. Don't abandon Electron until another UI can perform the same essential workflows reliably.
8. No blanket remote execution. GM commands must be typed, allowlisted, validated and auditable.

The biggest optimization here is architectural: you're not building 200 independent features. You're building a small number of reusable systems that unlock dozens of features each.

For example, a well-designed event engine supports mission triggers, GM actions, simulated radio reports, automated scenarios, replay, audit logs and after-action reviews. Build that engine once, and several major parts of the wishlist become much easier.

That's how I'd turn your current project into a serious Companion Core + Game Master + Enfusion integration platform, without wasting effort rebuilding the same functionality over and over.
## Existing scenario draft editing — 13 October 2026
Roadmap packages 05/06/07 now support validated in-place objective/event edits with stable IDs, explicit Apply/Cancel, initial objective status and a Settings shortcut. Complex rules stay in the complete editor and unapplied JSON is preserved. Sarge has 41 translated topics. The relevant 16-test gate, actual desktop workflow and large-authoring latency check passed; see [editing guide](docs/GM-DRAFT-EDITING.md). This development increment follows Preview 4 and does not repeat unrelated passing gates or imply a new Workshop publication.

## Bounded scenario draft history — 13 October 2026
Development 6 adds validated session-only Undo/Redo for applied scenario authoring changes, JSON applications and library loads. Settings chooses 10/20/50 steps within a bounded serialized history budget; Sarge now has 42 translated topics. The relevant 15-test gate, actual desktop isolation/reset workflow and prior-build authoring/storage comparison passed. Added history has measured latency and memory cost, recorded in [the guide](docs/GM-DRAFT-HISTORY.md); unrelated map/bridge/Enfusion gates were not repeated. Mission and GM command undo remain independent. Consolidated packaging remains a later release gate.

## Reforger native properties, COOP template and UI references — 13 October 2026
The user-provided Bohemia attribute tutorial, GRAD COOP Template and Reforger UI screenshot are reviewed in [the reference note](docs/REFORGER-GM-REFERENCES.md). They inform future authorised property integration, scenario setup and an optional compact GM workspace while preserving our own version and current priorities. GRAD uses APL restrictions; no foreign code or artwork was incorporated. The screenshot is retained locally outside source/release trees. This research does not implement a network property API or 3D viewport, and does not repeat previously passing application tests.

## Scenario preflight and optional workspace proposal — 13 October 2026
Development 7 adds advisory initial-draft preflight, diagnostic export, stale-result protection, a Settings shortcut and 43 translated Sarge topics. Eight focused tests and the actual desktop isolation/export workflow passed; the capped 500-finding review latency is recorded in [the guide](docs/GM-SCENARIO-PREFLIGHT.md). No unrelated passing gates were repeated.

Proposed UI sub-milestone **14.1 — Optional Game Master workspace** is recorded in [the implementation plan](docs/OPTIONAL-GM-WORKSPACE-PLAN.md). MagicPath is the proposed design tool for panel hierarchy and boundaries; no prototype or layout rewrite is delivered yet. The proposal stays inside the 16-package roadmap. Its “Package 20” is mapped to existing security/integration/release owners, and unimplemented properties/automatic-play behavior remain future work.

## Enfusion resource-format reference — 13 October 2026
The user-supplied extension inventory is reviewed in [the importer reference](docs/ENFUSION-RESOURCE-FORMATS.md), with corrections for procedural animation projects, text model/animation intermediates, script metadata exceptions and source files excluded from publishing. Package 12 will distinguish readable metadata, registered resource resolution and opaque runtime formats rather than claiming one universal parser or a complete engine schema. This reference does not change the current goal or deliver new binary import support.

## Resource metadata contract foundation — 13 October 2026
Package 12 now includes a versioned headless resource index, canonical JSON Schema, documented sample and read-only review CLI. Ownership, safe paths, GUID ambiguity, provenance, dependency gaps and transactional replacement/merge behavior are explicit. Twelve focused tests, thirteen schema cases and representative large-index timing samples passed; see [the contract guide](docs/RESOURCE-INDEX-CONTRACT.md). Desktop Development 7, Sarge and Settings remain unchanged because this increment delivers no user-facing importer. Native metadata parsing and real server resource validation are subsequent adapter gates. Consolidated packaging remains a later release gate; unrelated passing tests were not repeated.

## Offline property-adapter foundation — 13 October 2026
The property catalogue foundation now provides explicit review/apply translation for existing planner-unit names, affiliations, unit types, notes and local-map positions. Unsupported fields, missing/locked targets, duplicate edits and stale plans block application; unrelated mission data and separate provenance are preserved. Ten focused tests, eleven independent wire-schema cases and a 400-unit timing/isolation sample passed; see [the adapter guide](docs/PROPERTY-ADAPTER-FOUNDATION.md). This extends offline authoring and packages 07/12 without claiming native component mappings or writable server commands from packages 10/11. Development 7, Sarge and Settings remain unchanged until an actual review UI is delivered. No new package or Workshop update is implied.

## Reviewed unit-property UI — 13 October 2026
Development 8 adds file/pasted-request review in Units, an optional bounded resource-index loader, paged before/after findings and explicit Apply through existing mission authoring. Property batches carry paired builder snapshots: one mission Undo restores the full unit batch and builder text; Redo reapplies it. Extra builder snapshots share a 2 MiB session budget. Settings adds a shortcut and Sarge has 44 EN/FR/DE topics. Actual desktop atomicity, stale-lockout, Unicode display safety, ID/GUID/reference preservation, save-failure, memory-limit and localization/context checks passed, plus a 400-unit timing sample and prior-build authoring comparison. See [the workflow guide](docs/UNIT-PROPERTY-REVIEW.md). Active rehearsal remains unloaded; native writes/importers remain pending. Consolidated packaging stays a later gate, and unrelated completed tests were not repeated.

## Consolidated Preview 5 validation — 13 October 2026
At the user's explicit request, Package 16 runs a full release validation rather than repeating small gates indefinitely: 159 automated tests, five schema definitions, 33 schema corpus cases, actual desktop property workflows, dense-map baseline comparison, repeated batch/history cycles and offline reload/reopen checks passed. The unchanged native compile evidence is retained by source-hash comparison. Preview 5 consolidates Development 5–8 and the resource/property foundations; [the debrief](docs/PREVIEW5-VALIDATION.md) records measured performance, scope and remaining dedicated/native/signing limits. Archive integrity and packaged startup are separate final packaging checks.

## Selected Workbench metadata identities — 13 October 2026
Package 12 adds bounded identity extraction for the observed GameProject/MetaFileClass subset, a read-only selected-file CLI, stable addon/GUID-derived resource IDs and real user-addon fixtures. Eleven focused checks and a 500-sidecar timing sample passed. The actual inspected world target was empty and the partial addon dependency unresolved; both remain explicit, rather than being called a valid native world. Configuration bodies/resource dependencies remain uninterpreted. [Reader guide and evidence](docs/WORKBENCH-METADATA-READER.md). This source-only increment follows Preview 5; the desktop, Sarge/Settings and existing ZIPs remain unchanged until a metadata import UI is delivered. No server/native property writes are added.

## Usable metadata import workflow — 13 October 2026
Development 9 delivers the Package 12 desktop workflow in Assets: native project/sidecar pickers, worker-based inspection, resource/warning pages, dependency-gap review, native index export and transfer to offline property review. Imports preserve mission/builder/journal state; cancelled/rejected inputs retain the prior review, and transfer invalidates stale property reviews. Settings has a shortcut and Sarge has 45 translated topics. Twelve relevant checks, the actual 500-resource desktop workflow and a 400-unit Preview 5 performance comparison passed; [steps and debrief](docs/WORKBENCH-METADATA-IMPORT-UI.md). Native component interpretation, spawning and server validation remain subsequent milestones. Preview 5 archives remain preserved; the development executable contains this feature.

## Native text, DPI and graphics diagnostics — 13 October 2026
Development 10 extends Package 14/16 with consistent native system-font styling, work-area-aware initial sizing and a Display & graphics Settings page. DPR/monitor scale/interface zoom are separate, reports become stale on resize/settings changes, and bounded GPU/driver/exit diagnostics are read-only. Eight relevant tests, twelve DPI/zoom combinations, normal/software rendering comparisons, translated report controls and the existing metadata workflow passed; [display guide/evidence](docs/DISPLAY-QUALITY.md). Sarge has 46 topics. Some sampled DPI frames exceeded 100 ms and are documented. No driver/global settings were changed, no universal sharpness or driver-interference conclusion is claimed, and native adapter/release goals remain intact.

## Reviewed prefab planning assets — 13 October 2026
Development 11 advances Package 12 from identity review to usable planning references. Prefab rows offer explicit name/type selection and prepare the existing Units asset selector; applying/placing embeds GUID, addon ID, path, provenance and target warnings. Preparation is mission-neutral; assignments use existing save and one-step Undo/Redo. Conflicting duplicates are rejected, locale changes retain draft values, and Sarge/Settings guidance is synchronized in EN/FR/DE. Focused contracts and actual desktop assignment/reload passed; the same 400-unit/500-resource sample stayed near 59 FPS. [Guide and validation](docs/REVIEWED-PREFAB-ASSETS.md). Engine spawning/component adapters and server verification remain separate unfinished milestones. Preview 5 archives remain unchanged.

## Portable planning catalogs — 13 October 2026
Development 12 continues Package 12: Assets can export the session catalog plus assigned unit snapshots through a validated native Save dialog, then reimport them after restart. GUID/provenance and warnings survive; conflicts stop export before saving, and no mission/Undo/live-state changes occur. Sarge and Settings guidance are synchronized in EN/FR/DE. Sixteen relevant checks, actual desktop save/reimport/error workflows and a narrow post-optimization save check passed. Operation timings were compared against Development 11; a redundant renderer validation pass was removed while retaining native validation. [Steps and measured limits](docs/PORTABLE-PLANNING-CATALOGS.md). Preview 5 archives are unchanged. The separate manifest-copy experiment is not promoted into release source or treated as verified prefab GUID data.

## Downloaded-addon project identity review — 13 October 2026
Development 13 extends Package 12 with opaque bounded GameProject Configurations acceptance and a one-picker project-only review. Real copied Invade & Annex identity/dependencies now import without sidecars, exporting zero resource records rather than inventing GUIDs. Sarge/Settings are synchronized in EN/FR/DE. Twenty-three relevant checks and the actual desktop copy workflow passed; parser timing was compared with Development 12. All 12 original installed addon files remain hash-identical. [Steps and compatibility limits](docs/PROJECT-IDENTITY-COMPATIBILITY.md). The isolated manifest test stays preserved; binary resource mapping and native engine adapters remain future gates. Preview 5 packages are unchanged.

## Resource index reuse in Assets — 13 October 2026
Development 14 advances Package 12 with a one-picker worker-backed resource-index JSON load, multiple-addon owner review, bounded unresolved-reference findings and the existing prefab-to-unit preparation flow. Imported observations are explicitly declarations; referenced files are not rechecked and target-warning filtering is disabled. Empty indexes and cancel/rejection retention work. Sarge/Settings are synchronized in EN/FR/DE. Thirteen relevant checks and the actual 501-resource desktop workflow passed. The review retains its audit instead of rebuilding it during paging/preferences; matching 500/5,000-reference timings and zero UI rebuilds were recorded. [Steps and evidence](docs/RESOURCE-INDEX-REVIEW-UI.md). Native GUID extraction from RDB and engine/server adapters remain subsequent gates; Preview 5 archives are unchanged.

## Native read-only bridge runtime gate — 13 October 2026
The real diagnostic local-server executable sent native Enforce position updates through temporary HTTPS into Companion. Movement, unchanged mission JSON, same-stream interval reload after a reproduced counter-reset fix, native authentication rejection and cleanup were verified. Changed Enforce source compiled for PC/WORKBENCH. Server profile-path instructions are corrected in the guide, Settings and translated Sarge guidance. [Native runtime scope/evidence](docs/NATIVE-BRIDGE-RUNTIME.md). Standalone dedicated-server runtime, endpoint-preserving revocation/retry-limit checks and Workshop candidate publication remain pending. No new feature-build number or package was created; consolidate after the remaining release gates.
