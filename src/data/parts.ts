import type { ArchetypeDef, BudgetLevelDef, Category } from '../types'

/**
 * PARTS — the AR-15 component catalog, oriented around forced-reset (FRT),
 * binary, and Super-Safety (three-way selector) builds.
 *
 * 13 categories, each with options ordered best -> value (index 0 == rank #1).
 * Prices/tiers are APPROXIMATE PLANNING ESTIMATES, not endorsements.
 *
 * Rule-relevant attributes live directly on the options that need them:
 *   • barrel   -> lengthIn, gas
 *   • handguard-> lengthIn
 *   • buffer   -> bufferWeight
 *   • trigger  -> fireControl ('standard' | 'frt' | 'binary')
 *   • selector -> fireControl ('standard' | 'super-safety')
 *   • bcg      -> bcgProfile ('full-auto' | 'semi')
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
      { id: 'lower-anderson', brand: 'Anderson AM-15', tier: 'Budget', price: 60, desc: 'The classic no-frills mil-spec lower — inexpensive, ubiquitous, and a fine foundation for a value build.' },
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
    note: 'For reliable forced reset you want a strong, consistent gas impulse — a carbine-length gas 14.5–16" barrel (slightly over-gassed) is the safe pick. Length reshapes the 3D model.',
    options: [
      { id: 'barrel-ba16carb', brand: 'Ballistic Advantage 16"', tier: 'Mid', price: 175, lengthIn: 16, gas: 'carbine', desc: 'A workhorse 16" carbine-gas barrel — over-gassed on purpose, which is exactly what a forced-reset device wants. The default here.' },
      { id: 'barrel-crit16mid', brand: 'Criterion 16" Hybrid', tier: 'Premium', price: 360, lengthIn: 16, gas: 'mid', desc: 'Button-rifled, hand-lapped 16" with a mid-length gas system — buttery for normal semi, but a touch softer on impulse than carbine gas.' },
      { id: 'barrel-fa145carb', brand: 'Faxon 14.5" Carbine', tier: 'Premium', price: 250, lengthIn: 14.5, gas: 'carbine', desc: 'A 14.5" carbine-gas barrel (pin & weld a brake to hit 16") — short, punchy gas impulse that drives forced-reset resets hard.' },
      { id: 'barrel-psa16carb', brand: 'PSA 16" Carbine', tier: 'Budget', price: 110, lengthIn: 16, gas: 'carbine', desc: 'Palmetto’s value 16" carbine-gas barrel — unglamorous but runs, and well-suited to a budget forced-reset build.' },
      { id: 'barrel-crit18rifle', brand: 'Criterion 18" SPR', tier: 'Premium', price: 390, lengthIn: 18, gas: 'rifle', desc: 'An 18" rifle-gas SPR barrel — a lovely precision-semi setup, but the soft rifle-gas impulse is the wrong direction for forced reset.' },
      { id: 'barrel-psa105pistol', brand: 'PSA 10.5" Pistol', tier: 'Budget', price: 130, lengthIn: 10.5, gas: 'pistol', desc: 'A 10.5" pistol-gas SBR/pistol barrel — very compact and over-gassed, but needs a heavier buffer to keep timing sane.' },
    ],
  },
  {
    id: 'handguard',
    name: 'Handguard',
    meshKey: 'handguard',
    note: 'Rail length reshapes the 3D model — longer rails reach further down the barrel.',
    options: [
      { id: 'hg-geissele13', brand: 'Geissele MK16 13"', tier: 'Premium', price: 290, lengthIn: 13, desc: 'The MK16 M-LOK rail — slim, rock-solid, and a special-ops staple. The bolt-up interface is famously repeatable.' },
      { id: 'hg-aero15', brand: 'Aero ATLAS S-ONE 15"', tier: 'Mid', price: 180, lengthIn: 15, desc: 'A long 15" M-LOK rail giving you maximum real estate for a full-length grip and mounted gear on a 16" barrel.' },
      { id: 'hg-bcm10', brand: 'BCM MCMR 10"', tier: 'Mid', price: 200, lengthIn: 10, desc: 'A short 10" M-LOK rail sized for pistol/SBR barrels — keeps the front end trim.' },
      { id: 'hg-psa12', brand: 'PSA Lightweight 12"', tier: 'Budget', price: 70, lengthIn: 12, desc: 'A lightweight 12" M-LOK rail at a value price — a sensible middle length for most 14.5–16" carbines.' },
    ],
  },
  {
    id: 'bcg',
    name: 'Bolt Carrier Group',
    meshKey: 'bcg',
    note: 'Forced-reset / Super-Safety builds want a full-auto (M16) profile carrier — the extra mass gives consistent reset timing. Rides inside the upper; shown on the schematic only when selected.',
    options: [
      { id: 'bcg-bcm', brand: 'BCM BCG (full-auto)', tier: 'Premium', price: 200, bcgProfile: 'full-auto', desc: 'Full-auto-profile carrier, shot-peened and HPT/MPI tested — the gold standard, and the heavier mass forced-reset devices like.' },
      { id: 'bcg-toolcraft', brand: 'Toolcraft Full-Auto Nitride', tier: 'Mid', price: 130, bcgProfile: 'full-auto', desc: 'A well-regarded full-auto-profile nitride BCG that punches above its price — a common pick for reliable device builds.' },
      { id: 'bcg-psafa', brand: 'PSA Full-Auto BCG', tier: 'Budget', price: 100, bcgProfile: 'full-auto', desc: 'Palmetto’s value full-auto-profile carrier — the budget way to get the right carrier mass for a forced-reset build.' },
      { id: 'bcg-semi', brand: 'Semi-Auto Profile BCG', tier: 'Budget', price: 85, bcgProfile: 'semi', desc: 'A lighter AR-15 (semi) profile carrier — fine for a normal semi build, but the reduced mass can make forced-reset timing fussy.' },
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
      { id: 'muz-vg6', brand: 'VG6 Gamma 556', tier: 'Mid', price: 65, desc: 'A popular hybrid brake/comp that flattens recoil and muzzle rise — helpful for staying on target during fast strings.' },
      { id: 'muz-a2', brand: 'A2 Flash Hider', tier: 'Budget', price: 12, desc: 'The classic “birdcage” — cheap, effective flash suppression that’s been standard since the M16A2.' },
    ],
  },
  {
    id: 'trigger',
    name: 'Trigger',
    meshKey: 'trigger',
    note: 'This is where an FRT or binary trigger lives. Forced-reset (FRT) triggers use the carrier to force the trigger to reset; binary triggers fire on pull and release. Both are legally sensitive — see the compliance note.',
    options: [
      { id: 'trig-wot', brand: 'Wide Open Trigger (WOT)', tier: 'Premium', price: 440, fireControl: 'frt', desc: 'A forced-reset trigger known for a smooth pull; like all FRTs its ATF status has been contested — install and legality are on you.' },
      { id: 'trig-rarebreed', brand: 'Rare Breed FRT-15', tier: 'Premium', price: 380, fireControl: 'frt', desc: 'The forced-reset trigger that launched the category and the ongoing ATF litigation — carrier-driven reset for very fast semi-auto strings.' },
      { id: 'trig-frtvalue', brand: 'FRT-Style Trigger (value)', tier: 'Budget', price: 230, fireControl: 'frt', desc: 'A value-priced forced-reset trigger — the budget entry to an FRT build; QC and legality vary, so research the specific maker.' },
      { id: 'trig-bfsiii', brand: 'Franklin Armory BFSIII', tier: 'Premium', price: 430, fireControl: 'binary', desc: 'A binary (pull-and-release) trigger with its own three-position selector — fires once on pull, once on release. State-legal status varies.' },
      { id: 'trig-echo', brand: 'Fostech Echo Gen 3', tier: 'Mid', price: 350, fireControl: 'binary', desc: 'A binary trigger with a selectable release mode — another pull-and-release option; check your state before buying.' },
      { id: 'trig-geissele', brand: 'Geissele SSA-E', tier: 'Premium', price: 240, fireControl: 'standard', desc: 'A superb two-stage standard trigger — the right choice when the forced-reset function comes from a Super Safety selector instead.' },
      { id: 'trig-alg', brand: 'ALG ACT', tier: 'Mid', price: 65, fireControl: 'standard', desc: 'A smoothed, tuned mil-spec single-stage from Geissele’s value line — a solid standard trigger that drops in anywhere.' },
      { id: 'trig-milspec', brand: 'Mil-Spec Trigger Group', tier: 'Budget', price: 45, fireControl: 'standard', desc: 'The standard curved single-stage — gritty but reliable, and the cheapest standard trigger under a Super Safety.' },
    ],
  },
  {
    id: 'selector',
    name: 'Safety Selector',
    meshKey: 'selector',
    note: 'This is where a Super Safety (three-way) selector lives — safe / semi / forced-reset. Legally sensitive; the ATF has classified some three-way devices as machine guns. See the compliance note.',
    options: [
      { id: 'sel-ss-p', brand: 'Super Safety Selector (3-Way)', tier: 'Premium', price: 220, fireControl: 'super-safety', desc: 'A three-position safety — safe / semi / forced-reset. In the third position it uses the selector to force the trigger to reset. Legally contested; confirm status before buying.' },
      { id: 'sel-ss-mid', brand: '3-Way Auto Selector', tier: 'Mid', price: 160, fireControl: 'super-safety', desc: 'A budget-friendlier three-way safety delivering the same forced-reset function in its third position. Same legal cautions apply.' },
      { id: 'sel-radian', brand: 'Radian Talon Ambi', tier: 'Premium', price: 95, fireControl: 'standard', desc: 'A premium 45°/90° ambidextrous standard safety — the pick when your forced-reset function comes from an FRT/binary trigger instead.' },
      { id: 'sel-ambi', brand: 'Ambi Safety Selector', tier: 'Mid', price: 45, fireControl: 'standard', desc: 'A solid two-sided standard safety at a fair price.' },
      { id: 'sel-milspec', brand: 'Mil-Spec Safety Selector', tier: 'Budget', price: 18, fireControl: 'standard', desc: 'The standard single-side 90° safety — simple, cheap, and reliable.' },
    ],
  },
  {
    id: 'buffer',
    name: 'Buffer System',
    meshKey: 'buffer',
    note: 'Reset timing is buffer-sensitive — an H2 buffer is the usual reliable starting point for forced-reset / Super-Safety builds.',
    options: [
      { id: 'buf-super42h2', brand: 'Geissele Super 42 (H2)', tier: 'Premium', price: 110, bufferWeight: 'H2', desc: 'A braided-spring + H2 buffer kit tuned to smooth the cycle and cut bolt bounce — a great baseline for device timing.' },
      { id: 'buf-milspecH2', brand: 'Mil-Spec H2 Buffer', tier: 'Budget', price: 35, bufferWeight: 'H2', desc: 'A heavier H2 buffer at a budget price — the cheap way to get the right buffer mass for reliable resets.' },
      { id: 'buf-h3', brand: 'H3 Buffer + Spring', tier: 'Mid', price: 55, bufferWeight: 'H3', desc: 'An even heavier H3 buffer — useful on short/over-gassed setups to slow the carrier and stabilize reset timing.' },
      { id: 'buf-milspec', brand: 'Mil-Spec Carbine Buffer', tier: 'Budget', price: 25, bufferWeight: 'carbine', desc: 'The standard carbine buffer + spring — fine for a normal semi build, but often too light for consistent forced-reset timing.' },
    ],
  },
  {
    id: 'grip',
    name: 'Pistol Grip',
    meshKey: 'grip',
    options: [
      { id: 'grip-bcm', brand: 'BCM Gunfighter Mod 3', tier: 'Premium', price: 28, desc: 'A vertical-ish grip angle with a filled backstrap — comfortable for modern shooting stances.' },
      { id: 'grip-magpul', brand: 'Magpul MOE-K2', tier: 'Mid', price: 18, desc: 'A steeper grip angle that suits a squared-up, C-clamp style — grippy texture, great value.' },
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
      { id: 'optic-razor', brand: 'Vortex Razor Gen III 1-10x', tier: 'Premium', price: 2000, desc: 'A flagship 1-10x LPVO — overkill for a close-range fun gun, but there if you want reach. Class-leading glass and price.' },
      { id: 'optic-holo510', brand: 'Holosun HE510C Reflex', tier: 'Mid', price: 510, desc: 'An open reflex with a circle-dot reticle, solar backup, and shake-awake — fast, rugged, and ideal for rapid close-range work.' },
      { id: 'optic-holo403', brand: 'Holosun HS403C Red Dot', tier: 'Budget', price: 150, desc: 'A tube red dot with a 50k-hour battery and shake-awake — the value benchmark for a durable close-range dot.' },
    ],
  },
]

/** How many categories a complete build has. */
export const CATEGORY_COUNT = PARTS.length

/**
 * ARCHETYPES — the fire-control PLATFORM (the build type), independent of price.
 * Each pins the device plus the parts that make it run reliably (BCG profile,
 * buffer, barrel/gas); the budget level decides quality tier for the rest.
 */
export const ARCHETYPES: ArchetypeDef[] = [
  {
    id: 'super-safety',
    name: 'Super Safety (3-Way)',
    blurb: 'Built around a three-way safety selector — safe / semi / forced-reset — with a standard trigger and the gas + buffer + carrier to run it.',
    overrides: {
      selector: { budget: 'sel-ss-mid', mid: 'sel-ss-mid', high: 'sel-ss-p' },
      trigger: { budget: 'trig-milspec', mid: 'trig-alg', high: 'trig-geissele' },
      bcg: { budget: 'bcg-psafa', mid: 'bcg-toolcraft', high: 'bcg-bcm' },
      buffer: { budget: 'buf-milspecH2', mid: 'buf-super42h2', high: 'buf-super42h2' },
      barrel: { budget: 'barrel-psa16carb', mid: 'barrel-ba16carb', high: 'barrel-ba16carb' },
      optic: { budget: 'optic-holo403', mid: 'optic-holo510', high: 'optic-holo510' },
    },
  },
  {
    id: 'frt',
    name: 'Forced-Reset Trigger (FRT)',
    blurb: 'Built around a forced-reset trigger, with a standard safety and the over-gassed barrel, H2 buffer, and full-auto carrier that make resets reliable.',
    overrides: {
      trigger: { budget: 'trig-frtvalue', mid: 'trig-rarebreed', high: 'trig-wot' },
      selector: { budget: 'sel-milspec', mid: 'sel-ambi', high: 'sel-radian' },
      bcg: { budget: 'bcg-psafa', mid: 'bcg-toolcraft', high: 'bcg-bcm' },
      buffer: { budget: 'buf-milspecH2', mid: 'buf-super42h2', high: 'buf-super42h2' },
      barrel: { budget: 'barrel-psa16carb', mid: 'barrel-ba16carb', high: 'barrel-fa145carb' },
      optic: { budget: 'optic-holo403', mid: 'optic-holo510', high: 'optic-holo510' },
    },
  },
  {
    id: 'binary',
    name: 'Binary Trigger',
    blurb: 'Built around a binary (pull-and-release) trigger with its own three-position selector, plus a full-auto carrier and H2 buffer for consistent cycling.',
    overrides: {
      trigger: { budget: 'trig-echo', mid: 'trig-echo', high: 'trig-bfsiii' },
      selector: { budget: 'sel-milspec', mid: 'sel-ambi', high: 'sel-radian' },
      bcg: { budget: 'bcg-psafa', mid: 'bcg-toolcraft', high: 'bcg-bcm' },
      buffer: { budget: 'buf-milspecH2', mid: 'buf-super42h2', high: 'buf-super42h2' },
      barrel: { budget: 'barrel-psa16carb', mid: 'barrel-ba16carb', high: 'barrel-ba16carb' },
      optic: { budget: 'optic-holo403', mid: 'optic-holo510', high: 'optic-holo510' },
    },
  },
  {
    id: 'standard',
    name: 'Standard Semi (baseline)',
    blurb: 'A normal semi-auto carbine — a clean baseline to price against, with a standard trigger and safety.',
    overrides: {
      trigger: { budget: 'trig-milspec', mid: 'trig-alg', high: 'trig-geissele' },
      selector: { budget: 'sel-milspec', mid: 'sel-ambi', high: 'sel-radian' },
      barrel: { budget: 'barrel-psa16carb', mid: 'barrel-ba16carb', high: 'barrel-crit16mid' },
      optic: { budget: 'optic-holo403', mid: 'optic-holo510', high: 'optic-holo510' },
    },
  },
]

/**
 * BUDGET_LEVELS — the *price* dimension, independent of platform. Sets the
 * catalog tier used for every category the platform doesn't pin.
 */
export const BUDGET_LEVELS: BudgetLevelDef[] = [
  { id: 'budget', name: 'Budget', blurb: 'Value parts — reliable, no frills.', tier: 'Budget' },
  { id: 'mid', name: 'Mid-Tier', blurb: 'Solid quality where it counts.', tier: 'Mid' },
  { id: 'high', name: 'High-End', blurb: 'Top-shelf, best-in-class throughout.', tier: 'Premium' },
]

/**
 * Compliance note shown in the panel. This is a planning/shopping tool, not
 * legal advice or installation instructions.
 */
export const COMPLIANCE_NOTE =
  'IMPORTANT: Forced-reset triggers (FRTs), binary triggers, and "Super Safety" three-way ' +
  'selectors occupy a contested, fast-changing legal space. The ATF has classified some ' +
  'forced-reset and three-way devices as machine guns, federal litigation is ongoing, and ' +
  'many states and localities ban them outright. The lower receiver is the regulated firearm. ' +
  'This is a parts-planning tool with approximate estimates — NOT legal advice, and NOT ' +
  'manufacturing or installation instructions. Only consider commercially-available products, ' +
  'and confirm current federal ATF classification and your state/local law before buying, ' +
  'installing, or assembling anything.'
