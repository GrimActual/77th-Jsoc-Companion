# Desktop close/reopen update — 2.2.2

- Single-instance startup: opening the EXE again restores and focuses the running planner window.
- Explicit shutdown when the main Windows window closes; pending terrain downloads are aborted on quit.
- Workshop links open in the system browser instead of a separate planner-owned window.
- Absolute application-file loading, load-error reporting and renderer crash recovery prompt.
- Startup and shutdown diagnostics in %APPDATA%/everon-orbat-workshop-bridge/planner-lifecycle.log. Logs contain lifecycle events, not plan contents.
- Planner layout, JSON schema, asset handling and Sarge remain unchanged.

## Verification
The previous build passed three isolated close/reopen cycles, so the user's exact failure was not reproduced. The revised wrapper passed four cycles covering window close and app quit from different working directories, retaining the saved operation. A duplicate launch restored a hidden window and exited the extra process. Workshop link handling was checked without launching a real external page. All 13 core/backend test groups, presentation export checks and Sarge/selection checks passed.

## Install
Export a JSON backup from the current app. Close the old version. Extract the entire new Windows ZIP into a new folder and run its EXE. Keep supporting folders beside it. Do not delete the application data folder: it contains local saves.
If opening still fails, provide planner-lifecycle.log and describe whether a window appears. The changes address lifecycle gaps but are not proof of the original failure's cause.
