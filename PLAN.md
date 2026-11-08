# Lab 01 — Calculator, reconsidered

> Working notes. Fill in the blanks *before* you code each part.
> Update this file when a decision changes.

## Concept (1 sentence, your words)
_ _ _

## Scope
- In: two numbers (a, b) + one operator (+ − × ÷)
- Out: chaining, brackets, memory (maybe chaining next week)

## Data (types)
- `Operator` = which values? → _ _ _
- `Calculation` = which fields? → _ _ _
- `CalcResult` = which fields? → _ _ _

## Rules
- What counts as invalid input? List every case:
  1. _ _ _
  2. _ _ _
  3. _ _ _
- Error message for each (short, human):
  1. _ _ _

## States
| State | When | What the user sees |
|---|---|---|
| empty | _ _ _ | _ _ _ |
| valid | _ _ _ | _ _ _ |
| error | _ _ _ | _ _ _ |

## Layers (today = 1 + 2 + DOM text only)
1. Logic — `validate()`, `calculate()` (no DOM!)
2. Interface — read inputs → validate → calculate → show text + state
3. Mapping — `toVisual()` (next Sunday)
4. Render — ASCII grid + motion (next Sunday)

## Milestones
- [ ] 1. PLAN.md filled
- [ ] 2. Types written
- [ ] 3. `validate()` works (tested in console)
- [ ] 4. `calculate()` works (tested in console)
- [ ] 5. HTML inputs + output in place
- [ ] 6. DOM wired: live update on input
- [ ] 7. 3 states visible
- [ ] 8. `npm run build` → 0 errors, README filled

## Log (what I learned / got stuck on)
- 
