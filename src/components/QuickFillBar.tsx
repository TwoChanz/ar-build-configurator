import { useStore } from '../state/store'
import type { Tier } from '../types'
import styles from './QuickFillBar.module.css'

const TIERS: Tier[] = ['Budget', 'Mid', 'Premium']

export function QuickFillBar() {
  const { dispatch } = useStore()
  return (
    <div className={styles.bar} role="group" aria-label="Quick fill">
      <span className={`${styles.label} title-caps`}>Quick fill</span>
      <div className={styles.buttons}>
        {TIERS.map((tier) => (
          <button
            key={tier}
            type="button"
            className={`${styles.btn} title-caps`}
            onClick={() => dispatch({ type: 'QUICK_FILL', tier })}
          >
            {tier}
          </button>
        ))}
        <button
          type="button"
          className={`${styles.btn} ${styles.reset} title-caps`}
          onClick={() => dispatch({ type: 'RESET' })}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
