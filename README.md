# 77th JSOC Companion

Everon ORBAT Planner and the optional Arma Reforger bridge.

Source snapshot: **2.2.2**. Planner code is in [`planner/`](planner/). Each version is preserved by a Git tag and a release with matching source archives.

## Download

[Browse all releases](https://github.com/GrimActual/77th-Jsoc-Companion/releases). Historical builds retain their original versions. Experimental builds and release candidates are marked as prereleases.

## Run from source

Use Node.js, open `planner/`, run `npm install`, then `npm start`. Run `npm test` where a test script exists. For one-click bridge builds, copy `bridge-runtime/cloudflared.exe` from the matching Windows application resources or use the complete source release ZIP; the portable executable is not committed to Git. See the component license notices in the source.

## Scope

This is an independent community planner, not an official Bohemia Interactive product. Live bridge support is optional, shares one host-controlled character and requires the companion mod. Simulation uses synthetic data. See each release for its actual capabilities and limitations.
