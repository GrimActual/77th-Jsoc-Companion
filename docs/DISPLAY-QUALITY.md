# Text, high-DPI and graphics checks — Development 10

Development 10 retains the usable metadata workflow and adds a display-quality pass. Run `A:/Everon-ORBAT-Development/experiments/gm-desktop/COMMAND Planner.exe`. Existing Preview 5 archives remain unchanged.

## What changed

Interface text now consistently prefers Windows Segoe UI Variable Text/Segoe UI, with native system/Arial fallbacks. Controls inherit their font, Sarge uses the same font stack, normal kerning is explicit and text rasterization remains browser-managed. Whole text panels are not stretched with CSS transforms or forced onto 3D layers. Map transforms and vector-symbol behavior remain intact.

This avoids unnecessary text resampling; it does **not** promise pixel-perfect glyphs on every driver, monitor or fractional zoom. Non-standard smoothing flags are not a dependable Windows solution. [MDN font-smooth](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-smooth) explains the limited support; native platform rendering is retained rather than using unsupported smoothing overrides or blanket pixelated image rules.

The initial window now fits the primary monitor's available work area in device-independent pixels, up to the existing 1600×900 size. Existing interface scaling continues through Electron webFrame zoom; DPR is not multiplied into CSS layout a second time. Monitor scale, app zoom and renderer DPR are reported separately. [Electron screen](https://www.electronjs.org/docs/latest/api/screen) documents work-area/DIP APIs.

## In the Companion application

1. Open **Settings → Display & graphics**.
2. Click **Check display and graphics**. Read interface zoom, pixel ratio, monitor scale, viewport and GPU/driver status. Ratios above 1 are normal at high DPI and when interface zoom is increased.
3. If text looks soft, use **Open interface scale settings** to compare at 100%. **Accessibility → Panel text size → Larger** is also available. Save your preferred settings; these do not change mission coordinates.
4. Recheck after changing settings, resizing the window or moving between displays. Resize/settings changes invalidate the old report and disable Copy until checked again.
5. **Copy display report** copies a timestamped JSON snapshot for local troubleshooting. It contains bounded display/GPU fields, computed font stack and viewport, not your mission, credentials or file paths. Clipboard availability failures are reported. The app does not upload diagnostics.

Sarge's **Text clarity, display scaling and GPU checks** topic opens this page in EN/FR/DE. There are now 46 translated Sarge topics.

## GPU interference: observations and limits

Normal test runs reported hardware compositing/rasterization/WebGL enabled, zero GPU child exits, and the **Intel UHD Graphics 630 / Direct3D 11** path with reported Intel driver version **26.20.100.6911**. These are observations from this machine, not a recommendation or assertion that the driver is current.

An isolated GPU-disabled app instance reported software compositing and SwiftShader/SwANGLE; it also completed the layout, zoom and map checks. That process flag was used only in the test instance. No driver, Windows DPI, ClearType, overlay, global GPU profile or persistent hardware-acceleration setting was changed.

The app can report graphics feature status and GPU child exits; those are evidence, **not proof of driver interference**. It does not inspect vendor profile overrides, overlays or physical monitor settings. A normal report cannot rule those out. Hardware versus software screenshots/timings from short runs do not isolate a driver-specific cause of blurred text. [Electron GPU status/info](https://www.electronjs.org/docs/latest/api/app#appgetgpufeaturestatus) is the API source for these read-only diagnostics.

## Checks and measured workload

Eight focused tests passed: work-area sizing, trusted IPC, monitor/zoom separation, bounded GPU fields, readiness/unavailable handling, GPU exit counting, startup lifecycle and all translated Sarge coverage. Additional actual Electron checks passed:

- Emulated DPI 100%, 125%, 150%, 200%, each with interface zoom 100%, 110%, 125%: renderer DPR matched reported monitor scale × app zoom within tolerance. These are emulated factors, not four physical monitors.
- No transform/filter on the text panel, no report readout overflow, initial bounds fit the work area, full-map/menu restoration works and mission data remains unchanged.
- Timestamped copy handler, resize invalidation and exact EN/FR/DE Sarge text/destinations work. Clipboard was stubbed in the test to preserve the user's existing clipboard.
- Native capture of the 100% normal rendering was visually inspected. This confirms the captured layout/legibility, not universal physical-screen text quality.
- The 500-resource metadata import/export/filter/paging/property-index flow still passes after shared typography and Settings changes, without mission/builder/journal mutation. It took 778 ms in this additional sample; timing variation is expected.

Four-second, offline 400-unit map-pan samples:

| Configuration | FPS | p95 frame | Maximum frame |
| --- | --- | --- | --- |
| Development 9 baseline, 100% DPI | 57.0 | 16.8 ms | 92.8 ms |
| Development 10, 100% DPI | 59.0 | 17.3 ms | 53.1 ms |
| Development 10, 125% DPI | 58.5 | 17.3 ms | 101.8 ms |
| Development 10, 150% DPI | 56.5 | 17.3 ms | 138.5 ms |
| Development 10, 200% DPI | 58.75 | 16.9 ms | 83.6 ms |
| Development 10, GPU-disabled test, 100% DPI | 57.0 | 20.5 ms | 70.2 ms |

Each had 400 marker elements and one or two terrain tiles. The DPI cases have different logical viewport sizes; they are compatibility samples, not identical-area speed comparisons. Some frames exceeded 100 ms at 125/150% DPI; they are retained in the evidence rather than hidden. Short samples do not prove a causal speedup, leak freedom or guaranteed FPS. No broad passing release suite was repeated.

Evidence: `docs/test-evidence/display-quality.json`. Harnesses: `planner/tools/check-display-quality.cjs` and `check-display-controls.cjs`. Dedicated runtime and native writable properties remain separate roadmap gates. No new ZIP or Workshop release was produced by this increment.
