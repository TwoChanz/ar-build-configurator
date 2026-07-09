import { useEffect, useRef, useState } from 'react'

import { shareUrl } from '../state/persist'
import { useStore } from '../state/store'
import { buildCsv, buildText } from '../utils/exportBuild'
import styles from './BuildActions.module.css'

/** Trigger a client-side file download. */
function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function BuildActions() {
  const { state } = useStore()
  const { archetype, budgetLevel, selection } = state
  const [status, setStatus] = useState('')
  const timer = useRef<number | null>(null)

  const flash = (msg: string) => {
    setStatus(msg)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus(''), 2500)
  }

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  const onShare = async () => {
    const url = shareUrl({ archetype, budgetLevel, selection })
    // Reflect the build in the address bar so it's shareable even if the
    // clipboard is unavailable (and so refresh/bookmark keeps this build).
    window.history.replaceState(null, '', url)
    flash(
      (await copy(url))
        ? 'Share link copied to clipboard'
        : 'Share link is now in the address bar — copy it from there',
    )
  }

  const onCopyList = async () => {
    const text = buildText(archetype, budgetLevel, selection)
    flash((await copy(text)) ? 'Parts list copied' : 'Copy blocked — check clipboard permissions')
  }

  const onDownloadCsv = () => {
    download('ar-build.csv', buildCsv(selection), 'text/csv;charset=utf-8')
    flash('Downloaded ar-build.csv')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.buttons} role="group" aria-label="Build actions">
        <button type="button" className={`${styles.btn} title-caps`} onClick={onShare}>
          Share link
        </button>
        <button type="button" className={`${styles.btn} title-caps`} onClick={onCopyList}>
          Copy list
        </button>
        <button type="button" className={`${styles.btn} title-caps`} onClick={onDownloadCsv}>
          Export CSV
        </button>
      </div>
      <span className={styles.status} aria-live="polite">
        {status}
      </span>
    </div>
  )
}
