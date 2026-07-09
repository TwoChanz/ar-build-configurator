import { describe, expect, it } from 'vitest'

import {
  buildDefaults,
  computeInsights,
  computeTotal,
  priceBand,
  resolveSelected,
} from '../state/selectors'
import type { Archetype, BudgetLevel, Option, Selection } from '../types'

/** Evaluate a default build (optionally with some parts swapped) → fired rule ids. */
function evaluate(a: Archetype, l: BudgetLevel, tweak: Selection = {}): string[] {
  const selection: Selection = { ...buildDefaults(a, l), ...tweak }
  const selected = resolveSelected(selection)
  const total = computeTotal(selected)
  const bandMax = priceBand(a, l)[1]
  return computeInsights(a, l, selected, total, bandMax).map((i) => i.id)
}

describe('default builds are coherent', () => {
  it('FRT / mid: legal tip only, no conflicts or reliability warnings', () => {
    const ids = evaluate('frt', 'mid')
    expect(ids).toContain('device-legal')
    expect(ids).not.toContain('device-redundant-conflict')
    expect(ids).not.toContain('device-bcg-profile')
    expect(ids).not.toContain('device-buffer-tuning')
    expect(ids).not.toContain('frt-needs-trigger')
  })

  it('Super-Safety / mid: legal tip, selector satisfied, no conflict', () => {
    const ids = evaluate('super-safety', 'mid')
    expect(ids).toContain('device-legal')
    expect(ids).not.toContain('ss-needs-selector')
    expect(ids).not.toContain('device-redundant-conflict')
  })

  it('Standard baseline / mid: no device rules fire', () => {
    const ids = evaluate('standard', 'mid')
    expect(ids).not.toContain('device-legal')
    expect(ids).not.toContain('device-redundant-conflict')
  })
})

describe('device conflicts + reliability', () => {
  it('FRT trigger + Super-Safety selector → redundant-device error', () => {
    expect(evaluate('frt', 'mid', { selector: 'sel-ss-p' })).toContain('device-redundant-conflict')
  })

  it('device + semi-profile BCG → full-auto BCG warning', () => {
    expect(evaluate('frt', 'mid', { bcg: 'bcg-semi' })).toContain('device-bcg-profile')
  })

  it('device + carbine buffer → buffer-tuning warning', () => {
    expect(evaluate('frt', 'mid', { buffer: 'buf-milspec' })).toContain('device-buffer-tuning')
  })

  it('device + mid-gas barrel → prefers-carbine-gas tip', () => {
    expect(evaluate('frt', 'mid', { barrel: 'barrel-crit16mid' })).toContain(
      'device-prefers-carbine-gas',
    )
  })
})

describe('platform guidance nudges', () => {
  it('Super-Safety without a 3-way selector → ss-needs-selector', () => {
    expect(evaluate('super-safety', 'mid', { selector: 'sel-milspec' })).toContain('ss-needs-selector')
  })

  it('FRT without a forced-reset trigger → frt-needs-trigger', () => {
    expect(evaluate('frt', 'mid', { trigger: 'trig-milspec' })).toContain('frt-needs-trigger')
  })

  it('Binary without a binary trigger → binary-needs-trigger', () => {
    expect(evaluate('binary', 'mid', { trigger: 'trig-milspec' })).toContain('binary-needs-trigger')
  })
})

describe('gas cycling + budget', () => {
  it('rifle gas on a sub-18" barrel → gas-length-mismatch error', () => {
    const badBarrel: Option = {
      id: 'test-bad',
      brand: 'Test',
      tier: 'Budget',
      price: 100,
      desc: '',
      lengthIn: 16,
      gas: 'rifle',
    }
    const ids = computeInsights('standard', 'mid', { barrel: badBarrel }, 100, 999_999).map(
      (i) => i.id,
    )
    expect(ids).toContain('gas-length-mismatch')
  })

  it('a premium optic on a budget build blows the band → over-price-band tip', () => {
    expect(evaluate('super-safety', 'budget', { optic: 'optic-razor' })).toContain('over-price-band')
  })
})
