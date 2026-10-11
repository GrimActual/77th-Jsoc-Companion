# Local Workbench bridge — 2.9.0-local.1

Experimental, one test entity, same PC only. Coordinates are raw X/Z and not verified against Everon. The listener uses a small dedicated test message, not the full simulation bridge protocol. No multiplayer authority, friendly-unit scanning, live objectives or GeForce NOW connection is provided.

1. Extract the whole Windows ZIP. Run Everon ORBAT Planner.exe from its folder. This build has its own user-data profile and starts with the receiver OFF.
2. Gear > Local Workbench test > Start local receiver. Copy the temporary 32-character pairing code. The loopback listener is fixed at 127.0.0.1:8791. If busy, close the other test receiver; do not expose the port publicly.
3. In Workbench stop play mode. In Script Editor choose Build > Validate and Reload Scripts. The existing JSOC_ORBAT_BridgeTestComponent.c has been updated in place; its original startup-only copy is in work/bridge-startup-original.c.
4. Select GenericEntity_1 in your test world. Select its JSOC_ORBAT_BridgeTestComponent in Object Properties. Paste the code into Pairing code under Local bridge. Save the test world.
5. Press Play. Within a few seconds the planner should show connected and increasing update counts. Click Find test marker to centre on the orange marker. The empty test world may remain blank.
6. Stop play mode. After roughly 7–8 seconds the receiver should show stale and clear the marker. Move the entity, press Play again and check X/Z change in the planner.
7. Disconnect clears the temporary marker and invalidates the code. Starting again needs a new code in Workbench. Reload and application exit stop the listener. Clear the code from your world before sharing or publishing it.

The marker is a separate layer. Project JSON, ordinary presentation exports, autosave, selection and undo do not include it. Use the live receiver's Find test marker button to locate points near world origin.

Validation: 80 existing automated tests passed, plus the local receiver test (authentication, browser Origin rejection, field/coordinate validation, request limit, expiry, token rotation, oversize rejection). Electron HTTP integration covers moving the marker, stored-plan and export-model isolation, expiry, reload and socket release on exit. The sender still requires compilation and a live Workbench request on your installed version. Node HTTP tests do not prove Enfusion transport compatibility.

The standalone EXE remains unsigned. See WINDOWS-SIGNING.md. Existing Phase C and stable builds are unchanged.
