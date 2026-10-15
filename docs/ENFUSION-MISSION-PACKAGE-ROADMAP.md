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


## Source-linked semantic adapter requirements (15 October 2026)

Added a developer-only registry/review for 12 radio-relevant mechanic families with source hashes/locations, lexical-only evidence, documented target candidates, explicit unresolved names and lifecycle/behavior test obligations. Read-only radio sample: 80 occurrences, 12 families; zero implemented/native-verified adapters. 24 focused checks passed. No UI/game/export authority is added; source bindings/types, typed IR, native adapters and every earlier goal remain pending as applicable. See docs/SQF-ADAPTER-REQUIREMENTS.md.


## Source bindings, opt-in command syntax and value IR review (15 October 2026)

Added developer-only private/params/loop declaration evidence, conservative reference candidates and deferred-code barriers; an opt-in documented-arity command/comparison/logical parser; a partial source-value IR prototype; and reproducible folder review/integrity tools with EN/FR/DE developer guidance. 70 focused checks passed. The radio sample's 31 selected expression parts are now syntactically recognized by the extended profile, while types, effects, callback context and native behavior remain unresolved. Source files/audio remain untouched. Existing arithmetic output matches db6f9a1. No app executable, native mod, UI or deployment authority changes. Complete type/effect checks, typed statement/control-flow IR, strict UI/import contracts and native adapters remain unfinished; every earlier goal is retained. See docs/SQF-BINDING-VALUE-IR.md and tools/sqf-review/README.md.


## Bounded source operand/effect checks and strict contract (15 October 2026)

Added source-shape compatibility/mismatch/unresolved checks and explicit potential effects for the 18-command subset, including isNil unscheduled evaluation, deferred event/action callbacks, eager defaults and Boolean-versus-code logical evaluation. Strict JS validation and an independent schema fence source spans, graphs, gates and timing obligations. Folder review adds the report while preserving older formats. 52 focused checks and 11 schema cases passed; originals/audio remain untouched. No native adapter, whole-statement/type-flow proof, target code, desktop executable or deployment authority is added. Future full control-flow/type/effect and native goals remain intact. See docs/SQF-SOURCE-SEMANTICS.md.


## Author-operated mod conversion corpus and pathway priorities (15 October 2026)

Added a 20-repository public catalogue/tree inventory and revision-pinned, read-only tests of 30 small SQF samples from the five author-permitted priority projects. All 30 review bundles passed integrity/strict-report checks with unchanged captured source bytes; 248 selected expression parts were recognized and 282 remained unsupported. This is sampled static coverage, not whole-mod conversion or native verification. Evidence retains provenance without bundling third-party script bodies. The product destination is an in-app workflow for authors to convert their own sources: inventory/dependency review, bounded source-mapped preprocessing, explicit class/resource mappings, typed context/lifetime IR, reviewed output and isolated native validation. Current deeper checks remain developer tools. All prior roadmap items remain; new corpus priorities supplement them. See docs/EXTERNAL-MOD-CONVERSION-CORPUS.md and docs/test-evidence/root-corpus.json.


## Supplied-source include resolver and compiler CI (15 October 2026)

Added a bounded read-only dependency core and cancellable Node-worker CLI with explicit virtual mounts, source identities, missing/case/unsafe-path findings and potential cycle evidence. 22 focused checks passed; five pinned script/header fixtures yielded 49 exact include paths and six unresolved virtual-prefix requests. No preprocessing, cross-file symbol binding or native conversion is claimed. Added relevant-path Windows/Linux compiler CI; hosted results are separate from local checks. Tree-sitter/ANTLR and GNU CPP remain compatibility evaluations, not integrated dependencies. Release artifact attestations are a future packaging gate; no SLSA level is claimed. The author-operated in-app workflow and all earlier roadmap goals remain. See docs/SQF-SOURCE-DEPENDENCIES.md.


## Literal function registration and lexical call candidates (15 October 2026)

Added bounded literal CfgFunctions registration/source-path inventory, explicit config-root context, named lexical call/spawn candidates and an isolated Node-worker CLI. 26 new focused cases and 22 affected regression cases passed. Five pinned sampled projects (65 files) yielded 186 registration candidates, eight exact source paths and two unique name-candidate call sites; no runtime bindings or execution readiness are claimed. Macro-generated config, include-fragment insertion order, conditionals, inheritance, runtime writes and native behavior remain unresolved. Existing dependency reports match prior fixtures. CI includes the new checks; hosted evidence is separate. This is source-only developer tooling, keeping the author-operated in-app workflow and every prior roadmap goal intact. See docs/SQF-FUNCTION-REGISTRATIONS.md.


## Bounded literal include insertion and source maps (15 October 2026)

Added read-only literal include assembly, per-character original spans, repeated-include occurrence chains and guarded registration composition through explicitly synthetic config identities. Macro/conditional/unknown directives, missing or ambiguous files, cycles and unsupported line splices block entries without partial source/maps/candidates. 22 new cases and 11 affected worker/CLI regression cases passed. Of ten pinned real config entries, three literal units completed and seven macro-dependent units remained blocked; nontrivial include composition is proven by synthetic fixtures, not native mod conversion. Source-only developer tooling; no app/native execution authority or release binary is added. Main now also has the user-requested community policies, GPL-3.0-only original-code licensing and private vulnerability reporting. All prior roadmap goals remain. See docs/SQF-INCLUDE-EXPANSION.md.
