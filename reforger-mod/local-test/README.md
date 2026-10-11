# Host Local bridge candidate — NOT engine-validated

The older Workbench component has already sent a marker successfully. This candidate adds a NEW host-only pause-menu panel and sends the host controlled character position. It does not require placing the old test component into a vanilla scenario.

## What is included
- Explicit Connect / Disconnect controls in the host pause menu.
- Temporary pairing code held in memory, never written to the mod or logged.
- Only the host controlled character is sent; no enemy scan or joining-client feed.
- Two-second update interval, one pending request at a time, five-second timeout.
- Sender cleanup when the game mode is destroyed.

## Next required validation — only the new functionality
1. Open the existing JSOC_ORBAT_Bridge project in Workbench. Allow the new UI layout to import and generate its resource metadata.
2. In Script Editor use Build > Validate and Reload Scripts. This validates the newly added HostBridge and PairingMenu files, not just the older component. Stop if it reports errors.
3. Test a vanilla Everon Game Master scenario with this addon loaded. Open the pause menu. Confirm the ORBAT panel is visible, readable, and accepts pasted text.
4. In the existing local-test planner, open Settings > Local Workbench test, start the receiver and copy its newly generated code.
5. Paste that code in the new in-game pause panel. Keep http://127.0.0.1:8791/ for a game running on THIS PC. Click Connect, resume, and spawn or possess a character.
6. Check that the receiver count increases and the marker follows movement. Map alignment remains uncalibrated; receipt alone does not prove correct alignment.
7. Reopen pause and Disconnect. After seven seconds the planner marker should clear. Reconnect, then end the scenario; updates should stop. Joining clients must not see the host pairing panel.

## Publication gate
This ZIP is a sanitized source candidate, not a Workshop-ready build. Workbench compilation, resource import, menu interaction, and Host Local runtime tests remain unverified because desktop automation was unavailable. Include Workbench-generated resource metadata when publishing the tested addon. Do not include BridgeTest.ent_Layers, personal logs, or saved world files containing a pairing code.

No Workshop upload has been performed. Publishing is done from the tested addon in Workbench, not by uploading this ZIP to GitHub.

## GeForce NOW
The local address reaches the machine running Reforger. On GeForce NOW that is NVIDIA's machine, so it cannot reach the receiver on your PC. An HTTPS endpoint field alone does not solve this: a deployed authenticated relay and planner integration are still required. No remote relay is included or deployed in this candidate.
