# v2.7.0 — Invade & Annex AO import

Use Inject mod AOs on the map toolbar. The desktop app detects the installed addon under Documents or OneDrive Documents; if absent, a folder picker asks for the addon folder containing meta and data.pak.

Paired to Workshop 65AF366F829759CB, version 1.0.66, mission {90F086877C27B6F6}Missions/JSC_IA_Eden.conf. Other versions are rejected pending validation.

Reads AO.layer and the inherited JSC_MissionArea prefab directly from the local archive. The inspected version has 29 enabled AOs, each with a 250 m gameplay radius. Chotain inherits its name/radius. Coordinates use world X as east and Z as north on the existing Everon map; elevation is excluded from the 2D circle. SphereRadius is an editor property and is not substituted for gameplay radius.

Orange dashed boundaries are added to the current plan, visible in the shared phase. Hover for names or select them in Draw. Existing objects remain; existing matching AO IDs are skipped, including edited ones. One Undo reverses the import. Normal JSON saving and presentation export include the imported areas. Use Fit ORBAT to frame the plan again.

This imports available AO definitions, not the live server's active AO, enemies or mission progress. Map alignment uses the existing planner transform and has not been compared against an in-game screenshot. No Workshop content or game scripts are bundled, modified or uploaded. The browser edition requires the desktop EXE for this button.

Verified against the actual installed mod: 29 circles, inherited fields, existing units/routes retained, repeated injection without duplicates, single Undo/Redo. The earlier planner features remain in this release.
