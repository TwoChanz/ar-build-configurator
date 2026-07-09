import type { Goal, Rule } from '../types'
import { GOALS } from './parts'

/** Price-band ceilings by goal, derived from GOALS (single source of truth). */
const BAND_MAX_BY_GOAL = GOALS.reduce(
  (acc, g) => {
    acc[g.id] = g.priceBand[1]
    return acc
  },
  {} as Record<Goal, number>,
)

/**
 * RULES — the compatibility + insight engine, expressed as data.
 *
 * Each rule is a pure predicate over the current build. The UI evaluates every
 * rule against the live selection and surfaces ONLY the `message` strings whose
 * `test` returns true. Nothing is invented at runtime.
 *
 * To add an insight: append one object here. Nothing else changes.
 *
 * `test` returns true when the rule FIRES (the flagged condition is present).
 * Comments cite the mechanical reason for each rule.
 */
export const RULES: Rule[] = [
  {
    id: 'gas-length-mismatch',
    severity: 'error',
    highlight: ['barrel'],
    // Gas dwell time = the window the port stays pressurized while the bullet is
    // still ahead of it. A longer gas system on too short a barrel shortens that
    // window: rifle-length gas needs ~18"+ of barrel, mid-length needs ~13.5"+.
    // Too little dwell = not enough impulse to fully cycle the carrier.
    message:
      'Gas system is too long for this barrel — dwell time will be too short to cycle reliably. ' +
      'Rifle gas wants an 18"+ barrel; mid-length wants ~14"+. Shorten the gas system or lengthen the barrel.',
    test: (ctx) => {
      const b = ctx.selected.barrel
      if (!b || b.lengthIn === undefined || !b.gas) return false
      if (b.gas === 'rifle' && b.lengthIn < 18) return true
      if (b.gas === 'mid' && b.lengthIn < 13.5) return true
      return false
    },
  },
  {
    id: 'short-barrel-buffer',
    severity: 'warn',
    highlight: ['barrel', 'buffer'],
    // Very short barrels unlock the gas port earlier and spike bolt velocity.
    // A heavier buffer (H2/H3) slows the carrier back down so timing stays sane
    // and the bolt doesn't try to strip the next round before the mag follower
    // is ready.
    message:
      'Sub-11.5" barrel with a standard carbine buffer tends to over-run. ' +
      'Step up to an H2 or H3 buffer to tame bolt velocity.',
    test: (ctx) => {
      const b = ctx.selected.barrel
      const buf = ctx.selected.buffer
      if (!b || b.lengthIn === undefined || !buf) return false
      return b.lengthIn < 11.5 && buf.bufferWeight === 'carbine'
    },
  },
  {
    id: 'selector-trigger-conflict',
    severity: 'error',
    highlight: ['selector', 'trigger'],
    // Geissele hammers have a taller/reshaped profile that can bind against the
    // shelf of a standard (mil-spec-geometry) ambidextrous selector on the right
    // side. The Atrius G-Lever is relieved for exactly this and resolves it.
    message:
      'Geissele-type trigger + mil-spec-geometry ambi selector can bind. ' +
      'Switch the selector to the Atrius G-Lever (relieved for Geissele hammers) to clear it.',
    test: (ctx) => {
      const trig = ctx.selected.trigger
      const sel = ctx.selected.selector
      if (!trig || !sel) return false
      return trig.triggerType === 'geissele' && sel.selectorType === 'mil-spec'
    },
  },
  {
    id: 'handguard-clearance',
    severity: 'warn',
    highlight: ['handguard', 'barrel'],
    // A handguard as long as (or longer than) the barrel leaves no room for the
    // muzzle device / gas block to sit clear of the rail — the rail runs past
    // the muzzle or crowds the gas block.
    message:
      'Handguard is as long as the barrel — the muzzle device or gas block may not clear the rail. ' +
      'Drop to a shorter handguard.',
    test: (ctx) => {
      const b = ctx.selected.barrel
      const hg = ctx.selected.handguard
      if (!b || b.lengthIn === undefined || !hg || hg.lengthIn === undefined) return false
      return hg.lengthIn >= b.lengthIn
    },
  },
  {
    id: 'cqb-barrel-too-long',
    severity: 'tip',
    appliesToGoal: ['cqb'],
    highlight: ['barrel'],
    // Goal-fit: a CQB gun lives on maneuverability. Past ~16" the extra length
    // works against you indoors and around vehicles.
    message:
      'For a CQB build this barrel is on the long side — a 10.5–14.5" barrel handles tighter in close quarters.',
    test: (ctx) => {
      const b = ctx.selected.barrel
      if (!b || b.lengthIn === undefined) return false
      return b.lengthIn > 16
    },
  },
  {
    id: 'budget-premium-optic',
    severity: 'tip',
    appliesToGoal: ['budget-safety'],
    highlight: ['optic'],
    // Goal-fit: a premium optic alone can cost more than the whole budget build.
    message:
      'For a budget build, a premium optic blows the price band on its own — a quality red dot gets you most of the way for a fraction of the cost.',
    test: (ctx) => ctx.selected.optic?.tier === 'Premium',
  },
  {
    id: 'over-price-band',
    severity: 'tip',
    // Goal-fit: total exceeds the goal's target band. Not evaluated for the
    // open-ended "No preference" goal (its band is effectively unbounded).
    appliesToGoal: ['budget-safety', 'cqb', 'truck', 'range', 'lightweight'],
    message:
      'Running total is above the target price band for this goal — trim a tier somewhere or accept the higher budget.',
    test: (ctx) => {
      // Guard against an empty build; compare running total to the goal ceiling.
      return ctx.total > 0 && ctx.total > BAND_MAX_BY_GOAL[ctx.goal]
    },
  },
]
