// Reading view (2b): text resources opened from a node — serif headline,
// pull quote, inline diagram, dashed-underline highlight, your-note card.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { recOf } from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

export default function Reading() {
  const { id, resIdx } = useParams()
  const navigate = useNavigate()
  const { dispatch, sky, prog } = useSky()
  const [highlighted, setHighlighted] = useState(true)

  const star = sky.stars.find((s) => s.id === id)
  const res = star?.resources[Number(resIdx)]
  if (!star || !res) return null

  const rec = recOf(prog, star.id)
  const constellation = sky.constellations.find((c) => c.id === star.constellation)
  const article = res.article
  const readCount = star.resources.filter((r) => r.type !== 'youtube').length
  const thisIdx = star.resources.filter((r, i) => r.type !== 'youtube' && i <= Number(resIdx)).length

  const finish = () => {
    dispatch({ type: 'markRead', starId: star.id, resIdx: Number(resIdx) })
    navigate(`/star/${star.id}/drill`)
  }

  return (
    <div className="screen screen--node">
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate(-1)}>‹</button>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--sub)' }}>reading {thisIdx} of {readCount}</span>
          <span style={{ width: 60, height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 2, display: 'inline-block' }}>
            <span style={{ display: 'block', width: `${(thisIdx / Math.max(1, readCount)) * 100}%`, height: '100%', background: 'var(--cyan)', borderRadius: 2 }} />
          </span>
        </span>
      </div>

      <div className="reading-head">
        <div style={{ fontSize: 10.5, letterSpacing: 3, color: 'var(--cyan)' }}>
          {article?.overline || `${constellation?.name} · GUIDE`}
        </div>
        <h1 className="display reading-title">{res.title}</h1>
        <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
          {res.meta} · attached to ✦ {star.name}
        </div>
      </div>

      <div className="reading-body">
        {(article?.blocks || [
          { type: 'p', text: `${star.blurb} This ${res.type === 'pdf' ? 'chart' : 'guide'} walks the same ground as the criteria — read it slowly, instrument in hand.` },
          { type: 'quote', text: 'Read a little, play a lot. The page is a map; the criteria are the territory.' },
          { type: 'p', text: `When you're done here, head to the practice room — `, highlight: 'the drill is where this star actually ignites', after: '.' },
        ]).map((b, i) => {
          if (b.type === 'quote') {
            return <div key={i} className="reading-quote display">{b.text}</div>
          }
          if (b.type === 'diagram') {
            return (
              <div key={i} className="reading-diagram">
                <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--sub)' }}>{b.title}</div>
                <div className="reading-cells">
                  {b.cells.map((c, j) => (
                    <span
                      key={j}
                      className="reading-cell"
                      style={
                        j === 0 ? { background: 'rgba(255,217,142,.14)', borderColor: 'rgba(255,217,142,.4)', color: 'var(--gold)' }
                        : j === b.cells.length - 1 ? { background: 'rgba(125,227,255,.12)', borderColor: 'rgba(125,227,255,.4)', color: 'var(--cyan)' }
                        : undefined
                      }
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{b.caption}</div>
              </div>
            )
          }
          return (
            <p key={i} style={{ margin: 0 }}>
              {b.text}
              {b.highlight && (
                <span className={highlighted ? 'reading-highlight' : undefined}>{b.highlight}</span>
              )}
              {b.after}
            </p>
          )
        })}
      </div>

      {rec?.note && (
        <div className="pad" style={{ marginTop: 18 }}>
          <div className="banner banner--gold" style={{ alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--gold)', fontSize: 13, marginTop: 1 }}>✎</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 10, letterSpacing: 2, color: 'var(--gold-dim)' }}>YOUR NOTE</span>
              <span style={{ fontSize: 12.5, color: '#D9CBA6' }}>{rec.note}</span>
            </span>
          </div>
        </div>
      )}

      <div className="node-footer pad" style={{ display: 'flex', gap: 10 }}>
        <button
          className="cta cta--ghost"
          style={{ flex: 1, ...(highlighted ? { color: 'var(--cyan)', borderColor: 'rgba(125,227,255,.4)' } : {}) }}
          onClick={() => setHighlighted((v) => !v)}
        >
          Highlight
        </button>
        <button className="cta cta--cyan" style={{ flex: 2, fontSize: 13, padding: 14 }} onClick={finish}>
          Done reading → practice
        </button>
      </div>
    </div>
  )
}
