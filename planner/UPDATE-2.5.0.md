# v2.5.0 — presentation preview and selected-object export

The main planner layout and project JSON format are unchanged. This release continues the presentation/export roadmap after the v2.4.3 performance update.

## Using it

1. Select units, routes or areas with Ctrl+click, or use a selection box.
2. Open Presentation export. Choose Selected objects — fitted view, Current map view or Full Everon canvas.
3. Choose PNG, JPEG or PDF, background/grid/title options, width and quality.
4. Click Preview. This renders without downloading a file. PNG transparency is shown against a checkerboard. PDF preview includes the A4 page margins and the JPEG image that the PDF contains.
5. Click Create export to download. With unchanged settings and plan/view/selection, it uses the same prepared file. A preview is optional; Create export also works directly.

Changing an export option clears the old preview. Closing the dialog releases the prepared file and preview. Preview and export temporarily disable the dialog controls while rendering.

## Selected objects

Selected units, routes and areas are all included. Route-only and area-only exports are supported. Bounds include every route waypoint, rectangle/polygon vertex and the complete radius of circles, plus padding. Selection IDs are distinguished by object type.

Hidden phases and disabled layers remain excluded. If no selected object is visible, an error is shown and no file is generated. Existing custom colors, line patterns, arrowheads, symbols and embedded unit assets retain the existing export rendering.

Exports include committed changes only. Unapplied edits and unfinished drawings are not included. The planner's saved data, selection and map position are not modified by the exporter.

## Verification

31 automated tests passed. Desktop export tests covered mixed, route-only, circle-only and empty selections; PNG preview/download byte equality; JPEG/PDF creation; unchanged PDF bytes when downloading the cached preview; preview invalidation/cleanup; full/current offline exports; and French/German controls. The main editor regression was also checked. Packaged Windows export tests were run before delivery.

## Still pending

SVG, custom branding/logos/patches, operation date controls, watermarks and fictional classification stamps remain on the presentation roadmap. Generated export legend labels remain English. PDF remains an image-based document, not editable vector artwork. Independent native-language review is still pending.

## Installation and location

Extract the entire Windows ZIP into a new folder and run Everon ORBAT Planner.exe. Keep a manual JSON backup of important operations. Local preferences and saved plans remain compatible.

New development files, temporary tests and release files live under A:\Everon-ORBAT-Development. Existing releases and the application data profile were not moved or deleted.
