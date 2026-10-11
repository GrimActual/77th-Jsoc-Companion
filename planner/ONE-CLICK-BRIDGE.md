# One-click live bridge — 2.9.0-remote.2

Open Settings > Live bridge > Start free connection. Wait for Ready. Copy address into the first field of the in-game ORBAT panel; copy pairing code into the second. Click CONNECT in the game, resume, and control a soldier. Find live marker centers the planner on your character.

Stop connection closes the tunnel started by this planner. Reload/exit does the same. No hosting account, credit card, Node installation or separate relay launcher is needed. The portable cloudflared helper is bundled. Do not move the EXE away from its resources folder.

Keep your PC awake. Each new free connection has a new address and code. Codes expire after one hour. A temporary Cloudflare service has no uptime guarantee. A lost connection clears stale positions and reports the failure. Tunnel startup can take over a minute on a slow network; Stop can cancel it.

The existing published mod is compatible. No mod reupload is needed for these planner controls. One host-controlled character is supported. Multiple landmark alignment was verified by the user; the bridge uses the provider's +50 m imagery offset while retaining raw game coordinates.

The previous Remote-Bridge-Test folder remains unchanged. This build uses a separate settings/autosave profile: import your saved project JSON if desired.

Bundled cloudflared 2026.10.0 is unmodified, from Cloudflare's official release, licensed under Apache 2.0. See bridge-runtime/CLOUDFLARED-LICENSE.txt. Source: https://github.com/cloudflare/cloudflared/tree/2026.10.0 . The helper opens only a temporary tunnel to the bridge's local HTTP listener.
