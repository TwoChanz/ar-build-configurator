# AR Build Configurator

An interactive AR-15 **build-planning / shopping tool**. Pick a build goal, get
sensible default parts and a target price band, swap components across a 13-part
catalog, and watch a data-driven compatibility engine flag conflicts in real
time — all next to an abstract 3D schematic that shows *where each part goes*.

> This is a planning tool. Prices/tiers are **approximate estimates, not
> endorsements**, and nothing here is legal advice. The lower receiver is the
> regulated part; configuration legality varies by state — confirm legality for
> your jurisdiction before buying or assembling.

## Stack

- **Vite + React + TypeScript** (strict, no `any`)
- **Three.js** via **@react-three/fiber** + **@react-three/drei** for the schematic
- Plain **CSS Modules** + a single design-tokens file (machined-steel theme)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks (tsc -b) then builds to dist/
npm run preview   # serve the production build
```

## Project structure

```
src/
  data/
    parts.ts        # PARTS catalog (13 categories) + GOALS + compliance note
    rules.ts        # declarative Rule[] — the compatibility/insight engine
  three/
    RifleModel.tsx  # blocked-out schematic; meshes keyed to meshKey + highlight
    Scene.tsx       # Canvas, lights, OrbitControls, idle auto-spin
  components/        # BuildPanel, CategoryAccordion, OptionRow, TotalBar,
                     # QuickFillBar, GoalPicker, InsightsStrip
  state/
    store.tsx       # reducer + context (selection, goal, highlight)
    selectors.ts    # resolve selection, totals, insight evaluation
  styles/tokens.css # design tokens
  types/index.ts    # shared domain types
```

## Extending it

- **Add a category or a 4th option** → edit `src/data/parts.ts` only.
- **Add a compatibility rule / insight** → append one object to
  `src/data/rules.ts`. Rules are pure predicates over the current build; the UI
  only ever surfaces messages that come from this array (nothing is invented at
  runtime).
- **Add a build goal** → add a `GoalDef` to `GOALS` in `parts.ts` (and the
  `Goal` union in `types/index.ts`).

## How the insight engine works

Each `Rule` has a `severity` (`error` | `warn` | `tip`), a `message`, a `test`
predicate, an optional `appliesToGoal` filter, and optional `highlight` mesh
keys. The Insights strip evaluates every rule against the live selection + goal,
groups results by severity, and clicking a message highlights the referenced
component groups on the 3D model. Shipped rules include gas-system/barrel-length
cycling mismatches, short-barrel buffer weight, the Geissele-trigger vs
mil-spec-selector conflict (resolved by the Atrius G-Lever), handguard/barrel
clearance, and goal-fit budget tips.
