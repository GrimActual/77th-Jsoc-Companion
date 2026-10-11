# v2.4.3 — map rendering and responsiveness

This is a performance update before continuing the roadmap. The planner layout and v4 project format are unchanged.

## Changes

- Zooming preserves unit markers, route/area geometry and edit handles. Only arrowheads, which use screen-pixel sizing, are recalculated.
- Unit marker instances are reused during selection and editing. Only changed symbols, positions, labels and tooltips are updated. Removed/hidden units release their markers.
- Terrain detail requests wait until zoom animation finishes. Online requests are limited to Everon's bounds, with nearby tiles retained and the bundled lower-detail layer kept underneath. Wheel sensitivity/debounce reduces rapid intermediate zoom requests.
- Grid geometry uses one multiline path, reused until grid spacing or precision changes. Coordinate labels move without rebuilding all grid lines. Movement events share one grid update per frame.
- Cursor measurements and drawing previews update at most once per animation frame.
- Symbol cache eviction removes the oldest entry instead of clearing the entire cache. Repeated terrain-ready events no longer rewrite the same status text.
- Settings → General reports whether GPU compositing is active. The Windows test machine already had GPU compositing and rasterization enabled. Automatic driver compatibility handling remains in place; the app does not force unsupported graphics flags or change Windows GPU preferences.

## Verification

- 26 automated core, editing, preference, shortcut and backend tests passed.
- Desktop checks passed for group dragging, undo/redo, duplication, selection, locks, alignment, fit/briefing, typing protection and shortcut persistence.
- A simulated slow terrain source retained previously loaded imagery during zoom. Rapid zoom retained unit/route nodes. Failed online requests retained the bundled offline background. Plan data remained unchanged.
- PNG, JPEG and PDF exports passed, preserving project/view/selection. Four close/reopen cycles retained saved operation data.

### Controlled zoom comparison

400 units, offline terrain, six zoom changes, same machine and Electron runtime:

| Observation | v2.4.2 | v2.4.3 |
|---|---:|---:|
| Unit marker DOM removals during zoom | 2,400 | 0 |
| 95th-percentile frame interval | about 50 ms | about 17–33 ms in two runs |
| Frame intervals over 50 ms | 9 | 0–2 in two runs |

These are local measurements, not a guaranteed frame rate. Network tile detail still arrives asynchronously; a sharper map replacing a softer one is expected. Large plans, exports, drivers and display resolution still affect performance. This pass does not replace Leaflet with a WebGL renderer or claim that every operation is now GPU-computed.

## Install

Close the previous version, extract the entire Windows ZIP into a new folder and launch Everon ORBAT Planner.exe. Your local profile and manual JSON backups remain compatible.

Reference: Electron graphics status terminology: https://www.electronjs.org/docs/latest/api/structures/gpu-feature-status/
