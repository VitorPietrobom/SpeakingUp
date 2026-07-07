import { useEffect, useRef, useState } from 'react'
import { addRound, loadProgress, syncProgress } from '../lib/progress.js'
import './SpeakingGame.css'

function shuffle(n) {
  const a = [...Array(n).keys()]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const RADIUS = 52
const CIRC = 2 * Math.PI * RADIUS

/**
 * Shared "Jogo Rápido de Fala" engine. Both the Home page and the
 * Treinamento page mount this with their own scenario bank / timings /
 * scoring so the phases (intro -> prep -> speak -> reflect -> reveal) and
 * markup stay identical between the two.
 */
export default function SpeakingGame({
  scenarios,
  prepTime,
  speakTime,
  checkLabels,
  computeGain,
  feedbackFor,
  intro,
  persistKey,
}) {
  const [phase, setPhase] = useState('intro')
  const [order, setOrder] = useState(null)
  const [idx, setIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [lastGain, setLastGain] = useState(0)
  const [checks, setChecks] = useState([])
  const [lifetime, setLifetime] = useState(() => (persistKey ? loadProgress(persistKey) : null))
  const timerRef = useRef(null)
  const revealedRef = useRef(false)

  useEffect(() => () => clearInterval(timerRef.current), [])

  useEffect(() => {
    if (!persistKey) return
    let alive = true
    syncProgress(persistKey).then((p) => {
      if (alive) setLifetime(p)
    })
    return () => {
      alive = false
    }
  }, [persistKey])

  const runTimer = (duration, onZero) => {
    clearInterval(timerRef.current)
    setTimeLeft(duration)
    let t = duration
    timerRef.current = setInterval(() => {
      t -= 1
      if (t <= 0) {
        clearInterval(timerRef.current)
        setTimeLeft(0)
        onZero()
      } else {
        setTimeLeft(t)
      }
    }, 1000)
  }

  const start = () => {
    const ord = shuffle(scenarios.length)
    setOrder(ord)
    setIdx(0)
    setScore(0)
    setRounds(0)
    setLastGain(0)
    setChecks([])
    setPhase('prep')
    runTimer(prepTime, toSpeak)
  }

  const toSpeak = () => {
    setPhase('speak')
    runTimer(speakTime, toReflect)
  }

  const toReflect = () => {
    clearInterval(timerRef.current)
    setChecks([])
    revealedRef.current = false
    setPhase('reflect')
  }

  const toggleCheck = (i) => {
    setChecks((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]))
  }

  const reveal = () => {
    // Guard against a double click awarding (and persisting) the round twice.
    if (revealedRef.current) return
    revealedRef.current = true
    const gain = computeGain(checks.length)
    setScore((s) => s + gain)
    setRounds((r) => r + 1)
    setLastGain(gain)
    if (persistKey) setLifetime(addRound(persistKey, gain))
    setPhase('reveal')
  }

  const next = () => {
    const ord = order || shuffle(scenarios.length)
    let nextIdx = idx + 1
    let useOrder = ord
    if (nextIdx >= ord.length) {
      nextIdx = 0
      useOrder = shuffle(scenarios.length)
      // Don't show the scenario that just ended twice in a row across the reshuffle.
      if (useOrder.length > 1 && useOrder[0] === ord[ord.length - 1]) {
        ;[useOrder[0], useOrder[useOrder.length - 1]] = [useOrder[useOrder.length - 1], useOrder[0]]
      }
    }
    setOrder(useOrder)
    setIdx(nextIdx)
    setLastGain(0)
    setChecks([])
    setPhase('prep')
    runTimer(prepTime, toSpeak)
  }

  const currentOrder = order || [...Array(scenarios.length).keys()]
  const sc = scenarios[currentOrder[idx % currentOrder.length]] || scenarios[0]
  const maxForPhase = phase === 'speak' ? speakTime : prepTime
  const pct = Math.max(0, timeLeft) / maxForPhase
  const dash = CIRC * (1 - pct)
  const low = timeLeft <= 4 && (phase === 'prep' || phase === 'speak')
  const ringColor = low ? '#c2410c' : 'var(--su-cobalt)'
  const phaseLabel =
    phase === 'prep' ? 'Prepare-se' : phase === 'speak' ? 'Fale agora' : phase === 'reflect' ? 'Reflita' : 'Sua técnica'

  return (
    <div className="su-game-frame">
      <div className="su-game-card">
        {phase === 'intro' && (
          <div className="su-game-intro">
            <div className="su-game-intro-icon">🗣️</div>
            <h3>{intro.title}</h3>
            <p>{intro.description}</p>
            {intro.steps && intro.steps.length > 0 && (
              <div className="su-game-steps">
                {intro.steps.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
            )}
            {lifetime && lifetime.rounds > 0 && (
              <p className="su-game-lifetime">
                Seu histórico: <strong>{lifetime.score}</strong> pontos de voz em{' '}
                <strong>{lifetime.rounds}</strong> {lifetime.rounds === 1 ? 'rodada' : 'rodadas'}
              </p>
            )}
            <button onClick={start} className="su-btn-primary su-game-start">
              {intro.buttonLabel}
            </button>
            {intro.footnote && <p className="su-game-footnote">{intro.footnote}</p>}
          </div>
        )}

        {phase !== 'intro' && (
          <div>
            <div className="su-game-topbar">
              <span className="su-game-tag">
                <span>{sc.icon}</span>
                {sc.tag}
              </span>
              <div className="su-game-meta">
                <div className="su-game-score">
                  <div className="su-game-score-num">{score}</div>
                  <div className="su-game-score-label">pontos de voz</div>
                </div>
                <div className="su-game-ring">
                  <svg viewBox="0 0 130 130">
                    <circle cx="65" cy="65" r={RADIUS} fill="none" stroke="#eff1f6" strokeWidth="11" />
                    <circle
                      cx="65"
                      cy="65"
                      r={RADIUS}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="11"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      strokeDashoffset={dash}
                    />
                  </svg>
                  <div className="su-game-ring-time" role="timer" aria-label="Segundos restantes" style={{ color: ringColor }}>
                    {Math.max(0, timeLeft)}
                  </div>
                </div>
              </div>
            </div>

            <div className="su-game-challenge">
              <span className="su-game-challenge-label">
                Desafio {rounds + 1} · {phaseLabel}
              </span>
              <p className="su-game-challenge-text">{sc.text}</p>
              <p className="su-game-challenge-hint">
                <strong>Dica de preparo:</strong> {sc.hint}
              </p>
            </div>

            {phase === 'prep' && (
              <div className="su-game-prep">
                <p className="su-game-prep-title">Respire e monte a ideia na cabeça…</p>
                <p className="su-game-prep-sub">Quando estiver pronta, comece a falar. Não precisa estar perfeito.</p>
                <button onClick={toSpeak} className="su-btn-primary">
                  Estou pronta — falar agora 🎙️
                </button>
              </div>
            )}

            {phase === 'speak' && (
              <div className="su-game-speak">
                <span className="su-game-live">
                  <span className="su-game-dot" /> No ar — fale em voz alta
                </span>
                <div className="su-game-eq">
                  {[0.7, 0.9, 0.6, 1.0, 0.75, 0.85, 0.65].map((dur, i) => (
                    <span
                      key={i}
                      style={{
                        animationDuration: `${dur}s`,
                        animationDelay: `${(i * 0.07).toFixed(2)}s`,
                        background: i % 3 === 0 ? 'var(--su-yellow)' : i % 3 === 1 ? '#ffffff' : '#7fa8d9',
                      }}
                    />
                  ))}
                </div>
                <p className="su-game-speak-sub">Vai até o tempo acabar ou clique quando terminar.</p>
                <button onClick={toReflect} className="su-btn-yellow">
                  Terminei de falar ✓
                </button>
              </div>
            )}

            {phase === 'reflect' && (
              <div className="su-game-reflect-wrap">
                <p className="su-game-reflect-title">Como foi? Marque o que rolou:</p>
                <p className="su-game-reflect-sub">Seja honesta — cada acerto vale ponto, e a reflexão é onde o aprendizado gruda.</p>
                <div className="su-reflect">
                  {checkLabels.map((label, i) => {
                    const on = checks.includes(i)
                    return (
                      <button
                        key={label}
                        onClick={() => toggleCheck(i)}
                        aria-pressed={on}
                        className={`su-check${on ? ' on' : ''}`}
                      >
                        <span className="su-check-box">{on ? '✓' : ''}</span>
                        <span>{label}</span>
                      </button>
                    )
                  })}
                </div>
                <button onClick={reveal} className="su-btn-primary su-game-reveal-btn">
                  Ver minha técnica do dia →
                </button>
              </div>
            )}

            {phase === 'reveal' && (
              <div className="su-game-reveal">
                <div className="su-game-feedback">
                  <span className="su-game-gain">+{lastGain}</span>
                  <p>{feedbackFor(checks.length)}</p>
                </div>
                <div className="su-game-technique">
                  <span className="su-game-technique-label">Técnica · {sc.tech[0]}</span>
                  <p className="su-game-technique-title">{sc.tech[1]}</p>
                  <p className="su-game-technique-text">{sc.tech[2]}</p>
                </div>
                <div className="su-game-footer">
                  <div className="su-game-stats">
                    Rodadas: <strong>{rounds}</strong> · Voz acumulada: <strong>{score}</strong>
                  </div>
                  <button onClick={next} className="su-btn-primary">
                    Próximo desafio →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
