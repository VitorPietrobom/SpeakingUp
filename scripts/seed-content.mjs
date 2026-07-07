// Seeds the editable-content collections (trilhas, formats) in Firestore
// from the bundled defaults in src/data/, so the team can start editing in
// the Firebase console instead of typing every document by hand.
//
// Usage:
//   node scripts/seed-content.mjs <caminho/para/service-account.json>
//
// Get the key at: Firebase console → Project settings → Service accounts →
// "Generate new private key". Keep the file out of git.
//
// Idempotent: docs are written to fixed IDs (trilha-1…, format-1…), so
// re-running overwrites the seeds and leaves other docs alone.
import { createSign } from 'node:crypto'
import { readFileSync } from 'node:fs'

const keyFile = process.argv[2]
if (!keyFile) {
  console.error('Uso: node scripts/seed-content.mjs <service-account.json>')
  process.exit(1)
}
const sa = JSON.parse(readFileSync(keyFile, 'utf8'))

// The data modules are plain ESM with no Vite-isms, so node can import them.
const { trilhas } = await import('../src/data/trilhas.js')
const { formats } = await import('../src/data/treinoScenarios.js')

// --- mint an OAuth token from the service account (no dependencies) ---
const now = Math.floor(Date.now() / 1000)
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
  iss: sa.client_email,
  scope: 'https://www.googleapis.com/auth/datastore',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600,
})}`
const jwt = `${unsigned}.${createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url')}`

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
})
const token = (await tokenRes.json()).access_token
if (!token) {
  console.error('Não consegui autenticar com essa chave:', await tokenRes.status)
  process.exit(1)
}

// --- write the docs via the Firestore REST API ---
const toValue = (v) =>
  Number.isInteger(v)
    ? { integerValue: String(v) }
    : typeof v === 'number'
      ? { doubleValue: v }
      : typeof v === 'boolean'
        ? { booleanValue: v }
        : { stringValue: String(v) }

async function writeDoc(coll, id, data) {
  const fields = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, toValue(v)]))
  const url = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents/${coll}/${id}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  })
  if (!res.ok) throw new Error(`${coll}/${id}: HTTP ${res.status} ${await res.text()}`)
  console.log(`✓ ${coll}/${id} — ${data.title}`)
}

for (const [i, t] of trilhas.entries()) {
  // levelColor/levelBg derive from `level` in the app; don't store them.
  const { levelColor: _c, levelBg: _b, ...doc } = t
  await writeDoc('trilhas', `trilha-${i + 1}`, { order: i + 1, ...doc })
}
for (const [i, f] of formats.entries()) {
  await writeDoc('formats', `format-${i + 1}`, { order: i + 1, ...f })
}
console.log('\nPronto! Edite os documentos em https://console.firebase.google.com → Firestore Database.')
