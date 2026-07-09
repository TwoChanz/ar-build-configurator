import { PARTS } from '../data/parts'
import { RULES } from '../data/rules'
import type {
  BuildContext,
  Category,
  CategoryId,
  Goal,
  Insight,
  MeshKey,
  Option,
  Selection,
} from '../types'

const CATEGORY_BY_ID = Object.fromEntries(PARTS.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>

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

/**
 * Evaluate every rule against the current build. Only rules whose `test` fires
 * (and whose goal filter matches) become insights. The engine never invents
 * messages — every string comes from RULES.
 */
export function computeInsights(
  goal: Goal,
  selected: Partial<Record<CategoryId, Option>>,
  total: number,
): Insight[] {
  const ctx: BuildContext = { goal, selected, total }
  const out: Insight[] = []
  for (const rule of RULES) {
    if (rule.appliesToGoal && !rule.appliesToGoal.includes(goal)) continue
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
