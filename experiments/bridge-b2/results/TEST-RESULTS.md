# B2 verification — 11 October 2026

32/32 tests passed: retained B1 checks plus automatic initial snapshot/ack retry, out-of-order resynchronization, duplicate handling, reconnect, authorization filtering, terminal lockout, bounded permanent-loss recovery, queue limits, stop cleanup, event-capacity failure, quiet-feed heartbeats and copied grants.

Eight seeded 2,000-step runs use 100 units, one marker, 100 events and 20 respawns per run. Approximate fault mix: 1% loss, 3% delayed by 4.5 seconds, 1% duplication. Each run also interrupts once. All runs converge exactly to the authorized source after faults end, with no unacknowledged batch remaining.

Heap measurements after cleanup and garbage collection are in soak.json, against an 8 MiB growth budget. The aggregate simulated duration is about 20.13 hours, executed in seconds rather than real time.

Corrections during development: the out-of-order test now delays retries of the same message too, preventing a retry from repairing the gap before a snapshot is needed. Reconnect statistics now count only performed reconnects. Queue peaks capture pending data before flushing.

No real game transport, renderer, multiplayer or production authentication was tested. Working v2.8.2 source is compared with the archived release before delivery. The original B1 demo result is retained separately as historical evidence.
