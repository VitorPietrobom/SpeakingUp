// Song view (1g): why a song is still out of reach — prerequisite mini-
// constellation, what it asks of you, and the path narrative.
import { useNavigate, useParams } from 'react-router-dom'
import { starPath } from '../components/SkyGraph.jsx'
import { songMissing, stateOf } from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

export default function SongView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, sky, prog } = useSky()

  const custom = state.skies[sky.id]?.customSongs || []
  const song = [...sky.songs, ...custom].find((s) => s.id === id)
  if (!song) return null

  const missing = songMissing(sky, prog, song)
  const dist = missing.length
  const playable = dist === 0
  const reqStars = song.requiredStarIds.map((sid) => sky.stars.find((s) => s.id === sid)).filter(Boolean)
  const firstBeginnable = missing
    .map((sid) => sky.stars.find((s) => s.id === sid))
    .find((s) => s && ['available', 'in_progress', 'ready_for_eval'].includes(stateOf(sky, prog, s.id)))

  // mini-constellation layout: song star top-center, prereqs fanned below
  const spread = reqStars.map((s, i) => {
    const n = reqStars.length
    const t = n === 1 ? 0.5 : i / (n - 1)
    return { star: s, x: 70 + t * 250, y: 150 + Math.sin(t * Math.PI) * 22 }
  })

  return (
    <div className="screen screen--songs starfield">
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate(-1)}>‹</button>
        <span className={`badge ${playable ? 'badge--gold' : 'badge--pink'}`}>
          {playable ? 'PLAYABLE NOW ✦' : `${dist} STAR${dist === 1 ? '' : 'S'} AWAY`}
        </span>
        <span className="topbar-menu" />
      </div>

      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 20 }} className="pad">
        <div style={{ fontSize: 20, color: 'var(--pink)' }}>✦</div>
        <div className="display" style={{ fontSize: 30 }}>{song.title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--sub)' }}>
          {song.artist} · {song.meta}{song.estNote && !playable ? ` · ${song.estNote}` : ''}
        </div>
      </div>

      <svg viewBox="0 0 390 200" style={{ width: '100%', display: 'block', marginTop: 8 }}>
        {spread.map(({ star, x, y }) => {
          const done = stateOf(sky, prog, star.id) === 'completed'
          return (
            <g key={star.id}>
              <line
                x1={x} y1={y} x2="195" y2="60"
                stroke={done ? 'rgba(255,217,142,.5)' : 'rgba(84,94,130,.55)'}
                strokeWidth="1"
                strokeDasharray={done ? undefined : '3 4'}
              />
              {done ? (
                <>
                  <circle cx={x} cy={y} r="7" fill="#FFD98E" opacity=".2" />
                  <circle cx={x} cy={y} r="2.6" fill="#FFD98E" />
                </>
              ) : (
                <circle cx={x} cy={y} r="2.6" fill="#3E466B" />
              )}
              <text
                x={x} y={y + 22} textAnchor="middle"
                fill={done ? '#B9A26B' : '#8A94B8'} fontSize="9.5"
              >
                {star.name}{done ? ' ✓' : ''}
              </text>
            </g>
          )
        })}
        <path d={starPath(195, 60, 16)} fill="#FF5CA8" opacity=".35" />
        <path d={starPath(195, 60, 10)} fill="#FF5CA8" />
      </svg>

      <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        <div className="overline">WHAT THIS SONG ASKS OF YOU</div>
        {reqStars.map((s) => {
          const st = stateOf(sky, prog, s.id)
          if (st === 'completed') {
            return (
              <div key={s.id} className="row row--gold" style={{ background: 'rgba(255,217,142,.05)', borderColor: 'rgba(255,217,142,.2)' }}>
                <span style={{ color: 'var(--gold)', fontSize: 13 }}>✦</span>
                <span className="row-body"><span style={{ fontSize: 13, color: '#D9CBA6' }}>{s.name}</span></span>
                <span style={{ fontSize: 11, color: 'var(--gold-dim)' }}>ignited</span>
              </div>
            )
          }
          const reachable = ['available', 'in_progress', 'ready_for_eval'].includes(st)
          return reachable ? (
            <button key={s.id} className="row row--cyan" onClick={() => navigate(`/star/${s.id}`)}>
              <span style={{ color: 'var(--cyan)', fontSize: 13 }}>✧</span>
              <span className="row-body">
                <span style={{ fontSize: 13 }}>{s.name}</span>
                <span className="row-sub" style={{ fontSize: 10.5 }}>in reach · {s.est}</span>
              </span>
              <span style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 600 }}>Begin</span>
            </button>
          ) : (
            <div key={s.id} className="row row--dim">
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>✧</span>
              <span className="row-body">
                <span style={{ fontSize: 13, color: 'var(--sub)' }}>{s.name}</span>
                <span className="row-sub" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                  needs {sky.stars.find((x) => x.id === s.prereqIds[0])?.name || 'earlier stars'} first
                </span>
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>locked</span>
            </div>
          )
        })}
      </div>

      <div className="pad" style={{ marginTop: 20 }}>
        <div className="songview-path">
          <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--sub)' }}>THE PATH TO THIS SONG</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.6, color: '#C6CEE8' }}>
            {playable ? (
              <>Every star it asks for is lit. Play it tonight or any night — it’s yours now. ✦</>
            ) : (
              <>
                Ignite{' '}
                {missing.map((sid, i) => {
                  const s = sky.stars.find((x) => x.id === sid)
                  return (
                    <span key={sid}>
                      <span style={{ color: 'var(--cyan)' }}>{s?.name}</span>
                      {s?.est ? ` (${s.est})` : ''}
                      {i < missing.length - 2 ? ', ' : i === missing.length - 2 ? ', then ' : ''}
                    </span>
                  )
                })}{' '}
                — and this star is yours.
              </>
            )}
          </div>
        </div>
      </div>

      <div className="node-footer pad">
        {playable ? (
          <button className="cta cta--gold" onClick={() => navigate('/songs')}>Playable now ✦ back to the songbook</button>
        ) : firstBeginnable ? (
          <button className="cta cta--cyan" onClick={() => navigate(`/star/${firstBeginnable.id}`)}>
            Start the path · {firstBeginnable.name}
          </button>
        ) : (
          <button className="cta cta--cyan" onClick={() => navigate('/', { replace: false })}>
            See the path in your sky
          </button>
        )}
        {!playable && <div className="quiet">We’ll tell you the moment it’s playable ✦</div>}
      </div>
    </div>
  )
}
