import { BuildActions } from './BuildActions'
import { CategoryAccordion } from './CategoryAccordion'
import { InsightsStrip } from './InsightsStrip'
import { QuickFillBar } from './QuickFillBar'
import { TotalBar } from './TotalBar'
import { ARCHETYPES, BUDGET_LEVELS, COMPLIANCE_NOTE, PARTS } from '../data/parts'
import { useStore } from '../state/store'
import type { Archetype, Insight } from '../types'
import styles from './BuildPanel.module.css'

interface BuildPanelProps {
  total: number
  count: number
  insights: Insight[]
  priceBand: [number, number]
}

export function BuildPanel({ total, count, insights, priceBand }: BuildPanelProps) {
  const { state, dispatch } = useStore()
  const archDef = ARCHETYPES.find((a) => a.id === state.archetype) ?? ARCHETYPES[ARCHETYPES.length - 1]
  const levelDef = BUDGET_LEVELS.find((l) => l.id === state.budgetLevel) ?? BUDGET_LEVELS[1]
  const hasManual = Object.keys(state.manual).length > 0

  return (
    <aside className={styles.panel}>
      <div className={styles.scroll}>
        {/* Fire-control platform (archetype) */}
        <label className={styles.field}>
          <span className={`${styles.fieldLabel} title-caps`}>Fire control</span>
          <select
            className={styles.select}
            value={state.archetype}
            onChange={(e) => dispatch({ type: 'SET_ARCHETYPE', archetype: e.target.value as Archetype })}
          >
            {ARCHETYPES.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        {/* Price level (segmented) */}
        <div className={styles.field}>
          <span className={`${styles.fieldLabel} title-caps`}>Price level</span>
          <div className={styles.segmented} role="group" aria-label="Price level">
            {BUDGET_LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                className={`${styles.seg} ${state.budgetLevel === lvl.id ? styles.segActive : ''} title-caps`}
                aria-pressed={state.budgetLevel === lvl.id}
                onClick={() => dispatch({ type: 'SET_BUDGET', budgetLevel: lvl.id })}
              >
                {lvl.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.goalMeta}>
          <p className={styles.goalBlurb}>
            {archDef.blurb}
            {hasManual && (
              <span className={styles.manualNote}> · Your manual picks stay until you apply.</span>
            )}
          </p>
          <button
            type="button"
            className={`${styles.applyBtn} title-caps`}
            onClick={() => dispatch({ type: 'APPLY_SUGGESTIONS' })}
            title={`Fill the build with ${archDef.name} parts at the ${levelDef.name} level`}
          >
            Apply suggestions
          </button>
        </div>

        <QuickFillBar />

        <BuildActions />

        <InsightsStrip insights={insights} goalName={`${archDef.name} · ${levelDef.name}`} />

        <div className={styles.categories}>
          {PARTS.map((cat, i) => (
            <CategoryAccordion
              key={cat.id}
              category={cat}
              index={i}
              selectedOptionId={state.selection[cat.id]}
              open={state.openCategory === cat.id}
              onToggle={() => dispatch({ type: 'TOGGLE_CATEGORY', category: cat.id })}
              onSelect={(optionId) =>
                dispatch({ type: 'SELECT_OPTION', category: cat.id, option: optionId })
              }
            />
          ))}
        </div>

        <p className={styles.compliance}>
          <span className={`${styles.complianceTag} title-caps`}>Compliance</span>
          {COMPLIANCE_NOTE}
        </p>
      </div>

      <div className={styles.totalWrap}>
        <TotalBar total={total} count={count} priceBand={priceBand} showBand />
      </div>
    </aside>
  )
}
