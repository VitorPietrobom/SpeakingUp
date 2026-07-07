import { useEffect, useState } from 'react'
import { firebaseEnabled, getFirebase } from './firebase.js'

// Editable site content. Each content type has a bundled default in
// src/data/ (instant render, works with no backend) and an optional
// Firestore collection of the same shape that overrides it when present —
// so the team can edit copy in the Firebase console without a deploy.
// Docs are sorted by their numeric `order` field.

const cache = new Map()

/** Fetch a content collection, or null when Firebase is off/empty/unreachable. */
export async function fetchContent(name) {
  if (!firebaseEnabled) return null
  if (cache.has(name)) return cache.get(name)
  let result = null
  try {
    const fb = await getFirebase()
    if (fb) {
      const snap = await fb.getDocs(fb.collection(fb.db, name))
      const items = snap.docs
        .map((d) => d.data())
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      if (items.length) result = items
    }
  } catch {
    // offline or collection missing — bundled content is used instead
  }
  cache.set(name, result)
  return result
}

/**
 * Render `fallback` immediately and swap in the Firestore collection once it
 * arrives. `mapItem` (optional, must be a stable module-level function)
 * normalizes each cloud doc, e.g. deriving level colors for trilhas.
 */
export function useContent(name, fallback, mapItem) {
  const [items, setItems] = useState(fallback)
  useEffect(() => {
    let alive = true
    fetchContent(name).then((cloud) => {
      if (alive && cloud) setItems(mapItem ? cloud.map(mapItem) : cloud)
    })
    return () => {
      alive = false
    }
  }, [name, mapItem])
  return items
}
