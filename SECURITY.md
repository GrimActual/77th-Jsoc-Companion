# Security policy

## Reporting a vulnerability

Use [Report a vulnerability](https://github.com/GrimActual/COMMAND-ORBAT-Mission-Planner/security/advisories/new) to contact the maintainer privately through GitHub. Do not open a public issue or pull request containing exploit details, pairing codes, credentials, private relay addresses, personal information or unredacted logs.

Include the exact release tag or source commit, component, operating system, expected impact, minimal reproduction steps and a redacted proof of concept. Use your own systems or an isolated synthetic fixture. Do not send game binaries, copyrighted asset packs or other people's mission data. No production server access is required to report a concern.

If the private form is unavailable, open a public issue containing only "Private security contact requested" and wait for a private channel. Do not include the vulnerability or affected deployment details in that issue.

## Scope and maintained versions

Reports are welcome for the desktop planner, local services/relay, pairing and authorisation, file import/export, compiler/review tooling, bundled dependencies and companion addon. Ordinary bugs and feature requests belong in the public issue templates.

Security fixes are developed on the active development branch and delivered through a subsequent release. The latest stable release is the preferred starting point; prereleases and development builds remain experimental. Older releases are not separate maintained security branches: update to a release containing the fix. This volunteer project offers no guaranteed response time, maintenance period or service-level agreement.

## Coordinated disclosure

The maintainer will make a best-effort assessment, coordinate reproduction and discuss disclosure and credit with the reporter. Please allow time to investigate before publishing details that would expose users. Acknowledgement or a proposed advisory is not proof that a report is confirmed or that a fix is available.

## Safe operation

Connect only to relay endpoints you trust, keep pairing credentials private, and review in-game approvals before execution. Compiler findings and imported JSON are not permission to execute source code. Security testing must not scan unrelated players, servers or networks.
