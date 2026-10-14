# COMMAND 2.9.1-dev.gm.7 — migration foundation and tactical controls

## Start the app

Extract the entire Windows ZIP. Close the older Companion before switching builds. Open COMMAND Planner.exe inside COMMAND-Migration-Foundation. Existing saved profiles and plans retain their compatibility identifiers. Back up your current plan before changing builds. The earlier test copy has not been modified.

## Arma 3 migration workflow

1. Open Assets → Arma 3 migration review (also available through Settings → Game Master).
2. Drop selected SQF/SQM/EXT/HPP text files onto the drop area or select multiple files.
3. Review paged findings, literal positions, unresolved classes and referenced scripts.
4. Export migration review JSON for conversion work. No mission changes or game actions occur.

The scan ignores comments and strings containing command names. Findings record source file, line and column. doMove/addWaypoint suggest the exact indexed native Move waypoint, with explicit semantic differences. Arma 3 class names are not guessed into prefab paths. Literal coordinate reordering is advisory and terrain validation remains false. Unsupported/dynamic commands require review. A scan with no findings does not mean conversion is complete.

This is a bounded lexical migration foundation, not a full SQF compiler, SQM scene importer or universal translator. It does not unpack PBOs, evaluate scripts, expand macros/includes, generate executable Enforce code, execute bridge requests or export native scenes. Explicit asset mappings, supported-pattern AST/symbol resolution, terrain calibration, neutral intents and native export/validation are additive next milestones. Nothing was removed from the roadmap.

## Native tactical controls carried into this release

Move/timed Hold plus previously source-tested timed Defend and cancellation of Companion-owned movement are included. Only eligible bridge-created infantry AI groups are supported. In-game host approval remains mandatory. Matching Workshop 0.6.0 is needed for Defend/cancellation; migration review itself needs no mod. The clean project is supplied for the user to publish. No automatic Workshop upload was performed.

## Validation and limits

All 226 regression tests passed. Native JSON Save, 40-row paging and the Settings shortcut passed in the final offline package with automated file-dialog selection and a real filesystem write. An interrupted Blob download found by the export gate was replaced with the validated native Save path.

Actual offline Electron file selection/drop, worker scanning, rejected-import retention, EN/FR/DE review retention, malicious-looking names displayed as text and unchanged mission state passed with no renderer errors. Sarge and Settings are synchronized. The fixed native scripts retain prior PC/Workbench and bounded native-server tests; no repeated game launch was needed. Bounded native waypoint acceptance/binding is not proof of arrival or extended scenario stability.

Twenty files containing 800 recognized command findings (31,800 bytes), ten warmups and fifty headless scan samples: median 2.43 ms, p95 4.89 ms, max 6.55 ms on this PC. This measures lexical inspection only, not complete mission conversion, app FPS, network latency or total RAM. UI processing uses a background worker and pages 40 findings. It performs no mission writes.

See Documentation/SQF-MIGRATION-FOUNDATION.md and the included sanitized test evidence for details. Windows/source/Workbench ZIPs and SHA-256 checksums accompany the GitHub development prerelease.
