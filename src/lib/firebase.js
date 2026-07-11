// Optional Firebase backend. Configuration comes from VITE_FIREBASE_* env
// vars (see .env.example); when they are absent the SDK is never loaded and
// the site runs on localStorage alone (see progress.js).
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const firebaseEnabled = Boolean(config.apiKey && config.projectId && config.appId)

let appInstance = null

/**
 * Resolves to the initialized Firebase App (shared by every feature that
 * needs one — progress sync, modulos content — so we never call
 * `initializeApp` more than once), or `null` when not configured /
 * unreachable. Never throws — callers treat null as "offline".
 */
export function getApp() {
  if (!firebaseEnabled) return Promise.resolve(null)
  if (!appInstance) appInstance = initApp().catch(() => null)
  return appInstance
}

async function initApp() {
  const { initializeApp } = await import('firebase/app')
  const app = initializeApp(config)
  if (config.measurementId) startAnalytics(app)
  return app
}

let authInstance = null

/**
 * Resolves to `{ uid, progressRef, getDoc, setDoc }` once the SDK is loaded
 * and the visitor is signed in anonymously, or `null` when Firebase is not
 * configured / unreachable. Never throws — callers treat null as "offline".
 */
export function getFirebase() {
  if (!firebaseEnabled) return Promise.resolve(null)
  if (!authInstance) authInstance = initAuth().catch(() => null)
  return authInstance
}

async function initAuth() {
  const app = await getApp()
  if (!app) return null
  const [{ getAuth, signInAnonymously }, { getFirestore, doc, getDoc, setDoc }] = await Promise.all([
    import('firebase/auth'),
    import('firebase/firestore'),
  ])
  const { user } = await signInAnonymously(getAuth(app))
  const db = getFirestore(app)
  return { uid: user.uid, progressRef: doc(db, 'progress', user.uid), getDoc, setDoc }
}

async function startAnalytics(app) {
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics')
    if (await isSupported()) getAnalytics(app)
  } catch {
    // analytics blocked (ad blocker / unsupported env) — never break the app for it
  }
}
