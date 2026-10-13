# Resource index v1

Package 12 now has a headless metadata contract to support later asset import and Enfusion adapters. It is independent of mission/scenario JSON. The current desktop remains **2.9.1 Development 7**; no importer, Settings control, Sarge topic or native loader is delivered by this increment.

## What is recorded

`planner/resource-index.js` validates and indexes `companion-resource-index`, version 1. Addons own resource records; each resource retains an internal ID, addon-relative path, optional observed asset GUID, extension classification, provenance and declared dependencies. The canonical wire schema is `planner/schemas/resource-index-v1.schema.json`.

The example `planner/examples/RESOURCE-INDEX-V1.json` uses known addon identities and manually declared script/layout paths. Its layout GUID is deliberately unknown. It is a demonstration, not filesystem inspection or proof that those files are installed on a server.

`metadata-only` and `local-file` describe caller-supplied observations. Neither proves native validity, installed dependencies, runtime availability, licensing permission or server execution. Provenance and license fields retain declared information; they do not grant permission. The `.c`, `.gproj` and `.meta` record kinds do not claim target asset GUIDs: scripts are not registered assets, addon identity lives on the addon record, and a sidecar is distinct from its target.

## Validation and updates

- Unsupported versions, unknown fields, accessors, invalid ownership, addon dependency cycles and duplicate IDs fail closed. Version 1 is the first contract; it does not invent a migration from a nonexistent older index.
- GUIDs normalize to uppercase; path separators normalize to `/`. Duplicate path checks ignore case while preserving canonical spelling. Paths reject traversal, absolute paths, empty segments, control characters, reserved Windows names and ambiguous encoded/unsafe characters. This conservative contract is not a full native filename grammar.
- Resource GUID uniqueness applies within an addon. The same GUID in different addons stays ambiguous when ownership is unspecified; native override precedence is not guessed.
- The limits are 500 addons, 10,000 resources, 128 dependencies per record, 50,000 total resource references and **5 MiB including readable canonical serialization**. Whichever limit is reached first applies. Input files also have a 5 MiB cap.
- `replace` validates and compiles before swapping. `merge` accepts identical records and new identities, but rejects conflicting existing records or combined identity collisions. Failed operations preserve the last valid index. Dependency order differences count as merge conflicts; an intentional revision requires explicit replacement. Incoming merge documents must declare their resource owners.
- The JSON Schema describes canonical wire fields. Cross-record uniqueness, ownership, extension classification, path-segment rules, addon cycles and aggregate byte/reference limits additionally require the runtime validator. Schema validation alone is insufficient.

## Reference results

| Status | Meaning |
| --- | --- |
| resolved | One declared metadata record matches |
| missing | No record matches |
| missing-addon | A qualified owner is absent from this index |
| ambiguous | Multiple declared records match |
| conflict | GUID and path hints disagree with indexed metadata |
| unverified-guid | The path exists in the index but its asset GUID is unknown |

A GUID-plus-path reference must agree under this contract. A conflict is a metadata discrepancy; it does not claim that the native engine would reject a valid GUID with a stale path hint. Path-only resolution can match a script or unknown-GUID record without proving that a resource is registered or loadable.

Missing declared addon dependencies remain explicit audit gaps so a partial catalogue can be reviewed. `metadataComplete` means only that the declared dependency metadata resolves. It does not establish a complete asset catalogue, local file presence or server readiness. Resource-to-resource cycles may exist; the index resolves declared identities without recursively executing or expanding them.

## Read-only review

From the repository's `planner` folder, using Node:

```text
node resource-index-cli.js validate examples/RESOURCE-INDEX-V1.json
node resource-index-cli.js audit examples/RESOURCE-INDEX-V1.json
```

`resolve` also accepts a JSON reference containing `addonId`, `guid` and `path` (nullable values permitted, at least GUID or path required). The CLI outputs JSON, exits unsuccessfully on malformed input, and does not write, scan, fetch or load assets. Missing audit references are diagnostic results rather than parse failures. Do not import this resource-index example through the app's **Import plan** button; it is a different contract.

## Verification — 13 October 2026

Twelve focused Node tests cover round trips, input isolation, unsafe paths/fields, ownership, cycles, ambiguous/conflicting/missing identities, failed-update preservation, byte caps and CLI behavior. Thirteen independent JSON Schema cases cover the canonical wire shape.

The reproducible headless benchmark is `planner/tools/benchmark-resource-index.js`; evidence is `docs/test-evidence/resource-index-performance.json`. On this machine's Node v24.19.0, five measured runs after one warm-up gave:

| Synthetic catalogue | Mean build | Mean audit | Mean 1,000 lookups |
| --- | --- | --- | --- |
| 10,000 resources, no references, 3.55 MB serialized | 80.77 ms | 0.84 ms | 2.64 ms |
| 5,000 resources and references, 2.43 MB serialized | 60.10 ms | 13.03 ms | 2.28 ms |

These are bounded synthetic samples, not engine loading times or universal performance guarantees. No previous equivalent index existed for a before/after comparison. Completed unrelated map, bridge and Enfusion gates were not repeated.

## Next adapter gates

An actual metadata importer still needs bounded authorized file access, native-format fixtures, observed GUID extraction, target/sidecar distinction and provenance retention. Native/server resolution remains a separate verified adapter step. This module does not read `.meta`, unpack `.pak`, generate native layers, run scripts or send game commands.
