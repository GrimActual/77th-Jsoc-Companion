# Enfusion resource formats — importer reference

User-supplied format inventory reviewed 13 October 2026. This is reference guidance for package 12, not a delivered importer for every format.

## Verified clarifications
- `.pap` is a Procedural Animation project, not simply a second compiled-animation format. `.txa` is intermediate text animation; `.txo` is text model data, with `.anm` and `.xob` runtime outputs respectively.
- The list is broad but not exhaustive: resource databases `.rdb`, animation workspaces `.aw`, particle definitions `.ptc`, ragdolls `.ragdoll` and original source assets such as `.fbx` are also relevant.
- Workbench creates `.meta` for registered resources, excluding scripts. It contains a resource GUID and import/build settings. A format inventory is not a complete internal schema or component contract.
- Publishing omits source-side files including `.meta`, `.txa` and `.txo`. A packaged mod is not equivalent to its editable source project; do not assume all GUID sidecars or source data are recoverable from a `.pak`.

Primary references:
- [File Types](https://community.bistudio.com/wiki/Arma_Reforger:File_Types)
- [Workbench Metadata](https://community.bistudio.com/wiki/Arma_Reforger:Workbench_Metadata)
- [FBX Import](https://community.bistudio.com/wiki/Arma_Reforger:FBX_Import)
- [Animation Export](https://community.bistudio.com/wiki/Arma_Reforger:Enfusion_Blender_Tools:_Import/Export_Animation)
- [Mod Publishing Process](https://community.bistudio.com/wiki/Arma_Reforger:Mod_Publishing_Process)

## Companion design implications
Classify resources before parsing. A future index should record resource type, source addon/project, GUID when known, path, dependencies, provenance, known availability and version. Missing or ambiguous resolution must stay explicit. A known asset entry does not prove that the game server has its required mod.

Start with authorised readable project metadata, mission headers, prefab/component references and scene placements. Resolve registered identifiers through verified Workbench/resource information rather than assuming every file has a readable sidecar. Retain permitted metadata and asset references in Companion; leave compiled geometry, audio, animations, navmeshes and terrain execution with Enfusion.

Do not treat all extensions as interchangeable text formats, invent universal parsers or claim native validation from extension matching. Any binary/archive path needs its own supported, permissioned reader and capability limits. Files that cannot be inspected remain indexed as unsupported/opaque instead of being guessed at or advertised as imported.

This extends packages 04/05/10/11/12/16 without changing the offline-first planner goal or requiring native engine dependencies. No application or addon code changed, and no passing tests were repeated for this documentation update.
