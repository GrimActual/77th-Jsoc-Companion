# Bridge Workshop update preparation

The clean upload project is `A:/Everon-ORBAT-Development/publish/JSOC_ORBAT_Bridge/addon.gproj`. Its addon GUID remains `6A969EB0C5012BB9`; this is an update to the existing bridge, not a second addon. The prior upload folder is backed up at `A:/Everon-ORBAT-Development/work/workshop-backup-20261013`.

The five source files match the hashes in the successful PC/WORKBENCH compile evidence. Workbench regenerated its resource database with the dedicated sender included. The folder contains only the project, three bridge scripts, pairing layout and generated resource database. Test worlds, profile configuration, pairing credentials and third-party addon fixtures are excluded.

Proposed name: **COMMAND ORBAT Bridge**. Proposed version: **0.2.0**. Paste-ready description and changes are in `A:/Everon-ORBAT-Development/publish/WORKSHOP-TEXT.txt`. The bounded standalone HTTPS movement gate passed; dedicated support remains experimental for full scenarios and extended lifecycle coverage.

## Publishing steps

1. Keep Steam open. Close large unrelated applications first; Workbench ran out of memory with only 352 MB free during preparation.
2. Open `A:/Everon-ORBAT-Development/publish/Open-Clean-Bridge-Project.cmd`. Do not upload the old working project containing BridgeTest worlds and development notes.
3. In **Enfusion Workbench**, select **File → Publish to Workshop**. Confirm it loads the existing bridge item and preserves its addon identity.
4. Set **Project Name** to `COMMAND ORBAT Bridge`, **Version** to `0.2.0`, and use the summary/description/changes from `WORKSHOP-TEXT.txt`. Retain the existing preview image and appropriate licence. Do not add private profile files or pairing codes.
5. Publish and wait for the explicit success message. Until that message appears, this document describes a prepared update, not a published update.
6. In **Arma Reforger**, refresh/download the existing mod's update. Enable one copy of the addon. Test Host Local pairing with a fresh Companion session; dedicated testing uses the separate private server-profile setup in [Dedicated server setup](DEDICATED-SERVER.md).

Français : conservez Steam ouvert, publiez le projet propre avec le même GUID et attendez le message de réussite. Le support dédié reste expérimental. Ne publiez jamais le fichier privé du serveur ni un code de couplage.

Deutsch: Steam geöffnet lassen, das bereinigte Projekt mit derselben GUID veröffentlichen und die Erfolgsmeldung abwarten. Die dedizierte Unterstützung bleibt experimentell. Private Serverkonfiguration und Kopplungscode niemals hochladen.

## Release checks completed on 13 October

The 194 planner checks passed across the initial run and a focused normal-permission rerun: two initial sandbox failures were temporary-file rename/junction restrictions, not ignored failures. Four relay checks and 33 independent schema cases passed. Desktop stability preserved mission/recovery data through 30 batches of 400 changes, 90 history operations, three reloads and a full reopen. Its short performance sample overlapped memory pressure and a Steam download and is not a clean baseline comparison. See [preparation evidence](test-evidence/release-preparation-20261013.json).

Standalone server installation and bounded runtime are complete. The user confirmed Workshop 0.2.0 publication after manual entry because the Windows text-entry helper pasted unrelated clipboard text into the draft version field; that draft was closed without submitting. The prepared files and paste-ready text are valid. Workshop publication is user-confirmed. Final Companion release-candidate packaging is the next gate.
