# Preview 3 — mission recovery and scenario library

Launch the fully extracted application, then:
- Settings → Saving & Backups → Mission recovery copies: enable bounded rotating copies, refresh, explicitly restore a selected copy, or delete copies. Undo returns to the prior mission.
- GM → Build a scenario → Saved scenario library: name/save a draft, load it into the builder, export/import a library, or delete a saved definition.
- Settings → Game Master → Open scenario library links to the same controls.

Normal autosave remains authoritative and works with older builds. Up to two recovery copies are kept for missions under 256 KB; larger missions still save normally and require manual exported backups. Snapshot failures do not falsely report a failed primary save. Only true quota errors may trim oldest managed copies, and only while a valid primary save exists; other failures retain copies. Corrupt primary data is never replaced automatically. Startup keeps an explicit warning and offers manual recovery. Restoring a mission clears unrelated GM rehearsal/draft state.

The library contains up to 20 rule definitions and 256 KB total. Rules reference exact unit/phase IDs; missing identifiers are rejected. Loading changes the draft, not the active rehearsal. Import merges by default; conflicts are rejected without replacing the library. Explicit replacement is an opt-in import checkbox. Corrupt original library data is retained until a validated replacement import. Library data contains rules and identifier context, not mission assets or bridge credentials. Export library JSON for a portable backup.

Validation: 119 complete planner tests passed. New tests cover copy rotation/corruption, primary write failure, quota trimming, disabled/oversized snapshots, library CRUD, conflicts, failed writes, corrupt library replacement and entry limits. Actual desktop test covers library create/delete/export/import/persistence and settings links, no startup auto-run, recovering a prior mission with Undo, corrupt primary recovery, assets and unchanged plans. Sarge's 39 translated topics and new destinations were checked in the desktop.

Performance: same 400-unit plan + 400 rehearsal markers, offline tiles, zoom/pan input sequence. Preview 2 averaged 49.42 FPS; development averaged 52.80 FPS. Both p95 frame intervals were 33.3 ms, with 7 versus 4 intervals over 50 ms. Both retained 400 markers and 16 tiles. The viewport varied slightly with real pan timing; short local observations do not prove a causal speedup or guarantee other hardware. Sampled JS heaps were 17.36 MB and 15.35 MB and exclude native/GPU memory. Raw results are retained with the test evidence. Recovery skips unchanged snapshots and caches validated copies; no per-live-position mission autosaves were added.

Preview 3 includes the preceding GM preferences, JSON editor, spatial rules, replay, AAR, journals and recovery. It does not publish/update the Reforger mod. The dedicated sender remains experimental pending engine compilation and a real server test. The future Enfusion mission-package pipeline is recorded in ENFUSION-MISSION-PACKAGE-ROADMAP.md and does not redirect current development.
