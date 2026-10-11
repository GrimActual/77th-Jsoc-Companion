# 77th JSOC Companion

Everon ORBAT Planner and the optional Arma Reforger bridge.

Source snapshot: **2.9.0-rc.2**. Planner code is in [`planner/`](planner/). Each version is preserved by a Git tag and a release with matching source archives.

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
