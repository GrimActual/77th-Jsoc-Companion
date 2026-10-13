# Reviewed deployment preview

## Desktop steps
1. Prepare reviewed prefab assets in Assets and assign them to planned units.
2. In Units, select 1–16 units. Open Deployment preview (also available through Settings and Sarge).
3. Load the matching resource index JSON, or use the reviewed metadata index in Assets. Enter heading in degrees.
4. Review selected units. Inspect world X/Z, GUID-qualified resource paths, source provenance and required addons. Missing dependency metadata remains explicitly flagged.
5. Export reviewed deployment JSON. Choose the destination in the native Save dialog. Plan, heading or index changes require a fresh review.

The selected units captured during review define this package. Later selection changes do not silently replace them. Mission coordinates map directly to world X/Z; terrain elevation is unresolved. This is intention-only export, with nativeValidationRequired true. It cannot spawn units or approve a server action.

The CLI remains available: `node deployment-cli.js mission.json index.json "[1,2]" 90 output.json`. Use actual selected IDs. Existing files are not overwritten. A server-reviewed execution adapter remains future work.
