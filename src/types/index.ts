/**
 * Shared domain types for the AR build configurator.
 * No `any` anywhere — every selection, goal, and derived insight is typed.
 */

/* ---------- Parts catalog ---------- */

export type Tier = 'Premium' | 'Mid' | 'Budget'

/** Barrel gas-system length. Drives the cycling-reliability rules. */
export type GasSystem = 'pistol' | 'carbine' | 'mid' | 'rifle'

/** Buffer weight class. Drives the short-barrel dwell-time rule. */
export type BufferWeight = 'carbine' | 'H2' | 'H3' | 'rifle'

/** Safety-selector compatibility class. */
export type SelectorType =
  | 'mil-spec' // standard fire-control-group geometry
  | 'g-lever' // Atrius G-Lever — clears the Geissele-trigger interference

/** Trigger geometry class. */
export type TriggerType =
  | 'mil-spec' // standard single/two-stage, plays nice with any selector
  | 'geissele' // Geissele-type — hammer/selector interference with mil-spec-only ambi selectors

/**
 * A single purchasable option within a category, ordered best -> value.
 * The optional fields are rule-relevant attributes; only the categories that
 * need them populate them, so adding a plain option stays a 3-field object.
 */
export interface Option {
  id: string
  brand: string
  tier: Tier
  price: number

  /** Barrel: overall barrel length in inches. Handguard: rail length in inches. */
  lengthIn?: number
  /** Barrel: gas-system length. */
  gas?: GasSystem
  /** Buffer: weight class. */
  bufferWeight?: BufferWeight
  /** Safety selector: compatibility class. */
  selectorType?: SelectorType
  /** Trigger: geometry class. */
  triggerType?: TriggerType
}

/** The 13 component groups. Each id is also referenced by rules + defaults. */
export type CategoryId =
  | 'lower'
  | 'upper'
  | 'barrel'
  | 'handguard'
  | 'bcg'
  | 'chargingHandle'
  | 'muzzle'
  | 'trigger'
  | 'selector'
  | 'buffer'
  | 'grip'
  | 'stock'
  | 'optic'

/** Keys tying a category to a mesh group on the 3D schematic. */
export type MeshKey = CategoryId

export interface Category {
  id: CategoryId
  name: string
  /** Which mesh group on the RifleModel this category highlights. */
  meshKey: MeshKey
  /** Short planning note shown under the category header. */
  note?: string
  /** Options ordered best -> value (index 0 == rank #1). */
  options: Option[]
}

/* ---------- Selection state ---------- */

/** Maps a category id to the chosen option id. Partial — not everything picked. */
export type Selection = Partial<Record<CategoryId, string>>

/* ---------- Build goals ---------- */

export type Goal =
  | 'budget-safety'
  | 'cqb'
  | 'truck'
  | 'range'
  | 'lightweight'
  | 'none'

export interface GoalDef {
  id: Goal
  name: string
  blurb: string
  /** Preferred tier when auto-filling defaults. */
  defaultTier: Tier
  /** Target price band [min, max] for the whole build (planning estimate). */
  priceBand: [number, number]
  /**
   * Per-category default option overrides (by option id). Anything not listed
   * falls back to the best option at `defaultTier`.
   */
  overrides?: Partial<Record<CategoryId, string>>
}

/* ---------- Compatibility + insight engine ---------- */

export type Severity = 'error' | 'warn' | 'tip'

/**
 * Everything a rule needs to evaluate the current build. `selected` holds the
 * *resolved* option objects (not just ids) so rules can read attributes
 * directly.
 */
export interface BuildContext {
  goal: Goal
  selected: Partial<Record<CategoryId, Option>>
  /** Running total of the currently-selected options. */
  total: number
}

/**
 * A single declarative compatibility/insight rule. Adding a rule = adding one
 * object to the rules array. Rules never invent messages at runtime — the UI
 * only ever surfaces `message` strings from here.
 */
export interface Rule {
  id: string
  severity: Severity
  message: string
  /** Returns true when the rule *fires* (i.e. the condition is present). */
  test: (ctx: BuildContext) => boolean
  /** Only evaluate for these goals. Omit = applies to every goal. */
  appliesToGoal?: Goal[]
  /** Component groups this rule references — clicking it highlights them. */
  highlight?: MeshKey[]
}

/** A rule that fired against the current build, ready to render. */
export interface Insight {
  id: string
  severity: Severity
  message: string
  highlight?: MeshKey[]
}
