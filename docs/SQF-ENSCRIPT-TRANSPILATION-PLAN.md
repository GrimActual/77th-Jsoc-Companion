# SQF to Enforce Script: implementation audit and additive compiler plan

Status checked 15 October 2026. This is an engineering plan, not a delivered compiler or a claim of equivalent gameplay. No existing migration or mission-planner roadmap goals are removed.

## What the current source actually does

| Stage | Current implementation | Boundary |
| --- | --- | --- |
| File ingestion | `planner/sqf-migration.js`: bounded SQF/SQM/EXT/HPP inspection, comments/strings/delimiters, source locations and command findings | Does not execute source, expand a full preprocessor or reconstruct Eden/SQM scenes |
| Asset mapping | `planner/sqf-class-map.js`: explicit reviewed class-to-prefab resource index mapping | GUID/addon/path provenance is retained; classname similarity does not establish equivalent assets or behavior |
| Parsing | `planner/sqf-intent-draft.js`: a small AST for literals, arrays, symbols, assignments and supported straight-line commands | Not a full SQF grammar, expression/type system or block parser |
| Neutral draft | Mapped `createUnit`, supported `createVehicle`, linked `doMove` and basic `addWaypoint` patterns, with literal bindings and source-local references | Emits non-executable JSON; mandatory review/blockers remain; unsupported statements clear inferred bindings and block dependent use |
| Planning transfer | `planner/migration-transfer.js`: reviewed mapped units and selected linked movement points, optional horizontal landmark fit and terrain observation provenance | Planning import does not reproduce source timing, functions, groups or native runtime execution |
| Native adapters | Explicit Companion spawn and bounded group AI order adapters exist separately | No general SQF code emitter connects arbitrary blocks to these adapters |
| Enforce Script output | No general `.c` generator in this migration pipeline | Full block transpilation has not been delivered |

Existing source-file SHA-256 values describe decoded UTF-8 text. They are not automatically hashes of original uploaded bytes, nor proof of native asset identity. Current draft schema explicitly requires `executable:false` and every intent remains `executionReady:false`. SQM/EXT/HPP remain inventory-only in the draft builder.

## Additive compiler stages to build

1. **Source/dependency package.** Preserve original bytes, encoding, source text and hashes. Resolve explicitly included files inside a bounded selected package. Inventory macros, configuration references and dependencies. Unsupported preprocessing must produce located findings; never execute `compile`, `execVM` or another source fragment to discover its meaning.
2. **Full syntax representation.** Introduce a versioned SQF syntax tree with expressions, code blocks, declarations, functions, conditionals, loops and source spans. Keep syntax recognition separate from permission to translate or execute. Preserve unsupported nodes and report exact locations rather than flattening them into unconditional actions.
3. **Semantic analysis.** Resolve scopes, local/global namespaces, function calls, entity/group identities, value types and side effects. Distinguish scheduled/unscheduled code and server/client/headless locality. Track ATL/ASL/world spaces, units, timestamps and dynamic values explicitly. Every unresolved condition, symbol or authority requirement remains a blocker.
4. **Typed intermediate representation.** Lower supported constructs into a neutral control-flow/entity graph, not string replacements. Nodes carry stable IDs, provenance, typed values, ownership requirements and effects. Represent sequencing, branches, loops, delayed tasks, event subscriptions and cancellation separately from spawn/movement intents. Model ordered blackboard/context updates; do not infer a behavior-tree path from an SQF behavior-mode label.
5. **Verified semantic adapters.** Maintain an engine-versioned command registry: source signatures, supported operand types, semantic differences, native class/API or prefab GUID bindings, locality and lifecycle rules, tests and confidence/status. Link compatible existing adapters; build the missing ones. Vehicle crews, seats, groups, triggers, event handlers, cleanup and scheduler semantics require their own adapters. Never replace an unavailable adapter with an approximate command silently.
6. **Enforce Script generation.** Emit `.c` classes/components and reviewed configuration/resource references for the supported IR. Generate initialization, authority checks, delayed execution, subscription cleanup and cancellation explicitly. Emit source maps and a per-node conversion manifest. Parser support alone must never mark a construct executable. SQF dynamic-code facilities and engine-specific commands without verified semantics remain unsupported/manual until separately implemented and tested.
7. **Validation and packaging.** Validate every emitted GUID/addon/path against the selected resources, terrain identity and target engine API. Compile in an isolated diagnostic project, then execute bounded native fixtures for each supported semantic family. Export a reviewable package with required addons, diagnostics, source maps, hashes and explicit remaining blockers; retain host/server approval at the execution boundary.

The broader goal remains full migration tooling, but an unconditional promise to convert every arbitrary SQF script is not established. A complete syntax parser can still leave constructs untranslatable until the runtime compatibility layer and native semantic adapters exist. Successful Enforce compilation is also insufficient to claim behavioral equivalence.

## Deterministic build identity

Use versioned, domain-separated SHA-256 fingerprints for source content, dependency/adapter manifests, asset mapping snapshots, target terrain policy, compiler options, compiler version and generated output. Define canonical field ordering, numeric representation and ordered versus unordered collections in the contract. Avoid build timestamps, machine paths or random IDs in reproducible output; runtime session IDs remain separate. Changing any semantic input invalidates a prior conversion review.

Stable IDs may identify compiler nodes/artifacts. They must not fabricate Enfusion resource GUIDs: native resource identity still comes from the engine/resource index. Hashes detect differences against an expected receipt; they do not authenticate who produced it. Signed/session-bound deployment authorization is a separate boundary. Deterministic generated bytes do not imply deterministic AI, physics or multiplayer runtime behavior.

The current terrain diagnostic demonstrates canonical query hashes, copied native-source hashes and exact report-byte hashes with change-detection tests. It does not implement compiler-wide fingerprinting or a signed deployment manifest.

## Acceptance gates for each semantic increment

- Positive and negative grammar/type/scope fixtures, including nested blocks, variable shadowing, Unicode strings and unsupported preprocessing.
- Golden generated output/source maps and reproducible builds across installation directories; changed dependencies/options must invalidate the review.
- Explicit fail-closed findings for dynamic code, unresolved targets, unknown commands and missing native adapters.
- Isolated native compilation plus bounded behavior tests covering authority, cancellation, cleanup, ownership and connection/world changes. Distinguish actual engine evidence from mocked contract tests.
- Offline desktop import/review, stale-context rejection, readable paged findings, unchanged mission state before approval, and atomic Undo/Redo where planning changes are imported.
- Representative parsing/generation/large-package performance measurements when those stages change; reuse passing gates until a relevant change or failure justifies another run.

## What comes next

Complete session-bound native world enforcement for the current migration/deployment path, while preserving the existing planning-only safeguard. Then introduce the versioned block syntax/IR contract and one deliberately bounded control-flow increment with its native adapter tests. Scheduling, events, locality, configuration reconstruction, vehicle/group semantics and broader command coverage remain explicit later increments. This document adds detail to the existing roadmap; it does not replace or reduce it.


## Structural SQF AST inspector checkpoint (unreleased)

Delivered a separate read-only structural AST worker/Assets inspector for nested brace conditions, code-scope exits, while, range/three-block for, forEach and stored code assignments. Source locations/hashes, opaque expressions, unsupported findings, paged safe display, guarded native JSON export, source-stale/cancellation gates and EN/FR/DE Sarge/Settings guidance are included. 27 focused checks, nine schema cases and actual offline desktop tests passed; a 1,401-node fixture prepared at 23.88 ms median / 27.55 ms p95, with same-fixture map frame/storage checks recorded. This is not the full grammar, semantic/type/scope analysis, typed IR lowering or Enforce code generation. Existing migration intents/deployment safeguards and all prior goals remain unchanged. See docs/SQF-STRUCTURAL-AST.md.


## Arma 3 PBO / WRP inventory and identity resolver (planned, separate pipeline)

Added docs/ARMA3-ARCHIVE-WORLD-INVENTORY-PLAN.md: read-only PBO manifest/prefix/compression inventory, streaming/canonical content fingerprints, config/CfgWorlds-to-WRP resolution, version-aware WRP metadata and optional object-reference decoding. Distinguish listed, header-inspected, decoded and unsupported evidence. WRP object lists require an actual decoder; config.bin is not SQF text. The current text/AST inspector does not support these binaries. Full terrain recreation into Enfusion remains a separate potential conversion workflow, not an inventory claim. Existing goals remain retained.


## Bohemia language reference and translation review gates

User-supplied reference: [From SQF to Enforce Script](https://community.bistudio.com/wiki/Arma_Reforger:From_SQF_to_Enforce_Script). Direct retrieval returned HTTP 403 during this checkpoint; this entry records the reference without claiming its contents were reviewed.

Related official guidance verified through indexed Bohemia documentation:

- [Enforce value types](https://community.bohemia.net/wiki/Arma_Reforger:Scripting:_Values): target identifiers are case-sensitive, values have declared types, and arrays have a single element type. Preserve SQF name identity through an explicit symbol mapping; do not derive target types from a single observed literal or silently coerce mixed arrays.
- [Enforce operators](https://community.bohemia.net/wiki/Arma_Reforger:Scripting:_Operators): target operator precedence follows C. Parse source expressions using verified SQF precedence and lower the resulting tree explicitly; copying expression text into Enforce is not a translation rule.
- [Enforce reference counting](https://community.bohemia.net/wiki/Arma_Reforger:Scripting:_Automatic_Reference_Counting): managed object lifetime depends on strong references, with cyclic ownership requiring care. IR and adapter reviews must specify object ownership and cleanup, particularly for delayed callbacks and subscriptions.
- [SQF variables](https://community.bohemia.net/wiki/Variables): source scope and binding analysis must precede target declarations. A structural block boundary alone does not prove a variable binding or an equivalent target scope.

These are implementation acceptance requirements, not newly delivered parser/type/lifetime capabilities. Keep expression recognition, binding confidence, target type resolution and executable adapter approval separately reported. Do not use DayZ-specific restrictions as Reforger evidence. Existing compiler and archive/world inventory goals remain unchanged.


## Bounded expression syntax core checkpoint (15 October 2026)

Added a developer-only, non-executable expression parser for literals, unresolved local symbols, arrays, grouping and basic arithmetic, with a separate numeric lexer and full-source span/hash binding. Unsupported syntax rejects without a partial tree. Desktop UI/export and native execution remain unchanged. Source scope/binding analysis, broader command/operator grammar, typed IR, validator/schema and subsequent UI integration remain pending; no earlier goals are removed. See docs/SQF-EXPRESSION-AST.md for scope and evidence.


## Source-linked semantic adapter requirements (15 October 2026)

Added a developer-only registry/review for 12 radio-relevant mechanic families with source hashes/locations, lexical-only evidence, documented target candidates, explicit unresolved names and lifecycle/behavior test obligations. Read-only radio sample: 80 occurrences, 12 families; zero implemented/native-verified adapters. 24 focused checks passed. No UI/game/export authority is added; source bindings/types, typed IR, native adapters and every earlier goal remain pending as applicable. See docs/SQF-ADAPTER-REQUIREMENTS.md.


## Source bindings, opt-in command syntax and value IR review (15 October 2026)

Added developer-only private/params/loop declaration evidence, conservative reference candidates and deferred-code barriers; an opt-in documented-arity command/comparison/logical parser; a partial source-value IR prototype; and reproducible folder review/integrity tools with EN/FR/DE developer guidance. 70 focused checks passed. The radio sample's 31 selected expression parts are now syntactically recognized by the extended profile, while types, effects, callback context and native behavior remain unresolved. Source files/audio remain untouched. Existing arithmetic output matches db6f9a1. No app executable, native mod, UI or deployment authority changes. Complete type/effect checks, typed statement/control-flow IR, strict UI/import contracts and native adapters remain unfinished; every earlier goal is retained. See docs/SQF-BINDING-VALUE-IR.md and tools/sqf-review/README.md.
