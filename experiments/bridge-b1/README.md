# Everon bridge B1 — isolated experiment

Built 11 October 2026 after approval of the Phase A proposal. This is a developer prototype, not a new Windows planner release. v2.8.2 and its saved data remain untouched. No game connection, listener, process inspection, external requests or renderer integration exists in this folder.

## Run

With Node.js 18 or newer installed, open a terminal in this folder:

```
npm test
npm run demo
```

No npm install is needed: there are no external dependencies. The demo runs accelerated virtual time and prints a JSON summary. It is not a map display and does not require Reforger. Files in results record the verified local run; timings are specific to this machine.

## Implemented

- Strict everon-bridge-v1 envelopes and payload validation: snapshots, delta batches, acknowledgements, resync requests and heartbeats. Unknown fields and modification commands fail closed.
- JSON plus optional gzip/base64 encoding, strict base64 and UTF-8 decoding, compressed-wire and decompressed-output limits. Compression only when it reduces a sufficiently large payload.
- Atomic temporary state, revision/session checks, duplicate fingerprints, delete/respawn generations, bounded event history and explicit resynchronization states.
- Latest-position coalescing between event/lifecycle barriers, ordered important events, retained immutable retry messages, exact acknowledgements, bounded queues and adaptive slowdown when unacknowledged batches accumulate.
- Disabled initial connection manager, explicit mock connection, mock pairing-token checks, bounded traffic, idle timeout, repeated-violation lockout, disconnect cleanup and redacted diagnostic counters.
- Authority-supplied snapshot allowlist filtering fixture and read-only command policy. Every role remains read-only. Restricted fixture records are removed before serialization rather than just hidden in the UI.
- Deterministic synthetic positions for 100 units, a marker, periodic objective events and unit deletion/respawn. Synthetic local coordinates are clearly labeled and not verified game-world positions.

## Module map

| File | Responsibility |
|---|---|
| protocol.js | Types, allowed fields, data validation, limits |
| codec.js | Bounded encoding/decoding and envelope construction |
| sync-state.js | Temporary state, revision checks and atomic apply |
| batcher.js | Coalescing, acknowledgements, retries and backpressure |
| connection-manager.js | Mock connection lifecycle, validation and isolation |
| diagnostics.js | Bounded grouped diagnostics and traffic totals |
| policy.js | Authority fixture filtering and rejection of game commands |
| transports/mock.js | In-memory delivery and interruption |
| adapters/simulator.js | Deterministic moving units and objective events |
| tests/bridge.test.js | Fault cases and integration checks |
| demo.js | Accelerated 1,000-batch demonstration |

## Prototype limits

Current experimental budgets: 256 KiB final message, 1 MiB decompressed payload, 1,000 combined entities, 250 updates/batch, 256 events, 1,000 pending updates, eight unacknowledged batches, 200 diagnostic entries. Receiver permits at most 20 messages and 512 KiB per one-second window. These are chosen test budgets, not verified Reforger transport limits.

Interval options: 1, 2, 5 or 10 seconds. The mock driver supplies time and invokes flush/retry/tick; there is no background scheduler. Retry exhaustion blocks and retains unacknowledged batches. Queue/event exhaustion explicitly requires a fresh authorized snapshot. The caller must reconcile against authoritative state before resetting the sender; reset must not be used to silently discard important unsaved events. The demo acknowledges every batch; fault tests deliberately omit delivery/acknowledgements.

The connection manager returns resync status/reason to its driver. It does not yet automatically request and reconcile snapshots through a transport scheduler. The codec supports the resync envelope for that next step. The simulator demo uses one session; explicit reconnection, failures, out-of-order data, malformed packets and overload are exercised in tests.

Mock token matching is a test boundary, not a production authentication handshake. There is no secure credential storage, remote TLS, authenticated game authority, role discovery or real transport. Snapshot allowlist filtering is a fixture; a future adapter must apply authorization to every delta/event as well. Do not attach this prototype to an untrusted network.

Compression currently executes synchronously in this isolated Node harness. Before UI integration it belongs in a worker. The 1,000-batch result does not measure rendered FPS, real latency, game scripting performance or anti-cheat compatibility.

No planned ORBAT objects, autosave, undo/redo, existing exports or saved schema are imported or modified. The experiment uses its own temporary Maps and arrays. Live-layer integration requires separate application compatibility tests before release.

## Verified tests

20 tests pass: codec round-trips, malformed metadata/JSON/base64/gzip, UTF-8 rejection, decompression limits, unknown/prototype fields, atomic apply, duplicate/stale/missing revisions, session changes, delete/respawn identities, ordered events, coalescing, retained retries, acknowledgements, backpressure, queue limits, timeout, lockout, redaction, restricted snapshot filtering, and a 200-batch simulator integration test.

Additional demo: 1,000 batches, 100 units, one marker, 50 objective events and 10 respawns; successful disconnect clears receiver state. See results/demo.json for measured totals. The 45-test planner baseline passed in Phase A; it was not rerun here because no planner files were changed.

## Next milestone

Phase B2: implement an explicit mock scheduler/resynchronization coordinator, authorization on delta/event output, delayed/reordered transport queue, and repeatable longer fault/soak runs with bounded memory measurements. Then Phase C can add an OFF-by-default simulation layer in a separate app copy, plus connection controls and Sarge instructions. Real Reforger research stays later: exact-build API behavior, permission authority, payload limits, coordinates and multiplayer compatibility are still unverified.
