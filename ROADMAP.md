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
