// Review (3f): the 3-minute check that keeps a fading star lit. Pass restores
// 100% and doubles the interval; fail reopens only what slipped.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { starPath } from '../components/SkyGraph.jsx'
import { recOf, brightnessOf, daysSinceIgnited } from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

export default function Review() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatch, sky, prog } = useSky()
  const [started, setStarted] = useState(false)
  const [checked, setChecked] = useState({})

  const star = sky.stars.find((s) => s.id === id)
  if (!star) return null
  const rec = recOf(prog, star.id)
  const brightness = brightnessOf(rec) ?? 100
  const quick = star.criteria.filter((c) => c.required).slice(0, 2)
  const allChecked = quick.every((c) => checked[c.id])
  const nextInterval = (rec?.reviewInterval || 12) * 2

  const pass = () => {
    dispatch({ type: 'reviewPass', starId: star.id })
    navigate('/', { replace: true })
  }

  const fail = () => {
    const failed = quick.filter((c) => !checked[c.id]).map((c) => c.id)
    dispatch({ type: 'reviewFail', starId: star.id, failedCritIds: failed.length ? failed : quick.map((c) => c.id) })
    navigate(`/star/${star.id}`, { replace: true })
  }

  return (
    <div className="screen starfield" style={{ background: 'linear-gradient(180deg,#04060F 0%,#0A0F26 50%,#0D1330 100%)' }}>
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate(-1)}>‹</button>
        <span style={{ fontSize: 10.5, letterSpacing: 2, color: 'var(--sub)' }}>REVIEW · 3 MIN</span>
        <span className="topbar-menu">⋯</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 18 }}>
        <svg viewBox="0 0 220 150" style={{ width: 200, height: 136 }}>
          <circle cx="110" cy="75" r="52" fill="#FFD98E" opacity=".06" />
          <circle cx="110" cy="75" r="30" fill="#FFD98E" opacity=".1" />
          <path d={starPath(110, 75, 30)} fill="#D9B978" opacity=".8" />
        </svg>
      </div>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }} className="pad">
        <div style={{ fontSize: 10.5, letterSpacing: 3, color: 'var(--gold-dim)' }}>
          FADING · IGNITED {daysSinceIgnited(rec)} DAYS AGO
        </div>
        <div className="display" style={{ fontSize: 28 }}>{star.name}</div>
      </div>

      <div style={{ margin: '18px 40px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--sub)' }}>
          <span>BRIGHTNESS</span>
          <span style={{ color: 'var(--gold-faded)' }}>{brightness}%</span>
        </div>
        <div className="meter">
          <div className="meter-fill meter-fill--faded" style={{ width: `${brightness}%` }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 2 }}>
          a 3-minute review restores it to full
        </div>
      </div>

      <div className="pad node-section">
        <div className="overline">QUICK CHECK — SAME CRITERIA, SHORTER</div>
        <div className="rows" style={{ marginTop: 8 }}>
          {quick.map((c) => {
            const on = !!checked[c.id]
            return (
              <button
                key={c.id}
                className={`row ${on ? 'row--gold' : 'row--cyan'}`}
                onClick={() => started && setChecked((cur) => ({ ...cur, [c.id]: !cur[c.id] }))}
                style={!started ? { opacity: 0.6 } : undefined}
              >
                <span className={`check-circle${on ? ' check-circle--on' : ' check-circle--cyan'}`}>{on ? '✓' : ''}</span>
                <span style={{ fontSize: 12.5, color: on ? '#D9CBA6' : 'var(--ink)' }}>{c.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      {started && (
        <div className="pad" style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <button className="review-outcome review-outcome--bright" disabled={!allChecked} onClick={pass}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>Still bright ✦</span>
            <span style={{ fontSize: 10.5, color: 'var(--gold-dim)' }}>restores 100% · next review in {nextInterval} days</span>
          </button>
          <button className="review-outcome" onClick={fail}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--sub)' }}>It slipped</span>
            <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>re-opens the star with a short refresher plan</span>
          </button>
        </div>
      )}

      <div className="pad" style={{ marginTop: 20 }}>
        <div className="banner banner--cyan" style={{ fontSize: 12 }}>
          Reviews are suggested, never forced. Skip it and the star simply keeps dimming — you’ll see it in the sky.
        </div>
      </div>

      <div className="node-footer pad">
        {!started ? (
          <button className="cta cta--cyan" onClick={() => setStarted(true)}>Start the 3-minute check</button>
        ) : (
          <div className="quiet">check what still rings true, then choose</div>
        )}
      </div>
    </div>
  )
}
