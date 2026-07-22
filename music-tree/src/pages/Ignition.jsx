// Ignition (3a): the full-screen payoff. Only ever reached from Evaluation.
// New cyan edges reach out to the stars this ignition just made available.
import { useNavigate, useParams } from 'react-router-dom'
import { starPath } from '../components/SkyGraph.jsx'
import {
  newlyAvailable, songsMovedCloser, songMissing, suggestedNext,
} from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

export default function Ignition() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sky, prog } = useSky()

  const star = sky.stars.find((s) => s.id === id)
  if (!star) return null

  const fresh = newlyAvailable(sky, prog, star.id)
  const closer = songsMovedCloser(sky, prog, star.id)
  const oneAway = closer.find((s) => songMissing(sky, prog, s).length === 1)
  const drillCrit = star.criteria.find((c) => c.target)
  const next = suggestedNext(sky, prog)

  const spots = [
    { x: 312, y: 266, tx: 296, ty: 290 },
    { x: 80, y: 272, tx: 56, ty: 296 },
  ]

  return (
    <div className="screen screen--radial starfield">
      <div className="ignite-stage">
        <svg viewBox="0 0 390 320" style={{ width: '100%', display: 'block' }}>
          <g stroke="rgba(255,217,142,.45)" strokeWidth="1">
            <line x1="195" y1="60" x2="195" y2="110" /><line x1="195" y1="210" x2="195" y2="260" />
            <line x1="120" y1="160" x2="70" y2="160" /><line x1="270" y1="160" x2="320" y2="160" />
            <line x1="142" y1="107" x2="112" y2="77" /><line x1="248" y1="107" x2="278" y2="77" />
            <line x1="142" y1="213" x2="112" y2="243" /><line x1="248" y1="213" x2="278" y2="243" />
          </g>
          <circle cx="195" cy="160" r="70" fill="#FFD98E" opacity=".08" />
          <circle cx="195" cy="160" r="44" fill="#FFD98E" opacity=".14" />
          <circle cx="195" cy="160" r="30" fill="none" stroke="#FFD98E" strokeWidth="1" className="skygraph-pulse" style={{ animationDuration: '2.2s' }} />
          <path
            d={starPath(195, 160, 38)}
            fill="#FFEDC2"
            style={{ filter: 'drop-shadow(0 0 14px rgba(255,217,142,.9))', animation: 'igniteIn .8s cubic-bezier(.22,1,.36,1) both', transformBox: 'fill-box', transformOrigin: 'center' }}
          />
          {fresh.slice(0, 2).map((s, i) => (
            <g key={s.id}>
              <line
                x1={195 + (i === 0 ? 27 : -27)} y1="186" x2={spots[i].x} y2={spots[i].y}
                stroke="rgba(125,227,255,.5)" strokeWidth="1" strokeDasharray="3 4"
                style={{ animation: `edgeReach .9s ${0.5 + i * 0.25}s ease-out both` }}
              />
              <circle cx={spots[i].x} cy={spots[i].y} r="6" fill="none" stroke="rgba(125,227,255,.8)" strokeWidth="1" />
              <circle cx={spots[i].x} cy={spots[i].y} r="2.2" fill="#7DE3FF" />
              <text x={spots[i].tx} y={spots[i].ty} fill="#7DE3FF" fontSize="9.5">{s.name}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="ignite-copy">
        <div className="overline overline--wide" style={{ color: 'var(--gold-dim)' }}>STAR IGNITED</div>
        <div className="display" style={{ fontSize: 32 }}>{star.name}</div>
        <div style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.6 }}>
          {drillCrit ? `Verified: ${drillCrit.text.toLowerCase()}.` : 'Every criterion, honestly met.'}
          <br />This one stays in your sky.
        </div>
      </div>

      <div className="statcards pad" style={{ marginTop: 22 }}>
        <div className="statcard statcard--center" style={{ borderColor: 'rgba(125,227,255,.2)', background: 'rgba(20,26,52,.75)' }}>
          <div className="statcard-num" style={{ fontSize: 20, color: 'var(--cyan)', marginTop: 0 }}>{fresh.length} ✦</div>
          <div style={{ fontSize: 10.5, color: 'var(--sub)', marginTop: 2 }}>new star{fresh.length === 1 ? '' : 's'} in reach</div>
        </div>
        <div className="statcard statcard--center" style={{ borderColor: 'rgba(255,92,168,.25)', background: 'rgba(20,26,52,.75)' }}>
          <div className="statcard-num" style={{ fontSize: 20, color: 'var(--pink-text)', marginTop: 0 }}>{closer.length} ♪</div>
          <div style={{ fontSize: 10.5, color: 'var(--sub)', marginTop: 2 }}>{sky.songNoun} moved closer</div>
        </div>
      </div>

      {oneAway && (
        <div className="pad" style={{ marginTop: 16 }}>
          <div className="banner banner--pink">
            <span style={{ color: 'var(--pink)', fontSize: 14 }}>✦</span>
            <span style={{ fontSize: 12.5 }}>
              <span style={{ color: 'var(--pink-text)', fontWeight: 600 }}>{oneAway.title}</span> is now one star away
              — {sky.stars.find((s) => s.id === songMissing(sky, prog, oneAway)[0])?.name}
              {oneAway.estNote ? `, ${oneAway.estNote}` : ''}.
            </span>
          </div>
        </div>
      )}

      <div className="node-footer pad">
        <button className="cta cta--gold" onClick={() => navigate('/', { replace: true })}>
          Return to your sky
        </button>
        {next && (
          <button className="quiet" onClick={() => navigate(`/star/${next.id}`, { replace: true })}>
            or keep the streak — {next.name} · {next.daily.split(' ')[0]} min
          </button>
        )}
      </div>
    </div>
  )
}
