# v2.6.1 — remembered branding and translated outputs

This is a small follow-up to v2.6.0. The main planner layout and v4 project format are unchanged.

## Added
- Save community defaults in the existing Presentation branding section. It remembers community name, logo, watermark, opacity and exercise stamp on this device.
- Mission titles and dates deliberately remain session-only. A project import cannot replace your community defaults.
- Forget saved defaults removes the stored default; Reset branding clears only the current export session.
- French/German generated brief labels and presentation legends, including exercise stamps. User-entered names, phase names, watermarks and imported mod names remain unchanged.
- Copied briefs now respect the selected metric/imperial distance preferences.

## Reliability and help
- Switching language invalidates the export preview so a cached file cannot retain the previous language.
- Invalid stored defaults are ignored with a visible message; exports and the current project remain usable.
- Failed saves report failure and retain the previous stored default. Only validated PNG logos and bounded text/style values are stored.
- Clearing a pending logo selection correctly unlocks export controls.
- Form hints and accessibility labels translate without touching field values.
- Updated Sarge's export instructions, README and Quick Start for current export formats and launch commands.

## Verification
38 automated tests passed, including saved-profile validation, storage failures, translated briefs, asset preservation, project compatibility and the early-close shutdown regression.

Desktop checks verify a saved logo and styling across a real process restart, exclusion of title/date, French/German SVG legends and copied briefs, imperial distances, preview invalidation, corrupt-profile recovery, failed storage, removing defaults and unchanged plan data. Existing SVG/PNG/JPEG/PDF export regression checks also passed.

Native-speaker review, full technical-error localization, per-unit image patches and multiple named branding profiles remain pending. Community defaults are local to this installation/profile and are not included in project JSON backups.
