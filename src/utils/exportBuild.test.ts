import { describe, expect, it } from 'vitest'

import { buildDefaults } from '../state/selectors'
import { buildCsv, buildRows, buildText, buildTotal } from './exportBuild'

const FRT_MID = buildDefaults('frt', 'mid')

describe('buildRows', () => {
  it('produces one row per selected category, in catalog order', () => {
    const rows = buildRows(FRT_MID)
    expect(rows).toHaveLength(13)
    expect(rows[0].category).toBe('Lower Receiver')
    expect(rows.every((r) => r.price > 0)).toBe(true)
  })

  it('skips unselected categories', () => {
    expect(buildRows({ optic: 'optic-holo403' })).toHaveLength(1)
  })
})

describe('buildCsv', () => {
  it('has a header, a row per part, and a total line', () => {
    const csv = buildCsv(FRT_MID)
    const lines = csv.split('\r\n')
    expect(lines[0]).toBe('Category,Brand,Tier,Price')
    expect(lines).toHaveLength(1 + 13 + 1)
    expect(lines[lines.length - 1]).toBe(`,,Total,${buildTotal(buildRows(FRT_MID))}`)
  })

  it('escapes quotes in fields', () => {
    const csv = buildCsv({ barrel: 'barrel-ba16carb' })
    expect(csv).toContain('"Ballistic Advantage 16"""')
  })
})

describe('buildText', () => {
  it('names the platform and shows a total', () => {
    const text = buildText('frt', 'mid', FRT_MID)
    expect(text).toContain('Forced-Reset Trigger (FRT)')
    expect(text).toContain('TOTAL:')
    expect(text).toContain('not legal advice')
  })
})
