// Practice room (2c): criterion drill — progress dial, pink combo meter,
// working metronome (WebAudio) and recorder (MediaRecorder, degrades silently).
// Hitting the target — or 10 clean in a row — seals the criterion.
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { recOf, requiredDone, songsUnlockedBy } from '../lib/engine.js'
import { useSky } from '../lib/store.jsx'
import './screens.css'

const COMBO_TO_SEAL = 10

export default function PracticeRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatch, sky, prog } = useSky()

  const star = sky.stars.find((s) => s.id === id)
  const rec = recOf(prog, star?.id)

  // the drilled criterion: first unchecked required one (targets preferred).
  // Pinned in state so the screen doesn't silently switch criteria the moment
  // one is sealed — "Next criterion" advances it explicitly.
  const pickCritId = (r) =>
    (star?.criteria.find((c) => c.required && c.target && !r?.checked?.[c.id]) ||
      star?.criteria.find((c) => c.required && !r?.checked?.[c.id]) ||
      star?.criteria[0])?.id

  const [critId, setCritId] = useState(() => pickCritId(rec))
  const crit = star?.criteria.find((c) => c.id === critId)

  const target = crit?.target || 8
  const [bpm, setBpm] = useState(crit?.bpm || 60)
  const [reps, setReps] = useState(0)
  const [combo, setCombo] = useState(0)
  const [best, setBest] = useState(0)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(false)
  const [sealed, setSealed] = useState(false)
  const [recState, setRecState] = useState('idle') // idle | recording | done | unavailable
  const [recSecs, setRecSecs] = useState(0)

  const audioRef = useRef(null)
  const tickRef = useRef(null)
  const mediaRef = useRef(null)
  const recTimerRef = useRef(null)

  // metronome ------------------------------------------------------------
  useEffect(() => {
    if (!running) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (Ctx && !audioRef.current) audioRef.current = new Ctx()
    const ctx = audioRef.current
    let n = 0
    tickRef.current = setInterval(() => {
      n += 1
      setBeat((b) => !b)
      if (ctx) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.frequency.value = n % 4 === 1 ? 880 : 440
        gain.gain.setValueAtTime(0.12, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)
        osc.connect(gain).connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.07)
      }
    }, 60000 / bpm)
    return () => clearInterval(tickRef.current)
  }, [running, bpm])

  useEffect(() => () => {
    clearInterval(tickRef.current)
    clearInterval(recTimerRef.current)
    audioRef.current?.close?.()
    mediaRef.current?.stream?.getTracks?.().forEach((t) => t.stop())
  }, [])

  if (!star || !crit) return null

  const critIdx = star.criteria.indexOf(crit)

  const seal = () => {
    if (sealed) return
    setSealed(true)
    setRunning(false)
    dispatch({ type: 'sealCriterion', starId: star.id, critId: crit.id, note: `${target}/${target} clean at ${bpm} BPM` })
  }

  const clean = () => {
    if (sealed) return
    const nextReps = reps + 1
    const nextCombo = combo + 1
    setReps(nextReps)
    setCombo(nextCombo)
    setBest((b) => Math.max(b, nextCombo))
    if (nextReps >= target || nextCombo >= COMBO_TO_SEAL) seal()
  }

  const slip = () => {
    if (!sealed) setCombo(0)
  }

  // recorder -------------------------------------------------------------
  const toggleRecord = async () => {
    if (recState === 'recording') {
      mediaRef.current?.stop()
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRef.current = mr
      mr.onstop = () => {
        clearInterval(recTimerRef.current)
        stream.getTracks().forEach((t) => t.stop())
        setRecState('done')
        setRecSecs((s) => {
          dispatch({ type: 'attachRecording', starId: star.id, duration: s })
          return s
        })
      }
      mr.start()
      setRecSecs(0)
      setRecState('recording')
      recTimerRef.current = setInterval(() => setRecSecs((s) => s + 1), 1000)
    } catch {
      setRecState('unavailable')
    }
  }

  // after sealing: where next?
  const recAfter = recOf(prog, star.id)
  const ready = requiredDone(star, recAfter)
  const closerSong = songsUnlockedBy(sky, star.id)[0]

  const R = 96
  const CIRC = 2 * Math.PI * R
  const frac = Math.min(1, reps / target)

  return (
    <div className="screen screen--room starfield">
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate(`/star/${star.id}`)}>‹</button>
        <span style={{ fontSize: 10.5, letterSpacing: 2, color: 'var(--sub)' }}>
          {star.name.toUpperCase()} · CRITERION {critIdx + 1} OF {star.criteria.length}
        </span>
        <span className="topbar-menu">⋯</span>
      </div>

      <div className="room-title pad">
        <div className="display" style={{ fontSize: 24, lineHeight: 1.3 }}>{crit.text}</div>
        <div style={{ fontSize: 12, color: 'var(--sub)' }}>
          {sealed ? 'Sealed ✦ — this criterion is yours.' : 'Hit the goal once and this criterion seals itself.'}
        </div>
      </div>

      {/* dial */}
      <div className="room-dial">
        <svg viewBox="0 0 220 220" style={{ width: 220, height: 220 }}>
          <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" />
          <circle
            cx="110" cy="110" r={R} fill="none"
            stroke={sealed ? '#FFD98E' : '#7DE3FF'} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${CIRC * frac} ${CIRC}`}
            transform="rotate(-90 110 110)"
            style={{ filter: `drop-shadow(0 0 8px ${sealed ? 'rgba(255,217,142,.6)' : 'rgba(125,227,255,.6)'})`, transition: 'stroke-dasharray .3s ease' }}
          />
          <circle cx="110" cy="110" r="78" fill="rgba(20,26,52,.8)" />
          <text x="110" y="100" fill="#EAEFFF" fontSize="40" textAnchor="middle" fontFamily="Marcellus,serif">{reps}</text>
          <text x="110" y="124" fill="#8A94B8" fontSize="11" textAnchor="middle" letterSpacing="2">OF {target} CLEAN</text>
          <text x="110" y="146" fill={sealed ? '#FFD98E' : '#7DE3FF'} fontSize="12" textAnchor="middle">♩ {bpm} BPM</text>
        </svg>
        {running && <div className={`room-beat${beat ? ' room-beat--on' : ''}`} />}
      </div>

      {/* combo meter */}
      <div className="pad" style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <span style={{ letterSpacing: 2, color: 'var(--sub)' }}>STREAK</span>
          <span style={{ color: 'var(--pink-text)', fontWeight: 600 }}>×{combo} — best this session ×{best}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: COMBO_TO_SEAL }).map((_, i) => (
            <div key={i} className={`combo-seg${i < combo ? ' combo-seg--on' : ''}`} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{COMBO_TO_SEAL} clean in a row seals it early ✦</div>
      </div>

      {/* rep buttons */}
      <div className="pad" style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button className="cta cta--cyan" style={{ flex: 2 }} onClick={clean} disabled={sealed}>
          Clean pass ✓
        </button>
        <button className="cta cta--ghost" style={{ flex: 1 }} onClick={slip} disabled={sealed}>
          Slipped ✕
        </button>
      </div>

      {/* metronome + recorder */}
      <div className="pad" style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <div className="room-tool">
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--sub)' }}>METRONOME</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="room-bpm-btn" onClick={() => setBpm((b) => Math.max(30, b - 6))}>−</button>
            <span className="display" style={{ fontSize: 20 }}>{bpm}</span>
            <button className="room-bpm-btn" onClick={() => setBpm((b) => Math.min(220, b + 6))}>+</button>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--cyan)' }}>
            {crit.bpm ? `passes at ${crit.bpm} → try ${crit.bpm + 6}` : 'find a tempo that stays honest'}
          </div>
        </div>
        <div className="room-tool room-tool--rec">
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--sub)' }}>RECORDER</div>
          <button className={`room-rec-btn${recState === 'recording' ? ' room-rec-btn--live' : ''}`} onClick={toggleRecord}>
            <span className="room-rec-dot" />
          </button>
          <div style={{ fontSize: 10.5, color: 'var(--sub)' }}>
            {recState === 'recording' ? `recording · 0:${String(recSecs).padStart(2, '0')}`
              : recState === 'done' ? `captured · 0:${String(recSecs).padStart(2, '0')} ✓`
              : recState === 'unavailable' ? 'mic unavailable'
              : 'capture your pass'}
          </div>
        </div>
      </div>

      <div className="pad" style={{ marginTop: 16 }}>
        <div className="banner banner--gold" style={{ fontSize: 12 }}>
          <span style={{ color: 'var(--gold)' }}>✦</span>
          <span>
            {sealed && ready ? (
              <>All criteria met — <span style={{ color: 'var(--gold-hi)' }}>{star.name}</span> is ready for its honest look.</>
            ) : (
              <>
                When you hit {target}, <span style={{ color: 'var(--gold-hi)' }}>{star.name}</span> moves a criterion closer to ignition
                {closerSong && <> — and <span style={{ color: 'var(--pink-text)' }}>{closerSong.title}</span> moves one star closer</>}.
              </>
            )}
          </span>
        </div>
      </div>

      <div className="node-footer pad">
        {sealed ? (
          ready ? (
            <button className="cta cta--gold" onClick={() => navigate(`/star/${star.id}/evaluate`)}>
              Ignite this star ✦
            </button>
          ) : (
            <button
              className="cta cta--cyanfill"
              onClick={() => {
                const nextId = pickCritId(recOf(prog, star.id))
                const nextCrit = star.criteria.find((c) => c.id === nextId)
                setCritId(nextId)
                setBpm(nextCrit?.bpm || 60)
                setReps(0)
                setCombo(0)
                setSealed(false)
              }}
            >
              Next criterion · ♩ {bpm}
            </button>
          )
        ) : (
          <button className="cta cta--cyanfill" onClick={() => setRunning((v) => !v)}>
            {running ? 'Pause drill' : `${reps > 0 ? 'Resume' : 'Start'} drill · ♩ ${bpm}`}
          </button>
        )}
        <button className="quiet" onClick={() => navigate(`/star/${star.id}`)}>back to the star</button>
      </div>
    </div>
  )
}
