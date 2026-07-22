# Music Tree

A mobile-first PWA for learning instruments through a "night sky" skill graph:
skills are stars, categories are constellations, completed skills are gold
ignited stars, reachable skills glow cyan, and songs are pink stars whose
prerequisites are visible paths.

Initial implementation of the Claude Design handoff (`Music Tree.dc.html` +
`SPEC.md`). Self-contained app — it shares no code with the SpeakingUp site
that lives in the rest of this repository, and can be extracted to its own
repo as-is.

## Commands

```bash
npm install       # install dependencies
npm run dev       # Vite dev server
npm run build     # production build to dist/
npm run preview   # serve the production build
```

## Stack

React + Vite (plain JS), `react-router-dom`, plain CSS files with design
tokens in `src/index.css`. No backend: all progress persists to
`localStorage` (`mt-state-v1`), and a service worker (`public/sw.js`)
caches the shell for offline use. Fonts (Marcellus + Space Grotesk) load
from Google Fonts.

## Layout

- `src/data/skies.js` — seed content: acoustic guitar (23 stars, 10 songs)
  and drums (10 stars, 4 grooves), with constellations, prerequisites,
  ignition criteria, resources, and graph positions. Electric/banjo appear
  in onboarding as "charting soon" (the schema supports them).
- `src/lib/engine.js` — pure logic: the star state machine
  (`locked → available → in_progress → ready_for_eval → completed → fading`),
  brightness decay (100→60% over 45 days, review at <80% or past the
  12→24→48d interval), session queue building, streak rules (one missed day
  pauses, two resets), and song proximity.
- `src/lib/store.jsx` — React context + reducer, persisted to localStorage.
- `src/components/SkyGraph.jsx` — the pan/zoom SVG sky (pinch 0.5–2.5×,
  wheel zoom, ◎ recenter animates to the single pulsing suggested star).
- `src/pages/` — one file per screen of the handoff:

| Screen | Mockup id |
| --- | --- |
| Onboarding (welcome → instrument grid → pre-ignite checklist) | 1f → 3c |
| Sky Atlas + instrument switcher + dark-star sheet | 1a + 4b + 3d |
| Practice tab (session-set highway, fading stars) | 1e |
| Songbook (grouped by star-distance, add-a-song) | 4a |
| Node detail (video-first, criteria checklist) | 2a |
| Reading view | 2b |
| Practice room (dial, combo meter, metronome, recorder) | 2c |
| Evaluation (self-honesty gate) | 3e |
| Ignition (full-screen payoff) | 3a |
| Session summary | 3b |
| Review (keep a fading star lit) | 3f |
| Song view | 1g |

## Behavior notes

- Pre-ignited stars (onboarding) are `completed` with `verified: false`;
  their node page shows a verify-honestly banner until the criteria are
  self-checked. Pre-lighting a star also lights its prerequisites.
- The practice-room metronome is a real WebAudio click; the recorder uses
  `MediaRecorder` and degrades silently when the mic is unavailable.
  Hitting the criterion target — or 10 clean passes in a row — seals it.
- Copy is time-neutral per the spec ("session", never "tonight").
- YouTube resources render as placeholder players until a `url` is added to
  the resource in `src/data/skies.js`; offline they show "offline — open
  later".
