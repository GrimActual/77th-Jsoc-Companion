# Native bridge integration gate — 13 October 2026

The read-only bridge was exercised by the real installed `ArmaReforgerSteamDiag.exe` in local-server mode, using a tiny isolated world, the actual Enforce candidate, a temporary Cloudflare HTTPS relay and the actual Development 14 Companion desktop. This is more than compilation or a JavaScript sender simulation. It is **not** a standalone `ArmaReforgerServer.exe` test, Workshop publication test, engine command adapter or whole-server/player discovery test.

## Passed gates
- Workbench's native `Resource.Load` resolved the installed plain game-mode prefab and its faction/loadout/weather managers. Resource identities/class names came from the engine rather than invented GUID mappings.
- Native SCR_BaseGameMode.OnGameStart started the dedicated sender automatically. The configured named synthetic entity existed in the world.
- The Enforce REST callback acknowledged HTTPS writes. Companion received X/Z `4241.47 / 9469.76`, then `4341.47 / 9569.76` after the entity moved. Its update count reached 10. Mission JSON remained unchanged.
- A native lifecycle check reproduced a bug: changing the interval with the same pairing session reset the sequence counter, which the relay correctly rejected as stale. The sender now retains the counter for the same endpoint, code and entity ID while reloading interval/timeout settings. New stream identity starts a new counter.
- The changed candidate compiled successfully for both PC and WORKBENCH in isolated copies. The focused runtime retest continued from 3 to 8 accepted updates through interval reload, including movement, with the mission unchanged.
- With the relay kept reachable, an invalid temporary test credential triggered native authentication rejection and stopped the sender. The unchanged private configuration did not restart it across the following config poll. Successful runtime checks logged zero script errors.
- All test processes, temporary relay/tunnel and private credentials were cleaned up. The private test config was replaced with `enabled:false`; cleanup confirmed no test diagnostic process or cloudflared helper remained.

## Setup correction
`-profile A:/ServerTest` mounts `$profile:` at `A:/ServerTest/profile`. Therefore the private file belongs at `A:/ServerTest/profile/JSOC_ORBAT_Dedicated.json`, not directly at `A:/ServerTest/JSOC_ORBAT_Dedicated.json`. Check the engine log's filesystem mount on a hosting provider. [Official startup parameters](https://community.bistudio.com/wiki/Arma_Reforger:Startup_Parameters).

The initial bare game-mode fixture was incomplete. The installed plain prefab also needs its faction, loadout and weather world managers; adding those resolved the fixture's script errors. No initial failing smoke test is counted as an integration pass. `-wbsilent` was useful for validation but did not run the resource-lookup plugin; the documented Workbench plugin invocation with its proper working directory did. [Official plugin workflow](https://community.bistudio.com/wiki/Arma_Reforger:Workbench_Plugin_Tutorial).

## Test boundaries and performance
The user explicitly authorised the diagnostic executable and the external temporary HTTPS test payload: a short-lived pairing code plus synthetic entity positions. No mission files, arbitrary commands or discovered-player data were sent. No injection, game-memory reads, anti-cheat changes or installed game-file edits were involved. Process working-set sampling is a coarse OS memory metric, not reading game memory contents.

The basic native position phase took 19.3 seconds with sampled peak working set about 616 MB. Later lifecycle/authentication runs sampled about 1,016/1,014 MB. All launches had a 1.8 GB guard; the baseline executable was capped at 15 FPS to limit the fixture's load. These are short native-test samples, not Companion FPS, a stability soak or a promise for a full Everon world. A separate incomplete fixture was deliberately terminated at its deadline. Full release assurance remains necessary before packaging.

The free connection's Stop closes its relay and tunnel. That is a transport interruption, not a guaranteed native 401 response. A test that expected immediate authentication rejection after closing the free tunnel was corrected; native credential rejection was tested while the relay remained reachable. A real endpoint-preserving session-revocation and prolonged transport-failure/retry-limit test remain future runtime checks.

## What to do next
1. Complete standalone dedicated-server testing using an administrator-approved real scenario and named entity. This machine currently has the diagnostic game and Tools; the standalone server executable was not located in the checked installations.
2. Validate the actual Workshop candidate upload/layout/dependencies. Update the existing published addon rather than enable two copies with the same addon identity. The published Host Local item does not acquire dedicated support just because the desktop was updated.
3. Run the consolidated release regression/performance gate, then package the release candidate. No additional feature build was created for this fix; Development 14's desktop guides are corrected, and the dedicated candidate source is fixed separately.

## Precise steps for the server administrator
Follow [Dedicated server setup](DEDICATED-SERVER.md). Select the resolved private profile folder, create a fresh pairing connection in Companion, put ADDRESS into endpoint and CODE into pairingCode, and authorise the exact named scenario entity. Config changes inside the same active stream preserve its sequence; after disabling/revoking a sender, start a fresh pairing session before enabling again.

Français : avec `-profile A:/ServerTest`, placez le fichier privé dans `A:/ServerTest/profile/JSOC_ORBAT_Dedicated.json`. Les changements d’intervalle conservent la séquence de la session active. Après désactivation ou révocation, créez une nouvelle session. Le test natif est validé en serveur local de diagnostic ; serveur dédié autonome et publication Workshop restent à vérifier.

Deutsch: Mit `-profile A:/ServerTest` liegt die private Datei unter `A:/ServerTest/profile/JSOC_ORBAT_Dedicated.json`. Intervalländerungen behalten die Sequenz der aktiven Sitzung. Nach Deaktivierung oder Widerruf eine neue Kopplung erstellen. Der native Test im Diagnose-Lokalserver ist bestanden; eigenständiger dedizierter Server und Workshop-Veröffentlichung sind noch zu prüfen.

## Retained evidence
[Sanitized native results](test-evidence/native-bridge-runtime.json) and [updated compile evidence](test-evidence/enfusion-compile.json). Full local test artifacts remain in `A:/Everon-ORBAT-Development/work/native-bridge-runtime-20261013-171802`; original reports are retained with their correct scopes. The synthetic world/motion component and private profiles are not included in the Workshop candidate or release source. All published/Preview 5 packages remain unchanged.
