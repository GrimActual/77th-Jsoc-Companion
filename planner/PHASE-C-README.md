# Phase C — experimental simulated map

Version 2.9.0-sim.1 · 11 October 2026. This is a separate test build, not a replacement for the stable v2.8.2 release and not a live Reforger connection.

## Try it

1. Extract the entire `Everon-ORBAT-Phase-C-Simulation.zip` into a new folder. Run `Everon ORBAT Planner.exe` from that folder.
2. This build uses separate local storage (`Everon-ORBAT-PhaseC-Simulation`). Your regular operation is not automatically copied. If needed, export Project JSON from your regular planner and import a copy here, or import the included `feature-tour.json` from `resources/app`.
3. Open the gear → **Game Connection**, or click **SIMULATION OFF** above the map.
4. Check **Enable simulation**, then **Connect simulation**. Click **Fit simulated units** to see the demonstration area.
5. Cyan circles represent 100 moving synthetic units. A yellow circle represents a synthetic objective. These locations are artificial and do not identify real missions or players. Objective events and respawns are generated periodically.
6. **Show simulated layer** controls visibility. **Test interruption** demonstrates recovery; **Test worker failure** ends the worker and permits a fresh Connect. **Export simulation report** downloads counters and diagnostics without pairing tokens or unit positions.
7. **Disconnect** or disable simulation to clear temporary markers. Reloading or closing the app also resets simulation to OFF; it never reconnects automatically after startup.

Controls in Game Connection apply immediately. The update interval applies on the next Connect. Settings Save continues to control the ordinary planner preferences. Initial simulation interval is two seconds.

Sarge has a new searchable simulation topic and a **Show me where** button. The topic is available in English, French and German; experimental connection controls currently use English.

## Isolation and compatibility

The protocol/simulator runs in a worker thread. Main-process IPC accepts only specific simulation actions from the owned app window and validates worker frames before forwarding them. No arbitrary URL, file access or game command is exposed.

The map uses a separate non-interactive canvas layer. Simulated positions do not enter planned units, assets, routes, AO boundaries, JSON, CSV, autosave, undo history or presentation export models. Live-position import is deliberately absent in this milestone. Planned-map editing remains available with the simulation running or stopped.

Source files are isolated in `experiments/planner-phase-c`; stable source and releases are retained. Without the desktop API, the browser planner still works but simulation controls disclose that the experimental EXE is required.

This is an in-memory simulation. There is no Reforger/Arma 4 adapter, production authentication, remote network service or game-process access. The existing optional online terrain/Workshop features remain as before. Use General → bundled offline terrain for offline map imagery.

The demonstration's event history is bounded to 256 events. A prolonged session reaching the limit stops rather than silently dropping events; Connect starts a fresh demonstration. Existing plans stay safe. Diagnostics and security UX will be developed further in Phase D before any real-game proof of concept.

## Verification

- 80 automated checks pass: 45 existing planner checks, 32 bridge tests and three new IPC/worker lifecycle tests.
- Desktop test verifies OFF by default, 101 moving simulation entities, layer visibility, interruption/recovery, worker failure/reconnect, disconnect and reload cleanup.
- Plan snapshot and saved local-storage bytes remain identical during simulation. Undo/Redo still traverses the intended planned-unit edit.
- Exported Project JSON matches the saved plan. SVG preview includes planned units but no simulation circles or objective labels; the full export model remains unchanged.
- Desktop screenshot inspected for distinct symbols and visible simulation labeling.
- Packaged checks are repeated before delivery. Separate lifecycle check closes the EXE with a worker active and reopens the same profile with simulation OFF.

The bridge's earlier seeded soak results are included under `bridge/results`. They are accelerated virtual-time tests, not real-game or rendering performance claims. Other inherited documents describe earlier releases; this file describes the current experimental build.

## Development

`npm test` runs all 80 checks. Desktop test harnesses are retained under `A:/Everon-ORBAT-Development/work/test-phase-c.cjs` and `test-phase-c-reopen.cjs`.

New modules: simulation-main.js (worker and IPC ownership), simulation-worker.js (real-time simulation driver), simulation-layer.js (separate map layer), simulation-ui.js (connection settings and indicator). Existing main/preload, script loading, map boot and Sarge have small integration changes. The persistent project validator/schema is unchanged.
