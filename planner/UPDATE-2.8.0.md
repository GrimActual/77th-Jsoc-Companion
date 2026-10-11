# v2.8.0 — AO options and clearer exports

After injecting, Draw opens with AO options. Use checkboxes for any combination, Show all / Hide all, or Only this AO to isolate and frame one objective. Visibility is saved in JSON without deleting area geometry, and applies to map rendering, copied briefs and presentation exports. Undo restores visibility changes. Earlier builds can open plans but ignore the new hiddenAreas visibility field.

Map symbols shrink at wider zoom levels. Overlapping callsign labels are suppressed; hover still identifies units. Coincident map symbols can still overlap: use the export decluttering option for presentation images.

Presentation export now defaults to Spread overlapping units with position leader lines. Crowded symbols are separated on the exported page, with small dots/lines marking true positions. Uncrowded symbols stay put except where edge padding is needed. All units remain in the project at their real coordinates. This applies to PNG, JPEG, PDF and SVG. Turn the option off for exact symbol placement. Long callsigns are compressed to fit their allocated label width. Excessively crowded pages fail clearly instead of silently hiding units; export a smaller selection.

The original layout is retained with a compact AO section under Draw. New controls currently use English. This release does not add live server tracking.

Verification: 41 automated tests, actual-mod injection and filtering, JSON visibility round-trip, hidden-AO exclusion from exports, Undo/Redo, dense coincident display layout and four-format export regression including unchanged project coordinates.
