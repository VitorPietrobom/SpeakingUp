// Uploads scripts/modules.js to the public `modules` Firestore collection
// that the Aulas page reads from. Run with: npm run seed:modules
//
// One-time setup:
//   1. Firebase console → Project settings → Service accounts →
//      "Generate new private key" — downloads a JSON file.
//   2. Save it as serviceAccountKey.json in the repo root (already
//      gitignored — never commit it).
//
// Safe to re-run: each módulo gets a stable id derived from its title, so
// running this again after editing modules.js updates existing cards
// instead of duplicating them.

import { existsSync, readFileSync } from 'node:fs'
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { modules } from './modules.js'

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json'

if (!existsSync(keyPath)) {
  console.error(
    `Missing service account key at "${keyPath}".\n\n` +
      'Firebase console → Project settings → Service accounts → "Generate new private key",\n' +
      'then save the downloaded file as serviceAccountKey.json in the repo root.',
  )
  process.exit(1)
}

if (modules.length === 0) {
  console.log('scripts/modules.js is empty — nothing to upload. Add módulos there first.')
  process.exit(0)
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// Unicode combining diacritical marks (U+0300-U+036F) — what NFD normalize
// splits accented letters into, so stripping this range de-accents them.
const COMBINING_MARKS = /[̀-ͯ]/g

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const batch = db.batch()
for (const m of modules) {
  if (!m.title) throw new Error(`Every módulo needs a "title" — found one without: ${JSON.stringify(m)}`)
  batch.set(db.collection('modules').doc(slugify(m.title)), m, { merge: true })
}
await batch.commit()

console.log(`Uploaded ${modules.length} módulo(s) to Firestore. Check https://your-site/aulas to see them live.`)
