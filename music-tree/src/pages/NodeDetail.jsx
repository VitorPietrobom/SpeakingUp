// Node page (2a, canonical): video-first resource view, chapter chips,
// criteria checklist, practice CTA. Pre-ignited (verified=false) stars show
// the verify-honestly banner until their criteria are self-checked.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  stateOf, recOf, checkedCount, starsUnlockedBy, songsUnlockedBy, nextCriterion,
} from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

const BADGES = {
  available: { cls: 'badge--cyan', label: 'IN REACH' },
  in_progress: { cls: 'badge--cyan', label: 'IN PROGRESS' },
  ready_for_eval: { cls: 'badge--gold', label: 'READY FOR EVALUATION' },
  completed: { cls: 'badge--gold', label: 'IGNITED ✦' },
  locked: { cls: 'badge--cyan', label: 'STILL DARK' },
}

export default function NodeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatch, sky, prog } = useSky()
  const [noteDraft, setNoteDraft] = useState(null)

  const star = sky.stars.find((s) => s.id === id)
  if (!star) return null

  const st = stateOf(sky, prog, star.id)
  const rec = recOf(prog, star.id)
  const online = navigator.onLine
  const video = star.resources.find((r) => r.type === 'youtube')
  const rest = star.resources.filter((r) => r !== video)
  const done = checkedCount(star, rec)
  const next = nextCriterion(star, rec)
  const unlockS = starsUnlockedBy(sky, star.id).length
  const unlockSongs = songsUnlockedBy(sky, star.id).length
  const badge = BADGES[st]
  const unverified = st === 'completed' && rec && !rec.verified

  const resourceRoute = (r, i) =>
    r.type === 'youtube' ? null : `/star/${star.id}/read/${star.resources.indexOf(r) >= 0 ? star.resources.indexOf(r) : i}`

  return (
    <div className="screen screen--node">
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate(-1)}>‹</button>
        <span className={`badge ${badge.cls}`}>{badge.label}</span>
        <span className="topbar-menu" />
      </div>

      {unverified && (
        <div className="pad" style={{ marginTop: 12 }}>
          <div className="banner banner--gold" style={{ fontSize: 12 }}>
            <span style={{ color: 'var(--gold)' }}>✦</span>
            <span>
              You pre-lit this star. Its criteria are below — <span style={{ color: 'var(--gold-hi)' }}>verify honestly</span>{' '}
              whenever you like; it keeps its place in your sky either way.
            </span>
          </div>
        </div>
      )}

      {/* video (or placeholder) */}
      <div className="node-player">
        {video?.url && online ? (
          <iframe
            title={video.title}
            src={video.url}
            width="100%"
            height="219"
            style={{ border: 'none', display: 'block' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="node-player-ph">
            <div className="node-player-btn">
              <div className="node-player-tri" />
            </div>
            <div className="node-player-note">
              {video
                ? online ? 'youtube embed · lesson video' : 'offline — open later'
                : 'no video yet · criteria below still light this star'}
            </div>
            {video && <div className="node-player-title">{video.title}</div>}
          </div>
        )}
      </div>

      {video?.chapters && (
        <div className="node-chapters">
          {video.chapters.map((c, i) => (
            <span key={c.at} className={`chip${i === 1 ? ' chip--cyan' : ''}`} style={{ padding: '6px 12px' }}>
              {i === 1 ? '▸ ' : ''}{c.at} {c.label}
            </span>
          ))}
        </div>
      )}

      <div className="pad" style={{ marginTop: 18 }}>
        <div className="display" style={{ fontSize: 26 }}>{star.name}</div>
        <div className="node-meta">
          <span style={{ color: 'var(--gold)' }}>{'◆'.repeat(star.difficulty)}</span>
          <span style={{ color: 'var(--locked)' }}>{'◆'.repeat(5 - star.difficulty)}</span>
          <span>{star.est}</span>
          <span>·</span>
          <span>{star.daily}</span>
          <span>·</span>
          <span style={{ color: 'var(--cyan)' }}>unlocks {unlockS} ✦ {unlockSongs} ♪</span>
        </div>
        <p className="node-blurb">{star.blurb}</p>
      </div>

      <div className="pad node-section">
        <div className="node-section-head">
          <div className="overline">UP NEXT IN THIS STAR</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{star.resources.length} resources</div>
        </div>
        <div className="rows">
          {rest.map((r) => {
            const idx = star.resources.indexOf(r)
            const read = rec?.read?.[idx]
            return (
              <button
                key={r.title}
                className="row row--r14"
                onClick={() => resourceRoute(r, idx) && navigate(resourceRoute(r, idx))}
              >
                <span className={`res-thumb res-thumb--${r.type}`}>
                  {r.type === 'pdf' ? 'PDF' : r.type === 'note' ? '✎' : r.type === 'article' ? '¶' : '▶'}
                </span>
                <span className="row-body">
                  <span className="row-title">{r.title}</span>
                  <span className="row-sub">{r.meta}{read ? ' · read ✓' : ''}</span>
                </span>
                <span style={{ color: 'var(--muted)' }}>›</span>
              </button>
            )
          })}
          {star.resources.length === 0 && !rec?.note && (
            <div className="row row--dim" style={{ fontSize: 12, color: 'var(--muted)' }}>
              No charts or guides yet — this star lights by its criteria alone.
            </div>
          )}
          {rec?.note && (
            <div className="row row--r14">
              <span className="res-thumb res-thumb--note">✎</span>
              <span className="row-body">
                <span className="row-title">My note</span>
                <span className="row-sub">{rec.note}</span>
              </span>
            </div>
          )}
          {noteDraft === null ? (
            <button className="row row--dashed" onClick={() => setNoteDraft(rec?.note || '')}>
              <span style={{ fontSize: 14 }}>+</span>
              <span style={{ fontSize: 12 }}>{rec?.note ? 'Edit your note' : 'Add your own link or note'}</span>
            </button>
          ) : (
            <div className="row row--r14" style={{ gap: 8 }}>
              <input
                className="addsong-input"
                style={{ flex: 1, margin: 0 }}
                autoFocus
                placeholder="e.g. roll the index finger…"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
              />
              <button
                style={{ color: 'var(--cyan)', fontWeight: 600, fontSize: 12 }}
                onClick={() => {
                  if (noteDraft.trim()) dispatch({ type: 'saveNote', starId: star.id, text: noteDraft.trim() })
                  setNoteDraft(null)
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pad node-section">
        <div className="node-section-head">
          <div className="overline">IGNITION CRITERIA</div>
          <div style={{ fontSize: 11, color: st === 'completed' ? 'var(--gold-dim)' : 'var(--cyan)' }}>
            {done} of {star.criteria.length}
          </div>
        </div>
        <div className="segments">
          {star.criteria.map((c) => (
            <div key={c.id} className={`segment${rec?.checked?.[c.id] ? ' segment--on' : ''}`} />
          ))}
        </div>
        <div className="rows" style={{ marginTop: 10 }}>
          {star.criteria.map((c) => {
            const on = !!rec?.checked?.[c.id]
            return (
              <button
                key={c.id}
                className={`row ${on ? 'row--gold' : ''}`}
                onClick={() => dispatch({ type: 'toggleCriterion', starId: star.id, critId: c.id })}
              >
                <span className={`check-circle${on ? ' check-circle--on' : ''}`}>{on ? '✓' : ''}</span>
                <span className="row-body">
                  <span style={{ fontSize: 12.5, color: on ? '#D9CBA6' : 'var(--ink)' }}>{c.text}</span>
                  {!c.required && <span className="row-sub" style={{ fontSize: 10.5 }}>optional{c.recording ? ' · attach recording' : ''}</span>}
                </span>
              </button>
            )
          })}
        </div>
        {next && st !== 'completed' && (
          <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 10 }}>Next: {next.text}</div>
        )}
      </div>

      <div className="node-footer pad">
        {st === 'ready_for_eval' ? (
          <button className="cta cta--gold" onClick={() => navigate(`/star/${star.id}/evaluate`)}>
            Ignite this star ✦
          </button>
        ) : st === 'completed' ? (
          <button className="cta cta--cyan" onClick={() => navigate(`/star/${star.id}/review`)}>
            Run a keep-it-bright review
          </button>
        ) : (
          <button className="cta cta--gold" onClick={() => navigate(`/star/${star.id}/drill`)}>
            {video ? 'Watch, then practice' : 'Practice this star'} · {star.daily.split(' ')[0]} min
          </button>
        )}
        {st !== 'completed' && (
          <div className="quiet" style={{ padding: 2 }}>Complete all criteria to ignite ✦</div>
        )}
      </div>
    </div>
  )
}
