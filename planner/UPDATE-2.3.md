# Version 2.3 — Settings

The gear at the top-right of the map opens Settings. The map, roster, toolbar and original CSS layout remain in place. Default preferences retain the original appearance. Cancel discards preference edits; Save settings applies them locally. Reset preferences selects defaults but keeps current canvas visibility until explicitly changed.

Sections: General; Language & Region; Canvas; Editing; Export; Saving & Backups; Keyboard Shortcuts; Accessibility.

Functional settings: original/slate/high-contrast theme, remember map position/zoom, open Sarge on startup, UK/US date formats, automatic metric/meter-only distance display, layer visibility and grid precision, default style for new units, marker dragging, smart/always delete confirmation, PNG/JPEG/PDF defaults and quality, manual validated backup, larger panel text, reduced motion. Restart applies the zoom-animation preference. Existing symbols and project geometry do not change when default styles or distance display change.

English is the available application language; imperial units, custom shortcuts and scheduled backups are not implemented and are identified as such. Discord briefing measurements remain standard metric. Preferences are separate from project JSON; current canvas visibility remains in the plan.

Verified: all eight sections, Cancel, unchanged map bounds when opening/closing, keyboard isolation, preference persistence/reload, layer sync, marker drag lock, new-unit style, export defaults, regional distance display, remembered zoom, confirmation cancellation, mobile overflow and zero renderer errors. PNG/JPEG/PDF regression checks and all 13 core/backend tests passed.

Install: save a JSON backup, close the old build, extract the entire Windows ZIP into a new folder, and run the EXE. The v2.2.2 close/reopen wrapper is unchanged.
