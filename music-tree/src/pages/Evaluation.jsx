// Evaluation (3e): the honest gate before ignition. "Shaky" keeps the star
// in progress — the criteria are the judge, not your mood.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { recOf } from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

const FEELS = ['Shaky', 'Solid', 'Effortless']

export default function Evaluation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatch, sky, prog } = useSky()
  const [feel, setFeel] = useState('Solid')

  const star = sky.stars.find((s) => s.id === id)
  if (!star) return null
  const rec = recOf(prog, star.id)

  const ignite = () => {
    dispatch({ type: 'ignite', starId: star.id, feel })
    navigate(`/ignited/${star.id}`, { replace: true })
  }

  const notYet = () => {
    dispatch({ type: 'demote', starId: star.id })
    navigate(`/star/${star.id}`)
  }

  return (
    <div className="screen screen--node">
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate(-1)}>‹</button>
        <span className="badge badge--gold">READY FOR EVALUATION</span>
        <span className="topbar-menu" />
      </div>

      <div className="eval-head pad">
        <div style={{ fontSize: 22, color: 'var(--gold)', opacity: 0.9 }}>✦</div>
        <div className="display" style={{ fontSize: 28 }}>{star.name}</div>
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.6 }}>
          All criteria checked. One last honest look<br />before this star joins your sky for good.
        </p>
      </div>

      <div className="pad node-section">
        <div className="overline">FINAL CHECK</div>
        <div className="rows" style={{ marginTop: 8 }}>
          {star.criteria.filter((c) => rec?.checked?.[c.id]).map((c) => (
            <div key={c.id} className="row row--gold">
              <span className="check-circle check-circle--on">✓</span>
              <span className="row-body">
                <span style={{ fontSize: 12.5, color: '#D9CBA6' }}>{c.text}</span>
              </span>
              {c.recording && rec?.recorded && (
                <span className="eval-recchip">
                  <span className="eval-rectri" />
                  <span className="eval-waveform">
                    {[6, 10, 5, 9, 7].map((h, i) => <span key={i} style={{ height: h }} />)}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--sub)' }}>
                    0:{String(rec.recorded.duration || 0).padStart(2, '0')}
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pad" style={{ marginTop: 22 }}>
        <div className="eval-feel">
          <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--sub)' }}>HOW DID IT REALLY FEEL?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {FEELS.map((f) => (
              <button
                key={f}
                className={`eval-feel-opt${feel === f ? ' eval-feel-opt--on' : ''}`}
                onClick={() => setFeel(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
            “Shaky” keeps the star in progress — no shame, just truth. The criteria are the judge, not your mood.
          </div>
        </div>
      </div>

      <div className="node-footer pad">
        {feel === 'Shaky' ? (
          <button className="cta cta--cyan" onClick={notYet}>One more practice pass</button>
        ) : (
          <button className="cta cta--gold" style={{ fontSize: 15, padding: 16, boxShadow: '0 0 28px rgba(255,217,142,.35)' }} onClick={ignite}>
            Ignite this star ✦
          </button>
        )}
        <button className="quiet" onClick={notYet}>Not yet — one more practice pass</button>
      </div>
    </div>
  )
}
