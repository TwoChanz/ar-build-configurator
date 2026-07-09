import { useStore } from '../state/store'
import type { Insight, Severity } from '../types'
import styles from './InsightsStrip.module.css'

interface InsightsStripProps {
  insights: Insight[]
  goalName: string
}

const ORDER: Severity[] = ['error', 'warn', 'tip']
const LABEL: Record<Severity, string> = {
  error: 'Errors',
  warn: 'Warnings',
  tip: 'Tips',
}

export function InsightsStrip({ insights, goalName }: InsightsStripProps) {
  const { dispatch } = useStore()
  const grouped = ORDER.map((sev) => ({
    sev,
    items: insights.filter((i) => i.severity === sev),
  })).filter((g) => g.items.length > 0)

  return (
    <div className={styles.wrap} aria-live="polite">
      <div className={styles.head}>
        <span className={`${styles.title} title-caps`}>Insights</span>
        <span className={`${styles.badge} mono ${insights.length ? styles.badgeActive : ''}`}>
          {insights.length}
        </span>
      </div>

      {insights.length === 0 ? (
        <p className={styles.clean}>
          <span className={styles.checkmark} aria-hidden>
            ✓
          </span>
          No conflicts — build looks coherent for {goalName}.
        </p>
      ) : (
        <div className={styles.groups}>
          {grouped.map(({ sev, items }) => (
            <div key={sev} className={styles.group}>
              <span className={`${styles.groupLabel} ${styles[sev]} title-caps`}>
                {LABEL[sev]} <span className="mono">({items.length})</span>
              </span>
              <ul className={styles.list}>
                {items.map((ins) => {
                  const clickable = ins.highlight && ins.highlight.length > 0
                  return (
                    <li key={ins.id}>
                      <button
                        type="button"
                        className={`${styles.item} ${styles[`${sev}Item`]} ${
                          clickable ? styles.clickable : ''
                        }`}
                        disabled={!clickable}
                        onClick={() =>
                          clickable &&
                          dispatch({ type: 'SET_HIGHLIGHT', highlight: ins.highlight ?? [] })
                        }
                        title={clickable ? 'Show on schematic' : undefined}
                      >
                        <span className={styles.dot} aria-hidden />
                        <span>{ins.message}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
