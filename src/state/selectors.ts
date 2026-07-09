import { ARCHETYPES, BUDGET_LEVELS, PARTS } from '../data/parts'
import { RULES } from '../data/rules'
import type {
  Archetype,
  BudgetLevel,
  BuildContext,
  Category,
  CategoryId,
  Insight,
  MeshKey,
  Option,
  Selection,
  Tier,
} from '../types'

const CATEGORY_BY_ID = Object.fromEntries(PARTS.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>

/* ---------- defaults: archetype (purpose) × budget level (price) ---------- */

/** Best (highest-ranked) option at a given tier, falling back to overall best. */
function bestAtTier(category: Category, tier: Tier): string {
  const match = category.options.find((o) => o.tier === tier)
  return (match ?? category.options[0]).id
}

export function tierForLevel(level: BudgetLevel): Tier {
  return BUDGET_LEVELS.find((l) => l.id === level)?.tier ?? 'Mid'
}

/**
 * The full default selection for an archetype at a budget level. The archetype
 * pins character-defining parts (per level); everything else falls back to the
 * best option at the level's tier.
 */
export function buildDefaults(archetype: Archetype, level: BudgetLevel): Selection {
  const def = ARCHETYPES.find((a) => a.id === archetype)
  const tier = tierForLevel(level)
  const sel: Selection = {}
  for (const cat of PARTS) {
    const override = def?.overrides?.[cat.id]?.[level]
    sel[cat.id] = override ?? bestAtTier(cat, tier)
  }
  return sel
}

/** Sum of an archetype+level default build — used for the picker price ranges. */
export function estimateBuildTotal(archetype: Archetype, level: BudgetLevel): number {
  return computeTotal(resolveSelected(buildDefaults(archetype, level)))
}

/** Target price band for an archetype+level, derived from its default build. */
export function priceBand(archetype: Archetype, level: BudgetLevel): [number, number] {
  const est = estimateBuildTotal(archetype, level)
  const round = (n: number) => Math.round(n / 10) * 10
  return [round(est * 0.9), round(est * 1.15)]
}

/* ---------- resolving the current selection ---------- */

/** Resolve a selection (ids) into the actual Option objects, keyed by category. */
export function resolveSelected(
  selection: Selection,
): Partial<Record<CategoryId, Option>> {
  const out: Partial<Record<CategoryId, Option>> = {}
  for (const cat of PARTS) {
    const id = selection[cat.id]
    if (!id) continue
    const opt = cat.options.find((o) => o.id === id)
    if (opt) out[cat.id] = opt
  }
  return out
}

export function computeTotal(selected: Partial<Record<CategoryId, Option>>): number {
  return Object.values(selected).reduce((sum, o) => sum + (o?.price ?? 0), 0)
}

export function selectedCount(selection: Selection): number {
  return PARTS.reduce((n, cat) => (selection[cat.id] ? n + 1 : n), 0)
}

/** Mesh groups that have a configured (selected) part — get a faint brass tint. */
export function configuredMeshKeys(selection: Selection): MeshKey[] {
  return PARTS.filter((cat) => selection[cat.id]).map((cat) => cat.meshKey)
}

/* ---------- insight engine ---------- */

/**
 * Evaluate every rule against the current build. Only rules whose `test` fires
 * (and whose archetype filter matches) become insights. The engine never
 * invents messages — every string comes from RULES.
 */
export function computeInsights(
  archetype: Archetype,
  budgetLevel: BudgetLevel,
  selected: Partial<Record<CategoryId, Option>>,
  total: number,
  bandMax: number,
): Insight[] {
  const ctx: BuildContext = { archetype, budgetLevel, selected, total, bandMax }
  const out: Insight[] = []
  for (const rule of RULES) {
    if (rule.appliesToArchetype && !rule.appliesToArchetype.includes(archetype)) continue
    if (!rule.test(ctx)) continue
    out.push({
      id: rule.id,
      severity: rule.severity,
      message: rule.message,
      highlight: rule.highlight,
    })
  }
  return out
}

export function categoryById(id: CategoryId): Category | undefined {
  return CATEGORY_BY_ID[id]
}
