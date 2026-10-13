"""Independent wire-shape checks; runtime review additionally validates values/targets."""
import copy
import json
from pathlib import Path
from jsonschema import Draft202012Validator
root = Path(__file__).resolve().parents[1]
schema = json.loads((root/'schemas/property-request-v1.schema.json').read_text(encoding='utf-8'))
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema)
sample = json.loads((root/'examples/PROPERTY-REQUEST-V1.json').read_text(encoding='utf-8'))
cases = [('sample', sample, True)]
for name, mutation, expected in [
    ('future version', lambda x: x.update(version=2), False),
    ('secret field', lambda x: x.update(token='private'), False),
    ('missing source', lambda x: x.pop('source'), False),
    ('empty source', lambda x: x['source'].update(label=''), False),
    ('empty changes', lambda x: x.update(changes=[]), False),
    ('fractional ID', lambda x: x['changes'][0].update(unitId=1.5), False),
    ('negative ID', lambda x: x['changes'][0].update(unitId=-1), False),
    ('unsafe field syntax', lambda x: x['changes'][0].update(property='__proto__'), False),
    ('missing value', lambda x: x['changes'][0].pop('value'), False),
    ('unsupported name reaches review diagnostics', lambda x: x['changes'][0].update(property='nativeBudget'), True),
]:
    data = copy.deepcopy(sample)
    mutation(data)
    cases.append((name, data, expected))
for name, data, expected in cases:
    assert validator.is_valid(data) == expected, name
print(f'PASS property-request schema and {len(cases)} wire cases')
