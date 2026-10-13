"""Optional development check; requires jsonschema, never used by the desktop runtime."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator
from referencing import Registry, Resource
root = Path(__file__).resolve().parents[1]
schemas = {p.name: json.loads(p.read_text(encoding="utf-8")) for p in (root / "schemas").glob("*.schema.json")}
registry = Registry()
for schema in schemas.values():
    Draft202012Validator.check_schema(schema)
    registry = registry.with_resource(schema["$id"], Resource.from_contents(schema))
cases = json.loads((root.parent / "docs/test-evidence/scenario-schema-corpus.json").read_text(encoding="utf-8"))
for case in cases:
    result = Draft202012Validator(schemas[case["schema"]], registry=registry).is_valid(case["data"])
    assert result == case["valid"], case["name"]
print(f"PASS {len(schemas)} schemas and {len(cases)} contract cases")
