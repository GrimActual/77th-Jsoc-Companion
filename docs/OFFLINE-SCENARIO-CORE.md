# Offline scenario core — first increment

Audit: planner-core.js already validates/migrates missions headlessly; bridge simulation modules already separate transient states. Reuse those contracts rather than replacing the editor or live bridge. This increment adds scenario-core.js and a Node CLI. It is development source, not a change to the packaged v2.9.1 preview.

Run from planner/:

    node scenario-cli.js ../examples/OPERATION-SEA-SERPENT.json ../examples/SEA-SERPENT-SCENARIO.json rehearsal-journal.json 10000

The CLI validates the existing mission and scenario, advances ten simulated seconds, and creates a NEW journal file. Existing output files and source mission/scenario files are never overwritten. Inputs and output are bounded to 5 MB.

Scenario v1 has objectives and named events. An event has an optional atMs trigger (null means manual), required completed objective IDs, and typed actions. Actions currently allow objective status, movement of a known unit, phase selection, and text reports. No scripts, remote execution or game commands are accepted. The scenario's unit IDs use the exact existing mission IDs.

API: create(mission, scenario); dispatch({type:'resume'}), dispatch({type:'advance',deltaMs:1000}), dispatch({type:'pause'}), dispatch({type:'fire',eventId:'checkpoint_secured'}). state() returns an isolated synthetic snapshot; mission() returns the original validated mission. journal() contains the mission/scenario and ordered commands; restore(journal) checks those sources and replays transactionally. Failed commands or replay do not replace the last valid state. Journals are append-only through this API, not cryptographic audit logs.

Determinism means identical source data and command sequences produce identical states, without wall-clock timestamps or random behavior. Timed events execute at the end of each explicit clock advance; changing tick sizes may change report timestamps. No implicit real-time clock runs.

Delivered: headless reuse, versioned scenario/journal envelopes, allowlisted commands, objective prerequisites, deterministic triggers, source-plan isolation, replay and malformed-input checks.

Next: formal schema documents, GM desktop panel and transient map overlay, pause/reset/undo as audited commands, durable snapshot recovery and UI save/reload tests. The full integrated offline GM milestone is not yet complete. Existing mission-clock history remains a separate feature until an explicit migration is designed.

## Desktop continuation
The GM panel, transient rehearsal markers and journal replay slider are now implemented and tested. See OFFLINE-GM-DESKTOP.md. The remaining recovery/undo work is still pending.
