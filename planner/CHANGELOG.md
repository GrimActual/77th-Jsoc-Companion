## v2.8.1
Scaling sliders, actual-mod side-mission planning templates, manual mission clock/event log, validated planner CSV and background mod reading. See UPDATE-2.8.1.md for scope and compatibility.

# Version 2.0.0 — tactical planning expansion

- Added green independent faction, faction-default colors, marker/drawing color pickers and HEX presets.
- Bundled milsymbol 3.0.4 with its MIT license. Added valid military vectors for Headquarters, Infantry, Motorized, Mechanized, Armor, Rotary Wing, Fixed Wing, Air Defense, Mortar, Artillery, Logistics/Supply, Medical, Engineer, Recon, Special Force and Other/Objective. Asset pictograms remain available.
- Replaced two-click routes with editable multi-waypoint paths, per-line thickness, solid/dashed/dotted strokes, and directional arrowheads.
- Added editable polygons, rectangles and circles with per-area color, opacity, phase and radius.
- Added local 6/8-digit grid inspection and brief export, a labeled grid overlay, live distance/bearing ruler, and cumulative route lengths.
- Added phase names and assignments, presentation visibility, independent layer toggles and visible-phase brief copying.
- Added expandable command hierarchy, drag/drop reparenting, Reports to selector, cycle/depth protection and safe parent deletion.
- Added continuous WASD/arrow panning and Shift acceleration with typing safeguards.
- Split controls into Units, Draw, Brief and Assets panels; retained the supplied JSOC crest and JSON-only equipment catalog.
- Added plan schema v4 and validated migration from earlier formats. New metadata survives export/import/reload and undo/redo.
- Kept previous backend rate limiting, CORS policy, upstream timeout, cache expiry and static-file restrictions.

Compatibility: earlier plans import; version 4 exports require this build. The app preserves a one-time backup of an older local save. Grid measurements use the inherited map-coordinate transform; no live game connection or surveyed alignment is claimed.
