# Project identity compatibility — Development 13

Package 12 now accepts an optional top-level GameProject `Configurations` block as bounded opaque text. It reads only quoted ID/GUID/TITLE and flat declared addon dependencies. It does not interpret configuration settings, discover prefabs within configuration text or execute anything.

The desktop now has a project-only review mode. This makes an installed addon's `addon.gproj` useful for identifying its owner and declared dependency gaps even when no `.meta` sidecars are available. Download checksum manifests still do not provide prefab resource GUIDs.

## English: inspect a downloaded addon
1. Open `A:/Everon-ORBAT-Development/experiments/gm-desktop/Everon ORBAT Planner.exe` (Development 13).
2. Open **Assets → Import Workbench metadata → Review project identity only**.
3. Choose the actual `addon.gproj`. Do not choose `addon.gproj_..._manifest.json` or `data.pak_..._manifest.json`.
4. Review the addon name/ID and **Dependency not indexed** entries. The result contains zero prefab resources; this is an identity review, not a failed prefab import. A gap means the dependency is absent from this selected index, not that it is uninstalled or unavailable in the game.
5. **Export resource index** saves that addon declaration with an empty resources array. **Use reviewed resource index** makes it available to offline property review and invalidates previous reviews as before. It cannot supply a missing resource GUID.
6. If you have verified `.et.meta` sidecars in the project, use the existing **Select project and sidecars** mode instead. Only those GUID-qualified identities can become prefab planning assets. Use **Export planning catalog** to preserve prepared assets across restarts.

The mode uses one native project picker and the same bounded worker. Selection cancel or parser rejection retains the previous review. Both modes share operation locking/reset rules. Restart clears session review; no project, catalog or live connection is automatically restored. Project-only review does not change mission JSON, stored mission or Undo.

**Settings → Game Master → Open Workbench metadata import** and **Sarge → Import and review Workbench metadata → Show me where** lead to these controls in EN/FR/DE.

## Français
1. Ouvrez **Ressources → Importer les métadonnées Workbench → Vérifier uniquement l’identité du projet**.
2. Sélectionnez le fichier réel `addon.gproj`, pas un manifeste JSON de téléchargement.
3. Vérifiez nom, identifiant et dépendances déclarées. Le résultat contient zéro prefab. Les dépendances non indexées ne sont pas nécessairement absentes du jeu.
4. Exportez l’index si nécessaire. Pour préparer des ressources affectables, utilisez des fichiers `.et.meta` vérifiés avec la sélection projet et métadonnées.

Les blocs Configurations ne sont pas interprétés. Aucun GUID n’est inventé et la mission reste inchangée. Annulation ou fichier refusé conserve la vérification précédente.

## Deutsch
1. **Ressourcen → Workbench-Metadaten importieren → Nur Projektidentität prüfen** öffnen.
2. Die tatsächliche Datei `addon.gproj` auswählen, kein Download-Manifest im JSON-Format.
3. Name, Addon-ID und deklarierte Abhängigkeiten prüfen. Das Ergebnis enthält keine Prefabs. Nicht indexierte Abhängigkeiten müssen im Spiel nicht fehlen.
4. Bei Bedarf den Index exportieren. Für zuweisbare Ressourcen geprüfte `.et.meta`-Dateien über die Projekt-und-Metadaten-Auswahl verwenden.

Configurations-Blöcke werden nicht interpretiert. GUIDs werden nicht erfunden; die Mission bleibt unverändert. Abbruch oder abgelehnte Datei behält die vorherige Prüfung.

## Evidence and limits
23 relevant checks passed: existing bounded parsing/CLI boundaries and junction escapes, new opaque GameProject configuration cases, zero-sidecar CLI review and GUID-assignment rejection, project-only native sender/path authority, localization, and five changed selection/worker service checks. Scalar/duplicate configuration fields, unknown root fields and broken blocks still reject. Parser budgets remain 128 KiB, 20,000 tokens and 64 nesting levels; optional opaque acceptance is not universal engine-file compatibility.

The actual desktop test used an independent copy of the user's installed Invade & Annex project. It confirmed Addon ID `65AF366F829759CB`, 11 declared dependencies, zero fabricated resource records, a real worker, one picker, native filesystem index export, missing-GUID assignment rejection, cancellation/rejection retention, exact translated Sarge guidance and Settings destinations, unchanged mission/storage/Undo, unchanged input bytes and cleared review after reload. Native dialog choices are injected by the test harness; reads and writes are real. Review plus first UI update took 1,660 ms in this one sample; pure parsing is much faster and that measurement includes process/worker/UI overhead.

Pure parser comparison: 50 batches of 50 calls after warmup, against Development 12 (`4ce629b`):

| Fixture | Development 12 mean | Development 13 mean | Development 13 p95 batch mean |
|---|---:|---:|---:|
| Same project without configuration block | 0.0200 ms | 0.0205 ms | 0.0356 ms |
| Copied 548-byte installed project | Rejected Configurations | 0.0567 ms | 0.0886 ms |

These are parsing measurements, not map FPS, startup latency or universal responsiveness guarantees. No map/overlay/rendering code changed. Final SHA-256 verification confirmed all 12 original installed addon files still match the earlier isolated test baseline.

The earlier isolated manifest experiment and its reports remain unchanged historical evidence. It correctly recorded Development 12's rejection of Configurations; Development 13 resolves that reader limitation. It does not resolve the absence of verified prefab GUID mappings in the manifests or printable RDB candidates. No binary RDB parser, native prefab loading, engine spawn or dedicated-server property translation is claimed here.

Development 13 is in the development executable. Existing Preview 5 ZIPs and published Workshop package remain unchanged.
