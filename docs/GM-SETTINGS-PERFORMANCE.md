# Game Master settings and performance — 13 October 2026

In the GM development app, open Settings → Game Master. Choose settings, then Save settings. Cancel discards uncommitted preferences. Open GM workspace closes Settings and opens the GM panel.

Preferences: local recovery writes on/off; rehearsal overlay visibility; spatial zone boundaries; marker-size slider (50–200%); GM step of 1, 5, 10 or 30 seconds; default replay interval of 0.5, 1 or 2 seconds per command. Settings persist locally through restart, outside mission JSON. Existing preferences migrate with defaults matching prior behavior.

Disabling recovery stops new journal writes without deleting saved copies. Delete recovery remains in GM. Re-enabling recovery captures the current run. Reopening still offers explicit recovery; no automatic rehearsal or game connection starts. Saving preferences stops playback; the journal is preserved. Overlay visibility can also be toggled temporarily in GM. Marker sizing does not alter stored positions, normal plan symbols or export scale.

Sarge includes a Game Master settings topic with a direct working Settings destination, translated in English/French/German. There are now 37 guide topics. New Settings labels are localized; technical diagnostic prose may remain English.

## Verified behavior
Actual Electron test: save/cancel, recovery disable/enable, local persistence, marker visibility/scale, time step, replay interval, workspace shortcut, unchanged mission, explicit recovery, and zero recovery writes across ten unchanged preference notifications. Two new pure preference tests cover old settings migration, validated defaults, persistence and write-failure atomicity. Full regression results are in test-evidence/gm-settings-regression.txt.

## Performance and optimization
Same 400-unit plan, 400 rehearsal markers, offline terrain, wheel zoom and keyboard pan:
- Preview 2: 42.56 FPS average; p95 frame interval 33.4 ms; 7 intervals over 50 ms; sampled JS heap 16.31 MB.
- Development: 52.22 FPS average; p95 33.4 ms; 5 intervals over 50 ms; sampled JS heap 12.78 MB.
Both showed 400 rehearsal markers and 16 loaded tiles, with no renderer errors or mission changes. The resulting viewport varied with actual pan timing; this was a short local input-sequence check, not a fixed-camera benchmark, universal FPS promise or proof of causal speedup. JS heap excludes native/GPU memory. Raw observations are in test-evidence/gm-settings-performance.json.

Optimization: UI uses an O(1) journal revision getter instead of repeatedly cloning journals just to count commands. Recovery snapshots are cloned/validated/written only when the engine or revision changes (or recovery is re-enabled), not for unchanged display refreshes. Marker resizing only redraws markers whose radius changes; unchanged positions and unchanged zone definitions retain their layers.

Future performance gates and Sarge/Settings maintenance are recorded in repository AGENTS.md. Recheck representative baselines after meaningful rendering/playback/storage/integration changes and before packaging. Do not run broad/repeated benchmarks for documentation-only edits without an unresolved concern.

Existing Preview 2 release ZIPs remain unchanged; this increment is in experiments/gm-desktop and committed development source.
