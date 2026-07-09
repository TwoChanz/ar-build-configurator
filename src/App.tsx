import { useMemo } from 'react'

import { BuildPanel } from './components/BuildPanel'
import { GoalPicker } from './components/GoalPicker'
import { Scene } from './three/Scene'
import {
  computeInsights,
  computeTotal,
  configuredMeshKeys,
  resolveSelected,
  selectedCount,
} from './state/selectors'
import { useStore } from './state/store'
import styles from './App.module.css'

export function App() {
  const { state } = useStore()
  const { selection, goal, highlight, hasChosenGoal } = state

  const selected = useMemo(() => resolveSelected(selection), [selection])
  const total = useMemo(() => computeTotal(selected), [selected])
  const count = useMemo(() => selectedCount(selection), [selection])
  const insights = useMemo(
    () => computeInsights(goal, selected, total),
    [goal, selected, total],
  )
  const configured = useMemo(() => configuredMeshKeys(selection), [selection])
  const showBcg = Boolean(selection.bcg)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden>
            ▮▮▮
          </span>
          <h1 className={`${styles.title} title-caps`}>AR Build Configurator</h1>
        </div>
        <span className={styles.tagline}>Parts planning · compatibility insights · not legal advice</span>
      </header>

      <main className={styles.main}>
        <section className={styles.stage} aria-label="3D build schematic">
          <Scene highlight={highlight} configured={configured} showBcg={showBcg} />
          <span className={styles.hint}>Drag to rotate</span>
        </section>

        <BuildPanel total={total} count={count} insights={insights} />
      </main>

      {!hasChosenGoal && <GoalPicker />}
    </div>
  )
}
