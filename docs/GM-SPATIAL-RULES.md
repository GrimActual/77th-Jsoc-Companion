# Spatial scenario rules — 13 October 2026

Available in the GM development app, not yet in the existing Preview 2 ZIP.

1. Open a mission, then GM → Build a scenario.
2. Add an objective if your action needs one. Create an event and choose Trigger → Unit inside radius.
3. Select the named rehearsal unit; enter local northing/easting and a radius from 1 to 5000 meters. Select an action and optional completed-objective prerequisite.
4. Add event, then Start built scenario. Purple dashed circles show temporary zones. The visibility toggle hides both units and zones.
5. Advance simulated time or fire a movement event. When the unit is inside and prerequisites are satisfied, the spatial event fires automatically once. Undo reverses the command and its triggered consequences together; replay/recovery reproduces the same state.

This is an inside-radius condition, including units initially inside. It is not boundary-crossing detection and has no background live-game tracking. Automatic checks happen after explicit advances and, in version 2, after manual event actions. A paused clock cannot advance; manual GM actions still operate while paused. All conditions and prerequisites must be satisfied. Manual firing may override a timer, but not spatial conditions/prerequisites. Circles use the planner's local mission coordinates with no live-feed imagery offset.

Schema: scenarios with spatial conditions use version 2. Version 1 behavior is retained; old readers reject version 2 safely. A rule is {"type":"inside-radius","unitId":1,"center":{"lat":6450,"lng":6450},"radius":100}. Attach a conditions array (maximum 20, all required) to an event. atMs:null plus conditions enables automatic spatial checks; a numeric atMs requires both its time and conditions. Existing objectives, actions and stable mission unit IDs are reused. Builder adds one spatial condition; imported JSON may combine conditions.

Validation: 3 new pure tests cover triggering after movement, exact boundary, paused time, initially inside, blocked prerequisite, undo/replay, invalid centers/radii/units and version rejection. Actual Electron test covers authoring, invalid radius guard, version-2 scenario download, temporary zones, automatic trigger, undo/replay, layer visibility, explicit recovery and unchanged mission. Full regression transcript is retained in test-evidence/gm-spatial-regression.txt. The former unsupported-version test now uses version 99 because version 2 is intentionally supported.
