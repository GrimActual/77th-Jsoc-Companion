# Project development instructions

User requirements recorded 13 October 2026:

- Keep Sarge, Settings, roadmap and setup/debrief guides synchronized with delivered user-facing features. Existing guides are available in English, French and German; maintain their tested topic coverage and working destinations. Put persistent preferences in the existing settings system, separately from mission JSON.
- Perform regular performance/optimization checks after meaningful changes to map rendering, overlay density, playback, storage or integration traffic, and before release packaging. Compare the prior build with the same representative fixture and input sequence; record FPS/frame-time, large stalls, marker/tile counts and relevant memory/write behavior. Avoid presenting short samples as universal guarantees or causal speedup evidence.
- Optimize measured or evident redundant work, then verify correctness, offline startup, unchanged mission data and cleanup. Run tests appropriate to the change; repeat/broaden only for changed behavior, failures or unresolved concerns.
- Preserve existing offline functionality, app layout and mission compatibility. Live and rehearsal state stay out of saved plans, normal exports and editor undo. Never auto-connect or auto-run recovery at startup.
- Keep dedicated integration experimental until new Enfusion code is compiled and actually tested on a dedicated server. State simulated versus real validation accurately.
- Store bulk development/test/release artifacts on A:/Everon-ORBAT-Development. Preserve older release packages. Identify which development executable or release ZIP contains new work.
