import { usd } from '../utils/format'
import type { Option } from '../types'
import styles from './OptionRow.module.css'

interface OptionRowProps {
  option: Option
  /** 1-based rank within the category (#1 == best). */
  rank: number
  selected: boolean
  onSelect: () => void
}

/** Small attribute chips for the rule-relevant fields, when present. */
function attrChips(o: Option): string[] {
  const chips: string[] = []
  if (o.lengthIn !== undefined) chips.push(`${o.lengthIn}"`)
  if (o.gas) chips.push(`${o.gas} gas`)
  if (o.bufferWeight) chips.push(o.bufferWeight === 'carbine' ? 'carbine buffer' : `${o.bufferWeight} buffer`)
  if (o.selectorType) chips.push(o.selectorType === 'g-lever' ? 'G-Lever' : 'mil-spec')
  if (o.triggerType) chips.push(o.triggerType === 'geissele' ? 'Geissele-type' : 'mil-spec FCG')
  return chips
}

export function OptionRow({ option, rank, selected, onSelect }: OptionRowProps) {
  const chips = attrChips(option)
  return (
    <div className={`${styles.wrap} ${selected ? styles.wrapSelected : ''}`}>
      <button
        type="button"
        className={`${styles.row} ${selected ? styles.selected : ''}`}
        onClick={onSelect}
        aria-pressed={selected}
      >
        <span className={`${styles.rank} mono`}>#{rank}</span>

        <span className={styles.body}>
          <span className={styles.brandLine}>
            <span className={styles.brand}>{option.brand}</span>
            <span className={`${styles.tier} ${styles[`tier${option.tier}`]} title-caps`}>
              {option.tier}
            </span>
          </span>
          {chips.length > 0 && (
            <span className={styles.chips}>
              {chips.map((c) => (
                <span key={c} className={`${styles.chip} mono`}>
                  {c}
                </span>
              ))}
            </span>
          )}
        </span>

        <span className={`${styles.price} mono`}>{usd(option.price)}</span>
      </button>

      {selected && <p className={styles.desc}>{option.desc}</p>}
    </div>
  )
}
