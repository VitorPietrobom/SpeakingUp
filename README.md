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
- `src/lib/` — game-progress persistence (`progress.js`), Aulas content (`modulos.js`), and the optional
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
   - `modulos/{id}` documents are publicly readable, writable only from the
     console / Admin SDK (never from the client)
4. Copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values from
   *Project settings → SDK setup and configuration*

When the env vars are present, visitors are signed in anonymously and their
progress mirrors to Firestore (local and cloud totals are merged by taking the
max of each counter). When they're absent the Firebase SDK is never even
loaded by the browser.

### Publishing Aulas content

Add documents to a `modulos` collection in Firestore (via the console, or the
Admin SDK) — each document is one card on the Aulas page:

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

The Aulas page listens live (`onSnapshot`), so published changes show up
without a redeploy.
