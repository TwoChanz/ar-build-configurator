import type { BuildContext, Rule } from '../types'

/**
 * RULES — the compatibility + insight engine, expressed as data.
 *
 * The focus is making a forced-reset / binary / Super-Safety build actually
 * cycle and reset reliably, plus flagging the device conflicts and the legal
 * reality. Each rule is a pure predicate over the current build (BuildContext).
 * The UI surfaces ONLY the `message` strings whose `test` returns true.
 *
 * To add an insight: append one object here. Nothing else changes.
 */

/** Resolve the device situation from the current build. */
function devices(ctx: BuildContext) {
  const trig = ctx.selected.trigger
  const sel = ctx.selected.selector
  const rapidTrigger = trig?.fireControl === 'frt' || trig?.fireControl === 'binary'
  const superSafety = sel?.fireControl === 'super-safety'
  return { trig, sel, rapidTrigger, superSafety, hasDevice: rapidTrigger || superSafety }
}

export const RULES: Rule[] = [
  /* ---------- platform guidance: is the device actually selected? ---------- */
  {
    id: 'ss-needs-selector',
    severity: 'tip',
    appliesToArchetype: ['super-safety'],
    highlight: ['selector'],
    message:
      'Super-Safety build: choose a 3-way Super Safety selector in the Safety Selector category — that third position is what provides the forced reset.',
    test: (ctx) => ctx.selected.selector?.fireControl !== 'super-safety',
  },
  {
    id: 'frt-needs-trigger',
    severity: 'tip',
    appliesToArchetype: ['frt'],
    highlight: ['trigger'],
    message: 'FRT build: choose a forced-reset trigger in the Trigger category.',
    test: (ctx) => ctx.selected.trigger?.fireControl !== 'frt',
  },
  {
    id: 'binary-needs-trigger',
    severity: 'tip',
    appliesToArchetype: ['binary'],
    highlight: ['trigger'],
    message: 'Binary build: choose a binary (pull-and-release) trigger in the Trigger category.',
    test: (ctx) => ctx.selected.trigger?.fireControl !== 'binary',
  },

  /* ---------- device vs device conflict ---------- */
  {
    id: 'device-redundant-conflict',
    severity: 'error',
    highlight: ['trigger', 'selector'],
    // Two independent forced-reset methods at once — a rapid trigger AND a
    // Super Safety selector — is redundant and the two mechanisms can fight each
    // other's timing. Run one method, not both.
    message:
      'Two forced-reset methods at once — a rapid trigger and a Super Safety selector. They are redundant and can fight each other. Pick one method.',
    test: (ctx) => {
      const { rapidTrigger, superSafety } = devices(ctx)
      return rapidTrigger && superSafety
    },
  },

  /* ---------- reliability: carrier mass ---------- */
  {
    id: 'device-bcg-profile',
    severity: 'warn',
    highlight: ['bcg'],
    // Forced-reset timing depends on carrier mass/velocity. A lighter semi
    // (AR-15) profile carrier makes reset timing fussy; a full-auto (M16)
    // profile carrier is the reliable choice.
    message:
      'Forced-reset / Super-Safety builds want a full-auto-profile (heavier) BCG for consistent reset timing — you have a semi-profile carrier.',
    test: (ctx) => {
      const { hasDevice } = devices(ctx)
      return hasDevice && ctx.selected.bcg?.bcgProfile === 'semi'
    },
  },

  /* ---------- reliability: buffer tuning ---------- */
  {
    id: 'device-buffer-tuning',
    severity: 'warn',
    highlight: ['buffer'],
    // Reset timing is buffer-sensitive. A standard carbine buffer is often too
    // light and leads to short-stroking or doubling; H2 is the usual baseline.
    message:
      'Reset timing is buffer-sensitive and a standard carbine buffer is often too light — step up to an H2 (or H3) buffer as your reliable starting point.',
    test: (ctx) => {
      const { hasDevice } = devices(ctx)
      return hasDevice && ctx.selected.buffer?.bufferWeight === 'carbine'
    },
  },

  /* ---------- reliability: gas / dwell ---------- */
  {
    id: 'gas-length-mismatch',
    severity: 'error',
    highlight: ['barrel'],
    // Universal cycling check: too long a gas system for the barrel = too little
    // dwell to cycle at all. Rifle gas needs ~18"+, mid-length needs ~13.5"+.
    message:
      'Gas system is too long for this barrel — dwell time is too short to cycle reliably at all. Rifle gas wants an 18"+ barrel; mid-length wants ~14"+.',
    test: (ctx) => {
      const b = ctx.selected.barrel
      if (!b || b.lengthIn === undefined || !b.gas) return false
      if (b.gas === 'rifle' && b.lengthIn < 18) return true
      if (b.gas === 'mid' && b.lengthIn < 13.5) return true
      return false
    },
  },
  {
    id: 'device-prefers-carbine-gas',
    severity: 'tip',
    highlight: ['barrel'],
    // Forced-reset devices want a strong, consistent gas impulse. Mid/rifle-gas
    // barrels run softer; a slightly over-gassed carbine-length system is the
    // reliable pick.
    message:
      'Forced-reset devices run most reliably slightly over-gassed — a carbine-length gas system drives resets harder than mid or rifle gas.',
    test: (ctx) => {
      const { hasDevice } = devices(ctx)
      const gas = ctx.selected.barrel?.gas
      return hasDevice && (gas === 'mid' || gas === 'rifle')
    },
  },
  {
    id: 'short-barrel-buffer',
    severity: 'warn',
    highlight: ['barrel', 'buffer'],
    // Very short barrels spike bolt velocity; a heavier buffer keeps timing sane.
    message:
      'Sub-11.5" barrel with a standard carbine buffer over-runs — step up to an H2/H3 buffer to tame bolt velocity.',
    test: (ctx) => {
      const b = ctx.selected.barrel
      const buf = ctx.selected.buffer
      if (!b || b.lengthIn === undefined || !buf) return false
      return b.lengthIn < 11.5 && buf.bufferWeight === 'carbine'
    },
  },

  /* ---------- clearance ---------- */
  {
    id: 'handguard-clearance',
    severity: 'warn',
    highlight: ['handguard', 'barrel'],
    // A handguard as long as the barrel leaves no room for the muzzle device /
    // gas block to clear the rail.
    message:
      'Handguard is as long as the barrel — the muzzle device or gas block may not clear the rail. Drop to a shorter handguard.',
    test: (ctx) => {
      const b = ctx.selected.barrel
      const hg = ctx.selected.handguard
      if (!b || b.lengthIn === undefined || !hg || hg.lengthIn === undefined) return false
      return hg.lengthIn >= b.lengthIn
    },
  },

  /* ---------- legal reality ---------- */
  {
    id: 'device-legal',
    severity: 'tip',
    // Not mechanical, but the single most important thing about these builds.
    message:
      'Legal check: this build includes a forced-reset / binary / three-way device. ATF classification of these is contested and many states ban them — see the compliance note and confirm current law before buying.',
    test: (ctx) => devices(ctx).hasDevice,
  },

  /* ---------- budget ---------- */
  {
    id: 'over-price-band',
    severity: 'tip',
    message:
      'Running total is above the target price band for this build — trim a tier somewhere or step up your budget level.',
    test: (ctx) => ctx.total > 0 && ctx.total > ctx.bandMax,
  },
]
