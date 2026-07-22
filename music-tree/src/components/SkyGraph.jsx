// The night-sky graph: pan/zoom SVG of constellations, stars and song stars.
// Pinch zoom 0.5–2.5×, free pan, ◎ recenter animates to the suggested star.
// Only ONE star (suggestedId) pulses at a time (SPEC).
import { useEffect, useRef, useState } from 'react'
import { stateOf, recOf, brightnessOf, isFading, songDistance } from '../lib/engine.js'
import './components.css'

const MIN_K = 0.5
const MAX_K = 2.5

// 8-point star path centered on (cx,cy), like the mockups' song stars.
export function starPath(cx, cy, r) {
  const r2 = r * 0.3
  const pts = []
  for (let i = 0; i < 8; i++) {
    const R = i % 2 === 0 ? r : r2
    const a = (Math.PI / 4) * i - Math.PI / 2
    pts.push(`${(cx + R * Math.cos(a)).toFixed(1)} ${(cy + R * Math.sin(a)).toFixed(1)}`)
  }
  return `M${pts.join(' L')} Z`
}

function edgeStyle(fromState, toState) {
  const done = (s) => s === 'completed'
  const reach = (s) => ['available', 'in_progress', 'ready_for_eval'].includes(s)
  if (done(fromState) && done(toState)) {
    return { stroke: 'rgba(255,217,142,.4)', dash: null }
  }
  if ((done(fromState) && reach(toState)) || (reach(fromState) && done(toState))) {
    return { stroke: 'rgba(125,227,255,.35)', dash: '3 4' }
  }
  return { stroke: 'rgba(84,94,130,.55)', dash: '2 6' }
}

export default function SkyGraph({ sky, prog, suggestedId, focus, onTapStar, onTapSong }) {
  const { w: W, h: H } = sky.size
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const [animate, setAnimate] = useState(false)
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const svgRef = useRef(null)

  // ◎ recenter: animate the suggested star to the middle at 1×.
  useEffect(() => {
    if (!focus) return
    const star = sky.stars.find((s) => s.id === focus.starId)
    if (!star) return
    setAnimate(true)
    setView({ x: W / 2 - star.x, y: H / 2 - star.y, k: 1 })
    const t = setTimeout(() => setAnimate(false), 650)
    return () => clearTimeout(t)
  }, [focus, sky, W, H])

  const clampView = (v) => {
    const k = Math.min(MAX_K, Math.max(MIN_K, v.k))
    const pad = 120
    const x = Math.min(pad + W * 0.5, Math.max(-W * k + W * 0.5 - pad + W * 0.5, v.x))
    const y = Math.min(pad + H * 0.5, Math.max(-H * k + H * 0.5 - pad + H * 0.5, v.y))
    return { x, y, k }
  }

  const toWorld = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * W,
      y: ((clientY - rect.top) / rect.height) * H,
    }
  }

  // NB: no setPointerCapture here — capturing retargets pointerup to the svg,
  // which stops click events from ever reaching the star hit-circles.
  const onPointerDown = (e) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointers.current.values()]
    if (pts.length === 1) {
      gesture.current = { mode: 'pan', start: pts[0], view }
    } else if (pts.length === 2) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
      gesture.current = { mode: 'pinch', dist, mid, view }
    }
  }

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointers.current.values()]
    const g = gesture.current
    const rect = svgRef.current.getBoundingClientRect()
    const scale = W / rect.width
    if (g.mode === 'pan' && pts.length === 1) {
      const dx = (pts[0].x - g.start.x) * scale
      const dy = (pts[0].y - g.start.y) * scale
      if (Math.hypot(dx, dy) > 3) g.moved = true
      setView(clampView({ ...g.view, x: g.view.x + dx, y: g.view.y + dy }))
    } else if (g.mode === 'pinch' && pts.length === 2) {
      g.moved = true
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const k = Math.min(MAX_K, Math.max(MIN_K, g.view.k * (dist / g.dist)))
      const mid = toWorld(g.mid.x, g.mid.y)
      // keep the pinch midpoint fixed while scaling
      const wx = (mid.x - g.view.x) / g.view.k
      const wy = (mid.y - g.view.y) / g.view.k
      setView(clampView({ k, x: mid.x - wx * k, y: mid.y - wy * k }))
    }
  }

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size === 0) {
      // wait a tick so click handlers can check whether this was a drag
      const g = gesture.current
      setTimeout(() => {
        if (gesture.current === g) gesture.current = null
      }, 0)
    }
  }

  const onWheel = (e) => {
    const k = Math.min(MAX_K, Math.max(MIN_K, view.k * (e.deltaY < 0 ? 1.12 : 0.9)))
    const p = toWorld(e.clientX, e.clientY)
    const wx = (p.x - view.x) / view.k
    const wy = (p.y - view.y) / view.k
    setView(clampView({ k, x: p.x - wx * k, y: p.y - wy * k }))
  }

  const wasDrag = () => gesture.current?.moved

  const stars = sky.stars
  const stById = {}
  for (const s of stars) stById[s.id] = stateOf(sky, prog, s.id)

  const constellationDone = (cid) =>
    stars.filter((s) => s.constellation === cid).every((s) => stById[s.id] === 'completed')

  return (
    <svg
      ref={svgRef}
      className="skygraph"
      viewBox={`0 0 ${W} ${H}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <g
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
          transition: animate ? 'transform .6s cubic-bezier(.22,1,.36,1)' : 'none',
        }}
      >
        {/* edges */}
        {stars.map((s) =>
          s.prereqIds.map((pid) => {
            const from = stById[pid] ? stars.find((x) => x.id === pid) : null
            if (!from) return null
            const style = edgeStyle(stById[pid], stById[s.id])
            return (
              <line
                key={`${pid}-${s.id}`}
                x1={from.x} y1={from.y} x2={s.x} y2={s.y}
                stroke={style.stroke}
                strokeWidth="1"
                strokeDasharray={style.dash || undefined}
              />
            )
          })
        )}

        {/* song edges (to their prereq stars that exist on the map) */}
        {sky.songs.filter((s) => s.x != null).map((song) =>
          song.requiredStarIds.slice(0, 2).map((pid) => {
            const from = stars.find((x) => x.id === pid)
            if (!from) return null
            const done = stById[pid] === 'completed'
            return (
              <line
                key={`${song.id}-${pid}`}
                x1={from.x} y1={from.y} x2={song.x} y2={song.y}
                stroke={done ? 'rgba(255,217,142,.3)' : 'rgba(84,94,130,.4)'}
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            )
          })
        )}

        {/* constellation labels */}
        {sky.constellations.map((c) => {
          const anyLit = stars.some((s) => s.constellation === c.id && stById[s.id] === 'completed')
          const done = constellationDone(c.id)
          return (
            <text
              key={c.id}
              x={c.x}
              y={c.y}
              className={`skygraph-constellation${done ? ' skygraph-constellation--done' : ''}`}
              fill={done ? '#FFD98E' : anyLit ? '#B9A26B' : '#545E82'}
            >
              {c.name}
            </text>
          )
        })}

        {/* stars */}
        {stars.map((s) => {
          const st = stById[s.id]
          const rec = recOf(prog, s.id)
          const suggested = s.id === suggestedId
          return (
            <g key={s.id}>
              {st === 'completed' && (
                <>
                  <circle cx={s.x} cy={s.y} r="7" fill={isFading(rec) ? '#D9B978' : '#FFD98E'} opacity=".16" />
                  <circle
                    cx={s.x} cy={s.y} r="2.6"
                    fill={isFading(rec) ? '#D9B978' : '#FFD98E'}
                    opacity={0.6 + 0.4 * ((brightnessOf(rec) ?? 100) / 100)}
                  />
                </>
              )}
              {st !== 'completed' && suggested && (
                <>
                  <circle cx={s.x} cy={s.y} r="9" fill="none" stroke="#7DE3FF" strokeWidth="1" className="skygraph-pulse" />
                  <circle cx={s.x} cy={s.y} r="12" fill="#7DE3FF" opacity=".2" />
                  <circle cx={s.x} cy={s.y} r="4" fill="#7DE3FF" />
                </>
              )}
              {!suggested && (st === 'in_progress' || st === 'ready_for_eval') && (
                <circle cx={s.x} cy={s.y} r="3.4" fill="#7DE3FF" />
              )}
              {!suggested && st === 'available' && (
                <>
                  <circle cx={s.x} cy={s.y} r="6" fill="none" stroke="rgba(125,227,255,.7)" strokeWidth="1" />
                  <circle cx={s.x} cy={s.y} r="2.2" fill="#7DE3FF" />
                </>
              )}
              {st === 'locked' && <circle cx={s.x} cy={s.y} r="2" fill="#3E466B" />}
              {/* hit target ≥44px at 1× */}
              <circle
                cx={s.x} cy={s.y} r="15" fill="transparent"
                onClick={() => {
                  if (!wasDrag()) onTapStar(s, st)
                }}
              />
            </g>
          )
        })}

        {/* suggested label */}
        {(() => {
          const s = stars.find((x) => x.id === suggestedId)
          if (!s || stById[s.id] === 'completed') return null
          return (
            <g>
              <line x1={s.x + 8} y1={s.y - 8} x2={s.x + 42} y2={s.y - 36} stroke="rgba(125,227,255,.5)" strokeWidth="1" />
              <text x={s.x + 46} y={s.y - 40} className="skygraph-nextlabel">
                {s.name.toUpperCase()} · NEXT
              </text>
            </g>
          )
        })()}

        {/* song stars */}
        {sky.songs.filter((s) => s.x != null).map((song) => {
          const dist = songDistance(sky, prog, song)
          return (
            <g key={song.id}>
              <path d={starPath(song.x, song.y, 10)} fill="#FF5CA8" opacity={dist === 0 ? 0.95 : 0.85 - Math.min(dist, 3) * 0.15} />
              <text x={song.x - 22} y={song.y + 24} className="skygraph-songlabel">
                {song.title.toUpperCase()}
              </text>
              <circle
                cx={song.x} cy={song.y} r="15" fill="transparent"
                onClick={() => {
                  if (!wasDrag()) onTapSong(song)
                }}
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
