import { describe, expect, it } from 'vitest'

import { CATEGORY_COUNT } from '../data/parts'
import {
  buildDefaults,
  computeTotal,
  estimateBuildTotal,
  priceBand,
  resolveSelected,
  tierForLevel,
} from './selectors'

describe('buildDefaults', () => {
  it('pins the FRT platform parts per budget level', () => {
    const high = buildDefaults('frt', 'high')
    expect(high.trigger).toBe('trig-wot')
    expect(high.selector).toBe('sel-radian') // standard safety, not a Super Safety
    expect(high.bcg).toBe('bcg-bcm')
    expect(high.buffer).toBe('buf-super42h2')
    expect(high.barrel).toBe('barrel-fa145carb')
  })

  it('pins a 3-way selector for the Super-Safety platform', () => {
    expect(buildDefaults('super-safety', 'budget').selector).toBe('sel-ss-mid')
    expect(buildDefaults('super-safety', 'high').selector).toBe('sel-ss-p')
  })

  it('fills every category', () => {
    const sel = buildDefaults('binary', 'mid')
    expect(Object.keys(sel)).toHaveLength(CATEGORY_COUNT)
  })
})

describe('tierForLevel', () => {
  it('maps budget levels to catalog tiers', () => {
    expect(tierForLevel('budget')).toBe('Budget')
    expect(tierForLevel('mid')).toBe('Mid')
    expect(tierForLevel('high')).toBe('Premium')
  })
})

describe('totals + price band', () => {
  it('estimate equals the resolved default total', () => {
    const total = computeTotal(resolveSelected(buildDefaults('frt', 'mid')))
    expect(estimateBuildTotal('frt', 'mid')).toBe(total)
  })

  it('the target band brackets the estimate', () => {
    const est = estimateBuildTotal('super-safety', 'high')
    const [lo, hi] = priceBand('super-safety', 'high')
    expect(lo).toBeLessThanOrEqual(est)
    expect(hi).toBeGreaterThanOrEqual(est)
  })

  it('higher tiers cost more than lower tiers for a platform', () => {
    expect(estimateBuildTotal('frt', 'high')).toBeGreaterThan(estimateBuildTotal('frt', 'budget'))
  })
})

describe('resolveSelected', () => {
  it('drops ids that are not in the catalog', () => {
    const resolved = resolveSelected({ barrel: 'does-not-exist', optic: 'optic-holo403' })
    expect(resolved.barrel).toBeUndefined()
    expect(resolved.optic?.id).toBe('optic-holo403')
  })
})
