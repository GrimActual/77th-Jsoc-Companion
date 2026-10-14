# Resource index review and reuse — Development 14

Package 12 now reopens exported Companion resource indexes directly in Assets. This uses the existing version-1 resource identity contract, worker and native file selection; it does not read resource paths listed inside the index or load engine assets.

## English
1. Open `A:/Everon-ORBAT-Development/experiments/gm-desktop/COMMAND Planner.exe` (Development 14).
2. Open **Assets → Import Workbench metadata → Load resource index JSON**.
3. Select an exported `companion-resource-index` version-1 JSON. A mission JSON, planning catalog or download checksum manifest is a different format and is rejected here.
4. Review addon/resource counts, owner IDs, GUIDs, provenance and declared dependency gaps. Multiple addons and an empty valid index are supported. Unresolved resource-reference findings show a count and up to 50 entries; resource rows remain paged in groups of 50.
5. Expand a GUID-qualified prefab row, enter its planning name/type and click **Prepare unit asset**. In **Units**, Apply changes or Place new unit saves the assignment. Export planning catalog preserves prepared session assets for reuse; Export resource index preserves the reviewed declarations.
6. **Use reviewed resource index** transfers it to offline property review and invalidates previous property reviews as before. Review new property requests before applying.

Imported observations are labelled **Declared observation**. Even `local-file` is only the source index's recorded assertion; this load does not recheck files, their current contents, native availability, ownership authenticity, licenses or server readiness. GUID syntax/metadata consistency are validated, not publisher authenticity. No missing GUID is inferred. Source declarations remain intact when exported. Target-byte and missing/empty-file warnings are unknown for imported indexes; the local-target warning filter is disabled rather than inventing warnings. To observe local target files now, use the project-and-sidecar inspection workflow.

Cancel or malformed/oversized input retains the prior review. The selected file must be regular UTF-8 JSON (optional BOM accepted), up to 5 MiB, within existing index record/reference limits. The worker bounds reads even if a file grows. No referenced files are opened. Operations share sender authority, busy/reset rules and the ten-second inspection timeout. The existing worker reply-size limit also applies. Restart clears session review; imports/preparation never edit the mission until an explicit unit assignment is applied.

**Settings → Game Master → Open Workbench metadata import** and **Sarge → Import and review Workbench metadata → Show me where** open these controls in EN/FR/DE.

## Français
1. Ouvrez **Ressources → Importer les métadonnées Workbench → Charger un index de ressources JSON**.
2. Choisissez un index Companion exporté, pas une mission, un catalogue ou un manifeste de téléchargement.
3. Vérifiez propriétaires, GUID, provenance et dépendances déclarées. Les observations importées ne sont pas revérifiées localement.
4. Développez un prefab avec GUID, choisissez nom/type et préparez-le. Appliquez ensuite l’affectation dans **Unités** ou placez une unité.

Un fichier annulé ou refusé conserve la vérification précédente. Aucun GUID n’est inventé ; aucune disponibilité native n’est prouvée. Exporter le catalogue conserve les ressources préparées pour les réimporter après redémarrage.

## Deutsch
1. **Ressourcen → Workbench-Metadaten importieren → Ressourcenindex als JSON laden** öffnen.
2. Einen exportierten Companion-Index auswählen, keine Mission, keinen Planungskatalog und kein Download-Manifest.
3. Eigentümer, GUIDs, Herkunft und deklarierte Abhängigkeiten prüfen. Importierte Beobachtungen werden lokal nicht erneut geprüft.
4. Ein Prefab mit GUID öffnen, Name/Typ wählen und vorbereiten. Anschließend unter **Einheiten** zuweisen oder eine Einheit platzieren.

Abbruch oder ungültige Dateien behalten die vorige Prüfung. GUIDs werden nicht erfunden; native Verfügbarkeit wird nicht nachgewiesen. Den Planungskatalog exportieren, um vorbereitete Ressourcen nach Neustart erneut zu importieren.

## Validation
13 relevant automated checks passed: five selected-index file/worker/authority cases, three localization cases and five changed shared selection-service checks. Coverage includes strict UTF-8/BOM handling, malformed contracts, size/selection limits, empty indexes, preservation of declarations without referenced-file reads, correct worker mode and sender/path restrictions.

The actual Electron workflow used a synthetic 501-resource/two-addon index: native JSON selection to actual worker, owner IDs and paging, unresolved references, safe imported text, declared-observation wording/unknown target warning state, assignment with nativeAvailability=unverified, Undo/Redo, cancel/invalid input retention, exact EN/FR/DE Sarge destination and page retention, empty-index UI and native filesystem export. Review/preparation actions preserved the mission; explicit assignment alone changed it. Native dialog choices were injected by the harness; the reads and native save implementation were real. First review/page appeared in 317 ms in this sample. There were zero renderer errors in the completed workflow.

## Measured optimization
Previously paging/preferences rebuilt the validated resource index and dependency audit on each render. The current review retains one validated audit, rebuilding only when a new successful input replaces it. The desktop test counted zero index/audit rebuilds across ten page changes and three language switches; findings stayed intact.

Same synthetic fixture and 25 timed samples after warmup, pure repeated-audit comparison:

| Resources / declared references | Prior repeated audit + findings mean | Retained audit + findings mean |
|---|---:|---:|
| 500 / 500 | 7.56 ms | 0.0097 ms |
| 5,000 / 5,000 | 67.82 ms | 0.0815 ms |

This avoids measured redundant work. It does not remove initial validation/audit cost, full-page DOM rendering or file/worker overhead. These are CPU samples, not map FPS or universal latency guarantees. The current findings filter still traverses the bounded reference array and displays at most 50 entries. No map rendering or integration traffic changed.

Development 14 is available in the development executable. Preview 5 archives and published Workshop package are unchanged. This does not add an RDB decoder, infer GUIDs from download manifests or perform native/server spawning. The prior isolated addon test remains separate.
