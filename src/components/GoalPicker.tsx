import { useState } from 'react'

import { ARCHETYPES, BUDGET_LEVELS } from '../data/parts'
import { estimateBuildTotal, priceBand } from '../state/selectors'
import { useStore } from '../state/store'
import { usd } from '../utils/format'
import type { Archetype } from '../types'
import styles from './GoalPicker.module.css'

/**
 * First-run picker, two steps:
 *   1. Build type (archetype) — the purpose, independent of price.
 *   2. Budget level — the price tier, shown with live ranges for that build.
 * "No Preference" skips straight in with tier defaults left blank.
 */
export function GoalPicker() {
  const { dispatch } = useStore()
  const [pending, setPending] = useState<Archetype | null>(null)

  const chooseArchetype = (archetype: Archetype) => {
    if (archetype === 'none') {
      dispatch({ type: 'CHOOSE', archetype, budgetLevel: 'mid', applyDefaults: false })
      return
    }
    setPending(archetype)
  }

  const pendingDef = pending ? ARCHETYPES.find((a) => a.id === pending) : null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="goal-title">
      <div className={styles.modal}>
        {!pendingDef ? (
          <>
            <header className={styles.header}>
              <h1 id="goal-title" className={`${styles.title} title-caps`}>
                What are you building?
              </h1>
              <p className={styles.sub}>
                Pick the build type. Next you'll choose a price level — change anything later.
              </p>
            </header>

            <div className={styles.grid}>
              {ARCHETYPES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={styles.card}
                  onClick={() => chooseArchetype(a.id)}
                >
                  <span className={`${styles.name} title-caps`}>{a.name}</span>
                  <span className={styles.blurb}>{a.blurb}</span>
                  <span className={styles.step1cta}>
                    {a.id === 'none' ? 'Start exploring →' : 'Choose price →'}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <header className={styles.header}>
              <button type="button" className={styles.back} onClick={() => setPending(null)}>
                ← Build type
              </button>
              <h1 className={`${styles.title} title-caps`}>
                {pendingDef.name} — pick a price level
              </h1>
              <p className={styles.sub}>
                Ranges are estimated from this build's default parts at each level.
              </p>
            </header>

            <div className={styles.grid}>
              {BUDGET_LEVELS.map((lvl) => {
                const est = estimateBuildTotal(pendingDef.id, lvl.id)
                const [lo, hi] = priceBand(pendingDef.id, lvl.id)
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    className={styles.card}
                    onClick={() =>
                      dispatch({
                        type: 'CHOOSE',
                        archetype: pendingDef.id,
                        budgetLevel: lvl.id,
                        applyDefaults: true,
                      })
                    }
                  >
                    <span className={`${styles.name} title-caps`}>{lvl.name}</span>
                    <span className={styles.blurb}>{lvl.blurb}</span>
                    <span className={`${styles.band} mono`}>
                      {usd(lo)}–{usd(hi)}
                    </span>
                    <span className={`${styles.estimate} mono`}>≈ {usd(est)} as specced</span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
