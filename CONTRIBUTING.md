# Contributing to COMMAND

COMMAND is an independent ORBAT and mission planner. Bug reports, reproducible fixtures, documentation, accessibility improvements and focused code changes are welcome. Follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report vulnerabilities privately using [SECURITY.md](SECURITY.md).

## Before starting

Search existing issues and read the [roadmap](ROADMAP.md). Discuss large changes before implementing them. Preserve existing goals: roadmap additions must not silently remove agreed work. Use COMMAND branding; preserve compatibility identifiers and original external-project provenance where necessary.

For active feature/compiler work, branch from `development/tracking-pilot` and target that branch in a pull request. Community documentation fixes can target `main`. Main and published release tags can lag behind development; state which version you tested. Do not rewrite published tags or replace historical release assets in a contribution.

## Development and checks

Read [AGENTS.md](AGENTS.md) and the relevant component documentation. Use the Node version declared by the component; compiler CI currently covers Node 22 and 24. From the repository root on the active development branch, `npm run test:sqf-core --prefix planner` runs the dependency-free compiler/review checks. For planner work use `npm test --prefix planner`; for relay work use `npm test --prefix relay`. Installing/running the desktop app requires its documented dependencies; use `npm ci` where a lockfile exists.

Run checks relevant to your change. A passing check need not be repeated unless behavior changed, a failure occurred or an unresolved concern justifies it. Record the command, result, runtime/platform and any checks you could not perform. Never call a mocked or synthetic result native engine validation. Changes to Enfusion behaviour require compilation and bounded real-runtime evidence; CI does not launch the game or validate a live server.

## Compatibility, safety and performance

- Preserve offline planning, existing saved missions and data contracts. Keep live/rehearsal state outside normal saved plans and editor undo.
- Never execute imported SQF or Enforce source to inspect it. Keep source limits, path containment, cancellation, stale-review rejection and explicit approval gates intact.
- Do not add automatic connections or recovery execution at startup. Never hard-code private pairing codes, tokens or relay addresses.
- Keep persistent preferences in Settings, separately from mission JSON. For user-facing changes update Sarge, Settings shortcuts and relevant English/French/German guidance.
- Measure meaningful map, playback, storage or network changes against the same prior-build fixture. Separate measured costs from estimates; do not present a short sample as an FPS or leak guarantee.

## Issues and pull requests

Use the bug, feature or conversion-fixture template. Include exact versions, minimal steps, expected/actual results and redacted evidence. A small authorised text sample is preferable to an entire mod. Do not post pairing credentials, private server details, proprietary game files or personal data.

Keep pull requests focused. Explain the problem, resulting behavior, validation, compatibility risks and any remaining gates. State whether changes affect the app, developer tools, relay or addon. Screenshots should use synthetic plans and redacted logs. A reviewer should be able to assess the final result without reading a chat history.

## Licensing and rights

New contributions to original COMMAND code are provided under [GPL-3.0-only](LICENSE), unless a separately licensed component explicitly says otherwise. Keep third-party licences, authorship and notices intact. Do not add code, models, audio, maps, fixtures or images unless you have the necessary rights to distribute them here. Permission to test someone's mod is not blanket permission to publish their source or assets.

No copyright assignment or additional contributor agreement is required by this guide. Imported user mods and generated output do not automatically become GPL solely because COMMAND processes them. See [licensing scope](docs/LICENSING.md).
