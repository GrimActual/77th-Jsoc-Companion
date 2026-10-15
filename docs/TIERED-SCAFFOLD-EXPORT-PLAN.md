# Tiered scaffold export — additive roadmap milestone

Requested 15 October 2026. This records the next emission workflow; the current Function Explorer remains read-only and does not deliver code generation or a Scaffold Mode toggle.

- **Green — verified emission:** require an implemented target mapping, proven required operand/signature/resource information and native validation for the supported family. Parsing an assignment, array or .hpp property alone never qualifies. Unknown context remains a blocker. The SQF converter currently has no general green Enforce emitter.
- **Yellow — review scaffolding:** retain structural context and generate only the supported structural envelope, with explicit warnings and source-linked implementation gaps. A function name does not prove its parameters or return type. Until those are established, use comment-only placeholders instead of guessed IEntity parameters, return values or behavior.
- **Red — manual body:** emit a located review placeholder and reason, preserving the original node/source reference. Do not silently omit unresolved scheduling, deletion ownership or multiplayer authority logic. waitUntil, deleteVehicle and remoteExecCall require family-specific review/adapters; their classification may improve only when evidence improves.

Review Mode remains the default. An explicit Scaffold Mode/export action will create files only in a user-selected output location. It will not overwrite source files, execute emitted code, launch Workbench or turn unresolved nodes into executable ones. .hpp properties need their own configuration mappings and validation.

Each export needs a migration checklist/manifest covering emitted, scaffolded and manual-only nodes: source file/line/span and identity/hash scope, node ID, classification evidence, output path/range, review reason, unresolved type/locality/lifecycle/resource requirements and native validation status. Include skipped bodies as entries so unsupported work stays visible. Keep third-party notices and rights attached to source-derived output. Reproducible identity and source mapping extend the existing compiler plan; source hashes are not authorship proof.

Implementation sequence: define tier decisions and checklist format; deliver a bounded comments-first scaffold export with explicit file creation and negative tests; then enable one green semantic family only after typed/native adapter gates and isolated compilation/behavior tests pass. Workbench remains the integration/compilation/runtime validation stage. No workload-reduction percentage or whole-mod equivalence is claimed.

This adds to the existing compiler stages and mission-planner roadmap; it removes no goals.
