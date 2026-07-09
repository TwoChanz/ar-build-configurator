import { createContext, useContext, useMemo, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'

import { GOALS, PARTS } from '../data/parts'
import type { Category, CategoryId, Goal, MeshKey, Selection, Tier } from '../types'

/* ---------- lookups ---------- */

const CATEGORY_BY_ID = Object.fromEntries(PARTS.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>

/** Best (highest-ranked) option at a given tier, falling back to overall best. */
function bestAtTier(category: Category, tier: Tier): string {
  const match = category.options.find((o) => o.tier === tier)
  return (match ?? category.options[0]).id
}

/** The full default selection a goal suggests (overrides win, else its tier). */
function goalDefaults(goal: Goal): Selection {
  const def = GOALS.find((g) => g.id === goal)
  if (!def) return {}
  const sel: Selection = {}
  for (const cat of PARTS) {
    sel[cat.id] = def.overrides?.[cat.id] ?? bestAtTier(cat, def.defaultTier)
  }
  return sel
}

/* ---------- state ---------- */

export interface State {
  goal: Goal
  hasChosenGoal: boolean
  selection: Selection
  /** Categories the user picked by hand — protected from silent goal changes. */
  manual: Partial<Record<CategoryId, true>>
  openCategory: CategoryId | null
  /** Mesh groups currently highlighted in brass on the schematic. */
  highlight: MeshKey[]
}

export const initialState: State = {
  goal: 'none',
  hasChosenGoal: false,
  selection: {},
  manual: {},
  openCategory: null,
  highlight: [],
}

export type Action =
  /** Choose a goal from the picker. `applyDefaults` fills suggested parts. */
  | { type: 'CHOOSE_GOAL'; goal: Goal; applyDefaults: boolean }
  /** Change goal later without touching manual picks. */
  | { type: 'SET_GOAL'; goal: Goal }
  /** Explicitly apply the current goal's suggested defaults (overwrites all). */
  | { type: 'APPLY_SUGGESTIONS' }
  | { type: 'SELECT_OPTION'; category: CategoryId; option: string }
  | { type: 'QUICK_FILL'; tier: Tier }
  | { type: 'RESET' }
  | { type: 'TOGGLE_CATEGORY'; category: CategoryId }
  | { type: 'SET_HIGHLIGHT'; highlight: MeshKey[] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CHOOSE_GOAL': {
      const selection = action.applyDefaults ? goalDefaults(action.goal) : state.selection
      return {
        ...state,
        goal: action.goal,
        hasChosenGoal: true,
        selection,
        // suggestions are not "manual" — a later goal change may re-suggest them
        manual: action.applyDefaults ? {} : state.manual,
      }
    }

    case 'SET_GOAL':
      // Never touches selection — the panel offers "apply suggestions" instead.
      return { ...state, goal: action.goal }

    case 'APPLY_SUGGESTIONS':
      return { ...state, selection: goalDefaults(state.goal), manual: {} }

    case 'SELECT_OPTION': {
      const cat = CATEGORY_BY_ID[action.category]
      return {
        ...state,
        selection: { ...state.selection, [action.category]: action.option },
        manual: { ...state.manual, [action.category]: true },
        highlight: cat ? [cat.meshKey] : state.highlight,
      }
    }

    case 'QUICK_FILL': {
      const selection: Selection = {}
      for (const cat of PARTS) selection[cat.id] = bestAtTier(cat, action.tier)
      return { ...state, selection, manual: {} }
    }

    case 'RESET':
      return { ...state, selection: {}, manual: {}, highlight: [], openCategory: null }

    case 'TOGGLE_CATEGORY': {
      const open = state.openCategory === action.category ? null : action.category
      const cat = open ? CATEGORY_BY_ID[open] : null
      return { ...state, openCategory: open, highlight: cat ? [cat.meshKey] : [] }
    }

    case 'SET_HIGHLIGHT':
      return { ...state, highlight: action.highlight }

    default:
      return state
  }
}

/* ---------- context ---------- */

const StoreContext = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
