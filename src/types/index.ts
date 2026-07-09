/**
 * Shared domain types for the FRT / Super-Safety build configurator.
 * No `any` anywhere — every selection, platform, tier, and derived insight is typed.
 */

/* ---------- Parts catalog ---------- */

export type Tier = 'Premium' | 'Mid' | 'Budget'

/** Barrel gas-system length. Drives the cycling / reset-reliability rules. */
export type GasSystem = 'pistol' | 'carbine' | 'mid' | 'rifle'

/** Buffer weight class. Drives the reset-timing rules. */
export type BufferWeight = 'carbine' | 'H2' | 'H3' | 'rifle'

/**
 * Fire-control character of a trigger or safety selector.
 *  - trigger options:  'standard' | 'frt' | 'binary'
 *  - selector options: 'standard' | 'super-safety'  (three-way safety)
 */
export type FireControl = 'standard' | 'frt' | 'binary' | 'super-safety'

/** Bolt-carrier profile. Full-auto (M16) carriers are heavier. */
export type BcgProfile = 'full-auto' | 'semi'

/**
 * A single purchasable option within a category, ordered best -> value.
 * The optional fields are rule-relevant attributes; only the categories that
 * need them populate them, so adding a plain option stays a small object.
 */
export interface Option {
  id: string
  brand: string
  tier: Tier
  price: number
  /** Short history / capability blurb, revealed when the option is selected. */
  desc: string

  /** Barrel: overall barrel length in inches. Handguard: rail length in inches. */
  lengthIn?: number
  /** Barrel: gas-system length. */
  gas?: GasSystem
  /** Buffer: weight class. */
  bufferWeight?: BufferWeight
  /** Trigger / selector: fire-control character. */
  fireControl?: FireControl
  /** BCG: carrier profile. */
  bcgProfile?: BcgProfile
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

/* ---------- Fire-control platform (the build type) — independent of price ---------- */

export type Archetype = 'super-safety' | 'frt' | 'binary' | 'standard'

/** A per-budget-level option choice for a category (falls back to tier best). */
export type LevelChoice = Partial<Record<BudgetLevel, string>>

export interface ArchetypeDef {
  id: Archetype
  name: string
  blurb: string
  /**
   * Character-defining part choices, per budget level. The platform pins the
   * fire-control device plus the parts that make it run (BCG profile, buffer,
   * barrel/gas); the budget level only shifts quality. Anything not listed
   * falls back to the best option at the level's tier.
   */
  overrides?: Partial<Record<CategoryId, LevelChoice>>
}

/* ---------- Budget level (price) — independent of platform ---------- */

export type BudgetLevel = 'budget' | 'mid' | 'high'

export interface BudgetLevelDef {
  id: BudgetLevel
  name: string
  blurb: string
  /** Which catalog tier fills categories the platform doesn't pin. */
  tier: Tier
}

/* ---------- Selection state ---------- */

/** Maps a category id to the chosen option id. Partial — not everything picked. */
export type Selection = Partial<Record<CategoryId, string>>

/* ---------- Compatibility + insight engine ---------- */

export type Severity = 'error' | 'warn' | 'tip'

/**
 * Everything a rule needs to evaluate the current build. `selected` holds the
 * *resolved* option objects (not just ids) so rules can read attributes
 * directly.
 */
export interface BuildContext {
  archetype: Archetype
  budgetLevel: BudgetLevel
  selected: Partial<Record<CategoryId, Option>>
  /** Running total of the currently-selected options. */
  total: number
  /** Top of the target price band for the current platform + level. */
  bandMax: number
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
  /** Only evaluate for these platforms. Omit = applies to every platform. */
  appliesToArchetype?: Archetype[]
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
