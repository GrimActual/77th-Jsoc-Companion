# Presentation export — version 2.2

Project JSON keeps the editable operation. Presentation export creates a PNG, JPEG or single-page A4 PDF for sharing and printing. PDF orientation is automatic; PDF content is a raster snapshot, not editable vectors.

Open Presentation export in the top toolbar. Choose current map view, full Everon canvas, or selected units fitted to a view. Selected-unit export excludes routes/areas and requires visible selected units. Other scopes respect enabled unit/route/area layers and mission phases. Grid is independently selectable. Label visibility follows the editor.

Choose terrain, grid, title/legend, 1600/2400/3200 pixel width, and JPEG/PDF quality. Without terrain, PNG is transparent; JPEG/PDF are white. Terrain requires internet. Failed tile downloads stop export rather than silently omit map areas. The editor and JSON are unchanged. Apply unfinished edits before exporting.

Desktop: extract the complete Windows ZIP and run the EXE. Source: npm ci, npm start, npm run package. The desktop preload exposes only a restricted terrain-tile request; Node integration remains off. Browser image exports require the tile service to allow cross-origin images; turn terrain off if that service blocks them.

Verified: PNG/JPEG/PDF files, actual terrain downloads, current/full/selected scopes, plan/view/selection preservation, 3200px output, transparent pixels, custom pictograms/text, title toggle, empty selection, and simulated offline failure without a partial download. PDF parsed and rendered for visual inspection.
