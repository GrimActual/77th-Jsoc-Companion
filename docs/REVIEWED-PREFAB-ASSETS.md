# Reviewed prefabs as planning assets — Development 11

Package 12 now connects the selected metadata review to the existing asset selector. This is an explicit planning reference, not an engine prefab loader or spawn command.

## English
1. Open the development executable at `A:/Everon-ORBAT-Development/experiments/gm-desktop/Everon ORBAT Planner.exe`.
2. To change an existing unit, select it in **Units** first. Otherwise leave a new unit selected.
3. Open **Assets → Import Workbench metadata → Select project and sidecars**. Select your `addon.gproj`, then the desired `.et.meta` files inside its project.
4. Expand a prefab row. Review its GUID, source sidecar and missing/empty target warning. Enter **Planning asset name** and choose **Planning asset type**. Default Unclassified deliberately avoids guessing from filenames.
5. Click **Prepare unit asset**. The app opens **Units**, with that asset selected. Preparation leaves mission data and Undo unchanged.
6. Review the unit fields. Click **Apply changes** for an existing unlocked unit, or **Place new unit**, then click the map. The assigned asset snapshot includes GUID, addon ID, source path, provenance and target observation.
7. Save Backup / Project JSON includes the assigned snapshot through the existing mission contract. Importing or reopening the mission retains the reference even without a session catalog. Undo/Redo restores the assignment in one mission step.

Unassigned catalog entries and metadata review remain session-only. Importing another catalog replaces the current session catalog; assigned unit snapshots remain embedded. A different name/type for an already prepared prefab is rejected rather than silently overwriting it. Missing/empty files can be represented for planning but stay explicitly unverified. No Workshop entitlement, license permission, component semantics or native/server availability is inferred. Metadata review drafts retain their name/type through paging and language changes; selecting a new successful review clears those drafts.

**Settings → Game Master → Open Workbench metadata import** leads to the same controls. Sarge's metadata topic explains this workflow in EN/FR/DE.

## Français
1. Dans **Unités**, sélectionnez d’abord l’unité à modifier, ou préparez une nouvelle unité.
2. Ouvrez **Ressources → Importer les métadonnées Workbench**. Sélectionnez `addon.gproj`, puis les fichiers `.et.meta` de son projet.
3. Développez une ligne de prefab. Vérifiez GUID, provenance et avertissements. Choisissez son nom et son type de planification.
4. Cliquez **Préparer la ressource d’unité**. Dans **Unités**, appliquez les modifications ou placez une unité sur la carte.
5. La sauvegarde de mission conserve la référence affectée ; Annuler/Rétablir restaure l’affectation en une étape. Les références non affectées restent limitées à la session. Aucun objet n’est créé dans le jeu et la disponibilité native reste non vérifiée.

## Deutsch
1. Unter **Einheiten** zuerst die zu bearbeitende Einheit auswählen oder eine neue Einheit vorbereiten.
2. **Ressourcen → Workbench-Metadaten importieren** öffnen. `addon.gproj` und anschließend die `.et.meta`-Dateien im Projekt auswählen.
3. Eine Prefab-Zeile öffnen. GUID, Herkunft und Warnungen prüfen; Planungsname und Typ wählen.
4. **Einheitenressource vorbereiten** anklicken. Unter **Einheiten** Änderungen anwenden oder eine neue Einheit auf der Karte platzieren.
5. Die Missionsspeicherung behält die zugewiesene Referenz; Rückgängig/Wiederholen stellt die Zuweisung in einem Schritt wieder her. Nicht zugewiesene Ressourcen gelten nur für die Sitzung. Es werden keine Spielobjekte erzeugt; native Verfügbarkeit bleibt ungeprüft.

## Validation and limits
Five contract checks cover explicit classification, unsafe/unsupported input, detached provenance, idempotent/conflicting merge, canonical plan round-trip and bounded target observations. Existing three localization and two startup checks are retained/run where relevant. Real Electron workflow exercises the actual metadata worker, safe special-character names, warning retention, preparation without mission mutation, assignment, Undo/Redo, duplicate rejection, exact translated Sarge guidance/destination, language-switch draft retention and saved mission reload.

Six-second comparison with 400 planned units and 500 selected prefab sidecars:

| Build | FPS | p95 frame | Largest frame | Frames over 100 ms | Heap | Markers / tiles |
|---|---:|---:|---:|---:|---:|---|
| Development 10 | 58.83 | 16.9 ms | 47.1 ms | 0 | 19.3 MB | 400 / 2 |
| Development 11 | 59.00 | 17.2 ms | 68.1 ms | 0 | 19.3 MB | 400 / 2 |

Mission and stored mission were unchanged during both workloads. This short comparison indicates no material regression in this fixture, not a speedup or leak guarantee. Native file choices are injected by the test harness; the worker and filesystem reads are real. One follow-up harness run reloaded before initial load completed (ERR_ABORTED); waiting for initial load prevents that test race. No renderer error occurred in the completed workflow.

Development 11 is available in the development executable. Preview 5 ZIPs remain unchanged. No new Workshop publication or native Enfusion behavior is part of this increment.

## Development 12 follow-up
Prepared assets can now be explicitly saved using Assets → Export planning catalog and reimported after restart. See [catalog portability steps](PORTABLE-PLANNING-CATALOGS.md). The session-only statements above describe Development 11 without this explicit catalog export.
