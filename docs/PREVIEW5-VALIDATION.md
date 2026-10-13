# 2.9.1 Preview 5 — consolidated validation

Validated locally on 13 October 2026. This consolidates the post-Preview-4 authoring, draft history, preflight, resource-contract and property-review increments. It is a preview, not a stable release or Workshop publication.

## Run and use

1. Extract `Everon-ORBAT-Planner-2.9.1-Preview5.zip` completely into its own folder.
2. Run `Everon ORBAT Planner.exe` from the extracted folder. Keep your Project JSON backup before switching builds. Normal desktop preferences use the existing application profile; no live connection or saved rehearsal starts automatically.
3. For property review, choose **Units → Review unit property changes**, or **Settings → Game Master → Open unit property review**. Load a property-request file, expand the findings, then explicitly apply a valid batch. The matching source ZIP includes `planner/examples/PROPERTY-REQUEST-V1.json` as a format example; its unit ID must match your plan.
4. Use mission Undo/Redo for whole-batch edits and paired scenario-builder restoration. Active rehearsals stay unloaded. Export journals separately if needed.
5. Sarge has 44 topics in EN/FR/DE. Full workflow instructions: [unit property review](UNIT-PROPERTY-REVIEW.md), [draft editing](GM-DRAFT-EDITING.md), [draft history](GM-DRAFT-HISTORY.md) and [preflight](GM-SCENARIO-PREFLIGHT.md).

The source archive includes the same Cloudflared executable as the Windows build for the optional bridge. Source metadata/resource-index and property-request documents are distinct from mission plans; do not load them through **Import plan**.

## Full verification

- **159/159 automated tests passed**, no failures or skips. These cover planner/import/export, recovery, editing, simulation isolation, bridge validation/transport, scenario rules/replay/AAR, resources and property adapters.
- All five JSON schemas are valid; nine scenario/journal corpus cases, thirteen resource-index cases and eleven property-request cases passed independent schema checks.
- Actual Electron workflows passed: before/after review, all-or-nothing blocking, file loading, atomic unit/builder Undo/Redo including unapplied editor text, stale/manual-edit lockout, preserved unit IDs/embedded GUIDs/parent references, memory bounds, injected save failure, Unicode/script-like text and long-note layout, pagination, Settings shortcut and exact translated Sarge guidance while preserving valid request context.
- Thirty 400-change property batches and ninety Undo/Redo moves completed without mission drift. Three reloads and a complete app close/reopen restored the saved mission while clearing session review/rehearsal state. Simulation and bridge stayed disabled/off on startup. There were no captured renderer errors.
- Eighty tracked runtime JS/HTML/CSS/JSON files matched the tested development build before packaging. The unchanged native candidate hashes match the previous successful PC/WORKBENCH compile evidence; native compilation was not needlessly repeated.

Evidence: `docs/test-evidence/preview5-validation.json`. Desktop profiles were isolated from normal user plans and settings. The harnesses are under `planner/tools/`.

## Performance and stability limits

The same dense fixture used 400 planned units, 400 synthetic temporary rehearsal positions and 200 events, with overlay updates every 200 ms and a timed map-pan sequence. Both samples used offline terrain and reduced motion, with 400 marker elements and two terrain tiles.

| Eight-second sample | Preview 4 | Preview 5 code |
| --- | --- | --- |
| Average FPS | 53.75 | 55.25 |
| 95th percentile frame | 23.7 ms | 22.6 ms |
| Maximum frame | 72.8 ms | 98.5 ms |
| Frames above 100 ms | 0 | 0 |
| Reported JS heap | 15.2 MB | 17.1 MB |

Mission data remained unchanged by the temporary overlay. The stability cycling lasted about 18.9 seconds; sampled reported JS heap stayed at 17.1 MB with collection requested where available. These are short, bounded synthetic checks, not a long-duration leak proof, real-server load test or causal speedup claim. Frame timing and heap reporting vary with hardware, warm-up and other applications.

The first test harness dispatched synthetic keyboard events on `document`, producing two baseline-only target errors. Dispatch was corrected to `document.body`, matching the DOM element target expected for real keyboard input; the reported comparison uses the corrected clean runs. An optional screenshot capture later timed out; its test was replaced with a direct long-note overflow assertion. Neither required a product behavior change, and the final workflow gates passed.

## Remaining release/integration limits

The desktop executable is **unsigned**; its file hashes establish integrity, not publisher trust. This preview is not uploaded by the local packaging step.

Dedicated runtime, real server acknowledgements, Workshop candidate packaging, native `.meta`/`.et` parsing and writable component/property adapters remain unverified or unimplemented. Existing host-local bridge validation does not establish those capabilities. No game server or GeForce NOW session was launched during this pass.
