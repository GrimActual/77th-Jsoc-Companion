# Reviewed deployment intent: offline pilot

This source-only CLI reviews up to 16 selected planner units against a resource index and emits a bounded JSON intention package. It preserves the mission, resolves asset ownership/dependencies, rejects unsafe paths and refuses export after the source mission changes. It does not spawn entities, import native layers or approve a server command.

Run from planner with Node: `node deployment-cli.js mission.json index.json "[1,2]" 90 output.json`. Use actual selected unit IDs. Heading is explicit, terrain elevation must be resolved by Enfusion. Existing output files are not overwritten. Native validation and an administrator-reviewed execution adapter remain future work.
