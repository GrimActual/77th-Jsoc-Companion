# v2.6.0 — SVG and presentation branding

The existing planner layout and v4 project format are preserved.

## Added
- SVG export for current view, full canvas or selected objects. Tactical geometry, text and military symbols stay scalable. Terrain and uploaded logos are embedded raster images. The file is self-contained.
- A collapsed Presentation branding section in the export dialog: export title, community/task force, operation date, PNG/JPEG logo or patch, watermark opacity and fictional exercise stamp.
- Branding works in PNG, JPEG, PDF and SVG; exact-file previews remain available.
- SVG as the default export choice in settings. French/German labels for the new controls.

## Reliability
- Fixed a shutdown race: closing the window during initial loading no longer opens a blocking startup-error dialog. The packaged EXE was closed and reopened three times with the same profile.
- All formats use the same drawing logic and visibility/selection rules.
- User text is XML escaped. Logos accept PNG/JPEG only, maximum 2 MB and 4096 pixels per edge, and are normalized to at most 512 pixels for export.
- Editing a branding field immediately invalidates the preview. Exports wait for logo loading; failed uploads clear the previous logo.
- Exporting does not change project data, selection or the live map.

## How to use
Open Presentation export, choose the format and scope, then expand Presentation branding. Title, date and logo need Include title and legend enabled. Preview and then Create export. Reset branding clears all custom export values.

Branding is retained only until the application closes, and is not stored in project JSON. The operation date is displayed as YYYY-MM-DD; an empty date uses the export timestamp. The exercise stamp is fictional. Per-unit patches and saved branding profiles are not part of this release. Raster terrain does not gain detail when an SVG is enlarged. PDF remains an image-based A4 document.

## Verification
- 33 automated tests passed (including two new startup/shutdown regression checks), covering project migration, asset preservation, geometry, editing, export selection, language settings, shortcuts and backend protections.
- Desktop export regression passed: PNG/JPEG/PDF, preview fidelity, current/full/selected scope, route-only/area-only exports, visibility, empty selections and offline terrain.
- SVG/branding desktop tests passed: valid XML, vector paths, embedded symbols/logo, Unicode and injection escaping, all four formats, corrupt/oversized/wrong-type logos, reset, transparent SVG, offline terrain and unchanged project data.
- SVG and PNG rasterizations were compared at equal dimensions; mean channel difference was below 0.1 on a 0–255 scale.

Builds and test artifacts are on A:/Everon-ORBAT-Development. Earlier releases remain available.

