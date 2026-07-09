import { useMemo } from 'react'

import { BuildPanel } from './components/BuildPanel'
import { GoalPicker } from './components/GoalPicker'
import { Scene } from './three/Scene'
import type { OpticStyle } from './three/RifleModel'
import {
  computeInsights,
  computeTotal,
  configuredMeshKeys,
  priceBand,
  resolveSelected,
  selectedCount,
} from './state/selectors'
import { useStore } from './state/store'
import styles from './App.module.css'

const DEFAULT_BARREL_IN = 16
const DEFAULT_HANDGUARD_IN = 13

export function App() {
  const { state } = useStore()
  const { selection, archetype, budgetLevel, highlight, hasChosen } = state

  const selected = useMemo(() => resolveSelected(selection), [selection])
  const total = useMemo(() => computeTotal(selected), [selected])
  const count = useMemo(() => selectedCount(selection), [selection])
  const band = useMemo(() => priceBand(archetype, budgetLevel), [archetype, budgetLevel])
  const insights = useMemo(
    () => computeInsights(archetype, budgetLevel, selected, total, band[1]),
    [archetype, budgetLevel, selected, total, band],
  )
  const configured = useMemo(() => configuredMeshKeys(selection), [selection])

  const showBcg = Boolean(selection.bcg)
  const barrelIn = selected.barrel?.lengthIn ?? DEFAULT_BARREL_IN
  const handguardIn = selected.handguard?.lengthIn ?? DEFAULT_HANDGUARD_IN
  const opticStyle: OpticStyle = selected.optic?.id === 'optic-razor' ? 'lpvo' : 'reddot'

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
          <Scene
            highlight={highlight}
            configured={configured}
            showBcg={showBcg}
            barrelIn={barrelIn}
            handguardIn={handguardIn}
            opticStyle={opticStyle}
          />
          <span className={styles.hint}>Drag to rotate</span>
        </section>

        <BuildPanel total={total} count={count} insights={insights} priceBand={band} />
      </main>

      {!hasChosen && <GoalPicker />}
    </div>
  )
}
