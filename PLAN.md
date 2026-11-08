# Lab 01 — Calculator, reconsidered

> Working notes.
> Update when a decision changes.

## Concept (1 sentence, your words)

A simple calculator with a visual response depending on the state and operator provided. Styled in ASCII.

## Scope

- In: two numbers (a, b) + one operator (+ − × ÷)
- Out: chaining, brackets, memory (maybe chaining)

## Data (types)

- `Operator` = "+" | "-" | "*" | "/"
- `Calculation` = { valueOne: number; valueTwo: number; op: Operator }
- `CalcResult` = { op: Operator; value: number }

## Rules

0. A field is empty → empty state (not an error, no message)
1. valueOne or valueTwo is not a number (NaN) → "Enter a number"
2. op is ÷ and valueTwo is 0 → "Can't divide by zero"

## States

| State | When                                        | What the user sees                         |
| ----- | ------------------------------------------- | ------------------------------------------ |
| empty | one or both fields are empty                | `---` (neutral, no message)                |
| valid | both fields are numbers and it's not ÷0     | the full sum and answer, e.g. `5 × 3 = 15` |
| error | a field isn't a number, or dividing by zero | the matching error message                 |

## Layers

1. Logic — `validate()`, `calculate()` (no DOM!)
2. Interface — read inputs → validate → calculate → show text + state
3. Mapping — `toVisual()`
4. Render — ASCII grid + motion

## Milestones

- [DONE] 1. PLAN.md filled
- [ ] 2. Types written
- [ ] 3. `validate()` works (tested in console)
- [ ] 4. `calculate()` works (tested in console)
- [ ] 5. HTML inputs + output in place
- [ ] 6. DOM wired: live update on input
- [ ] 7. 3 states visible
- [ ] 8. `npm run build` → 0 errors, README filled

## Log (what I learned / got stuck on)

-
