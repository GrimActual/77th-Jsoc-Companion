"""Development-only JSON Schema gate; needs jsonschema, no desktop dependency."""
import copy
import json
from pathlib import Path
from jsonschema import Draft202012Validator

root = Path(__file__).resolve().parents[1]
schema = json.loads((root / 'schemas/resource-index-v1.schema.json').read_text(encoding='utf-8'))
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema)
sample = json.loads((root / 'examples/RESOURCE-INDEX-V1.json').read_text(encoding='utf-8'))
cases = [('documented sample', sample, True)]
for name, mutate in [
    ('future version', lambda x: x.update(version=2)),
    ('unknown root field', lambda x: x.update(secret='private')),
    ('zero owner', lambda x: x['addons'][0].update(id='0'*16)),
    ('noncanonical GUID', lambda x: x['addons'][0].update(id=x['addons'][0]['id'].lower())),
    ('empty name', lambda x: x['addons'][0].update(name='')),
    ('whitespace source', lambda x: x['resources'][0]['provenance'].update(source='  ')),
    ('native availability claim', lambda x: x['resources'][0].update(observation='server-confirmed')),
    ('missing provenance', lambda x: x['resources'][0].pop('provenance')),
    ('absolute path', lambda x: x['resources'][0].update(path='/test.c')),
    ('backslash wire path', lambda x: x['resources'][0].update(path='Scripts\\test.c')),
    ('empty dependency identity', lambda x: x['resources'][0].update(dependencies=[{'addonId':None,'guid':None,'path':None}])),
    ('unknown dependency field', lambda x: x['resources'][0]['dependencies'][0].update(available=True)),
]:
    data = copy.deepcopy(sample)
    mutate(data)
    cases.append((name, data, False))
for name, data, expected in cases:
    assert validator.is_valid(data) == expected, name
print(f'PASS resource schema and {len(cases)} canonical wire cases')
