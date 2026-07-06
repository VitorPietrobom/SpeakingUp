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
- `src/data/` — scenario banks, team bios, and trilha (course) data
