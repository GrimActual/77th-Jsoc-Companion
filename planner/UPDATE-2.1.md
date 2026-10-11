# Everon ORBAT Planner 2.1

Replace your application with the entire extracted Windows folder. Keep your existing JSON exports. Schema version remains 4.

## Selection
- Left-click: select one object. Ctrl/Cmd-click: toggle an object.
- Drag empty map: select fully enclosed visible units, routes and areas. Ctrl-drag adds.
- Ctrl/Cmd+A: select units in enabled layers and phases (including units outside the viewport).
- Escape: cancel drawing and clear selection.
- Pan using WASD/arrows or Alt+drag; left-drag is now box selection.
- Delete/Backspace or Delete selected: delete only the selected group. One confirmation for five or more objects or a commander whose unselected children will become top-level.
- Ctrl/Cmd+Z restores the deletion as one action. Text fields keep their own keyboard shortcuts.

## Saving
Saved locally reports successful local autosave writes. A separate message identifies unfinished editor changes. Apply marker/style edits or finish placement/drawing before exporting.
Save Backup creates a unique timestamped JSON download. Backups and normal exports are checked against the import validator and 5 MB import limit before download. The app reports a download request, not an unverifiable guarantee that the OS completed the write.
This is a manual backup button; scheduled/rotating backups and automatic corrupt-storage recovery are not added.

## Source
Install dependencies with npm ci. Run npm start. Build with npm run package.
