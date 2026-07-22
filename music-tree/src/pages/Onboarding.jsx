// Onboarding: welcome → choose your constellation (1f) → "do any of these
// already shine?" (3c). Also reachable with ?add=1 from the sky switcher to
// chart an additional sky.
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { skies, comingSoon } from '../data/skies.js'
import { withPrereqClosure } from '../lib/engine.js'
import { useStore } from '../lib/store.jsx'
import './screens.css'

function MiniConstellation({ sky, lit }) {
  // tiny decorative constellation from the sky's first 4 stars
  const pts = sky.stars.slice(0, 4).map((s, i) => ({
    x: 14 + i * 17 + (i % 2) * 4,
    y: i % 2 === 0 ? 40 - i * 4 : 20 + i * 4,
  }))
  const stroke = lit ? 'rgba(255,217,142,.6)' : 'rgba(138,148,184,.45)'
  const fill = lit ? '#FFD98E' : '#8A94B8'
  return (
    <svg viewBox="0 0 80 56" className="onb-mini">
      {pts.slice(1).map((p, i) => (
        <line key={i} x1={pts[i].x} y1={pts[i].y} x2={p.x} y2={p.y} stroke={stroke} strokeWidth="1" />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === 3 ? 3.2 : 2.4} fill={fill} />
      ))}
    </svg>
  )
}

export default function Onboarding() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const adding = params.get('add') === '1' && state.onboarded
  const [step, setStep] = useState(adding ? 2 : 1)
  const [skyId, setSkyId] = useState(null)
  const [preLit, setPreLit] = useState([])

  const chosen = skies.find((s) => s.id === skyId) || null
  const charted = Object.keys(state.skies)

  const chart = (ids) => {
    dispatch({ type: 'chartSky', skyId, preIgnitedIds: ids })
    navigate('/', { replace: true })
  }

  const preLitTotal = chosen ? withPrereqClosure(chosen, preLit).length : 0

  if (step === 1) {
    return (
      <div className="screen starfield onb">
        <div className="onb-welcome">
          <svg viewBox="0 0 120 120" className="onb-logo">
            <circle cx="60" cy="60" r="40" fill="#FFD98E" opacity=".08" />
            <circle cx="60" cy="60" r="26" fill="#FFD98E" opacity=".12" />
            <path d="M60 28 L67 53 L92 60 L67 67 L60 92 L53 67 L28 60 L53 53 Z" fill="#FFEDC2" style={{ filter: 'drop-shadow(0 0 14px rgba(255,217,142,.9))' }} />
          </svg>
          <div className="overline overline--wide">STEP 1 OF 3</div>
          <h1 className="display onb-title">Music Tree</h1>
          <p className="onb-copy">
            Every skill you learn is a star. Ignite them one by one,
            watch constellations take shape — and play the songs
            they unlock.
          </p>
        </div>
        <div className="onb-footer">
          <button className="cta cta--gold" onClick={() => setStep(2)}>Chart my sky</button>
          <div className="quiet">Everything lives on your device — no account needed.</div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="screen starfield onb">
        <div className="onb-head">
          <div className="overline overline--wide">{adding ? 'NEW SKY' : 'STEP 2 OF 3'}</div>
          <h1 className="display onb-title">Choose your<br />constellation</h1>
          <p className="onb-copy">Each instrument is a sky of its own.<br />You can add more later.</p>
        </div>
        <div className="onb-grid pad">
          {skies.map((s) => {
            const already = charted.includes(s.id)
            const sel = skyId === s.id
            return (
              <button
                key={s.id}
                className={`onb-card${sel ? ' onb-card--sel' : ''}`}
                disabled={already}
                onClick={() => setSkyId(s.id)}
              >
                <MiniConstellation sky={s} lit={sel} />
                <div className={`display onb-card-name${sel ? ' onb-card-name--sel' : ''}`}>{s.name.replace(' Guitar', '')}</div>
                <div className="onb-card-meta" style={sel ? { color: 'var(--gold-dim)' } : undefined}>
                  {already ? 'already charted' : `${s.stars.length} stars · ${s.songs.length} ${s.songNoun}`}
                </div>
              </button>
            )
          })}
          {comingSoon.map((s) => (
            <button key={s.id} className="onb-card onb-card--soon" disabled>
              <svg viewBox="0 0 80 56" className="onb-mini">
                <circle cx="24" cy="30" r="2" fill="#3E466B" />
                <circle cx="44" cy="20" r="2" fill="#3E466B" />
                <circle cx="60" cy="38" r="2" fill="#3E466B" />
              </svg>
              <div className="display onb-card-name">{s.name}</div>
              <div className="onb-card-meta">charting soon</div>
            </button>
          ))}
        </div>
        {chosen && (
          <p className="onb-hint">
            Your first star ignites in your first session — <span style={{ color: 'var(--cyan)' }}>{chosen.stars[0].name}, 10 min.</span>
          </p>
        )}
        <div className="onb-footer">
          <button className="cta cta--gold" disabled={!chosen} onClick={() => setStep(3)}>
            Chart this sky
          </button>
          <div className="quiet">{chosen ? '1 constellation selected' : 'pick an instrument to continue'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen starfield onb">
      <div className="onb-head">
        <div className="overline overline--wide">{adding ? 'NEW SKY' : 'STEP 3 OF 3'}</div>
        <h1 className="display onb-title">Do any of these<br />already shine?</h1>
        <p className="onb-copy">Mark what you can already play —<br />your sky starts lit, not empty.</p>
      </div>
      <div className="rows pad">
        {chosen.stars.slice(0, 5).map((s) => {
          const sel = preLit.includes(s.id)
          return (
            <button
              key={s.id}
              className={`row row--r14 ${sel ? 'row--gold-strong' : ''}`}
              onClick={() => setPreLit((cur) => (sel ? cur.filter((id) => id !== s.id) : [...cur, s.id]))}
            >
              <span className="row-icon" style={{ color: sel ? 'var(--gold)' : 'var(--muted)', fontSize: 15 }}>
                {sel ? '✦' : '✧'}
              </span>
              <span className="row-body">
                <span className="row-title" style={sel ? { color: 'var(--gold-hi)' } : undefined}>{s.name}</span>
                <span className="row-sub" style={sel ? { color: 'var(--gold-dim)' } : undefined}>
                  {s.criteria[0].text.toLowerCase()}
                </span>
              </span>
              <span className={`check-circle${sel ? ' check-circle--on' : ''}`} style={{ width: 22, height: 22 }}>
                {sel ? '✓' : ''}
              </span>
            </button>
          )
        })}
      </div>
      <div className="pad" style={{ marginTop: 18 }}>
        <div className="banner banner--cyan">
          <span style={{ color: 'var(--cyan)', alignSelf: 'flex-start' }}>✧</span>
          <span style={{ fontSize: 12 }}>
            Marked stars are <span style={{ color: 'var(--cyan)' }}>pre-ignited</span> — each shows its criteria
            so you can verify honestly whenever you like.
          </span>
        </div>
      </div>
      <div className="onb-footer">
        <button className="cta cta--gold" onClick={() => chart(preLit)}>
          {preLit.length
            ? `Light my sky · ${preLitTotal} star${preLitTotal === 1 ? '' : 's'} pre-lit`
            : 'Light my sky'}
        </button>
        <button className="quiet" onClick={() => chart([])}>
          I’m brand new — start me at the horizon
        </button>
      </div>
    </div>
  )
}
