import { ARCHETYPES, BUDGET_LEVELS, PARTS } from '../data/parts'
import type { Archetype, BudgetLevel, Selection } from '../types'

/**
 * Build persistence + sharing.
 *
 * A build is saved silently to localStorage on every change, and can be encoded
 * into a shareable URL (`…#b=<base64url>`). On load we restore from an incoming
 * share link first, then fall back to localStorage. Everything is validated
 * against the current catalog, so a stale link can never inject unknown ids.
 */

const STORAGE_KEY = 'frt-configurator.build.v1'
const HASH_PREFIX = 'b='

export interface PersistedBuild {
  archetype: Archetype
  budgetLevel: BudgetLevel
  selection: Selection
  hasChosen: boolean
}

const isArchetype = (v: unknown): v is Archetype => ARCHETYPES.some((a) => a.id === v)
const isBudgetLevel = (v: unknown): v is BudgetLevel => BUDGET_LEVELS.some((l) => l.id === v)

/** Keep only category->option ids that actually exist in the current catalog. */
function validateSelection(raw: unknown): Selection {
  const out: Selection = {}
  if (!raw || typeof raw !== 'object') return out
  const rec = raw as Record<string, unknown>
  for (const cat of PARTS) {
    const id = rec[cat.id]
    if (typeof id === 'string' && cat.options.some((o) => o.id === id)) out[cat.id] = id
  }
  return out
}

/* ---------- base64url (unicode-safe) ---------- */

function toB64Url(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64Url(s: string): string {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/* ---------- encode / decode ---------- */

interface Payload {
  a: Archetype
  b: BudgetLevel
  s: Selection
}

export function encodeBuild(build: {
  archetype: Archetype
  budgetLevel: BudgetLevel
  selection: Selection
}): string {
  const payload: Payload = { a: build.archetype, b: build.budgetLevel, s: build.selection }
  return toB64Url(JSON.stringify(payload))
}

function decodeBuild(raw: string): Payload | null {
  try {
    const obj = JSON.parse(fromB64Url(raw)) as Record<string, unknown>
    if (!isArchetype(obj.a) || !isBudgetLevel(obj.b)) return null
    return { a: obj.a, b: obj.b, s: validateSelection(obj.s) }
  } catch {
    return null
  }
}

/* ---------- share url ---------- */

export function shareUrl(build: {
  archetype: Archetype
  budgetLevel: BudgetLevel
  selection: Selection
}): string {
  const base = window.location.origin + window.location.pathname
  return `${base}#${HASH_PREFIX}${encodeBuild(build)}`
}

/* ---------- load / save ---------- */

/** Restore a build from an incoming share link, else from localStorage. */
export function loadInitial(): PersistedBuild | null {
  // 1. incoming share link takes precedence
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#/, '')
    if (hash.startsWith(HASH_PREFIX)) {
      const p = decodeBuild(hash.slice(HASH_PREFIX.length))
      if (p) return { archetype: p.a, budgetLevel: p.b, selection: p.s, hasChosen: true }
    }
  }
  // 2. previously-saved build
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const obj = JSON.parse(raw) as Record<string, unknown>
      if (isArchetype(obj.a) && isBudgetLevel(obj.b)) {
        return {
          archetype: obj.a,
          budgetLevel: obj.b,
          selection: validateSelection(obj.s),
          hasChosen: obj.chosen === true,
        }
      }
    }
  } catch {
    /* storage unavailable / corrupt — ignore */
  }
  return null
}

export function saveToStorage(build: PersistedBuild): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        a: build.archetype,
        b: build.budgetLevel,
        s: build.selection,
        chosen: build.hasChosen,
      }),
    )
  } catch {
    /* storage unavailable — non-fatal */
  }
}
