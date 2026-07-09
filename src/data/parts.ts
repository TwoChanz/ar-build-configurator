import type { ArchetypeDef, BudgetLevelDef, Category } from '../types'

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
      { id: 'lower-bcm', brand: 'BCM Stripped Lower', tier: 'Premium', price: 200, desc: 'Bravo Company forged 7075-T6 lower with tight tolerances and a strong QC reputation among duty builders.' },
      { id: 'lower-aero', brand: 'Aero Precision M4E1', tier: 'Mid', price: 130, desc: 'Enhanced forged lower with an integrated trigger guard and threaded bolt-catch pin — a builder favorite for fit and value.' },
      { id: 'lower-anderson', brand: 'Anderson AM-15', tier: 'Budget', price: 60, desc: 'The classic no-frills mil-spec lower — inexpensive, ubiquitous, and perfectly serviceable as the foundation of a value build.' },
    ],
  },
  {
    id: 'upper',
    name: 'Upper Receiver',
    meshKey: 'upper',
    options: [
      { id: 'upper-bcm', brand: 'BCM Upper (assembled)', tier: 'Premium', price: 180, desc: 'Assembled forged upper with M4 feed ramps and port door installed — matched to BCM tolerances for a tight receiver fit.' },
      { id: 'upper-aero', brand: 'Aero Precision M4E1 Upper', tier: 'Mid', price: 110, desc: 'Enhanced upper with a keyed handguard-mounting surface; pairs with the M4E1 lower for a seamless two-piece feel.' },
      { id: 'upper-anderson', brand: 'Anderson Stripped Upper', tier: 'Budget', price: 55, desc: 'Bare forged upper you finish yourself — the cheapest path to a running gun if you have the small parts.' },
    ],
  },
  {
    id: 'barrel',
    name: 'Barrel',
    meshKey: 'barrel',
    note: 'Length + gas system are matched per option — mismatches drive the insight engine, and length reshapes the 3D model.',
    options: [
      { id: 'barrel-crit16mid', brand: 'Criterion 16" Hybrid', tier: 'Premium', price: 360, lengthIn: 16, gas: 'mid', desc: 'Button-rifled, hand-lapped 16" with a mid-length gas system — smooth-cycling and known for sub-MOA accuracy.' },
      { id: 'barrel-crit18rifle', brand: 'Criterion 18" SPR', tier: 'Premium', price: 390, lengthIn: 18, gas: 'rifle', desc: 'An 18" SPR-profile barrel with rifle-length gas — the classic precision-carbine recipe for soft recoil and accuracy.' },
      { id: 'barrel-ba16carb', brand: 'Ballistic Advantage 16"', tier: 'Mid', price: 175, lengthIn: 16, gas: 'carbine', desc: 'A workhorse 16" carbine-gas barrel — over-gassed on purpose for reliability, and the default for do-everything builds.' },
      { id: 'barrel-ba145mid', brand: 'Ballistic Advantage 14.5"', tier: 'Mid', price: 200, lengthIn: 14.5, gas: 'mid', desc: 'A 14.5" mid-length that reaches 16" once a muzzle device is pinned & welded — lighter and handier than a full 16".' },
      { id: 'barrel-faxon16rifle', brand: 'Faxon 16" (rifle gas)', tier: 'Mid', price: 210, lengthIn: 16, gas: 'rifle', desc: 'A 16" barrel wearing rifle-length gas for reduced recoil — but short on dwell time, so it can be finicky to cycle.' },
      { id: 'barrel-psa16carb', brand: 'PSA 16" Carbine', tier: 'Budget', price: 110, lengthIn: 16, gas: 'carbine', desc: 'Palmetto’s value 16" carbine-gas barrel — unglamorous but runs, and the backbone of countless budget builds.' },
      { id: 'barrel-psa105pistol', brand: 'PSA 10.5" Pistol', tier: 'Budget', price: 130, lengthIn: 10.5, gas: 'pistol', desc: 'A 10.5" pistol-gas barrel for SBR/pistol builds — maximum compactness at the cost of muzzle blast and velocity.' },
    ],
  },
  {
    id: 'handguard',
    name: 'Handguard',
    meshKey: 'handguard',
    note: 'Rail length reshapes the 3D model — longer rails reach further down the barrel.',
    options: [
      { id: 'hg-geissele13', brand: 'Geissele MK16 13"', tier: 'Premium', price: 290, lengthIn: 13, desc: 'The MK16 M-LOK rail — slim, rock-solid, and a special-ops staple. The bolt-up interface is famously repeatable.' },
      { id: 'hg-aero15', brand: 'Aero ATLAS S-ONE 15"', tier: 'Mid', price: 180, lengthIn: 15, desc: 'A long 15" M-LOK rail giving you maximum real estate for a full-length grip and mounted gear on a 16"+ barrel.' },
      { id: 'hg-bcm10', brand: 'BCM MCMR 10"', tier: 'Mid', price: 200, lengthIn: 10, desc: 'A short 10" M-LOK rail sized for pistol/SBR barrels — keeps the front end trim for close-quarters handling.' },
      { id: 'hg-psa12', brand: 'PSA Lightweight 12"', tier: 'Budget', price: 70, lengthIn: 12, desc: 'A lightweight 12" M-LOK rail at a value price — a sensible middle length for most 14.5–16" carbines.' },
    ],
  },
  {
    id: 'bcg',
    name: 'Bolt Carrier Group',
    meshKey: 'bcg',
    note: 'Rides inside the upper — shown on the schematic only when selected.',
    options: [
      { id: 'bcg-bcm', brand: 'BCM BCG (auto)', tier: 'Premium', price: 200, desc: 'Full-auto-profile carrier, shot-peened and HPT/MPI tested — the gold standard for a duty-grade bolt.' },
      { id: 'bcg-toolcraft', brand: 'Toolcraft Nitride', tier: 'Mid', price: 120, desc: 'A well-regarded nitride BCG that punches above its price — a common recommendation for reliable mid-tier builds.' },
      { id: 'bcg-psa', brand: 'PSA Nitride BCG', tier: 'Budget', price: 90, desc: 'Palmetto’s value bolt carrier group — gets the gun running without drama for budget-minded builders.' },
    ],
  },
  {
    id: 'chargingHandle',
    name: 'Charging Handle',
    meshKey: 'chargingHandle',
    options: [
      { id: 'ch-radian', brand: 'Radian Raptor (ambi)', tier: 'Premium', price: 90, desc: 'The ambidextrous handle that popularized the category — huge dual latches you can rack from either side.' },
      { id: 'ch-bcm', brand: 'BCM Gunfighter', tier: 'Mid', price: 55, desc: 'An extended-latch handle that redirects gas away from your face — the sensible upgrade over mil-spec.' },
      { id: 'ch-milspec', brand: 'Mil-Spec Charging Handle', tier: 'Budget', price: 20, desc: 'The standard-issue handle — small latch, but it works and costs almost nothing.' },
    ],
  },
  {
    id: 'muzzle',
    name: 'Muzzle Device',
    meshKey: 'muzzle',
    options: [
      { id: 'muz-warcomp', brand: 'SureFire WARCOMP', tier: 'Premium', price: 150, desc: 'A flash hider / muzzle brake hybrid that also indexes SureFire suppressors — flash reduction with a comp’s flat recoil.' },
      { id: 'muz-vg6', brand: 'VG6 Gamma 556', tier: 'Mid', price: 65, desc: 'A popular hybrid brake/comp that flattens recoil and muzzle rise for fast follow-up shots.' },
      { id: 'muz-a2', brand: 'A2 Flash Hider', tier: 'Budget', price: 12, desc: 'The classic “birdcage” — cheap, effective flash suppression that’s been standard since the M16A2.' },
    ],
  },
  {
    id: 'trigger',
    name: 'Trigger',
    meshKey: 'trigger',
    options: [
      { id: 'trig-geissele', brand: 'Geissele SSA-E', tier: 'Premium', price: 240, triggerType: 'geissele', desc: 'A two-stage trigger beloved for its crisp, light break — a benchmark upgrade, but its hammer geometry can clash with some ambi selectors.' },
      { id: 'trig-alg', brand: 'ALG ACT', tier: 'Mid', price: 65, triggerType: 'mil-spec', desc: 'A “Combat Trigger” — a smoothed, tuned mil-spec single-stage from Geissele’s value line. Drops in anywhere.' },
      { id: 'trig-milspec', brand: 'Mil-Spec Trigger Group', tier: 'Budget', price: 45, triggerType: 'mil-spec', desc: 'The standard curved single-stage — gritty but utterly reliable, and compatible with everything.' },
    ],
  },
  {
    id: 'selector',
    name: 'Safety Selector',
    meshKey: 'selector',
    options: [
      { id: 'sel-radian', brand: 'Radian Talon Ambi', tier: 'Premium', price: 95, selectorType: 'mil-spec', desc: 'A premium 45°/90° ambidextrous selector with mil-spec fire-control geometry — slick, but that geometry can bind on Geissele hammers.' },
      { id: 'sel-glever', brand: 'Atrius G-Lever Ambi', tier: 'Mid', price: 75, selectorType: 'g-lever', desc: 'An ambi selector relieved specifically to clear Geissele-type hammers — the fix when a premium trigger and ambi safety won’t play nice.' },
      { id: 'sel-milspec', brand: 'Mil-Spec Safety Selector', tier: 'Budget', price: 18, selectorType: 'mil-spec', desc: 'The standard single-side 90° safety — simple, cheap, and reliable.' },
    ],
  },
  {
    id: 'buffer',
    name: 'Buffer System',
    meshKey: 'buffer',
    options: [
      { id: 'buf-super42h2', brand: 'Geissele Super 42 (H2)', tier: 'Premium', price: 110, bufferWeight: 'H2', desc: 'A braided-spring + H2 buffer kit tuned to smooth the cycle and cut bolt bounce — a refined recoil upgrade.' },
      { id: 'buf-milspecH2', brand: 'Mil-Spec H2 Buffer', tier: 'Budget', price: 35, bufferWeight: 'H2', desc: 'A heavier H2 buffer at a budget price — the cheap fix to tame bolt velocity on short-barreled builds.' },
      { id: 'buf-sprinco', brand: 'Carbine + Sprinco Spring', tier: 'Mid', price: 55, bufferWeight: 'carbine', desc: 'A standard carbine buffer paired with a Sprinco spring for a smoother, quieter cycle in a normal 16" carbine.' },
      { id: 'buf-milspec', brand: 'Mil-Spec Carbine Buffer', tier: 'Budget', price: 25, bufferWeight: 'carbine', desc: 'The standard carbine buffer + spring — correct for most 16" carbine-gas guns, and dirt cheap.' },
    ],
  },
  {
    id: 'grip',
    name: 'Pistol Grip',
    meshKey: 'grip',
    options: [
      { id: 'grip-bcm', brand: 'BCM Gunfighter Mod 3', tier: 'Premium', price: 28, desc: 'A vertical-ish grip angle with a filled backstrap — comfortable for modern shooting stances.' },
      { id: 'grip-magpul', brand: 'Magpul MOE-K2', tier: 'Mid', price: 18, desc: 'A steeper grip angle that suits a squared-up, C-clamp shooting style — grippy texture, great value.' },
      { id: 'grip-a2', brand: 'A2 Pistol Grip', tier: 'Budget', price: 8, desc: 'The issue grip with its infamous finger nub — plain, but it comes on nearly everything for a reason: it’s free-cheap.' },
    ],
  },
  {
    id: 'stock',
    name: 'Stock',
    meshKey: 'stock',
    options: [
      { id: 'stock-ctr', brand: 'Magpul CTR', tier: 'Premium', price: 90, desc: 'A carbine stock with a friction lock that removes wobble — solid cheek weld without going full precision.' },
      { id: 'stock-moesl', brand: 'Magpul MOE SL', tier: 'Mid', price: 45, desc: 'A slim, lightweight collapsible stock with a low profile — clean lines and great value.' },
      { id: 'stock-milspec', brand: 'Mil-Spec M4 Stock', tier: 'Budget', price: 20, desc: 'The basic M4 collapsible stock — some wobble, but adjustable and cheap.' },
    ],
  },
  {
    id: 'optic',
    name: 'Optic',
    meshKey: 'optic',
    options: [
      { id: 'optic-razor', brand: 'Vortex Razor Gen III 1-10x', tier: 'Premium', price: 2000, desc: 'A flagship 1-10x LPVO — true 1x for both eyes open up close, 10x for reach. Class-leading glass at a class-leading price.' },
      { id: 'optic-holo510', brand: 'Holosun HE510C Reflex', tier: 'Mid', price: 510, desc: 'An open reflex with a circle-dot reticle, solar backup, and shake-awake — fast, rugged, and versatile.' },
      { id: 'optic-holo403', brand: 'Holosun HS403C Red Dot', tier: 'Budget', price: 150, desc: 'A tube red dot with a 50k-hour battery and shake-awake — the value benchmark for a durable close-range dot.' },
    ],
  },
]

/** How many categories a complete build has. */
export const CATEGORY_COUNT = PARTS.length

/**
 * ARCHETYPES — the *purpose* of the build, independent of price. Each pins the
 * character-defining parts (per budget level); the budget level decides the
 * quality tier for everything else.
 */
export const ARCHETYPES: ArchetypeDef[] = [
  {
    id: 'general',
    name: 'General Purpose',
    blurb: 'A do-everything 16" carbine with a red dot — the sensible default that handles most jobs.',
    overrides: {
      barrel: { budget: 'barrel-psa16carb', mid: 'barrel-ba16carb', high: 'barrel-crit16mid' },
      handguard: { budget: 'hg-psa12', mid: 'hg-aero15', high: 'hg-geissele13' },
      optic: { budget: 'optic-holo403', mid: 'optic-holo403', high: 'optic-holo510' },
    },
  },
  {
    id: 'cqb',
    name: 'Close-Quarters (CQB)',
    blurb: 'Short barrel, red dot, snappy handling for tight spaces and vehicles.',
    overrides: {
      barrel: { budget: 'barrel-psa105pistol', mid: 'barrel-psa105pistol', high: 'barrel-psa105pistol' },
      handguard: { budget: 'hg-bcm10', mid: 'hg-bcm10', high: 'hg-bcm10' },
      buffer: { budget: 'buf-milspecH2', mid: 'buf-super42h2', high: 'buf-super42h2' },
      optic: { budget: 'optic-holo403', mid: 'optic-holo510', high: 'optic-holo510' },
    },
  },
  {
    id: 'truck',
    name: 'Truck Gun',
    blurb: '16" and low-fuss — legal length everywhere, cheap to feed and forget in a case.',
    overrides: {
      barrel: { budget: 'barrel-psa16carb', mid: 'barrel-ba16carb', high: 'barrel-crit16mid' },
      handguard: { budget: 'hg-psa12', mid: 'hg-psa12', high: 'hg-aero15' },
      optic: { budget: 'optic-holo403', mid: 'optic-holo403', high: 'optic-holo510' },
    },
  },
  {
    id: 'range',
    name: 'Range / Fun Gun',
    blurb: 'Accuracy first — a longer barrel, good glass, and a nice trigger for slow-fire fun.',
    overrides: {
      barrel: { budget: 'barrel-ba16carb', mid: 'barrel-crit16mid', high: 'barrel-crit18rifle' },
      handguard: { budget: 'hg-psa12', mid: 'hg-aero15', high: 'hg-aero15' },
      trigger: { budget: 'trig-alg', mid: 'trig-alg', high: 'trig-geissele' },
      selector: { high: 'sel-glever' },
      optic: { budget: 'optic-holo510', mid: 'optic-holo510', high: 'optic-razor' },
    },
  },
  {
    id: 'lightweight',
    name: 'Lightweight / Hunting',
    blurb: 'Trim the ounces — a mid-length 14.5"/16", light furniture, and a compact optic.',
    overrides: {
      barrel: { budget: 'barrel-psa16carb', mid: 'barrel-ba145mid', high: 'barrel-ba145mid' },
      handguard: { budget: 'hg-psa12', mid: 'hg-psa12', high: 'hg-geissele13' },
      optic: { budget: 'optic-holo403', mid: 'optic-holo510', high: 'optic-holo510' },
    },
  },
  {
    id: 'none',
    name: 'No Preference',
    blurb: 'Just exploring — start from tier defaults and change whatever you like.',
  },
]

/**
 * BUDGET_LEVELS — the *price* dimension, independent of archetype. Sets the
 * catalog tier used for every category the archetype doesn't pin.
 */
export const BUDGET_LEVELS: BudgetLevelDef[] = [
  { id: 'budget', name: 'Budget', blurb: 'Value parts — reliable, no frills.', tier: 'Budget' },
  { id: 'mid', name: 'Mid-Tier', blurb: 'Solid quality where it counts.', tier: 'Mid' },
  { id: 'high', name: 'High-End', blurb: 'Top-shelf, best-in-class throughout.', tier: 'Premium' },
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
