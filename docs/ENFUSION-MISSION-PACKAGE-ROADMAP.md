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
