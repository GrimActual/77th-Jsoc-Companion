# v2.4.2 — configurable canvas shortcuts

Open the existing gear → Keyboard Shortcuts. Edit an action's keys and click Save settings. Examples: Ctrl+B, ArrowLeft, Space. Separate up to three alternatives with commas; leave an action blank to disable it. Key names in these fields use the displayed English notation in every language. Ctrl also accepts Command on macOS; this release was tested on Windows.

Configurable actions: undo, redo, select all units, duplicate, copy, paste, delete selection, cancel selection/drawing, finish drawing, zoom in/out, Fit ORBAT, movement in four directions, and the hold-to-drag key. Movement and hold-to-drag accept unmodified letters, arrows or Space. Shift still speeds up movement. The letter-panning switch disables the letter bindings for directional movement; arrow bindings remain active.

Conflicting assignments, malformed bindings and reserved combinations are rejected before saving preferences. Reset shortcuts prepares the original bindings; Save settings applies them. Cancel discards pending changes. Older preferences receive the original bindings. Invalid stored bindings fall back to defaults without discarding other preferences.

Typing in text fields retains ordinary editing shortcuts. Movement stops on key release, window blur, text focus and dialog focus. Repeated keydown events do not repeatedly delete or duplicate objects.

The main layout, project schema, saved plans and imported assets are unchanged. Preferences stay local. Existing help describes default bindings and now points to the active shortcut settings.

Mouse gestures (Ctrl+click selection and Alt+drag), Shift speed boost, dialog Escape and fullscreen Escape remain fixed. OS/browser-reserved shortcuts are not remappable. Detailed validation messages currently remain English; setting labels and instructions support English, French and German.

Validation: 26 automated tests; desktop checks for custom bindings, persistence, typing protection, conflict rejection without partial writes, movement release/focus stop, reset semantics, translations and unchanged plan data. Existing desktop editor regression and language checks are also run on this release.

Install: close the old app, extract the entire ZIP into a new folder, then run Everon ORBAT Planner.exe. Keep your manual JSON backups.

Next roadmap task: presentation export improvements, beginning with selected-object exports and preview. SVG and branding remain pending.
