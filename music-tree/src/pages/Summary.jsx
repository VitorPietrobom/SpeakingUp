// Session summary (3b): sky delta, what got brighter (skipping is guilt-free),
// streak + weekly time, next-session suggestion.
import { useNavigate } from 'react-router-dom'
import { skiesById } from '../data/skies.js'
import { buildQueue, emptyProg, streakStatus } from '../lib/engine.js'
import { useStore, weekMinutes } from '../lib/store.jsx'
import './screens.css'

const ITEM_STYLES = {
  sealed: { icon: '✦', color: 'var(--gold)', cls: 'row--gold', end: '+1' },
  ignited: { icon: '✦', color: 'var(--gold)', cls: 'row--gold', end: '✦' },
  kept: { icon: '✦', color: 'var(--gold)', cls: '', end: 'kept', dim: true },
  slipped: { icon: '✧', color: 'var(--cyan)', cls: '', end: '↺' },
  done: { icon: '¶', color: 'var(--cyan)', cls: '', end: '✓' },
  skipped: { icon: '✧', color: 'var(--cyan)', cls: '', end: '→' },
}

const ITEM_SUBS = {
  sealed: (note) => note || 'criterion sealed',
  ignited: () => 'joined your sky for good',
  kept: () => 'still bright · review interval doubled',
  slipped: () => 'reopened with a short refresher plan',
  done: () => 'reading finished',
  skipped: () => 'no guilt — it returns next session',
}

export default function Summary() {
  const { state } = useStore()
  const navigate = useNavigate()
  const sum = state.lastSummary

  if (!sum) {
    navigate('/', { replace: true })
    return null
  }

  const sky = skiesById[sum.skyId]
  const prog = state.skies[sum.skyId] || emptyProg()
  const nextUp = buildQueue(sky, prog)[0]
  const starName = (id) => sky.stars.find((s) => s.id === id)?.name || id
  const paused = streakStatus(state.streak) === 'paused'
  const week = weekMinutes(state.minutesByDay)

  return (
    <div className="screen starfield" style={{ background: 'linear-gradient(180deg,#04060F 0%,#0A0F26 55%,#0D1330 100%)' }}>
      <div className="summary-head pad">
        <div className="overline overline--wide">SESSION COMPLETE</div>
        <div className="display" style={{ fontSize: 28 }}>
          {sum.minutes} minute{sum.minutes === 1 ? '' : 's'} well spent
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--sub)' }}>
          {new Date(sum.at).toLocaleDateString('en-US', { weekday: 'long' })} · {sky.name.toLowerCase()}
        </div>
      </div>

      <div className="pad" style={{ marginTop: 24 }}>
        <div className="summary-delta">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10.5, letterSpacing: 2, color: 'var(--sub)' }}>YOUR SKY</span>
            <span style={{ fontSize: 12, color: 'var(--gold)' }}>
              {sum.pctBefore !== sum.pctAfter ? `${sum.pctBefore}% → ` : ''}{sum.pctAfter}% ignited
            </span>
          </div>
          <div className="meter">
            <div className="meter-fill" style={{ width: `${sum.pctAfter}%` }} />
            {sum.pctBefore !== sum.pctAfter && <div className="meter-tick" style={{ left: `${sum.pctBefore}%` }} />}
          </div>
        </div>
      </div>

      <div className="pad node-section">
        <div className="overline">WHAT GOT BRIGHTER</div>
        <div className="rows" style={{ marginTop: 8 }}>
          {sum.items.length === 0 && (
            <div className="row" style={{ color: 'var(--muted)', fontSize: 12 }}>
              A quiet one — showing up still counts.
            </div>
          )}
          {sum.items.map((item, i) => {
            const s = ITEM_STYLES[item.status] || ITEM_STYLES.done
            return (
              <div key={i} className={`row ${s.cls}`}>
                <span style={{ color: s.color, opacity: s.dim ? 0.7 : 1 }}>{s.icon}</span>
                <span className="row-body">
                  <span className="row-title">
                    {starName(item.starId)}
                    {item.status === 'sealed' ? ' — criterion sealed'
                      : item.status === 'ignited' ? ' — ignited'
                      : item.status === 'kept' ? ' — reviewed'
                      : item.status === 'slipped' ? ' — it slipped'
                      : item.status === 'skipped' ? ' — skipped' : ' — read'}
                  </span>
                  <span className="row-sub">{ITEM_SUBS[item.status]?.(item.note)}</span>
                </span>
                <span className="row-end" style={item.status === 'sealed' || item.status === 'ignited' ? { color: 'var(--gold-dim)' } : undefined}>
                  {s.end}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="statcards pad" style={{ marginTop: 22 }}>
        <div className="statcard statcard--center">
          <div className="statcard-num" style={{ fontSize: 20, color: paused ? 'var(--muted)' : 'var(--gold)', marginTop: 0 }}>
            {sum.streak}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--sub)', marginTop: 2 }}>session streak{paused ? ' · paused' : ''}</div>
        </div>
        <div className="statcard statcard--center">
          <div className="statcard-num" style={{ fontSize: 20, marginTop: 0 }}>
            {Math.floor(week / 60) ? `${Math.floor(week / 60)}h ` : ''}{week % 60}m
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--sub)', marginTop: 2 }}>this week</div>
        </div>
      </div>

      {nextUp && (
        <div className="pad" style={{ marginTop: 18 }}>
          <div className="banner banner--cyan">
            <span style={{ color: 'var(--cyan)' }}>✧</span>
            <span>
              Next session: {nextUp.kind === 'review' ? `keep ${nextUp.label} bright` : nextUp.label.toLowerCase()}.{' '}
              <span style={{ color: 'var(--cyan)' }}>~{nextUp.min} min.</span>
            </span>
          </div>
        </div>
      )}

      <div className="node-footer pad">
        <button className="cta cta--cyan" onClick={() => navigate('/', { replace: true })}>Back to the sky</button>
      </div>
    </div>
  )
}
