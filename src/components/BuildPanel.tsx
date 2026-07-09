import { CategoryAccordion } from './CategoryAccordion'
import { InsightsStrip } from './InsightsStrip'
import { QuickFillBar } from './QuickFillBar'
import { TotalBar } from './TotalBar'
import { COMPLIANCE_NOTE, GOALS, PARTS } from '../data/parts'
import { useStore } from '../state/store'
import type { Goal, Insight } from '../types'
import styles from './BuildPanel.module.css'

interface BuildPanelProps {
  total: number
  count: number
  insights: Insight[]
}

export function BuildPanel({ total, count, insights }: BuildPanelProps) {
  const { state, dispatch } = useStore()
  const goalDef = GOALS.find((g) => g.id === state.goal) ?? GOALS[GOALS.length - 1]
  const hasManual = Object.keys(state.manual).length > 0

  return (
    <aside className={styles.panel}>
      <div className={styles.scroll}>
        {/* Goal control */}
        <div className={styles.goalRow}>
          <label className={styles.goalField}>
            <span className={`${styles.goalLabel} title-caps`}>Build goal</span>
            <select
              className={styles.select}
              value={state.goal}
              onChange={(e) => dispatch({ type: 'SET_GOAL', goal: e.target.value as Goal })}
            >
              {GOALS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={`${styles.applyBtn} title-caps`}
            onClick={() => dispatch({ type: 'APPLY_SUGGESTIONS' })}
            title="Overwrite the build with this goal's suggested parts"
          >
            Apply suggestions
          </button>
        </div>
        <p className={styles.goalBlurb}>
          {goalDef.blurb}
          {hasManual && (
            <span className={styles.manualNote}> · Your manual picks stay until you apply.</span>
          )}
        </p>

        <QuickFillBar />

        <InsightsStrip insights={insights} goalName={goalDef.name} />

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
        <TotalBar
          total={total}
          count={count}
          priceBand={goalDef.priceBand}
          showBand={state.goal !== 'none'}
        />
      </div>
    </aside>
  )
}
