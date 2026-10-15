# COMMAND read-only terrain sampler (separate diagnostic addon)

This is a separate opt-in development tool, not the Workshop bridge update. It reads the currently loaded world's path and GetSurfaceY at up to 300 explicitly supplied coordinates. It does not create/delete/move entities, save the mission, scan players, send network requests or alter the production mod.

## Using it

1. In the new desktop candidate, prepare a migration draft and placement. Open Terrain identity and ground height. Enter the intended world's addon ID and qualified {GUID}Worlds/...ent resource, choose a height policy, acknowledge the review, then Preview planning placement.
2. Export terrain sampler query saves COMMAND-terrain-query.json through the native Save dialog. It includes the current selected unit/route positions, deduplicated exact coordinates and zero placeholders, not source altitudes or asserted ground heights.
3. Make an isolated development scenario/project that depends on this diagnostic addon and the intended world's addons, or add its Scripts/Game file to your isolated test project. Do not copy the empty-world test fixture into your real mission. Do not publish this tool over the Workshop bridge.
4. Put the exported query in that server profile's data directory as $profile:COMMAND-terrain-query.json. The explicit enabled:true flag is required. Use a fresh profile/output file to avoid confusing a prior report; a rejected query does not overwrite an older report.
5. Start your intended development world. One second after game-mode start, the server-only sampler reads the request, compares the loaded world path and writes $profile:COMMAND-terrain-observation.json. Wrong paths or invalid coordinates produce no new report. No client launch or public tunnel is required by the tool.
6. Load that report into Companion, review its origin/world/height policy and Preview again. Missing selected positions block sampled planning import. Remove/disable the query and stop the isolated server afterward.

The native check observes the loaded world path. Addon ID and GUID are still declarations from the query; the sampler does not independently authenticate them or prove that the world contains the Everon terrain shown in the planner. Imported JSON is not signed or authenticated live state. It does not prove terrain availability, current session identity, collision/building-floor placement, navmesh validity, freshness or safe spawning. Native world-GUID/authority enforcement remains a future bridge capability.

## Native evidence

The source compiled and executed in ArmaReforgerServerDiag 1.8.0.13 against a bounded isolated empty-world fixture. Two actual API values (-256) round-tripped through the desktop validator/schema. That fixture had no real terrain; these values are not Everon height evidence. A second negative check rejected a different expected world path and wrote no observation. Both diagnostic servers were stopped. No game client, tunnel or players were used.

Workbench PC/WORKBENCH validation attempts crashed at startup with access violation and no compiler stdout. They were not retried after the startup failure was identified, and the crash report was not submitted. Standalone diagnostic execution provides the actual Game-script compile/runtime evidence; Workbench validation remains unverified.

The initial runtime lookup tried Resource.Load on an absolute world filename, then on the declared scene resource. Those scene loads did not yield usable prefab resources. The final tool compares the engine-observed world path directly and explicitly keeps addon/GUID as declarations. It does not claim native resource GUID resolution that the test did not establish.

Primary API references: [Game.GetWorldFile](https://community.bistudio.com/wikidata/external-data/arma-reforger/EnfusionScriptAPIPublic/interfaceGame.html), [BaseWorld.GetSurfaceY](https://community.bistudio.com/wikidata/external-data/arma-reforger/EnfusionScriptAPIPublic/interfaceBaseWorld.html). Query/observation examples use synthetic identities; replace them with your own metadata.
