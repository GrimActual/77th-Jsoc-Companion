# Edit existing scenario objectives and events

Delivered 13 October 2026 in **2.9.1 Development 5**, following packaged Preview 4. This is a mission-authoring increment in roadmap packages 05/06/07; it does not expand game authority or change the integration goal.

## Steps
1. Open GM → Build a scenario. Settings → Game Master → Open scenario builder is a shortcut.
2. If modifying a running scenario, choose Copy active scenario into builder first. This copies its rules, not its current execution state.
3. Click Edit beside an objective. Its ID stays fixed; change its name or initial status, then Apply objective edit. Cancel objective edit leaves the draft unchanged.
4. Click Edit beside a simple event. Change its name, manual/time/zone trigger, prerequisite and permitted action, then Apply event edit. Cancel event edit leaves the draft unchanged.
5. Events with multiple actions, prerequisites or conditions, or a combined time-and-zone trigger, open the complete scenario JSON editor. Their rules are never silently reduced to a single form action. Unapplied JSON text is retained; Refresh editor from draft explicitly replaces it when you are ready.
6. Export scenario JSON or Save draft to library to keep the edited rules. Start built scenario explicitly starts the edited draft as a new rehearsal; export the old journal before replacing that run.

IDs stay fixed during form edits so existing references continue to work. Invalid edits leave the prior draft intact. Adding a zone upgrades the draft to scenario version 2; removing the zone later does not silently downgrade it. Full JSON editing can deliberately change references, subject to complete validation. Loading a different draft, applying complete JSON or importing a mission cancels stale form-edit modes.

Draft edits do not change mission JSON, the active rehearsal journal, live bridge data or GM recovery copies. The draft is not automatically saved; export it or use the library. Reopening does not automatically start a rehearsal. Sarge now has 41 topics with English, French and German guidance.

## Completed validation
- 16 relevant tests passed: new authoring validation, existing scenario/spatial rules, library compatibility and translated help coverage. The earlier full 122-test gate and Enfusion compilation were not repeated because their relevant code did not change.
- Actual Electron workflow passed objective/event editing, preserved IDs and prerequisites, invalid edits, Cancel, manual/time/zone changes, version upgrade, complex-rule protection, library reload, Settings shortcut, Sarge destination and explicit start. Saved mission, active journal and recovery copies stayed unchanged until the explicitly requested new run.
- A separate narrow check passed for preserving unapplied JSON, cancelling a prior simple-event edit on switching to a complex event, and explicit JSON application without changing the active run.
- Large-authoring check: 400 mission units, 100 objectives, 200 draft events, three equivalent validated replacements measured through two animation frames. Preview 4 took 57–72 ms; development took 71–82 ms. Both retained mission data and started no rehearsal. This small sample records the additional editor controls' practical cost; it is not a universal latency or map-FPS guarantee. See test-evidence/scenario-authoring-performance.json.

The packaged Preview 4 is preserved. Use the development executable for this feature until the next consolidated package. Actual dedicated-server runtime and Workshop package validity still require their separate integration gate.
