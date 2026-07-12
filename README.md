# Speaking UP

Comunicação que move — plataforma educativa que ajuda jovens a desenvolver a comunicação e a fala em público, na prática.

Built with React + Vite. Implements the final design handed off from Claude Design (hero, the "Jogo Rápido de Fala" speaking-practice game, Aulas, Treinamento, and Organização pages).

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

## Structure

- `src/pages/` — the four routed pages (Home, Aulas, Treinamento, Organização)
- `src/components/` — shared UI: `TopNav`, `Footer`, `Avatar`, and the reusable `SpeakingGame` engine that powers the practice game on both the Home and Treinamento pages
- `src/data/` — scenario banks and team bios
- `src/lib/` — game-progress persistence (`progress.js`), Aulas content (`modules.js`), and the optional
  Firebase backend (`firebase.js`)

## Backend (optional Firebase)

Game progress (lifetime "pontos de voz" and rounds per game) is always saved
in the browser via `localStorage`, so the site works with no backend at all.
The Aulas page's módulo list, on the other hand, has no local fallback data —
it *only* comes from Firestore, and shows a "módulos em breve" empty state
until Firebase is configured and módulos are published.

To turn on Firebase:

1. Create a project at <https://console.firebase.google.com>
2. **Authentication → Sign-in method** — enable *Anonymous* (needed for
   game-progress sync; not needed for the public módulo list)
3. Create a **Cloud Firestore** database and publish the rules in
   [`firestore.rules`](firestore.rules):
   - each anonymous user can only read/write their own `progress/{uid}` document
   - `modules/{id}` documents are publicly readable, writable only from the
     console / Admin SDK (never from the client)
4. Copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values from
   *Project settings → SDK setup and configuration*

When the env vars are present, visitors are signed in anonymously and their
progress mirrors to Firestore (local and cloud totals are merged by taking the
max of each counter). When they're absent the Firebase SDK is never even
loaded by the browser.

### Publishing Aulas content

Each módulo shown on the Aulas page is one document in a `modules` Firestore
collection. The easiest way to add or update them is the seed script — no
console clicking, no typos in field names:

1. Firebase console → **Project settings → Service accounts → "Generate new
   private key"** — downloads a JSON key file. Save it as
   `serviceAccountKey.json` in the repo root (already gitignored — this is a
   secret, never commit it).
2. Edit [`scripts/modules.js`](scripts/modules.js) — a plain array of módulo
   objects, with the field shape documented at the top of the file.
3. Run `npm run seed:modules`.

It's safe to run repeatedly: each módulo gets a stable id derived from its
`title`, so re-running after edits updates the existing card instead of
creating a duplicate. The Aulas page listens live (`onSnapshot`), so
published changes show up without a redeploy.

Field shape (also documented in `scripts/modules.js`):

| field    | type   | notes                                      |
| -------- | ------ | ------------------------------------------- |
| `theme`  | string | small eyebrow label, e.g. `"Presença & voz"` |
| `icon`   | string | one emoji                                    |
| `color`  | string | hex, used for the eyebrow + top accent bar   |
| `level`  | string | `"Iniciante"` \| `"Intermediário"` \| `"Avançado"` |
| `title`  | string | card headline                                |
| `desc`   | string | card body copy                               |
| `aulas`  | number | lesson count                                 |
| `horas`  | string | e.g. `"~2h00"`                               |
| `order`  | number | optional; sort position (ties broken by `title`) |

(You can still add/edit documents by hand in the Firestore console if you
prefer — the script is just a shortcut for bulk or repeated edits.)
