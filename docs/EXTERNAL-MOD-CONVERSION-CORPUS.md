# External mod corpus: author-operated conversion pathways

## Product destination and current boundary

COMMAND's intended workflow is self-service: an author selects their own loose mod/mission files in the app, gets a bounded dependency and capability report, supplies or approves asset mappings, reviews generated candidates, and exports a package for isolated native compilation and behaviour checks. The user reaffirmed this on 15 October 2026. These test subjects inform that workflow; the deliverable is not a collection of bundled converted third-party mods.

The current desktop inspector and developer folder-review tools are separate capabilities. The later binding, command-expression, source-shape/effect and review-bundle tools tested here are source-only developer tools. This checkpoint does not expose them as a new in-app converter. Whole-mod conversion, full preprocessing, typed statement/control-flow IR, Enforce generation and verified mechanic adapters remain unfinished. Existing bridge behaviour and deployment guards remain in place.

## Capture and reproducibility

The user reports permission from the author to use these projects as test subjects. The public A3-Root account catalogue returned 20 repositories. All 20 tree inventories were captured without truncation; five priority repositories supplied six script samples each. Priority source snapshots are pinned to commit SHA and each raw download was matched to its Git blob ID, byte count and SHA-256. The other projects are tree-metadata inventories only. Fork origin/licence metadata is retained; this is not a complete third-party rights audit or permission to redistribute dependencies.

Small ordinary UTF-8 SQF blobs were selected deterministically by SHA-256 of the path, choosing distinct parent directories first. Bounds: 200–32,768 bytes per file, path length at most 220 characters, six samples per priority project. This intentionally samples different folders; it is not exhaustive or statistically representative coverage. Repository directory names, source paths and byte hashes are retained as provenance. Includes, PBOs, binary models, audio and textures were not downloaded as dependencies, extracted or executed. Captured script bytes were unchanged after review; upstream repositories were not modified.

Private capture, scripts and reports: `A:/Everon-ORBAT-Development/work/root-corpus-20261015`. Public aggregate evidence without script bodies: `docs/test-evidence/root-corpus.json`. Each sample has a version-4 review bundle and its independently retained fingerprint. The harness used the original upstream relative filename, not the local fixture placeholder, for report source identity. No source was run, preprocessed, compiled or sent to a game server.

## Actual static results

All 30 samples produced bounded review bundles and passed the existing integrity verifier, including strict source-semantics validation. All original byte comparisons matched. These are 30 corpus review cases, not 30 new unit tests or proof of semantic conversion. Existing unrelated passing suites were not replayed.

| Repository | SQF samples | Recognized selected expression parts | Unsupported selected expression parts |
| --- | ---: | ---: | ---: |
| 77th-JSOC-Missions | 6 | 170 | 187 |
| Advanced-Equipment | 6 | 16 | 13 |
| Root_Anomalies | 6 | 11 | 23 |
| Root_Cyberwarfare | 6 | 39 | 45 |
| Root_Effects | 6 | 12 | 14 |

Totals: 248 recognized and 282 unsupported selected expression parts. Opaque statements and code bodies are not thereby fully analyzed. No known operand-shape mismatch was found in the recognized subset; unknown operand types, source contexts and unsupported commands remain unresolved. Structural reports retain 21 preprocessing findings and nine unsupported-control findings. Unsupported-expression diagnostics include missing verified command/namespace signatures (175), unconsumed/unsupported syntax (74), closing-parenthesis expectations within the limited grammar (32), and an unsupported token (one). These diagnostics describe parser limitations, not necessarily errors in the original mods.

One sequential review/write/verify pass took about 1.92 seconds for the 30 samples (113,308 source bytes), excluding capture. This is a single mixed cold/warm development sample, not a comparison, app performance guarantee, game tick measurement or whole-mod conversion benchmark. No renderer, app storage or live traffic changed, so no unrelated FPS claim is made.

## Pathways these fixtures require next

1. **Source inventory and virtual paths.** Retain addon roots, declared dependencies, original paths and case policy. Resolve relative includes and Arma virtual prefixes against an explicitly selected local source set. Missing includes remain missing; do not turn an Arma virtual path into unrestricted local filesystem access. Inventory configuration separately from SQF grammar. Preprocessor expansion needs its own bounded, source-mapped stage.
2. **Macros, registrations and calls.** CBA/HEMTT-style FUNC/GVAR/QGVAR/EFUNC families, XEH registration and named function calls occur in the samples. Collect definitions and dependency requirements before resolving a call target. A lexical name match does not prove a signature, dependency availability or Enfusion equivalent. CBA/ACE/BIS functions need explicit adapters or unresolved findings.
3. **Execution context and lifetime.** Remote calls, events, deferred work, UI callbacks and effect start/stop ownership require typed locality/scheduling/lifetime IR. Preserve server/owner/client authority, cancellation and cleanup. Game-themed cyberwarfare and equipment filesystem logic remain source data, not requests for external access or host commands.
4. **Coordinates and resources.** Position commands such as getPosATL expose coordinate/elevation semantics. Carry terrain identity, coordinate frame and height policy into reviewed target transforms; do not apply a blanket axis swap. Map config classes/resource identities to reviewed Enfusion prefab/component paths independently of script syntax. A source path is not a native GUID.
5. **Author-facing app integration.** Add folder intake and dependency findings, mapping review, conversion readiness per feature, paged diagnostics and explicit export gates. Update Sarge, Settings entry points and EN/FR/DE guidance when those user-facing pieces ship. Keep this additive to the existing mission planner, native adapters and archive/world inventory roadmap.

Priority source references: [Root Effects](https://github.com/A3-Root/Root_Effects), [mission collection](https://github.com/A3-Root/77th-JSOC-Missions), [Root Anomalies](https://github.com/A3-Root/Root_Anomalies), [Advanced Equipment](https://github.com/A3-Root/Advanced-Equipment), [Root Cyberwarfare](https://github.com/A3-Root/Root_Cyberwarfare). Exact historical repository names are provenance, not COMMAND branding.

Additional catalogue candidates include AdriansArmaDeWrp, bis-file-formats, RAMET, grad_meh and ocap-renderterrain for the separate terrain/archive inventory track; Root_AdaptiveDetectionSystem and Root_AIProneFix for later AI-context fixtures; and Reforger-TrainingGround for native resource structure inventory. These are candidates from tree metadata and repository descriptions, not reviewed implementations or validated adapters. PBO/WRP identity work stays separate from SQF conversion and does not imply automatic native terrain reconstruction.
