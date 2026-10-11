# Remote bridge test — 2.9.0-remote.1

## Status
Implemented: single-character relay, temporary pairing, remote planner Settings, disconnect/reload cleanup and deployment files.
Passed: 81 planner regressions; 4 relay tests; Electron UI test using a real localhost relay and a test-only HTTPS-to-HTTP transport mapping. Public TLS, GeForce NOW gameplay, and Workshop installation have NOT been verified. No relay is deployed yet.
The in-game panel compiled and its layout was checked earlier. A small new change preserves the selected endpoint when the pause menu is reopened; compile that change before publication.
Coordinates remain uncalibrated. This is an experimental one-host-character bridge, not a live feed of every unit or objective.

## 1. Deploy the relay using your Render account
1. Extract JSOC-ORBAT-HTTPS-Relay.zip.
2. Put its contents in the root of a new GitHub repository you control. These are relay source files only, not the planner EXE or mod. No credentials are included.
3. In Render choose New > Web Service and connect that repository.
4. Choose Docker as the runtime, Free as the instance type, and /health as the health-check path. Dockerfile is at the repository root. The service listens on PORT (default 8080).
5. Deploy and wait for the service to report live. Open its HTTPS URL with /health appended; expect {"ok":true}.
6. Keep the ROOT HTTPS address, e.g. https://your-service.onrender.com/ . Do not paste /health or /marker into the planner.
Alternatively deploy the included render.yaml as a Blueprint. Review that it says plan: free before confirming.

Official instructions: https://render.com/docs/web-services and https://render.com/docs/free . Free services sleep after 15 minutes without inbound traffic. Open /health and let the service wake before pairing if the first request times out. A service restart loses all temporary sessions; pair again. Run one instance only: sessions are held in memory and are not shared across replicas.

## 2. Open the new planner
1. Extract Everon-ORBAT-Remote-Bridge-Test.zip completely, then run Everon ORBAT Planner.exe from that folder.
2. Open the gear > Live bridge test.
3. Enter the root HTTPS relay address and click Connect via relay.
4. Copy the temporary pairing code. Keep the planner running. The code lasts up to one hour.
5. Do NOT click Start local receiver for GeForce NOW. That is a separate local-PC test mode.

## 3. Prepare and test the mod
Use the existing project at A:/Everon-ORBAT-Development/mods/JSOC_ORBAT_Bridge. Validate and Reload Scripts once for the new endpoint-retention change. The sanitized mod ZIP excludes the old BridgeTest world and pairing secrets. It includes available layout metadata.
Workshop publication and Host Local runtime tests are still required. Do not mark this as a verified release. Once the tested mod is published, download/enable it in Reforger on GeForce NOW, then Host Local a vanilla Everon scenario.
Open Escape > ORBAT PLANNER - HOST PAIRING. Paste the SAME HTTPS root address and current planner pairing code. Click CONNECT, resume, and possess a character. Check the planner update count and marker as you move.
Disconnect should clear the planner marker. Re-pair after expiry, relay restart, or planner reload. Do not paste a pairing code into Workshop descriptions or saved world resources.

## Data and limits
The game sends only {token,x,z} every two seconds. Read credentials are separate and remain in planner process memory. The relay stores only the latest point per session in RAM; sessions expire after one hour. It accepts at most 100 concurrent sessions, limits request rates and payload size, rejects browser Origin requests, and uses five-second request/header timeouts. Deploy behind Render HTTPS; the container's internal HTTP port is not a public TLS endpoint by itself.
Remote stale markers clear after about 7–9 seconds; polling failures clear them immediately. Plans, asset catalogs, undo history and exports are separate from live markers.
This bounded prototype is intended for a small private test. Its global capacity limits are not a substitute for public-service abuse protection at the hosting edge.
