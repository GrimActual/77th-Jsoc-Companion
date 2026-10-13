# Portable planning catalogs — Development 12

Package 12 adds an explicit catalog export to the existing Assets workflow. Prepared prefab references no longer need to be assigned to a unit just to keep them for later sessions. No catalog is automatically restored or connected to a game.

## English: save and reuse
1. Open `A:/Everon-ORBAT-Development/experiments/gm-desktop/Everon ORBAT Planner.exe` (Development 12).
2. In **Assets**, import your catalog with **Import catalog JSON**, or prepare reviewed prefab references under **Import Workbench metadata**.
3. Click **Export planning catalog**. Choose the destination in the native Save dialog. This saves all current session assets plus the snapshots assigned to existing mission units, including their resource GUID, addon ID, path, provenance and target warnings when present.
4. Wait for **Planning catalog saved. Mission unchanged.** The export does not commit unit form edits, change mission JSON or create an Undo step.
5. After restarting, open **Assets → Import catalog JSON** and choose that saved file. Under **Units**, select an assigned asset normally; Apply changes or Place new unit commits the assignment.

A catalog is equipment/reference data, not a mission import. Reimport replaces the session catalog; assigned unit snapshots stay embedded in the mission. Unassigned references remain session-only until explicitly exported. The export includes only the assigned snapshot, not the rest of the unit record or live/rehearsal state. It does not turn unknown GUIDs into verified references or claim native availability.

If the same asset ID has conflicting snapshots, export stops before the Save dialog. Review the imported catalog and affected units; preserve the current mission backup before editing assignments. No silent winner is selected. Empty, duplicate, invalid and oversized catalogs are rejected. Up to 10,000 catalog items and 5 MB serialized JSON are supported. Cancel or a failed write does not report success. Atomic replacement uses a temporary file next to the selected destination.

**Settings → Game Master** explains catalog reuse; its metadata shortcut opens Assets. **Sarge → Import assets and mods → Show me where** opens the same panel in EN/FR/DE.

## Français
1. Dans **Ressources**, importez un catalogue JSON ou préparez les références de prefabs vérifiées.
2. Cliquez **Exporter le catalogue de planification**, puis choisissez le fichier dans la boîte de dialogue native.
3. Attendez la confirmation. Le catalogue inclut les ressources de session et les références affectées aux unités, sans modifier la mission ni l’historique Annuler.
4. Après redémarrage, utilisez **Importer le catalogue JSON**, puis affectez une ressource dans **Unités**.

Les références contradictoires bloquent l’export avant la boîte de dialogue. Aucun GUID inconnu n’est inventé ; la disponibilité native reste non vérifiée. Les entrées non affectées doivent être exportées pour être conservées après redémarrage.

## Deutsch
1. Unter **Ressourcen** einen JSON-Katalog importieren oder geprüfte Prefab-Referenzen vorbereiten.
2. **Planungskatalog exportieren** anklicken und die Datei im nativen Speicherdialog auswählen.
3. Auf die Bestätigung warten. Sitzungsressourcen und zugewiesene Referenzen werden gespeichert, ohne Mission oder Rückgängig-Verlauf zu ändern.
4. Nach Neustart **Katalog-JSON importieren** verwenden und unter **Einheiten** eine Ressource zuweisen.

Widersprüchliche Referenzen blockieren den Export vor dem Dialog. Unbekannte GUIDs werden nicht erfunden; native Verfügbarkeit bleibt ungeprüft. Nicht zugewiesene Einträge müssen exportiert werden, damit sie nach Neustart erhalten bleiben.

## Validation and performance
16 relevant automated checks passed across catalog contracts, the modified native metadata/catalog export service, localization and startup. Atomic replacement was verified outside the sandbox after its file-replacement restriction produced EPERM. The real Electron workflow passed native filesystem export, replacement and temporary-file cleanup; unused asset inclusion; assigned GUID/provenance retention; cancel and write-error preservation; conflicting snapshot rejection before the dialog; reimport after reload; safe displayed names and icon types; Sarge EN/FR/DE and Settings destinations; unchanged mission, stored mission and Undo. Native dialog choices are injected in the harness; the actual save implementation/filesystem are exercised. The fixture references are synthetic, not native-engine verification.

A redundant renderer validation was removed after measurement; the native save service still validates every payload before writing. A narrow follow-up verified empty export rejection before the dialog and actual export of 500 assets without mission mutation.

Pure operation comparison against Development 11 (`258bcef`), 25 timed samples after three warmups:

| Catalog size | Prior normalization mean | Bounded normalization mean | Export preflight + native-contract validation mean | Largest measured export |
|---|---:|---:|---:|---:|
| 500 assets + 400 assigned snapshots | 0.52 ms | 0.76 ms | 6.86 ms | 7.74 ms |
| 10,000 assets + 400 assigned snapshots | 10.21 ms | 20.57 ms | 74.69 ms | 78.25 ms |

The fixtures serialize to approximately 107 KB and 2.17 MB. Bounded normalization costs more because it checks size and detaches nested data. These are CPU samples, not map FPS, disk latency or a responsiveness guarantee at the full 5 MB cap. The export measurement includes both renderer combination and independent native-contract validation; no redundant third renderer validation is retained. Map rendering and live traffic are unchanged.

Development 12 is available in the development executable. Preview 5 ZIPs are preserved and unchanged. No Workshop or GitHub release was published by this increment. The isolated manifest experiment stays outside release source; its unknown GUID candidates were not added to this catalog.
