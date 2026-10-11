# v2.8.2 help verification — 10 October 2026

45 automated checks pass, including English/French/German topic coverage. Desktop checks passed: 23 topics, filtered search and no-results state, all new navigation destinations, accent-insensitive French search, Escape and typing guards, and unchanged plan snapshot. Desktop screenshot inspected. Packaged help test repeated before delivery; release builder checks ZIP CRCs and source SHA256 agreement.

# v2.8.1 verification — 10 October 2026

- PASS: 45 automated checks, including CSV assets/hierarchy/geometry/timer round-trip, malformed imports, scaling validation, prior editing/export/lifecycle/backend/translation coverage.
- PASS: packaged EXE reads the actual installed 1.0.66 mod in a background worker; 29 AOs, inherited Chotain radius, duplicate prevention, one-step Undo/Redo, AO chooser and visibility preservation.
- PASS: five actual-mod side-mission templates each placed as manual objectives, without injecting unwanted AOs or equipment assets.
- PASS: map scale preferences preserve plan coordinates and styles; native interface slider applies 125%; settings remain within the viewport and closable at 200%.
- PASS: mission clock start, event entry, pause, saved timing and reload persistence. Fixed clock actions switching to the selected unit's tab.
- PASS: CSV file downloaded, reimported unchanged, and malformed CSV rejected without changing the current plan. Assets and geometry round-trip checked in automated tests.
- PASS: packaged PNG/JPEG/PDF/SVG previews and downloads, with export symbol scale 150%, embedded branding, offline terrain, input escaping and unchanged project. SVG/PNG mean channel difference 0.065 in the comparison fixture.
- PASS: packaged native window close, app quit and three consecutive launches with the same profile; preferences and existing French/German labels survive reopening.
- PASS: browser server supplies both new modules with JavaScript content types.
- PASS: release builder checks ZIP CRCs and verifies every distributed source file against its SHA256 in both archives.

Visual checks inspected desktop screenshots. These are local fixture tests, not an assurance of zero bugs on every PC. No live game synchronization or geographic coordinate calibration was tested or claimed. XLSX, GeoJSON, KML/KMZ and MilX are not part of this release.

Desktop harnesses and screenshots are retained under A:/Everon-ORBAT-Development/work (test-new281.cjs, test-ao281.cjs, test-branding281.cjs, test-reopen281.cjs). Mod research remains outside release archives.

---
Previous release records follow.

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
