# Everon bridge B2 — recovery and fault simulation

11 October 2026. Isolated developer prototype, not a Windows planner update. B1 is preserved in its own folder. The v2.8.2 planner and saved plans remain unchanged. No real game connection or map display is included.

## Run

Node.js 18 or newer; no external packages or installation step required:

```
npm test
npm run soak
```

The soak script uses `node --expose-gc soak.js` to sample JavaScript heap after cleanup. It advances virtual time rather than running for 20 real hours. `npm run demo` retains the original simpler B1 demonstration; results/demo.json is its historical B1 result.

## Added in B2

- coordinator.js schedules bounded retries, sends/receives protocol acknowledgements and resync requests, pauses deltas during snapshot reconciliation, and automatically resumes after a valid snapshot acknowledgement. The source keeps authoritative current positions, generations and event history; snapshots capture these before resetting pending delivery.
- transports/fault-queue.js provides seeded in-memory loss, delay, reordering, duplication and corruption. Queue limits: 64 messages and 2 MiB. Clearing invalidates callbacks already removed for delivery, so stale queued packets cannot continue during recovery.
- policy.js filters position/upsert/delete/event updates before serialization using the same authority fixture allowlists as snapshots. Grant Sets are copied at construction; later changes to the caller's Sets do not change the active policy.
- Interruption or idle timeout automatically reconnects, up to three times within an explicitly started run. Every reconnect has a new session ID and token. Security lockout is terminal and never automatically reconnects.
- Quiet authorized feeds send heartbeats. Permanent loss or capacity exhaustion halts explicitly instead of retrying forever or silently dropping important events.
- tests/recovery.test.js and soak.js exercise recovery, filtering, repeated start/stop, fault injection and memory budgets. All B1 validation, codecs and bounded state remain.

No runtime experiment module accesses sockets, game processes, game APIs, HTTP endpoints or Electron files.

## Verification

32 tests pass: 20 foundation tests and 12 recovery tests. The soak completes 16,000 movement steps for 100 units in eight cycles. It represents approximately 20.13 aggregate virtual hours, with 100 events and 20 respawns per cycle. Intervals 1/2/5/10 seconds are each exercised twice. Fixed seeds introduce dropped, delayed and duplicated messages, and every cycle has an interruption. At the end faults stop and all permitted units, markers and events must converge exactly to source state, with no outstanding acknowledgements.

See results/soak.json for measured queues, heap and timing. Stop clears receiver state and transport queue and releases authority state. Post-cleanup garbage-collected heap growth must remain below 8 MiB. This is an accelerated JavaScript test, not renderer FPS, whole-process memory, real network latency, a 20-hour wall-clock leak test or anti-cheat validation.

The 1-second setting required more snapshot recoveries under injected delay than slower settings. Keep 2 seconds as the initial setting for later experiments; this is not a verified Reforger performance limit.

## Prototype boundaries

The driver explicitly invokes start/step/tick; there is no background service or autostart. Halt disconnects and clears the receiver but retains source state for diagnosis until stop. Stop clears all temporary state. Restart after lockout requires explicit stop/start or a new coordinator.

The source event journal is capped at 256 events. Exhaustion rejects the next update batch atomically and halts, retaining existing source events. Production sessions need a separately designed durable event archive and acknowledgement policy; this prototype does not silently roll off important events.

Mock tokens and grants are test fixtures, not a production handshake or game role discovery. The control path is trusted in-memory mock transport. There is no remote TLS, credential storage or dynamic grant-revocation protocol. To change permissions, terminate the old session and create a new coordinator with a fresh authoritative grant. A real adapter must enforce permissions at the game authority before sending data. Do not attach this experiment to an untrusted peer.

No saved ORBAT, autosave, undo history or project export is used. Coordinates remain synthetic local metres. Compression is synchronous in this Node harness and must move behind a worker boundary before UI integration.

## Next

Phase C: a separate experimental application copy with OFF-by-default simulation controls, a distinct temporary map layer and Sarge help. Verify saved-plan bytes, exports and undo history remain untouched through updates, failures and disconnects. Real Reforger integration remains a later authorized one-marker proof, requiring API, permission, payload and coordinate verification.
