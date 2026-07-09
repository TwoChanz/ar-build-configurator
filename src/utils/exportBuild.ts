import { ARCHETYPES, BUDGET_LEVELS, CATEGORY_COUNT, PARTS } from '../data/parts'
import { resolveSelected } from '../state/selectors'
import type { Archetype, BudgetLevel, Selection } from '../types'
import { usd } from './format'

export interface ExportRow {
  category: string
  brand: string
  tier: string
  price: number
}

const LEGAL_LINE =
  'Planning estimate only — not legal advice or installation instructions. ' +
  'Confirm current ATF classification and your state/local law before buying.'

function archetypeName(a: Archetype): string {
  return ARCHETYPES.find((x) => x.id === a)?.name ?? a
}
function budgetName(b: BudgetLevel): string {
  return BUDGET_LEVELS.find((x) => x.id === b)?.name ?? b
}

/** Resolve the selection into ordered, human-readable parts rows. */
export function buildRows(selection: Selection): ExportRow[] {
  const selected = resolveSelected(selection)
  const rows: ExportRow[] = []
  for (const cat of PARTS) {
    const o = selected[cat.id]
    if (o) rows.push({ category: cat.name, brand: o.brand, tier: o.tier, price: o.price })
  }
  return rows
}

export function buildTotal(rows: ExportRow[]): number {
  return rows.reduce((sum, r) => sum + r.price, 0)
}

/** A plain-text parts list, suitable for copy-to-clipboard. */
export function buildText(
  archetype: Archetype,
  budgetLevel: BudgetLevel,
  selection: Selection,
): string {
  const rows = buildRows(selection)
  const total = buildTotal(rows)
  const rule = '-'.repeat(52)
  const lines = [
    `AR BUILD PLAN — ${archetypeName(archetype)} · ${budgetName(budgetLevel)}`,
    rule,
    ...rows.map((r) => `${r.category.padEnd(20)} ${r.brand} (${r.tier}) — ${usd(r.price)}`),
    rule,
    `TOTAL: ${usd(total)}   (${rows.length} of ${CATEGORY_COUNT} selected)`,
    '',
    LEGAL_LINE,
  ]
  return lines.join('\n')
}

/** A CSV parts list, suitable for download. */
export function buildCsv(selection: Selection): string {
  const rows = buildRows(selection)
  const total = buildTotal(rows)
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`
  const header = 'Category,Brand,Tier,Price'
  const body = rows.map((r) => [esc(r.category), esc(r.brand), esc(r.tier), r.price].join(','))
  return [header, ...body, `,,Total,${total}`].join('\r\n')
}
