# Offline property adapter v1

The first property adapter translates explicit requests into **existing canonical planner-unit fields**. It is headless source work for the property catalogue/integration foundation, not a delivered native Enfusion property adapter or a new desktop control.

Current desktop: **2.9.1 Development 7**. Current consolidated release ZIP: **Preview 4**. Neither contains a newly exposed property-import UI. Sarge and Settings remain unchanged for this source-only increment; guidance must be added with a delivered UI rather than describing controls that do not exist.

## Supported translation

| Request property | Planner destination and rules |
| --- | --- |
| `name` | Existing unit name; text up to 10,000 characters |
| `strength` | Existing strength/notes text, same text limit |
| `side` | Exact planner affiliation: blue, red, green or neutral |
| `unitType` | Exact key in PlannerCore.TYPES; related display `type` updated consistently |
| `position` | Existing `{lat, lng}` local metre coordinate, each −500 to 13,500 |

For the current local-map contract, `lat` is northing and `lng` is easting. The example uses northing 9469.76 and easting 4241.47. This is not latitude/longitude in geographic degrees, a world transform, or an automatic native-axis conversion. New text values reject control characters. Unsupported enums are reported, not silently aliased to another unit type.

No adapter is provided for native components, class bindings, physics, resource spawning, AI, budget/supply fields, scripts, routes, hierarchy or engine transforms. Unknown property names become explicit blocking diagnostics. An unsupported field cannot sneak through as a generic component override.

## Review, then apply

`planner/property-adapter.js` exposes `review(canonicalMission, requestJsonText, optionalResourceIndex)`. Input uses schema `companion-property-request`, version 1; see `planner/examples/PROPERTY-REQUEST-V1.json` and the corresponding JSON Schema. Limits are 256 KiB and 1–1,000 changes.

The review returns two operations:

```javascript
const review = CompanionProperties.review(missionSnapshot, requestJson);
const diagnostic = review.report(); // detached source declaration, issues and before/after diff
if (diagnostic.canApply) {
  const nextDraft = review.apply(currentMissionSnapshot);
  // A future UI must explicitly install nextDraft through its existing authoring/history flow.
}
```

Review does not mutate or replace the mission. Apply returns a detached validated draft; it also does not install or save it. There are no file writes, automatic imports, background connections, game commands or rehearsal edits. The future UI must review these diffs explicitly and retain existing authoring/Undo behavior.

Every target must already exist. Numeric/string forms of the same unit ID identify the same target. Locked units are blocked; the adapter cannot unlock them. Repeated unit/property edits, invalid values, missing targets and unsupported fields block the **whole batch**. Any valid diffs in a blocked report are provisional diagnostics, not partial applied changes.

Apply checks that the entire canonical plan still matches the reviewed baseline. A changed plan requires a fresh review, including changes unrelated to the targeted unit. Report and returned-draft modifications cannot alter the closure's reviewed candidate. No-op requests remain valid but report `changed: false`.

The adapter requires a lossless canonical snapshot from the existing PlannerCore/importer. It rejects legacy or extra-field documents that normalization would alter, rather than quietly dropping their data. Routes, view settings, command relationships, embedded custom assets and untargeted units are retained.

## Provenance and availability

Each request declares a source label and optional resource index ID. An indexed source requires a valid resource document and an existing matching identity. Its declared resource metadata is retained in the review report. Source identity is a provenance link, not permission or proof that the source supports the requested native property. A manual declaration with no resource ID is allowed for offline authoring.

Provenance remains outside the resulting mission. The report never asserts server execution, native capability or actual file presence. Pairing codes, endpoints and credentials are not supported request fields. A complete native property adapter will need actual component/attribute mappings, typed values/units, target capabilities, authority checks and server acknowledgements.

## Verification — 13 October 2026

Ten focused Node tests passed: translation and preservation, all-or-nothing blocking, locks/missing/duplicate targets, value/bounds checks, malformed/oversized requests, stale plans, lossless canonical snapshots, detached results, no-op behavior, source identity and enum coercion rejection. Eleven independent wire-schema cases passed. The wire schema intentionally permits syntactically valid unsupported names so the runtime can report them; it does not replace runtime review.

`planner/tools/benchmark-property-adapter.js` reviews and applies 400 position changes on a 400-unit canonical plan, while checking source isolation. Five measured runs after one warm-up on Node v24.19.0:

- Request: 26,835 bytes; mission: 137,172 bytes.
- Review: mean 14.31 ms, maximum 18.12 ms.
- Apply: mean 10.81 ms, maximum 12.30 ms.

Evidence: `docs/test-evidence/property-adapter-performance.json`. This is a synthetic offline sample, not map FPS or engine/server timing. There was no prior equivalent adapter to compare. No unrelated completed map, bridge or native compile gates were repeated.

The next integration step is a review UI using existing authoring controls and history, followed separately by verified native property mappings. Neither is implied by these headless tests. Do not use the example request with **Import plan**: it is a property-review contract, not a mission file.
