# 77th JSOC Companion

Everon ORBAT Planner and the optional Arma Reforger bridge.

Current development source: **2.9.1-dev.10**, including [desktop metadata import](docs/WORKBENCH-METADATA-IMPORT-UI.md) and [display/DPI diagnostics](docs/DISPLAY-QUALITY.md). The latest consolidated local package is **Preview 5**; the latest published tested build remains **2.9.0-rc.2**. Planner code is in [`planner/`](planner/). Published versions are preserved by Git tags and releases with matching source archives.

## Download

[Download the current tested RC2 Windows build](https://github.com/GrimActual/77th-Jsoc-Companion/releases/tag/v2.9.0-rc.2).

[Browse all releases](https://github.com/GrimActual/77th-Jsoc-Companion/releases). Historical builds retain their original versions. Experimental builds and release candidates are marked as prereleases.

## Run from source

Use Node.js, open `planner/`, run `npm install`, then `npm start`. Run `npm test` where a test script exists. For one-click bridge builds, copy `bridge-runtime/cloudflared.exe` from the matching Windows application resources or use the complete source release ZIP; the portable executable is not committed to Git. See the component license notices in the source.

## Scope

This is an independent community planner, not an official Bohemia Interactive product. Live bridge support is optional, shares one host-controlled character and requires the companion mod. Simulation uses synthetic data. See each release for its actual capabilities and limitations.

## Live bridge quick start

1. In the planner, open Settings → Live bridge → Start free connection.
2. In Reforger with the companion mod enabled, open ORBAT PLANNER – HOST PAIRING.
3. Copy the planner address into the game’s first field and the code into its second field; click CONNECT, resume and control a soldier.
4. Keep the planner PC awake. Temporary tunnel addresses change; public codes expire after one hour.

Simulation is a separate practice feature. Current RC2 has been user-tested in-game but remains labelled a release candidate. The prior stable release is v2.8.2.

[Release history](RELEASES.md) · [Latest debrief](planner/RELEASE-DEBRIEF.md)


## v2.9.1 development preview

This development branch adds experimental dedicated-server profiles and a single-entity sender candidate. See [setup](docs/DEDICATED-SERVER.md), [audit](docs/V2.9.1-AUDIT.md), and [preview notes](docs/V2.9.1-RELEASE-NOTES.md). Enfusion compilation and real dedicated hosting remain validation gates. Existing published downloads are unchanged.

## Future programme

[Master roadmap](ROADMAP.md) · [200-feature wishlist](docs/FUTURE-FEATURE-WISHLIST.md). Sixteen packages ordered by dependencies; no delivery dates. The next integrated architectural milestone is an offline JSON-driven GM scenario.

Development 11: [reviewed prefab planning assets](docs/REVIEWED-PREFAB-ASSETS.md) connects Workbench metadata review to unit asset assignment, with explicit classification and retained provenance. Available in the development executable; Preview 5 archives are unchanged.

Development 12 adds [portable planning catalog export](docs/PORTABLE-PLANNING-CATALOGS.md) for reuse after restart, retaining assigned asset provenance without changing mission state. Available in the development executable; existing Preview 5 archives are unchanged.

Development 13 adds [downloaded-addon project identity review](docs/PROJECT-IDENTITY-COMPATIBILITY.md), accepting opaque project configuration blocks without inferring prefab GUIDs. Available in the development executable; Preview 5 archives remain unchanged.

Development 14 adds [resource index reuse in Assets](docs/RESOURCE-INDEX-REVIEW-UI.md), with worker-backed JSON loading, multiple-addon review and cached dependency findings. Available in the development executable; Preview 5 archives remain unchanged.

Native read-only bridge [diagnostic runtime gate](docs/NATIVE-BRIDGE-RUNTIME.md) passed real Enforce-to-HTTPS-to-Companion position and authentication checks. Same-session interval reload is fixed in the dedicated candidate. Standalone server and Workshop candidate validation remain pending; Preview 5 archives are unchanged.
