# 77th JSOC Companion 2.9.1 Release Candidate 1

Extract the Windows ZIP fully, then run Everon ORBAT Planner.exe. Keep a Project JSON backup before switching versions. The source ZIP contains the planner, relay, bridge addon source, tests and guides. Old release archives are preserved.

## What is included

- Offline ORBAT/map planning, fullscreen map controls, scenario authoring/rehearsal, atomic property-batch Undo/Redo, preflight and journals.
- Reviewed Workbench resource-index imports, explicit prefab asset preparation and portable planning catalogs with addon/GUID provenance.
- Display/graphics diagnostics and 46 Sarge topics with English/French/German guidance.
- Host Local live pairing and experimental dedicated-server tracking of one named authorised entity.
- Workshop bridge 0.2.0 publication confirmed by the user. Obtain the existing 77th JSOC ORBAT Bridge item in Reforger Workshop; do not enable duplicate addon identities.

## Start a live connection

Open Settings → Live bridge. Host Local uses the game's ORBAT PLANNER - HOST PAIRING panel: ADDRESS goes in endpoint, CODE goes in pairing code. GeForce NOW requires reachable HTTPS. Dedicated mode uses the server administrator's private profile configuration; see DEDICATED-SERVER.md. Use a fresh session after disabling/revoking. No automatic connection starts at app launch.

## Completed validation

194 planner checks passed across the initial run and a focused normal-permission rerun of two sandbox-blocked temporary-file tests. Four relay checks and 33 independent schema cases passed. Translation coverage passed after the final guidance edits. Thirty 400-change batches, 90 history actions, three reloads and a full reopen preserved mission/recovery data. PC/WORKBENCH compilation and a real standalone-server HTTPS movement check passed; Companion received 11 updates, with no script errors and no mission changes. All native test processes/tunnels and temporary credentials were cleaned up.

Matched eight-second dense-map samples measured 36.375 FPS for Preview 4 and 36.125 FPS for current code. Both included frame stalls. No substantial FPS regression or causal improvement is claimed; these are short hardware-specific samples, not a soak or universal guarantee.

## Remaining limits

Dedicated support is experimental beyond the bounded synthetic test. Full scenarios, prolonged transport/retry-limit tests and endpoint-preserving revocation need further coverage. Downloaded Workshop-package gameplay verification is separate from native source validation. No whole-server tracking, automatic player discovery, GM command execution or entity spawning is implemented. Experimental live/rehearsal state stays out of saved missions and normal exports.

The Windows executable is unsigned. SHA256SUMS checks file integrity, not publisher trust or antivirus approval. This is a prerelease candidate, not a stable production release.

Français : extrayez entièrement le ZIP puis lancez Everon ORBAT Planner.exe. Sauvegardez votre Project JSON. Pont dédié expérimental, une seule entité autorisée. Consultez DEDICATED-SERVER.md ; ne publiez jamais un code temporaire ni le fichier privé du serveur.

Deutsch: ZIP vollständig entpacken und Everon ORBAT Planner.exe starten. Project JSON vorher sichern. Dedizierte Brücke experimentell, nur eine autorisierte Entität. DEDICATED-SERVER.md beachten; temporären Code und private Serverdatei niemals veröffentlichen.
