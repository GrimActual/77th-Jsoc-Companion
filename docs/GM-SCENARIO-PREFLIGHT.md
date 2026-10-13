# Scenario preflight review

Delivered 13 October 2026 in **2.9.1 Development 7**, following draft editing and history. This continues packages 05/06/07. It does not validate native game resources or execute a rehearsal.

## Steps
1. Open GM → Build a scenario → Scenario preflight. Settings → Game Master → Open scenario preflight is a shortcut.
2. Run preflight checks reviews applied draft rules and mission starting positions. It ignores unapplied JSON/form changes and live/rehearsal positions.
3. Review objectives with no prerequisite-completion path, blocked event prerequisites, conflicting objective statuses, later scheduled prerequisites, time-zero rules and starting-zone conditions.
4. Edit the draft as needed. Changed draft/reference positions mark results stale; unchanged validated draft replacements keep the report current. Undo/Redo returning to the reviewed inputs can restore freshness.
5. Export preflight report downloads separate diagnostic JSON for the current reviewed inputs. It contains IDs, names, counts and advisory codes, not raw mission assets, action report-text fields or bridge credentials. Up to 500 findings are displayed/exported; total counts identify additional findings.
6. Rehearse to verify actual behavior. Warnings do not prevent Start built scenario.

## Meaning and limits
Prerequisite analysis uses an optimistic completion closure: initially completed objectives and possible final completion actions from events whose prerequisites can potentially be met. It ignores time, zones and later failures when finding that potential path. A missing path flags self-blocking rules or missing completion actions; a found path does not prove that an executable event order exists.

Multiple statuses for one objective within an event follow the existing engine rule: its last action wins. A prerequisite scheduled later is advisory because the GM can fire eligible timed events early manually. Zone checks use initial mission coordinates; they do not predict navigation or guarantee entry. Time-zero events still require the engine's existing explicit rule checks. No background checks, automatic clock advances or game commands are added.

Preflight does not write draft history, mission saves, active journals or recovery copies. Export is separate from scenario/mission JSON. Invalid input rejects a review rather than issuing a successful report.

## Completed checks
- Eight focused tests passed: five new diagnostic tests and the three language/help checks. These cover cyclic prerequisites, conservative zone/time handling, last-write semantics, source isolation, invalid IDs/nonfinite values, determinism, report truncation and 43 translated Sarge topics.
- Actual Electron workflow passed findings/export, safe display of markup-like names, no mission/history/journal/recovery changes, freshness after no-op/edit/Undo/Redo, preservation of unapplied JSON, Settings/Sarge navigation and stale results after mission import.
- One explicit dense-report sample used 100 objectives, 200 events and 500 displayed findings: analysis plus DOM construction 43.2 ms; two-frame paint measurement 157.3 ms. JS heap sample 14.5 MiB, not total process/GPU memory. This is a limited review-latency sample, not a map-FPS or universal performance guarantee. See test-evidence/preflight-performance.json.
- Existing application/bridge/Enfusion gates were not repeated because no corresponding source changed. A future consolidated package still needs its release checks.

The reviewed optional GM workspace proposal is future package 14.1 design work; it is not part of this delivered preflight increment. Development 7 keeps the existing interface and data contracts.
