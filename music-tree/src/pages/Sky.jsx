// Sky Atlas (1a + 4b): home tab. Pan/zoom constellation graph, instrument
// switcher sheet, ◎ recenter, next-star card, dark-star bottom sheet (3d).
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TabBar from '../components/TabBar.jsx'
import Sheet from '../components/Sheet.jsx'
import SkyGraph from '../components/SkyGraph.jsx'
import { skiesById } from '../data/skies.js'
import {
  countCompleted, pctIgnited, suggestedNext, stateOf, recOf, reviewDue, isFading,
  starsUnlockedBy, songsUnlockedBy, pathTo, availableStars,
} from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

function DarkStarSheet({ sky, prog, star, dispatch, onClose }) {
  const navigate = useNavigate()
  const path = pathTo(sky, prog, star.id)
  const ignitedPrereqs = star.prereqIds.filter((id) => stateOf(sky, prog, id) === 'completed')
  const songs = songsUnlockedBy(sky, star.id)
  const watched = prog.watched.includes(star.id)
  const constellation = sky.constellations.find((c) => c.id === star.constellation)
  const firstReachable = path.find((s) => stateOf(sky, prog, s.id) === 'available')

  return (
    <Sheet onClose={onClose}>
      <div className="dark-hero">
        <svg viewBox="0 0 200 110" style={{ width: 170, height: 94 }}>
          <circle cx="100" cy="55" r="38" fill="#8A94B8" opacity=".1" />
          <circle cx="100" cy="55" r="23" fill="none" stroke="rgba(138,148,184,.5)" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="100" cy="55" r="6" fill="#3E466B" stroke="rgba(138,148,184,.6)" strokeWidth="1" />
        </svg>
        <div className="overline" style={{ letterSpacing: 3 }}>STILL DARK · {constellation?.name}</div>
        <div className="display" style={{ fontSize: 26 }}>{star.name}</div>
        <p className="dark-blurb">
          {star.blurb} {path.length ? `${path.length} star${path.length === 1 ? ' stands' : 's stand'} between you and it.` : ''}
        </p>
      </div>
      <div className="rows">
        <div className="overline">THE PATH TO THIS STAR</div>
        {ignitedPrereqs.slice(0, 2).map((id) => (
          <div key={id} className="row row--gold">
            <span className="row-icon" style={{ color: 'var(--gold)' }}>✦</span>
            <span className="row-body"><span style={{ fontSize: 13, color: '#D9CBA6' }}>{sky.stars.find((s) => s.id === id)?.name}</span></span>
            <span className="row-end" style={{ color: 'var(--gold-dim)' }}>ignited</span>
          </div>
        ))}
        {path.slice(0, 3).map((p) => {
          const st = stateOf(sky, prog, p.id)
          const reachable = st === 'available' || st === 'in_progress' || st === 'ready_for_eval'
          const prev = sky.stars.find((s) => s.id === p.prereqIds[0])
          return reachable ? (
            <button key={p.id} className="row row--cyan" onClick={() => navigate(`/star/${p.id}`)}>
              <span className="row-icon" style={{ color: 'var(--cyan)' }}>✧</span>
              <span className="row-body">
                <span style={{ fontSize: 13 }}>{p.name}</span>
                <span className="row-sub" style={{ fontSize: 10.5 }}>in reach now · {p.est}</span>
              </span>
              <span style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 600 }}>Begin</span>
            </button>
          ) : (
            <div key={p.id} className="row row--dim">
              <span className="row-icon" style={{ color: 'var(--muted)' }}>✧</span>
              <span className="row-body">
                <span style={{ fontSize: 13, color: 'var(--sub)' }}>{p.name}</span>
                <span className="row-sub" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                  follows {prev ? prev.name : 'the path'} · {p.est}
                </span>
              </span>
            </div>
          )
        })}
      </div>
      {songs.length > 0 && (
        <div className="banner banner--pink" style={{ fontSize: 12 }}>
          <span>
            When it ignites:{' '}
            <span style={{ color: 'var(--pink-text)' }}>
              {songs.slice(0, 2).map((s) => s.title).join(', ')}
              {songs.length > 2 ? ` +${songs.length - 2} songs` : ''}
            </span>{' '}
            {songs.length > 1 ? 'come' : 'comes'} into reach.
          </span>
        </div>
      )}
      <div className="sheet-actions">
        <button
          className="cta cta--ghost"
          style={watched ? { color: 'var(--cyan)', borderColor: 'rgba(125,227,255,.4)' } : undefined}
          onClick={() => dispatch({ type: 'toggleWatch', starId: star.id })}
        >
          {watched ? 'Watching ✓' : 'Watch this star'}
        </button>
        <button
          className="cta cta--cyan"
          style={{ fontSize: 13, padding: 13 }}
          onClick={() => (firstReachable ? navigate(`/star/${firstReachable.id}`) : onClose())}
        >
          Chart the path
        </button>
      </div>
    </Sheet>
  )
}

export default function Sky() {
  const { state, dispatch, sky, prog } = useSky()
  const navigate = useNavigate()
  const [switcher, setSwitcher] = useState(false)
  const [darkStar, setDarkStar] = useState(null)
  const [focus, setFocus] = useState(null)

  const suggested = useMemo(() => suggestedNext(sky, prog), [sky, prog])
  const done = countCompleted(sky, prog)
  const emptySky = done === 0

  const nextState = suggested ? stateOf(sky, prog, suggested.id) : null
  const unlockStars = suggested ? starsUnlockedBy(sky, suggested.id).length : 0
  const unlockSongs = suggested ? songsUnlockedBy(sky, suggested.id).length : 0

  const onTapStar = (star, st) => {
    if (st === 'locked') setDarkStar(star)
    else navigate(`/star/${star.id}`)
  }

  return (
    <div className="screen screen--tabs starfield">
      <header className="sky-head pad">
        <div className="sky-head-row">
          <button className="sky-title-btn" onClick={() => setSwitcher((v) => !v)}>
            <span className="display sky-title">{sky.name}</span>
            <span className="sky-caret">⌄</span>
          </button>
          <button
            className="sky-recenter"
            title="recenter on your next star"
            onClick={() => suggested && setFocus({ starId: suggested.id, t: Date.now() })}
          >
            ◎
          </button>
        </div>
        <div className="sky-progress">
          <div className="meter" style={{ flex: 1, height: 3 }}>
            <div className="meter-fill" style={{ width: `${pctIgnited(sky, prog)}%`, boxShadow: '0 0 8px rgba(255,217,142,.7)' }} />
          </div>
          <span className="sky-progress-label">{done} / {sky.stars.length} stars ignited</span>
        </div>
        {switcher && (
          <div className="switcher">
            {Object.keys(state.skies).map((id) => {
              const s = skiesById[id]
              const p = state.skies[id]
              const current = id === sky.id
              const due = s.stars.some((st) => reviewDue(recOf(p, st.id)) || isFading(recOf(p, st.id)))
              return (
                <button
                  key={id}
                  className={`switcher-row${current ? ' switcher-row--current' : ''}`}
                  onClick={() => {
                    dispatch({ type: 'switchSky', skyId: id })
                    setSwitcher(false)
                  }}
                >
                  <span style={{ color: current ? 'var(--gold)' : 'var(--sub)', fontSize: 14 }}>{current ? '✦' : '✧'}</span>
                  <span className="row-body">
                    <span className="row-title" style={current ? { color: 'var(--gold-hi)' } : undefined}>{s.name}</span>
                    <span className="row-sub" style={{ fontSize: 10.5, color: current ? 'var(--gold-dim)' : 'var(--muted)' }}>
                      {pctIgnited(s, p)}% ignited · {due ? 'review due' : `${availableStars(s, p).length} in reach`}
                    </span>
                  </span>
                  {current
                    ? <span style={{ fontSize: 11, color: 'var(--gold-dim)' }}>current</span>
                    : due && <span className="switcher-dot" />}
                </button>
              )
            })}
            <button
              className="switcher-row"
              style={{ color: 'var(--muted)' }}
              onClick={() => navigate('/onboarding?add=1')}
            >
              <span style={{ fontSize: 14 }}>+</span>
              <span style={{ fontSize: 12.5 }}>Chart a new sky</span>
            </button>
          </div>
        )}
      </header>

      <SkyGraph
        sky={sky}
        prog={prog}
        suggestedId={suggested?.id}
        focus={focus}
        onTapStar={onTapStar}
        onTapSong={(song) => navigate(`/song/${song.id}`)}
      />

      {suggested && (
        <div className="nextcard">
          <div className="nextcard-orb">✦</div>
          <div className="row-body">
            <div className="nextcard-overline">{emptySky ? 'YOUR FIRST STAR' : 'NEXT STAR'}</div>
            <div className="display" style={{ fontSize: 18 }}>{suggested.name}</div>
            <div className="nextcard-sub">
              {emptySky
                ? 'It’s already glowing — begin whenever you like.'
                : `Unlocks ${unlockStars} star${unlockStars === 1 ? '' : 's'} · ${unlockSongs} ${sky.songNoun}`}
            </div>
          </div>
          <button className="pill" onClick={() => navigate(`/star/${suggested.id}`)}>
            {nextState === 'ready_for_eval' ? 'Ignite' : nextState === 'in_progress' ? 'Continue' : 'Begin'}
          </button>
        </div>
      )}

      {switcher && <button className="sky-clickaway" aria-label="Close" onClick={() => setSwitcher(false)} />}
      {darkStar && (
        <DarkStarSheet sky={sky} prog={prog} star={darkStar} dispatch={dispatch} onClose={() => setDarkStar(null)} />
      )}
      <TabBar />
    </div>
  )
}
