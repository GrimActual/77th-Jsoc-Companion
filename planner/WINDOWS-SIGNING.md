# Windows signing status

This build is UNSIGNED. No certificate has been obtained and no claim of Microsoft approval is made.
The blue Windows protected your PC / Run anyway prompt is SmartScreen reputation, rather than proof of an antivirus malware detection.

## Free signing path
SignPath Foundation offers signing for eligible open-source projects, subject to their review. Repository URL, ownership, released source, verifiable builds, licensing of all bundled components and project reputation must be reviewed before applying. The package.json ISC field alone does not establish that all distributed assets qualify. In particular, review terrain imagery, logos and third-party binaries. Do not relicense third-party material.

https://signpath.org/terms.html

The present package copies an existing Electron runtime. It must be replaced by a reproducible, pinned build workflow before claiming verifiable source-to-release provenance. Agree the Electron installer/binary signing scope with SignPath; do not sign upstream binaries under an unapproved identity. Provider application, approved repository integration and credentials remain outstanding.

## Release verification
Run tools/audit-release.ps1 with ReleaseFolder pointing at the extracted Windows release and ReportPath pointing outside that folder. It records SHA-256 hashes and the actual EXE Authenticode status. Add -RequireSigned for the signed-release gate: it rejects unsigned/invalid/untimestamped binaries. Hashes are integrity information, not trusted signatures. This EXE-only gate must be extended to an installer if an installer is introduced.

After approved signing, verify the timestamped signature, package without modifying signed files, and publish checksums alongside the download. Never commit private keys, tokens or certificate passwords. Signing does not guarantee immediate SmartScreen reputation.
https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation

Do not disable Defender or ask users to add blanket exclusions. A named malware detection is a separate issue needing investigation and, if incorrect, Microsoft developer submission.
