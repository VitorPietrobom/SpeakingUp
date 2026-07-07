# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint (react + oxc plugins; see .oxlintrc.json)
```

There is no test suite / test command configured in this project yet.

## Architecture

React + Vite SPA (plain JS, no TypeScript). Routing is `react-router-dom`'s
`BrowserRouter` with four routes wired in `src/App.jsx`, one per page in
`src/pages/`: `Home` (`/`), `Aulas` (`/aulas`), `Treinamento` (`/treinamento`),
`Organizacao` (`/organizacao`).

Content is Brazilian Portuguese (pt-BR) throughout — keep new copy consistent
with that.

### Origin

This app is a from-scratch reimplementation of a prototype produced by Claude
Design (a separate design tool that exports `.dc.html` mockups). The visual
design — colors, spacing, copy, layout — was matched pixel-for-pixel from that
handoff rather than designed fresh here, which explains some of the very
literal per-element CSS values (e.g. button padding/border-radius that differ
by a pixel or two between similar-looking buttons).

### The SpeakingGame engine

`src/components/SpeakingGame.jsx` is the architectural centerpiece: a single
reusable component implementing the "Jogo Rápido de Fala" speaking-practice
game, mounted with different configs on both `Home` and `Treinamento` (shorter
warm-up scenarios vs. longer practice-session scenarios). It is driven by
props rather than being hardcoded per page:

- `scenarios` — array of `{ tag, icon, text, hint, tech: [name, title, text] }`
- `prepTime` / `speakTime` — seconds for each timed phase
- `checkLabels` — the 4 self-assessment checkboxes shown at reflect time
- `computeGain(checksCount)` — scoring formula
- `feedbackFor(checksCount)` — feedback copy tiers
- `intro` — `{ title, description, steps, buttonLabel, footnote }` for the
  intro card (`steps`/`footnote` are optional and simply omitted if empty)

Internally it's a phase state machine: `intro → prep → speak → reflect →
reveal → (prep again, next scenario)`. `prep`/`speak` count down via
`runTimer`, which uses a `timerRef` (`setInterval`) and always
`clearInterval`s before starting a new one. Scenario order is shuffled with a
Fisher–Yates `shuffle()` at `start()` and re-shuffled once the shuffled order
is exhausted in `next()`.

**Known pitfall**: don't call `setScore`/`setRounds`/etc. from inside another
state setter's functional updater (e.g. from inside `setChecks(cur => ...)`).
React StrictMode double-invokes functional updaters to catch exactly this kind
of impurity, which previously caused `reveal()` to award points twice in dev.
`reveal()` now reads `checks` directly from closure instead — keep that
pattern when touching this file.

Per-page scenario/format data lives in `src/data/` (`homeScenarios.js`,
`treinoScenarios.js` — which also exports the `formats` list for
Treinamento's exercise cards) and is imported into the page, not into
`SpeakingGame` itself.

### Persistence & optional Firebase backend

`SpeakingGame` takes an optional `persistKey` prop ("home" / "treino"); when
set, each revealed round adds to a lifetime score/rounds counter shown on the
intro card. Persistence lives in `src/lib/progress.js`: localStorage is the
source of truth (key `su-progress-v1`), and when Firebase is configured the
same object mirrors to Firestore at `progress/{uid}` (anonymous auth), with
local/cloud counters reconciled by taking the max of each — they only ever
grow, so max is a safe merge. `src/lib/firebase.js` reads `VITE_FIREBASE_*`
env vars (see `.env.example`; security rules in `firestore.rules`) and
dynamically imports the SDK only when configured — every cloud call is
wrapped so failures degrade silently to local-only. Keep that contract: the
site must fully work with no `.env` and no network.

### Editable content collections

`src/lib/content.js` exposes `useContent(collection, fallback, mapItem?)`:
pages render the bundled `src/data/` array immediately and swap in the
same-shaped Firestore collection once fetched (docs sorted by numeric
`order`; empty/missing collection or any error keeps the fallback). Wired
for `trilhas` (Aulas; `mapItem` = `applyLevelStyle` so editors only set
`level`) and `formats` (Treinamento). To make another data bank editable,
follow that pattern and add a world-readable match block for the collection
in `firestore.rules`. `npm run seed -- <service-account.json>` copies the
bundled defaults into Firestore (`scripts/seed-content.mjs`, idempotent,
dependency-free).

### Shared components vs. per-page styling

- `TopNav` — sticky header + mobile hamburger/panel; nav item active-state
  comes from `react-router-dom`'s `NavLink`, not manual path comparisons.
- `Footer` — identical on every page.
- `Avatar` — takes `{ photo, name, size }`; renders the photo if present,
  otherwise a circular initials fallback (this is how team members without a
  photo asset are handled — see `Yasmin` in `src/data/team.js`, which has
  `photo: null`).
- `src/data/team.js` is shared between the Home page's team grid and the
  Organizacao page's team bios — it holds both the short home-page `quote`
  and the longer Organizacao `bio` per person.

Styling is plain CSS files (one per component/page, imported directly into
the matching `.jsx`), not CSS modules or a utility framework. Shared design
tokens (`--su-cobalt`, `--su-yellow`, `--su-bg`, `--su-ink`, `--su-body`,
`--su-muted`, `--su-border*`, `--font-display` = Space Grotesk, `--font-body`
= Archivo) and a handful of cross-page utility classes (`.su-wrap`,
`.su-page`, `.su-eyebrow`, `.su-strong-ink`, `.su-check-mark`) live in
`src/index.css`; page/component CSS files only hold layout and classes
specific to that page. Fonts are loaded via a Google Fonts `<link>` in
`index.html`, not self-hosted.
