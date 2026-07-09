import { OptionRow } from './OptionRow'
import { usd } from '../utils/format'
import type { Category } from '../types'
import styles from './CategoryAccordion.module.css'

interface CategoryAccordionProps {
  category: Category
  selectedOptionId: string | undefined
  open: boolean
  index: number
  onToggle: () => void
  onSelect: (optionId: string) => void
}

export function CategoryAccordion({
  category,
  selectedOptionId,
  open,
  index,
  onToggle,
  onSelect,
}: CategoryAccordionProps) {
  const selected = category.options.find((o) => o.id === selectedOptionId)
  const panelId = `cat-panel-${category.id}`

  return (
    <section className={`${styles.wrap} ${open ? styles.open : ''}`}>
      <button
        type="button"
        className={styles.header}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className={`${styles.index} mono`}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.headMain}>
          <span className={`${styles.name} title-caps`}>{category.name}</span>
          <span className={styles.summary}>
            {selected ? (
              <>
                <span className={styles.selBrand}>{selected.brand}</span>
                <span className={`${styles.selPrice} mono`}>{usd(selected.price)}</span>
              </>
            ) : (
              <span className={styles.notSet}>Not selected</span>
            )}
          </span>
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.panel} id={panelId}>
          {category.note && <p className={styles.note}>{category.note}</p>}
          <div className={styles.options}>
            {category.options.map((opt, i) => (
              <OptionRow
                key={opt.id}
                option={opt}
                rank={i + 1}
                selected={opt.id === selectedOptionId}
                onSelect={() => onSelect(opt.id)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
