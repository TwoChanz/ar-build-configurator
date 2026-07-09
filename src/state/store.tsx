import { createContext, useContext, useMemo, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'

import { PARTS } from '../data/parts'
import { buildDefaults } from './selectors'
import type { Archetype, BudgetLevel, Category, CategoryId, MeshKey, Selection, Tier } from '../types'

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

/* ---------- state ---------- */

export interface State {
  archetype: Archetype
  budgetLevel: BudgetLevel
  hasChosen: boolean
  selection: Selection
  /** Categories the user picked by hand — protected from silent goal changes. */
  manual: Partial<Record<CategoryId, true>>
  openCategory: CategoryId | null
  /** Mesh groups currently highlighted in brass on the schematic. */
  highlight: MeshKey[]
}

export const initialState: State = {
  archetype: 'standard',
  budgetLevel: 'mid',
  hasChosen: false,
  selection: {},
  manual: {},
  openCategory: null,
  highlight: [],
}

export type Action =
  /** Finalize the picker: set archetype + level and optionally seed defaults. */
  | { type: 'CHOOSE'; archetype: Archetype; budgetLevel: BudgetLevel; applyDefaults: boolean }
  /** Change archetype later without touching manual picks. */
  | { type: 'SET_ARCHETYPE'; archetype: Archetype }
  /** Change budget level later without touching manual picks. */
  | { type: 'SET_BUDGET'; budgetLevel: BudgetLevel }
  /** Explicitly apply the current archetype + level defaults (overwrites all). */
  | { type: 'APPLY_SUGGESTIONS' }
  | { type: 'SELECT_OPTION'; category: CategoryId; option: string }
  | { type: 'QUICK_FILL'; tier: Tier }
  | { type: 'RESET' }
  | { type: 'TOGGLE_CATEGORY'; category: CategoryId }
  | { type: 'SET_HIGHLIGHT'; highlight: MeshKey[] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CHOOSE': {
      const selection = action.applyDefaults
        ? buildDefaults(action.archetype, action.budgetLevel)
        : state.selection
      return {
        ...state,
        archetype: action.archetype,
        budgetLevel: action.budgetLevel,
        hasChosen: true,
        selection,
        manual: action.applyDefaults ? {} : state.manual,
      }
    }

    case 'SET_ARCHETYPE':
      // Never touches selection — the panel offers "apply suggestions" instead.
      return { ...state, archetype: action.archetype }

    case 'SET_BUDGET':
      return { ...state, budgetLevel: action.budgetLevel }

    case 'APPLY_SUGGESTIONS':
      return {
        ...state,
        selection: buildDefaults(state.archetype, state.budgetLevel),
        manual: {},
      }

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
