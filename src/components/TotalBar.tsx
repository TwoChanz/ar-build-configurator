import { CATEGORY_COUNT } from '../data/parts'
import { usd } from '../utils/format'
import styles from './TotalBar.module.css'

interface TotalBarProps {
  total: number
  count: number
  priceBand: [number, number]
  showBand: boolean
}

export function TotalBar({ total, count, priceBand, showBand }: TotalBarProps) {
  const [min, max] = priceBand
  const over = total > max
  const under = total > 0 && total < min

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={`${styles.count} mono`}>
          {count} <span className={styles.of}>of {CATEGORY_COUNT}</span>
        </span>
        <span className={styles.countLabel}>selected</span>
      </div>

      {showBand && (
        <div className={styles.band}>
          <span className={styles.bandLabel}>Target band</span>
          <span
            className={`${styles.bandVal} mono ${over ? styles.over : ''} ${
              under ? styles.under : ''
            }`}
          >
            {usd(min)}–{usd(max)}
          </span>
        </div>
      )}

      <div className={styles.right}>
        <span className={styles.totalLabel}>Total</span>
        <span className={`${styles.total} mono ${over ? styles.over : ''}`}>{usd(total)}</span>
      </div>
    </div>
  )
}
