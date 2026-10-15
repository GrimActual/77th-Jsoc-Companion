# Future Enfusion mission-package pipeline — scope addition, not a goal change

Desktop: validated intentions, ORBAT, manual route authoring (automatic route optimization remains future), offline scenario rules/journals and GM controls. Game engine: actual entity/resource instantiation, rendering, physics, AI and replication. Do not embed engine internals such as mesh topology or GPU allocation into planner data.

Proposed flow: canonical validated mission/scenario JSON → versioned deployment manifest with asset references/placements → reviewed Workbench import/export adapter or authorised server-side Enfusion adapter → game-authoritative acknowledgements and permitted event feed. A native .layer output is a separate Workbench compatibility milestone; arbitrary desktop files are not assumed to be runtime-loadable.

Required safeguards: installed resource GUID/prefab resolution, correct addon dependencies and engine version, terrain/unit/rotation transforms, stable planner IDs distinct from runtime replication IDs, allowlisted component overrides, quotas, dry-run preview and server-owner approval. No blanket class binding, arbitrary scripts or remote execution. Existing bridge remains read-only until separately implemented/validated commands exist.

Verified public API references (13 October 2026):
- Game.SpawnEntityPrefab accepts a Resource and EntitySpawnParams; Game.GetWorldEditor is for non-play mode: https://community.bistudio.com/wikidata/external-data/arma-reforger/EnfusionScriptAPIPublic/interfaceGame.html
- EntitySpawnParams.Transform is vector[4], with transform mode, parent and scale; a rotation-only 3×3 matrix does not encode translation: https://community.bistudio.com/wikidata/external-data/arma-reforger/EnfusionScriptAPIPublic/interfaceEntitySpawnParams.html
- Official Scenario Framework setup demonstrates Workbench layers and prefab assignments: https://community.bistudio.com/wiki/Arma_Reforger:Scenario_Framework_Setup_Tutorial

These establish candidate APIs, not a tested external package importer. Runtime scene-loading path, text versus processed resources, component exposure and layer-format compatibility need direct verification in the installed tools/server. No blanket claim of negligible server overhead: AI, physics, replication and entity creation still need budgets and measurements. BVH/octree/GPU backend/physics middleware details are engine implementation concerns and are not treated as a proven import contract.

Owners: packages 04/05 (canonical geospatial mission package), 10/11 (authorised server adapter), 12 (resource/Workbench compatibility), 16 (validation/benchmarking). This addition preserves the current offline GM/recovery work and does not schedule a new engine rewrite.

## Tracking and deployment pilot update — 2026-10-13

60 explicitly named entities passed a bounded real-server HTTPS test. See TRACKED-ENTITIES-PILOT.md. Automatic players and 120-player support remain future goals. The offline deployment-intent CLI is preliminary; it has no native execution adapter. See DEPLOYMENT-INTENT-PILOT.md.

## Native AI-order pilot — 14 October 2026

Package 14 now adds Move to position and timed Hold for bridge-created on-foot infantry AI groups in desktop 2.9.1-dev.gm.5 / Workshop candidate 0.5.0. In-game host review remains mandatory. Versioned requests, capability negotiation, same-pair ownership and stale desktop reviews accompany the adapter. Native PC/Workbench compilation and an isolated actual-server waypoint lifecycle gate passed; physical travel/arrival, combat behaviour and occupied/mounted rejection in real Host Local sessions remain pending. The new runtime test used loopback, not public HTTPS. Desktop context/localization/mission isolation and all 215 regression tests passed. Settings and the existing 50 Sarge topics include EN/FR/DE guidance. Vehicle transport/crew, route chains, properties and environment remain separate roadmap milestones. See [the pilot guide](NATIVE-AI-ORDERS-PILOT.md).


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


## Bounded expression syntax core checkpoint (15 October 2026)

Added a developer-only, non-executable expression parser for literals, unresolved local symbols, arrays, grouping and basic arithmetic, with a separate numeric lexer and full-source span/hash binding. Unsupported syntax rejects without a partial tree. Desktop UI/export and native execution remain unchanged. Source scope/binding analysis, broader command/operator grammar, typed IR, validator/schema and subsequent UI integration remain pending; no earlier goals are removed. See docs/SQF-EXPRESSION-AST.md for scope and evidence.
