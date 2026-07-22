// Practice tab (1e): greeting + streak, stat cards, the session-set highway,
// fading-star reviews. Copy stays time-neutral ("session", never "tonight").
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import TabBar from '../components/TabBar.jsx'
import {
  pctIgnited, availableStars, buildQueue, fadingStars, songDistance,
  greeting, streakStatus, daysSinceIgnited, recOf,
} from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

const routeFor = (item) =>
  item.kind === 'review' ? `/star/${item.starId}/review`
  : item.kind === 'evaluate' ? `/star/${item.starId}/evaluate`
  : item.kind === 'drill' ? `/star/${item.starId}/drill`
  : `/star/${item.starId}`

export default function Practice() {
  const { state, dispatch, sky, prog } = useSky()
  const navigate = useNavigate()

  const queue = useMemo(() => buildQueue(sky, prog), [sky, prog])
  const fading = fadingStars(sky, prog)
  const inReach = availableStars(sky, prog).length
  const songsUnlockable = sky.songs.filter((s) => songDistance(sky, prog, s) === 1).length
  const sStatus = streakStatus(state.streak)
  const now = queue[0]
  const later = queue.slice(1).reverse() // furthest first, stacked down the highway
  const sessionOpen = state.session && state.session.items.length > 0

  const endSession = () => {
    dispatch({ type: 'endSession' })
    navigate('/summary')
  }

  return (
    <div className="screen screen--tabs starfield">
      <header className="prac-head pad">
        <div>
          <div className="prac-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })} · clear skies
          </div>
          <div className="display" style={{ fontSize: 25 }}>{greeting()}</div>
        </div>
        <div className={`prac-streak${sStatus === 'paused' ? ' prac-streak--paused' : ''}`}>
          <span style={{ fontSize: 18 }}>✦</span>
          <span className="prac-streak-count">
            {state.streak.count} session{state.streak.count === 1 ? '' : 's'}
          </span>
          {sStatus === 'paused' && <span className="prac-streak-note">paused — practice to keep it</span>}
        </div>
      </header>

      <div className="statcards pad" style={{ marginTop: 16 }}>
        <div className="statcard">
          <div className="statcard-label">Sky ignited</div>
          <div className="statcard-num">{pctIgnited(sky, prog)}%</div>
          <div className="meter" style={{ height: 3, marginTop: 8 }}>
            <div className="meter-fill" style={{ width: `${pctIgnited(sky, prog)}%`, boxShadow: 'none' }} />
          </div>
        </div>
        <div className="statcard">
          <div className="statcard-label">In reach</div>
          <div className="statcard-num" style={{ color: 'var(--cyan)' }}>{inReach} ✦</div>
          <div style={{ fontSize: 10.5, color: 'var(--sub)', marginTop: 6 }}>
            {songsUnlockable} {sky.songNoun} unlockable
          </div>
        </div>
      </div>

      <div className="pad" style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="overline">SESSION SET</div>
        {sessionOpen && (
          <button style={{ fontSize: 11, color: 'var(--muted)' }} onClick={endSession}>
            end session · summary ›
          </button>
        )}
      </div>

      {/* the highway */}
      <div className="highway">
        <div className="highway-road" />
        <div className="highway-rail highway-rail--left" />
        <div className="highway-rail highway-rail--right" />
        {later.map((item, i) => {
          const depth = later.length - i // 1 = nearest of the far cards
          return (
            <button
              key={`${item.kind}-${item.starId}`}
              className="highway-card"
              style={{
                top: 16 + i * 74,
                transform: `translateX(-50%) scale(${0.82 - (depth - 1) * 0.14})`,
                opacity: 0.75 - (depth - 1) * 0.25,
              }}
              onClick={() => navigate(routeFor(item))}
            >
              <span className="row-body">
                <span className="highway-card-tag" style={item.kind === 'review' ? { color: 'var(--gold)' } : undefined}>
                  {item.kind.toUpperCase()} · {sky.name.split(' ')[0].toUpperCase()}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</span>
              </span>
              <span style={{ fontSize: 12, color: 'var(--sub)' }}>{item.min} min</span>
            </button>
          )
        })}
        {now ? (
          <div className="highway-now">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="highway-card-tag" style={{ color: 'var(--cyan)' }}>
                NOW · {sky.name.split(' ')[0].toUpperCase()}
              </span>
              <span style={{ fontSize: 11, color: 'var(--sub)' }}>{now.min} min</span>
            </div>
            <div className="display" style={{ fontSize: 20, marginTop: 4 }}>{now.label}</div>
            <div style={{ fontSize: 11.5, color: 'var(--sub)', marginTop: 2 }}>{now.sub}</div>
            <button
              className="cta cta--gold"
              style={{ marginTop: 12, fontSize: 13, padding: 11, borderRadius: 12 }}
              onClick={() => navigate(routeFor(now))}
            >
              Start practice
            </button>
          </div>
        ) : (
          <div className="highway-now" style={{ textAlign: 'center' }}>
            <div className="display" style={{ fontSize: 18 }}>Sky’s clear ✦</div>
            <div style={{ fontSize: 11.5, color: 'var(--sub)', marginTop: 4 }}>
              Nothing queued — wander the sky and pick any star.
            </div>
          </div>
        )}
      </div>

      <div className="pad" style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="overline">FADING STARS</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>reviews keep them lit</div>
        </div>
        {fading.length === 0 ? (
          <div className="row row--r14" style={{ color: 'var(--muted)', fontSize: 12 }}>
            Nothing is fading — your sky is holding its light.
          </div>
        ) : (
          fading.slice(0, 3).map((s) => (
            <div key={s.id} className="row row--r14" style={{ borderColor: 'rgba(255,217,142,.15)' }}>
              <span style={{ fontSize: 16, color: 'var(--gold)', opacity: 0.55 }}>✦</span>
              <span className="row-body">
                <span className="row-title">{s.name} dimming</span>
                <span className="row-sub">
                  Ignited {daysSinceIgnited(recOf(prog, s.id))} days ago — a short review keeps it bright.
                </span>
              </span>
              <button
                style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 600 }}
                onClick={() => navigate(`/star/${s.id}/review`)}
              >
                Review
              </button>
            </div>
          ))
        )}
      </div>

      <TabBar />
    </div>
  )
}
