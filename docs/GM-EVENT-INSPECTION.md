# GM event inspection and Enfusion compile gate

Delivered 13 October 2026 in the GM development desktop, following Preview 3. Offline event inspection does not send game commands.

## Use the event inspector
1. Load or create an offline rehearsal in the GM tab.
2. Under Scenario events, select All events, Available to fire, Waiting for conditions or Already fired.
3. Open Inspect event for a rule. It shows required objective status, distance versus zone radius, scheduled time, clock status and permitted actions.
4. Available to fire means the GM may trigger it manually. Timed events can be fired early manually; the inspector states this explicitly. Time scheduling remains separate from manual permission.
5. Replay shows conditions at the selected command revision and disables firing. Return to GM resumes inspection of the active run.
6. Settings → Game Master → Default event filter sets the initial filter. Save settings applies it; Cancel retains the saved preference. The in-panel filter is temporary until a new settings application or restart.

Readiness uses rehearsal positions only. Version 1 checks automatic rules on time advances; version 2 also checks after fired events. Inspection cannot advance time or modify journals, missions or recovery copies. Sarge includes the guide in English, French and German.

## Completed evidence
- Full regression suite: 122 passed; see test-evidence/event-inspector-regression.txt.
- Actual Electron workflow: availability, prerequisites, early manual firing, filter changes, replay, Undo, Settings save/cancel, Sarge destination, unchanged mission/journal/recovery and offline restart passed.
- Performance fixture: 400 planned units, 400 temporary rehearsal markers, 200 events, bundled terrain, identical wheel/pan inputs and final viewport. Preview 3: 52.39 FPS; development: 52.62 FPS. Both p95 33.3 ms; 4 versus 5 intervals over 50 ms. No renderer errors, unchanged mission data, 16 loaded tiles. This short sample shows no material regression; it is not a universal FPS guarantee or evidence of causal acceleration. See test-evidence/event-inspector-performance.json.

## Enfusion compilation
The dedicated bridge source candidate successfully compiled for PC and WORKBENCH with installed Arma Reforger Tools / engine 1.8.0.13. Source hashes and configuration results are in test-evidence/enfusion-compile.json. The check ran against an isolated copy, loaded the bridge addon and exited without starting a world or publishing anything. Existing base-game deprecation warnings remain. Silent initialization also logged resource/texture warnings and a missing layout GUID; successful compilation does not establish layout or Workshop package validity.

Use planner/tools/validate-enfusion.ps1 with explicit WorkbenchExe, GameAddons and EvidenceDirectory arguments to reproduce the check. It creates a new isolated folder, records source hashes, bounds each compile to 120 seconds and touches neither the published addon nor the user's open project. Logs remain local; the portable result omits account details.

The real dedicated-server runtime test is still pending: named entity selection, private profile config, outbound HTTPS, acknowledgements, disconnect/reconnect and stop/revocation must be observed in an actual game session. Host Local was previously user-tested; that is not evidence for the new dedicated sender. New source has not been published to Workshop or GitHub.
