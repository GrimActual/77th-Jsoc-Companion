# v2.9.1 Preview 1 — dedicated server installation

**Experimental: desktop and relay tested using an HTTP server adapter; PC and WORKBENCH compilation passed on engine 1.8.0.13; the native diagnostic local-server HTTPS path is now tested, and a bounded standalone ArmaReforgerServer.exe HTTPS movement test passed.** Keep RC2 for the proven player-hosted path. No claim of whole-server tracking or stable dedicated support.

## What runs where
- Desktop PC: planner; optionally its bundled temporary relay and Cloudflare tunnel.
- Game server: updated bridge addon candidate and a private config in its profile directory. Only outbound HTTPS is required for bridge traffic.
- Relay: either the desktop-owned free tunnel, or relay/server.js behind your own HTTPS reverse proxy. No separate background service is needed on the game host.
- Players: use the matching addon listed by the server. This candidate retains the existing client pairing UI; install it as a regular shared addon, not an untested server-only mod.

## 1. Prepare the addon and scenario (administrator / Workbench)
1. Use reforger-mod/dedicated-candidate/JSOC_ORBAT_Bridge from the source ZIP. It extends the existing addon; do not enable two copies of the same addon identity.
2. Open its addon.gproj in Workbench. Build → Validate and Reload Scripts. This source candidate was compiled successfully with installed Reforger Tools for PC and WORKBENCH. Node tests alone do not establish that. Revalidate only if source or engine version changes; resolve any version-specific engine error before uploading.
3. In your scenario, give the ONE entity you explicitly authorise for tracking the unique editor name ORBAT_TRACKED_ENTITY. Names and entityId accept letters, digits, underscore and hyphen, up to 64 characters. This is a scenario entity name, not a player callsign. A player may possess that character. Automatic selection of arbitrary players on vanilla scenarios is not implemented.
4. Save and package your scenario as appropriate. Publish/update the addon through your existing Workbench Workshop project only after validation. Keep credentials out of the project. The already published Host Local version does not contain this dedicated sender.
5. Add the actual Workshop mod ID/version to the server's normal game.mods list and enable the scenario. Obtain IDs from the actual published items; no placeholder ID in this guide is a working addon.

## 2. Create the connection (desktop planner)
1. Launch the v2.9.1 Preview EXE. Settings gear → Live bridge → Server profiles / Dedicated server.
2. Name the profile, choose Dedicated server and Free temporary tunnel on this PC. Set interval 2 seconds, timeout 5 seconds, automatic reconnect enabled. Save profile.
3. Click Connect profile. Wait for the address and 32-character pairing code. These are different fields. Keep this PC and planner running.
4. Alternatively choose Existing HTTPS relay and its HTTPS ROOT address. Run the included v2 relay there. The game's gameplay IP/UDP port is NOT this endpoint. A v1-only relay is rejected explicitly.

## 3. Configure the game server (private server files, NOT Workbench resources)
Copy docs/JSOC_ORBAT_Dedicated.example.json into the engine's resolved `$profile:` directory, naming it JSOC_ORBAT_Dedicated.json. The `-profile` argument selects its parent: for `-profile A:/ServerTest`, use `A:/ServerTest/profile/JSOC_ORBAT_Dedicated.json`, not `A:/ServerTest/JSOC_ORBAT_Dedicated.json`. The engine log reports the directory mounted as `profile`; use that to verify a hosting provider's layout. [Official profile parameter](https://community.bistudio.com/wiki/Arma_Reforger:Startup_Parameters).
- Set enabled to true.
- endpoint: copy the ADDRESS from the desktop planner's Live bridge panel.
- pairingCode: copy the CODE from that same panel.
- entityName: exact scenario name from step 1.
- entityId: stable administrator-selected key, e.g. authorised_entity_1. Do not use a callsign.
- intervalMs: 2000; timeoutSeconds: 5; autoReconnect: true.
Restrict file access to trusted server administrators. Do not commit this file or include it in a Workshop upload. The sender checks it every five seconds. Stop/disabling removes network updates. If a provider prevents custom profile files or outbound HTTPS, that provider cannot use this path.

For an existing server config, merge a real addon entry into its existing game.mods array: {"modId":"YOUR_ACTUAL_WORKSHOP_MOD_ID","name":"77th JSOC ORBAT Bridge","version":"YOUR_PUBLISHED_VERSION"}. Do not replace the rest of the server configuration.

## 4. Verify in the game and desktop
1. Start the dedicated server and join with the matching mod. Look for the server log message: Dedicated sender enabled.
2. Possess/move the named character. Server log should acknowledge the permitted position. No server pause menu or local controller is required by this sender.
3. In the desktop, confirm receiving live data, an increasing update count, and the marker at the expected Everon location. The preserved imagery offset affects display only.
4. Move again; compare at multiple locations. Disconnect the server's relay access briefly. The desktop hides stale data and shows retries. Restore access within the retry limit.
5. Click Stop connection in the desktop. Credentials are revoked; sender stops after rejection. Mission JSON must be identical before and after tracking.
6. If the session expires (one hour) or retries are exhausted, create a new desktop connection and replace the private server address/code. A Quick Tunnel URL changes on restart. It can take time for public DNS to resolve.

## Status and troubleshooting
- Connected to relay / waiting: transport and pairing exist; no recent permitted position yet.
- Waiting for configured named entity (server log): verify exact editor name and loaded scenario. Vanilla player callsigns are not entity names.
- Unsupported relay: install this release's relay/server.js; do not point at a gameplay port.
- Authentication failed / expired: fresh Connect, new code, update private config. Do not reuse old codes.
- Reconnecting: five retries with increasing delays; no endless loop. After exhaustion, pair again.
- Lockout: repeated authenticated invalid messages stop only this session. Check sender/protocol, then create a new session. The offline planner stays usable.
- No public reachability: allow outbound HTTPS from game server and required Cloudflare connectivity on the desktop; test host/provider restrictions. No inbound game-port changes are required for the bridge.
- Changes to desktop interval/timeout are local; also edit server intervalMs/timeoutSeconds when desired.
- Switching profiles closes the previous bridge. Profiles store no pairing/read tokens; mission export never includes them.

## Disable / uninstall
Set enabled:false or remove the server-private JSON; sender halts within five seconds. Click Stop connection in the planner. Remove the addon from server configuration and restart if removing it entirely. Create a fresh desktop pairing session before enabling a disabled or revoked sender again; do not reuse its old pairing code. Delete saved desktop profiles independently. Offline missions are unaffected.

## Protocol and boundaries
Legacy {token,x,z} sessions remain supported. Dedicated sessions explicitly request protocol 2 and single-entity scope. Writer messages carry protocol, token, entityId, sequence, x, z. A paired session pins its first entity ID; conflicting entities/invalid messages lock that session after three authenticated violations. Duplicates do not advance revisions or refresh stale timestamps; older sequence values are rejected. Sender retries retain identical bytes. Latest positions coalesce; no events/commands or batched multi-unit feed are implemented. Limits: 2KB inbound marker; 4KB desktop relay response; supported Everon bounds ±13500m. No compression assumption is made for Enfusion.

## Official API references checked
- https://community.bistudio.com/wiki/Arma_Reforger:Server_Config
- https://community.bistudio.com/wiki/Arma_Reforger:Startup_Parameters
- https://community.bistudio.com/wikidata/external-data/arma-reforger/ArmaReforgerScriptAPIPublic/interfaceJsonLoadContext.html
- https://community.bistudio.com/wikidata/external-data/arma-reforger/EnfusionScriptAPIPublic/interfaceBaseWorld.html
- https://community.bistudio.com/wikidata/external-data/arma-reforger/ArmaReforgerScriptAPIPublic/interfaceSCR__GameModeEditor.html

The isolated compile gate passed for engine 1.8.0.13; see GM-EVENT-INSPECTION.md and test-evidence/enfusion-compile.json. These API references and compile results do not establish an actual dedicated runtime test or Workshop package validity.

## Native diagnostic gate — 13 October 2026
The actual Enforce sender and Companion desktop passed HTTPS position/movement and same-session interval reload in an isolated diagnostic local server. A reset-sequence bug was reproduced and fixed, followed by PC/WORKBENCH compilation and a native reload check. Native authentication rejection stops the sender without unchanged-config restart. A subsequent standalone server HTTPS movement test passed; Workshop publication remains pending. See [native runtime evidence and remaining gates](NATIVE-BRIDGE-RUNTIME.md).
