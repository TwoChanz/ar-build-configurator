# FRT / Super-Safety Build Configurator

An interactive **build-planning / shopping tool** for AR-15 builds centered on a
fire-control device — a **forced-reset trigger (FRT)**, a **binary trigger**, or
a **Super Safety (three-way) selector**. Pick the platform, then a price level;
get sensible default parts and a target price band; swap components across a
13-part catalog; and watch a data-driven engine flag device conflicts and the
reliability issues (BCG profile, buffer weight, gas/dwell) that make these
devices run — all next to a 3D schematic whose barrel/handguard length is
parametric.

> **Planning tool only.** Prices/tiers are approximate estimates, not
> endorsements. Forced-reset, binary, and three-way "Super Safety" devices sit
> in a contested, fast-changing legal space — the ATF has classified some as
> machine guns and many states ban them. Nothing here is legal advice or
> installation instructions. Confirm current federal ATF classification and your
> state/local law before buying or assembling anything.

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
npm test          # run the rules-engine / selectors / export test suite (Vitest)
```

Builds are **saved to localStorage** (a refresh restores your build) and can be
**shared as a link** (`…#b=<encoded>`) or **exported** as a copyable parts list
or a CSV. Shared/stored builds are validated against the current catalog, so a
stale link can never inject unknown parts.

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
predicate, an optional `appliesToArchetype` filter, and optional `highlight`
mesh keys. The Insights strip evaluates every rule against the live selection +
platform, groups results by severity, and clicking a message highlights the
referenced component groups on the 3D model. Shipped rules include: FRT/binary +
Super-Safety device conflict, full-auto BCG profile for reliable reset timing,
buffer-weight (H2) tuning, gas/dwell adequacy (carbine-gas preferred for forced
reset), gas-length cycling mismatch, handguard/barrel clearance, an always-on
legal-caution tip when a device is present, and an over-budget tip.
