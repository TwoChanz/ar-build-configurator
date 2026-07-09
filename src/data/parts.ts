import type { Category, GoalDef } from '../types'

/**
 * PARTS — the AR-15 component catalog.
 *
 * 13 categories, each with options ordered best -> value (index 0 == rank #1).
 * Prices/tiers are APPROXIMATE PLANNING ESTIMATES, not endorsements.
 *
 * Rule-relevant attributes live directly on the options that need them:
 *   • barrel   -> lengthIn, gas
 *   • handguard-> lengthIn
 *   • buffer   -> bufferWeight
 *   • selector -> selectorType
 *   • trigger  -> triggerType
 *
 * To extend: add a category object, or drop another option into an `options`
 * array. Nothing else in the app needs to change.
 */
export const PARTS: Category[] = [
  {
    id: 'lower',
    name: 'Lower Receiver',
    meshKey: 'lower',
    note: 'The legally-controlled part — see compliance note below.',
    options: [
      { id: 'lower-bcm', brand: 'BCM Stripped Lower', tier: 'Premium', price: 200 },
      { id: 'lower-aero', brand: 'Aero Precision M4E1', tier: 'Mid', price: 130 },
      { id: 'lower-anderson', brand: 'Anderson AM-15', tier: 'Budget', price: 60 },
    ],
  },
  {
    id: 'upper',
    name: 'Upper Receiver',
    meshKey: 'upper',
    options: [
      { id: 'upper-bcm', brand: 'BCM Upper (assembled)', tier: 'Premium', price: 180 },
      { id: 'upper-aero', brand: 'Aero Precision M4E1 Upper', tier: 'Mid', price: 110 },
      { id: 'upper-anderson', brand: 'Anderson Stripped Upper', tier: 'Budget', price: 55 },
    ],
  },
  {
    id: 'barrel',
    name: 'Barrel',
    meshKey: 'barrel',
    note: 'Length + gas system are matched per option — mismatches drive the insight engine.',
    options: [
      { id: 'barrel-crit16mid', brand: 'Criterion 16" Hybrid', tier: 'Premium', price: 360, lengthIn: 16, gas: 'mid' },
      { id: 'barrel-crit18rifle', brand: 'Criterion 18" SPR', tier: 'Premium', price: 390, lengthIn: 18, gas: 'rifle' },
      { id: 'barrel-ba16carb', brand: 'Ballistic Advantage 16"', tier: 'Mid', price: 175, lengthIn: 16, gas: 'carbine' },
      { id: 'barrel-ba145mid', brand: 'Ballistic Advantage 14.5"', tier: 'Mid', price: 200, lengthIn: 14.5, gas: 'mid' },
      // 16" paired with rifle-length gas: dwell time is too short to cycle
      // reliably — intentionally trips the gas/length ERROR rule.
      { id: 'barrel-faxon16rifle', brand: 'Faxon 16" (rifle gas)', tier: 'Mid', price: 210, lengthIn: 16, gas: 'rifle' },
      { id: 'barrel-psa16carb', brand: 'PSA 16" Carbine', tier: 'Budget', price: 110, lengthIn: 16, gas: 'carbine' },
      { id: 'barrel-psa105pistol', brand: 'PSA 10.5" Pistol', tier: 'Budget', price: 130, lengthIn: 10.5, gas: 'pistol' },
    ],
  },
  {
    id: 'handguard',
    name: 'Handguard',
    meshKey: 'handguard',
    options: [
      { id: 'hg-geissele13', brand: 'Geissele MK16 13"', tier: 'Premium', price: 290, lengthIn: 13 },
      { id: 'hg-aero15', brand: 'Aero ATLAS S-ONE 15"', tier: 'Mid', price: 180, lengthIn: 15 },
      { id: 'hg-bcm10', brand: 'BCM MCMR 10"', tier: 'Mid', price: 200, lengthIn: 10 },
      { id: 'hg-psa12', brand: 'PSA Lightweight 12"', tier: 'Budget', price: 70, lengthIn: 12 },
    ],
  },
  {
    id: 'bcg',
    name: 'Bolt Carrier Group',
    meshKey: 'bcg',
    note: 'Rides inside the upper — shown on the schematic only when selected.',
    options: [
      { id: 'bcg-bcm', brand: 'BCM BCG (auto)', tier: 'Premium', price: 200 },
      { id: 'bcg-toolcraft', brand: 'Toolcraft Nitride', tier: 'Mid', price: 120 },
      { id: 'bcg-psa', brand: 'PSA Nitride BCG', tier: 'Budget', price: 90 },
    ],
  },
  {
    id: 'chargingHandle',
    name: 'Charging Handle',
    meshKey: 'chargingHandle',
    options: [
      { id: 'ch-radian', brand: 'Radian Raptor (ambi)', tier: 'Premium', price: 90 },
      { id: 'ch-bcm', brand: 'BCM Gunfighter', tier: 'Mid', price: 55 },
      { id: 'ch-milspec', brand: 'Mil-Spec Charging Handle', tier: 'Budget', price: 20 },
    ],
  },
  {
    id: 'muzzle',
    name: 'Muzzle Device',
    meshKey: 'muzzle',
    options: [
      { id: 'muz-warcomp', brand: 'SureFire WARCOMP', tier: 'Premium', price: 150 },
      { id: 'muz-vg6', brand: 'VG6 Gamma 556', tier: 'Mid', price: 65 },
      { id: 'muz-a2', brand: 'A2 Flash Hider', tier: 'Budget', price: 12 },
    ],
  },
  {
    id: 'trigger',
    name: 'Trigger',
    meshKey: 'trigger',
    options: [
      { id: 'trig-geissele', brand: 'Geissele SSA-E', tier: 'Premium', price: 240, triggerType: 'geissele' },
      { id: 'trig-alg', brand: 'ALG ACT', tier: 'Mid', price: 65, triggerType: 'mil-spec' },
      { id: 'trig-milspec', brand: 'Mil-Spec Trigger Group', tier: 'Budget', price: 45, triggerType: 'mil-spec' },
    ],
  },
  {
    id: 'selector',
    name: 'Safety Selector',
    meshKey: 'selector',
    options: [
      { id: 'sel-radian', brand: 'Radian Talon Ambi', tier: 'Premium', price: 95, selectorType: 'mil-spec' },
      { id: 'sel-glever', brand: 'Atrius G-Lever Ambi', tier: 'Mid', price: 75, selectorType: 'g-lever' },
      { id: 'sel-milspec', brand: 'Mil-Spec Safety Selector', tier: 'Budget', price: 18, selectorType: 'mil-spec' },
    ],
  },
  {
    id: 'buffer',
    name: 'Buffer System',
    meshKey: 'buffer',
    options: [
      { id: 'buf-super42h2', brand: 'Geissele Super 42 (H2)', tier: 'Premium', price: 110, bufferWeight: 'H2' },
      { id: 'buf-sprinco', brand: 'Carbine + Sprinco Spring', tier: 'Mid', price: 55, bufferWeight: 'carbine' },
      { id: 'buf-milspec', brand: 'Mil-Spec Carbine Buffer', tier: 'Budget', price: 25, bufferWeight: 'carbine' },
    ],
  },
  {
    id: 'grip',
    name: 'Pistol Grip',
    meshKey: 'grip',
    options: [
      { id: 'grip-bcm', brand: 'BCM Gunfighter Mod 3', tier: 'Premium', price: 28 },
      { id: 'grip-magpul', brand: 'Magpul MOE-K2', tier: 'Mid', price: 18 },
      { id: 'grip-a2', brand: 'A2 Pistol Grip', tier: 'Budget', price: 8 },
    ],
  },
  {
    id: 'stock',
    name: 'Stock',
    meshKey: 'stock',
    options: [
      { id: 'stock-ctr', brand: 'Magpul CTR', tier: 'Premium', price: 90 },
      { id: 'stock-moesl', brand: 'Magpul MOE SL', tier: 'Mid', price: 45 },
      { id: 'stock-milspec', brand: 'Mil-Spec M4 Stock', tier: 'Budget', price: 20 },
    ],
  },
  {
    id: 'optic',
    name: 'Optic',
    meshKey: 'optic',
    options: [
      { id: 'optic-razor', brand: 'Vortex Razor Gen III 1-10x', tier: 'Premium', price: 2000 },
      { id: 'optic-holo510', brand: 'Holosun HE510C Reflex', tier: 'Mid', price: 510 },
      { id: 'optic-holo403', brand: 'Holosun HS403C Red Dot', tier: 'Budget', price: 150 },
    ],
  },
]

/** How many categories a complete build has. */
export const CATEGORY_COUNT = PARTS.length

/**
 * GOALS — build intents. Each sets a default tier + target price band and can
 * override specific categories. Order matches the picker layout.
 */
export const GOALS: GoalDef[] = [
  {
    id: 'budget-safety',
    name: 'Budget "Super Safety"',
    blurb: 'Cheapest reliable build. Value parts everywhere, keep it simple.',
    defaultTier: 'Budget',
    priceBand: [450, 900],
  },
  {
    id: 'cqb',
    name: 'Close-Quarters (CQB)',
    blurb: 'Short barrel, red dot, snappy handling for tight spaces.',
    defaultTier: 'Mid',
    priceBand: [1000, 1800],
    overrides: {
      barrel: 'barrel-psa105pistol',
      handguard: 'hg-bcm10',
      buffer: 'buf-super42h2',
      optic: 'optic-holo510',
    },
  },
  {
    id: 'truck',
    name: 'Truck Gun',
    blurb: '16" and low-fuss — legal length everywhere, cheap to feed and forget.',
    defaultTier: 'Budget',
    priceBand: [650, 1150],
    overrides: {
      barrel: 'barrel-ba16carb',
      optic: 'optic-holo403',
    },
  },
  {
    id: 'range',
    name: 'Range / Fun Gun',
    blurb: 'Accuracy first — heavier 18" barrel, glass, nice trigger.',
    defaultTier: 'Mid',
    priceBand: [1500, 3600],
    overrides: {
      barrel: 'barrel-crit18rifle',
      trigger: 'trig-geissele',
      selector: 'sel-glever',
      optic: 'optic-razor',
    },
  },
  {
    id: 'lightweight',
    name: 'Lightweight / Hunting',
    blurb: 'Trim the ounces — mid-length 14.5"/16", light furniture, compact optic.',
    defaultTier: 'Mid',
    priceBand: [1100, 2100],
    overrides: {
      barrel: 'barrel-ba145mid',
      handguard: 'hg-psa12',
      optic: 'optic-holo510',
    },
  },
  {
    id: 'none',
    name: 'No Preference',
    blurb: "Just exploring — mid-tier defaults, no strong opinions.",
    defaultTier: 'Mid',
    priceBand: [0, 100000],
  },
]

/**
 * Compliance note shown in the panel. This is a planning/shopping tool, not
 * legal advice.
 */
export const COMPLIANCE_NOTE =
  'The lower receiver is the federally-regulated firearm — everything else is a part. ' +
  'Configuration legality (barrel length, overall length, features, optic/laser rules) ' +
  'varies by state and locality. This is a planning tool with approximate price/tier ' +
  'estimates, not endorsements or legal advice. Confirm legality for your jurisdiction ' +
  'before buying or assembling.'
