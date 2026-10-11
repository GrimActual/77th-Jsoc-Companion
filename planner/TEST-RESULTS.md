# Validation — 9 October 2026

**13 automated test groups passed, 0 failed.** Run npm test with Node.js 18+.

Covered: legacy-plan migration; full advanced-plan round trips; custom colors versus faction identity; east/north grid truncation at 100 m and 10 m; game-meter distance and cardinal bearings; all 64 military type/faction combinations; invalid/cyclic command relationships; rejected malformed imports; degenerate geometry and crossed polygons; phase-filtered briefs; preserved asset classification; view/style bounds; and backend CORS, methods, missing-file handling, cache expiry, lookup deduplication, refresh, timeouts and rate limiting.

**Real-browser integration passed** in headless Microsoft Edge at 1500×1000 and 390×844:

- Logo loading, new unit placement, independent faction, marker HEX color and phase assignments.
- Command-tree drag/drop, self/descendant cycle prevention and preserved parent IDs.
- Multi-waypoint paths, individual style updates, vertex dragging and appending waypoints.
- Arrowheads, polygon AO, rectangle AO, radius circle and numeric radius edits.
- Ruler bearing, grid precision, phase toggles and independent layer controls.
- Keyboard pan while zoomed in; typing does not pan.
- Advanced JSON export/import, rejection without mutation, and browser reload persistence.
- Legacy asset snapshots, official Workshop direct links, tooltip HTML escaping and invalid HEX handling.
- No uncaught page errors or horizontal mobile overflow. Desktop/mobile previews were visually inspected.

The symbol tarball's SHA-512 matches the registry's published integrity value. Terrain loaded during browser testing. Steam metadata responses were mocked for deterministic failure/cache tests. Grid placement has not been compared against live in-game control points; it follows the app's existing game-coordinate transform. Custom faction colors are game conventions, not strict standards compliance.
