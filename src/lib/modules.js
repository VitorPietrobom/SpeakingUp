import { firebaseEnabled, getApp } from './firebase.js'

export const LEVEL_STYLE = {
  Iniciante: { levelColor: '#1F8A5B', levelBg: '#EAF7F0' },
  Intermediário: { levelColor: '#8A6A00', levelBg: '#FFF3CF' },
  Avançado: { levelColor: '#C2410C', levelBg: '#FCE8DF' },
}

function decorate(doc) {
  return { ...doc, ...(LEVEL_STYLE[doc.level] || {}) }
}

// Firestore's orderBy() silently drops documents missing the sorted field,
// which is an easy footgun for content edited by hand in the console — so we
// fetch unordered and sort client-side, falling back to title when a module
// has no explicit `order`.
function sortModules(list) {
  return [...list].sort((a, b) => {
    const oa = typeof a.order === 'number' ? a.order : Infinity
    const ob = typeof b.order === 'number' ? b.order : Infinity
    if (oa !== ob) return oa - ob
    return (a.title || '').localeCompare(b.title || '')
  })
}

/**
 * Live-subscribes to the public `modules` Firestore collection (the "módulo"
 * course content shown on the Aulas page). Calls `onChange` with:
 *   - null  — Firebase isn't configured, or the read failed; render an
 *             "em breve" empty state, never an error.
 *   - []    — configured and reachable, but no modules published yet.
 *   - [...] — modules, sorted by optional `order` then `title`.
 * Returns an unsubscribe function that is always safe to call.
 */
export function subscribeModules(onChange) {
  if (!firebaseEnabled) {
    onChange(null)
    return () => {}
  }

  let alive = true
  let unsubscribeSnapshot = () => {}

  ;(async () => {
    try {
      const app = await getApp()
      if (!app) throw new Error('firebase unavailable')
      const { getFirestore, collection, onSnapshot } = await import('firebase/firestore')
      if (!alive) return
      const db = getFirestore(app)
      unsubscribeSnapshot = onSnapshot(
        collection(db, 'modules'),
        (snap) => {
          if (!alive) return
          onChange(sortModules(snap.docs.map((d) => decorate({ id: d.id, ...d.data() }))))
        },
        () => {
          if (alive) onChange(null)
        },
      )
    } catch {
      if (alive) onChange(null)
    }
  })()

  return () => {
    alive = false
    unsubscribeSnapshot()
  }
}
