# RC2: live bridge startup fix

The one-click planner previously created and polled its own local relay through the public Cloudflare address. New-address DNS delays could make pairing wait around a minute. RC2 waits for cloudflared to report a registered tunnel, then creates the pairing session and reads positions over loopback on this PC. The game still uses the public HTTPS address. The public URL is preserved in the UI and clipboard; loopback addresses are not substituted into game instructions.

Measured on 11 October 2026 in sequential real-tunnel tests:
- RC1 pairing ready: 68.54 seconds.
- RC2 pairing ready: 9.57 seconds; successful public marker request by 10.85 seconds.

These are individual network-dependent samples, not a guaranteed time or controlled Cloudflare performance comparison. The local polling route removes unnecessary ongoing internet requests. The game still depends on external DNS and tunnel availability.

Validation: 88 regression tests passed. Added coverage proves an address alone cannot enable pairing, tunnel registration is required, pairing uses the local relay and the UI retains the public URL. Packaged RC2 verified public HTTPS marker delivery, clipboard actions, unchanged plan, stop/restart and reload cleanup.

Install by closing RC1 and extracting the whole RC2 ZIP into a new folder. Run its EXE. Existing one-click settings and autosave use the same profile; keep a JSON backup. Start a fresh connection and copy the new address and code into the existing game mod. No Workshop mod update is required. RC1 is preserved.

The RC1 checks and known limits below still apply; this update changes bridge startup/transport, not map rendering.

---

# 2.9.0 RC1 — Release debrief

## Changes
- Renamed the confusing Game Connection simulation settings to Simulation.
- Expanded Sarge to 29 searchable guides, covering live pairing with explicit planner/game fields, status, reconnecting, local Workbench, backups and upgrades; French/German translations included.
- Added an on-map LIVE status button that opens Live bridge settings. Simulation remains separately identified.
- Shortened the live marker label to LIVE plus game grid; removed the old alignment-check wording and prevented narrow word wrapping.
- Reused the existing live marker instead of destroying and recreating it on every update. Stationary updates skip movement and tooltip updates.
- Corrected startup timing guidance, connection lifetime explanations and immediate-action Settings feedback.
- Preserved the original main planner layout, existing plan format, coordinate alignment and prior working builds.

## Tests completed on 11 October 2026
- 87 automated regression tests passed, including import/export validation, assets, selection, undo, translations, simulation, bridge authentication/lifecycle and coordinate alignment.
- Marker test: 1,000 identical updates created one marker with zero redundant moves or tooltip changes; moving/stale positions handled correctly.
- Packaged desktop: all 29 Sarge topics and Show me where destinations; searching; 100-unit simulation; typing-safe Delete; 400-unit group deletion and undo; compact Settings layout.
- Real public HTTPS tunnel: startup, address/code copying, position delivery, unchanged plan, Stop cleanup, new code on restart, and reload cleanup passed.
- Actual files: two uniquely named JSON backups, editable project JSON, PNG/JPEG/PDF/SVG presentation downloads; invalid JSON preserved the active plan.
- French/German new help guides rendered and searched successfully. Close/reopen restored the saved plan and kept the bridge off.

## Performance
Same machine, 400-unit fixture, bundled offline terrain, scripted wheel zoom and keyboard pan, approximately 6.5-second requestAnimationFrame sample:
| Metric | Previous one-click build | RC1 |
| --- | ---: | ---: |
| Average frame rate | 52.6 FPS | 51.7 FPS |
| 95th-percentile frame interval | 33.3 ms | 33.4 ms |
| Frames over 50 ms | 8 | 7 |

No clear material rendering regression in this sample. This measures the planner renderer, not game FPS. It is a short local benchmark, not a guarantee for every GPU, display, network or plan size. Online tile latency and extended endurance were not benchmarked. RC1 UI testing performed more interactions before measurement, so heap readings are not directly comparable. Existing GPU acceleration settings were retained.

## Remaining practical limits
- One host-controlled character, on Everon; no whole-server tracking.
- Quick Tunnel addresses are temporary; public codes expire after one hour.
- Simulation/live overlays intentionally remain outside exports and saved plans.
- No Workshop reupload required for these changes; no GitHub release published by this task.
- Application remains unsigned. No claim that SmartScreen reputation warnings are resolved.
- Exact RC1 ZIP still merits a final user in-game smoke test before stable publication.
