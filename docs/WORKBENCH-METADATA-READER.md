# Selected Workbench metadata identity reader

Package 12 now has a bounded, read-only reader for the **observed identity fields** in readable `GameProject` and `MetaFileClass` text. It is source-only work following Preview 5. Existing preview archives and the desktop interface are unchanged; this is not a universal Enfusion parser or native importer UI.

## Supported subset

- `GameProject`: quoted ID, GUID and TITLE, plus a flat quoted Dependencies block. The addon GUID becomes the owner identity; version remains unknown rather than inferred.
- `MetaFileClass`: one quoted `Name` in `{16-hex-GUID}resource-name` form. The declared name must match the selected sidecar's addon-relative target path or basename. The resource classification comes from the existing index contract.
- Whitespace, UTF-8 BOM, line/block comments, quoted braces, escaped quote/backslash and bounded nested blocks are handled. Configuration bodies remain opaque and are never executed or interpreted as dependencies.
- Unknown top-level fields or unsupported structures/escapes are rejected rather than silently discarded. Other native text variants need new observed fixtures before support is expanded.

The pure reader is `planner/workbench-metadata.js`. The selected-file CLI is `planner/workbench-metadata-cli.js`. Each metadata input is limited to 128 KiB, 20,000 tokens and 64 nested block levels. The CLI accepts one explicit project file and up to 500 explicit sidecars; it never recursively scans, fetches dependencies, unpacks archives or writes source files.

Selected sidecars and existing target files are checked against the resolved project directory. Junction/symlink escapes are rejected at inspection. Concurrent hostile filesystem replacement is not claimed to be prevented by these path checks. UTF-8 decoding is strict; regular-file reads are bounded even if a file grows.

Resource IDs derive from addon and asset GUIDs, so changing the selection order does not change identity. Duplicate paths/GUIDs and combined documents still pass the resource-index validator before any successful output. A failure produces no partial output index.

## Observations and gaps

The CLI checks target presence and file size, without reading or validating native target contents. Missing targets stay `metadata-only` with `TARGET_MISSING`; regular files become `local-file`, with `EMPTY_TARGET` when their size is zero. Neither proves native loadability or server installation. The separate observation report preserves these warnings and flags `configurationInspected: false` and `resourceDependenciesInspected: false`.

Dependencies in the project are declared addon dependencies. Resource dependencies are **not extracted** from configuration text; the empty resource dependency list is not proof that a resource has no dependencies. The index audit covers only declared metadata and cannot establish complete native readiness.

Inspection of the user's actual addon found world GUID `0313BCE464A22D27` in `BridgeTest.ent.ent.meta`, owned by addon `6A969EB0C5012BB9`. Its target file exists but is **zero bytes**. This is recorded as an empty local target, not a valid/playable world. The declared game dependency is also an explicit gap in this partial catalogue. No files were repaired, overwritten or opened in the game.

Copies of the two observed text fixtures are under `planner/examples/workbench-metadata/`, with `.txt` suffixes to make clear they are parser fixtures. Their hashes, extracted index and observations are in `docs/test-evidence/workbench-metadata-observation.json`.

## Read-only CLI use

From the source `planner` folder, supply your selected project and sidecar paths:

```text
node workbench-metadata-cli.js "path/to/addon.gproj" "path/to/resource.et.meta"
```

The validated index goes to standard output; observations and audit gaps go to standard error. Redirect these separately if saving them. `npm run metadata -- <project> <sidecar>` invokes the same tool. The resulting index can be reviewed with the existing resource-index CLI or loaded into the desktop property review's optional source-index field. Its identities do not turn unsupported properties into supported engine commands. Do not use **Import plan** for an index.

Actual selected-addon output is retained locally at `A:/Everon-ORBAT-Development/work/workbench-selected-resource-index.json`, with the separate `workbench-selected-resource-observations.json` beside it.

## Verification — 13 October 2026

Eleven focused checks passed across the parser, selected-file boundaries, duplicate/unsupported inputs, strict UTF-8, junction escapes, stable IDs across file order, unknown/missing/empty target distinctions and actual observed text fixtures. The junction test required an unsandboxed disposable test directory because the sandbox blocked creating a junction; the tested reader rejected the escape. Changed CLI cases were rerun narrowly after stable-ID work, while unchanged parser gates were retained.

The synthetic supported-subset benchmark extracted and validated 500 sidecars in a mean **21.11 ms**, maximum **22.26 ms**, over five runs after one warm-up on Node v24.19.0. It measures metadata identity extraction without disk scanning or native target parsing. Evidence: `docs/test-evidence/workbench-metadata-performance.json`; harness: `planner/tools/benchmark-workbench-metadata.js`. There was no prior reader to compare, and no desktop rendering/storage code changed, so completed full Preview 5 tests were not repeated.

Settings and Sarge remain unchanged until an actual metadata selection/import UI is delivered. Native property translation, binary formats, component configurations and server validation remain separate adapter gates.
