# Complete scenario editing and schema contracts — 13 October 2026

Available in experiments/gm-desktop. Existing release ZIPs are unchanged.

1. Open GM → Build a scenario. To edit a loaded definition, use Copy active scenario into builder.
2. Expand Edit complete scenario JSON and click Refresh editor from draft.
3. Edit the JSON. Multi-action events and combined conditions are supported by the core. Preserve references to actual mission unit/phase IDs and objective IDs; use scenario version 2 for spatial conditions.
4. Validate JSON without applying checks the text without changing anything. Validate and apply JSON to draft replaces the validated draft only. Syntax/schema/reference failures preserve the last valid draft and running rehearsal.
5. Export scenario JSON saves the validated draft. Start built scenario explicitly replaces the current rehearsal; export its journal first. Unapplied text is not exported or started. Refresh replaces that text with the draft. Editing the mission clears both draft and editor to avoid stale references.

Schema files are in planner/schemas: scenario-v1.schema.json, scenario-v2.schema.json, journal-v2.schema.json. They use JSON Schema Draft 2020-12 (https://json-schema.org/specification). Register the URN $id values when resolving journal references to the scenario schemas. No remote schema download is needed once registered.

These schemas validate structure, field limits and allowlisted message shapes. Duplicate ID checks, valid mission references, ordered revisions and deterministic replay remain enforced by planner-core/scenario-core. A structural schema pass does not grant permissions or establish that a scenario works with a particular mission. Version-1 journals are still accepted by the runtime migration path; the supplied journal schema describes current version-2 exports.

Independent validation: jsonschema 4.x in an isolated test-only directory checked all three schemas against their meta-schema and passed nine valid/invalid contract cases. No app dependency was added. For developers with jsonschema installed, run python planner/tools/check-scenario-schemas.py. Recorded results and fixtures are in docs/test-evidence/scenario-schema-validation.json and scenario-schema-corpus.json.

Desktop test: complete editing with multiple actions and two conditions; validate-only leaves the active journal untouched; apply changes only the draft; invalid JSON preserves prior rules; exported scenario exactly matches the edited definition; execution and temporary zones match the rules; mission unchanged. Sarge now contains 36 fully translated topic guides.
