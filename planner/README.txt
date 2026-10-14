V2.8.1: See UPDATE-2.8.1.md. Scaling: Settings. Side missions: Draw. Clock and CSV: Brief.

EVERON ORBAT PLANNER 2.8.1 — COMMAND

START
Windows release: extract the entire ZIP and run COMMAND Planner.exe.
Source: install Node.js 18+, run npm ci, then npm start for the desktop app.
For the browser edition, run npm run server and open http://127.0.0.1:8787.
Leaflet and lower-detail Everon terrain are bundled for offline use.
Online terrain detail, Workshop and URL catalogs need internet access.

PRESENTATION EXPORT
PNG, JPEG, PDF and SVG are available with preview and current/full/selected scope.
Expand Presentation branding to add a logo, title, date, watermark or exercise stamp.
Save community defaults remembers the community name, logo, watermark and stamp on this device.
Operation titles and dates remain session-only; project JSON remains unchanged.
See UPDATE-2.6.1.md for release notes and verification.

Read QUICK-START.md for tool-by-tool instructions. feature-tour.json is an
optional sample plan, never automatically loaded. asset-catalog.json is empty:
only your imported catalog adds named assets. The JSOC crest is included unchanged.

NEW PLANNING TOOLS
- Bluefor, Opfor, green Independent/Guerrilla/FIA, and Civilian/Neutral factions.
- Custom HEX colors, native color pickers and presets for markers and drawings.
- APP-6 military vectors for 16 unit types, plus asset pictograms and text mode.
- Multi-waypoint paths with solid/dashed/dotted lines, thickness and arrowheads.
- Editable AO polygons, rectangles and meter-radius circles with translucent fill.
- Six/eight-digit local easting-northing grids, overlay and Discord brief grids.
- Two-point live distance/bearing ruler and total waypoint-path distances.
- Editable Phase I/II/III names, assignments and presentation visibility.
- Separate grid, units, routes, areas and callsign layer toggles.
- Expandable command tree with drag/drop and an accessible Reports to selector.
- WASD/arrow-key panning, Shift acceleration, +/- zoom, Enter to finish, Esc cancel.
- Session undo/redo, transactional import and browser-local saving.

FILE COMPATIBILITY
This version imports existing version 1-3 plans and exports version 4. The new
version preserves areas, full waypoint geometry, colors, phases and command
relationships. Older builds cannot open v4 files and should keep their old exports.
Existing marker IDs, asset names and embedded asset metadata remain preserved.
Legacy two-point routes become two-waypoint paths. All plan items, including hidden
phases, are exported. Copy brief uses visible phases. Layer switches only affect
the map. An old local save is backed up once in everonOrbat-v3-backup before migration.

CATALOGS AND WORKSHOP
Accepted catalog JSON: a raw array, {assets:[...]}, {mods:[...]}, or {game:{mods:[...]}}.
Each item needs a name; id/modId/workshopId supplies its stable key. Existing optional
category, type, symbol, image, author, version, description and searchQuery fields
remain supported. assetKind can explicitly set helicopter, infantry, lightVehicle,
apc, tank, truck, aircraft, boat, mixed or other. A recognized name may suggest a type.
Names cannot reveal every item in a large mod pack; set explicit catalog entries
for individual vehicles/equipment when needed. No demonstration mods are bundled.

Workshop links use the official HTTPS workshopUrl, then a 16-character hexadecimal
Reforger modId/workshopId, then a searchQuery or name search. A query is optional.
The metadata bridge is still a legacy Steam-only adapter. Reforger previews use
metadata supplied by the catalog. Set workshopProvider: steam for an ambiguous
all-digit 16-character Steam ID. Official Reforger links do not require a proxy.
Catalog choices are session-only. Saved marker assets survive replacement/reload
and are not silently added to new-marker catalog choices.

BACKEND CONFIGURATION
HOST: 127.0.0.1 by default; set 0.0.0.0 only when hosting beyond this machine.
PORT: 8787 by default.
ALLOWED_ORIGINS: comma-separated exact browser origins; default includes
http://localhost:8787,http://127.0.0.1:8787,null. null supports opening HTML from disk;
remove it for hosted-only deployment and add your exact HTTPS origin. * explicitly
opts into open CORS. CORS is not authentication.
RATE_LIMIT: 60 requests per socket IP per minute, default; forwarded IPs are not trusted.
UPSTREAM_TIMEOUT_MS: 8000 per Steam request, including body reading.
CACHE_TTL_MS: 3600000 (one hour). Cache limit: 1000 entries; atomic persistence.
Upstream concurrency: eight lookups, with duplicate-ID sharing; maximum body 2 MB.
GET /health and GET /api/workshop/{numericSteamId}[?refresh=1] remain supported.
Only the app's explicitly allowed public files are served; source/tests/cache stay private.

LIMITS AND VALIDATION
Plan/catalog upload limit: 5 MB; up to 10,000 units/assets, 3,000 routes, 1,000 areas,
30 phases and 30,000 total path/boundary points. Hierarchy depth is limited to 64.
Coordinates use the inherited Everon game-meter map transform. Grids are local
eastings/northings, not global MGRS; alignment has not been surveyed in a live game.
Bearings are clockwise from map north; distance is planar, without terrain height.
The ruler and circles do not compute ballistic solutions or safety distances.
See THIRD-PARTY-NOTICES.md and vendor/milsymbol-LICENSE.txt for library attribution.

TEST
Stop the server and run npm test. See TEST-RESULTS.md for validation coverage.


MOD AO IMPORT
Use Inject mod AOs with installed Invade & Annex - Reforged 1.0.66.
See UPDATE-2.7.0.md for pairing, coordinate and live-status limitations.

See UPDATE-2.8.0.md for AO selection and decluttered presentation exports.
