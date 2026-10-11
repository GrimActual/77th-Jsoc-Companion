# B1 verification — 11 October 2026

20/20 tests passed with Node's built-in test runner. No third-party dependencies or external network were required. Test implementation: ../tests/bridge.test.js.

The resync regression test found an important distinction: acknowledging an already-seen packet must not mark a receiver as connected while it is waiting for a fresh snapshot. The fixed receiver remains synchronizing until that snapshot is accepted.

The demo drives real codec, batcher and receiver modules with 100 simulated units through 1,000 revisions over 2,000 seconds of virtual time. It records 50 objective events and exercises respawn every 100 steps. Peak queue values and measured traffic are saved in demo.json. This is an accelerated deterministic run, not a real-time network or renderer benchmark and not a memory soak test.

No game APIs, PAK modifications, planner release changes or saved-operation migrations were performed. No real-game compatibility is claimed. The prototype remains separate from v2.8.2.
