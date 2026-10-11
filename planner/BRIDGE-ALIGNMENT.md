# Live bridge imagery alignment correction
Game position reported by user: X 4241.47 / Z 9469.76, game grid 042 094, Meaux harbour.
The map provider uses an edge_to_center_offset of +50 m on both axes for gameCoordsToLatLng:
https://github.com/nickludlam/EnfusionMapMaker/blob/main/Web/reforger-map.js
The live bridge had plotted [Z,X] directly, omitting that conversion. It now plots [Z+50,X+50] and uses the same conversion when centering the map.
Raw world coordinates, relay payloads and project objects are unchanged. This fixes the live overlay only; existing map-click/project-coordinate conventions were not migrated. The map-pointer HUD can therefore differ by 50 m from the live marker's raw game coordinates. The live tooltip grid is calculated from raw coordinates.
Visual checks at multiple landmarks are still needed before declaring full terrain calibration complete.
