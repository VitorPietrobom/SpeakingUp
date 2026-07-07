import { firebaseEnabled, getFirebase } from './firebase.js'

// Lifetime game progress, keyed by game ("home" / "treino"). localStorage is
// the source of truth so everything works offline and without Firebase; when
// Firebase is configured the same object is mirrored to progress/{uid} in
// Firestore, and totals are reconciled by taking the max of each counter
// (they only ever grow, so max is a safe merge).
const KEY = 'su-progress-v1'
const EMPTY = { score: 0, rounds: 0 }

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    // storage unavailable (e.g. blocked cookies) — progress lasts the session only
  }
}

export function loadProgress(gameKey) {
  const p = readAll()[gameKey]
  return p ? { score: p.score || 0, rounds: p.rounds || 0 } : { ...EMPTY }
}

export function addRound(gameKey, gain) {
  const all = readAll()
  const cur = all[gameKey] || EMPTY
  all[gameKey] = { score: (cur.score || 0) + gain, rounds: (cur.rounds || 0) + 1 }
  writeAll(all)
  pushToCloud(all)
  return all[gameKey]
}

/** Pull cloud totals, merge into local, push the merge back. */
export async function syncProgress(gameKey) {
  if (firebaseEnabled) {
    try {
      const fb = await getFirebase()
      if (fb) {
        const snap = await fb.getDoc(fb.progressRef)
        const cloud = snap.exists() ? snap.data() : {}
        const all = readAll()
        for (const [k, v] of Object.entries(cloud)) {
          if (!v || typeof v !== 'object') continue
          const local = all[k] || EMPTY
          all[k] = {
            score: Math.max(local.score || 0, v.score || 0),
            rounds: Math.max(local.rounds || 0, v.rounds || 0),
          }
        }
        writeAll(all)
        pushToCloud(all)
      }
    } catch {
      // offline or misconfigured — local progress still works
    }
  }
  return loadProgress(gameKey)
}

async function pushToCloud(all) {
  if (!firebaseEnabled) return
  try {
    const fb = await getFirebase()
    if (fb) await fb.setDoc(fb.progressRef, all, { merge: true })
  } catch {
    // fire-and-forget; next successful sync reconciles
  }
}
