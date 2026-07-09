import { GOALS } from '../data/parts'
import { useStore } from '../state/store'
import { usd } from '../utils/format'
import styles from './GoalPicker.module.css'

/**
 * First-run goal picker. Choosing a goal (other than "No preference") seeds
 * sensible default parts for that build intent; the user can change anything
 * afterward.
 */
export function GoalPicker() {
  const { dispatch } = useStore()

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="goal-title">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h1 id="goal-title" className={`${styles.title} title-caps`}>
            What are you building?
          </h1>
          <p className={styles.sub}>
            Pick a goal and we'll suggest a starting point + a price band. Change anything later.
          </p>
        </header>

        <div className={styles.grid}>
          {GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              className={styles.card}
              onClick={() =>
                dispatch({ type: 'CHOOSE_GOAL', goal: goal.id, applyDefaults: goal.id !== 'none' })
              }
            >
              <span className={`${styles.name} title-caps`}>{goal.name}</span>
              <span className={styles.blurb}>{goal.blurb}</span>
              {goal.id !== 'none' && (
                <span className={`${styles.band} mono`}>
                  {usd(goal.priceBand[0])}–{usd(goal.priceBand[1])}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
