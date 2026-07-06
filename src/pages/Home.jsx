import TopNav from '../components/TopNav.jsx'
import Footer from '../components/Footer.jsx'
import SpeakingGame from '../components/SpeakingGame.jsx'
import Avatar from '../components/Avatar.jsx'
import { team } from '../data/team.js'
import { homeScenarios, homeCheckLabels, homeComputeGain, homeFeedbackFor } from '../data/homeScenarios.js'
import './Home.css'

const EQ_BARS = [
  { dur: '1.1s', delay: '0s', color: 'var(--su-yellow)' },
  { dur: '0.9s', delay: '0.15s', color: '#7fa8d9' },
  { dur: '1.3s', delay: '0.3s', color: 'var(--su-yellow)' },
  { dur: '0.8s', delay: '0.05s', color: '#7fa8d9' },
  { dur: '1.0s', delay: '0.25s', color: '#ffffff' },
  { dur: '1.2s', delay: '0.4s', color: 'var(--su-yellow)' },
  { dur: '0.95s', delay: '0.1s', color: '#7fa8d9' },
  { dur: '1.15s', delay: '0.35s', color: '#ffffff' },
  { dur: '0.85s', delay: '0.2s', color: 'var(--su-yellow)' },
]

const FEATURES = [
  {
    bg: '#EAF0FA',
    icon: '🎮',
    title: 'Jogos interativos',
    desc: 'Desenvolvem o pensamento rápido e a fala espontânea — como o Jogo Rápido de Fala aqui embaixo.',
  },
  {
    bg: '#FCF2D6',
    icon: '📈',
    title: 'Auto-feedback',
    desc: 'Você mesma acompanha a sua evolução, rodada após rodada, sem ninguém te julgando.',
  },
  {
    bg: '#EAF7F0',
    icon: '🎬',
    title: 'Videoaulas & textos',
    desc: 'Focados nas principais dificuldades de quem está aprendendo a falar em público.',
  },
]

const gameIntro = {
  title: 'Bora destravar a fala?',
  description:
    'Você recebe um desafio do dia a dia profissional, tem alguns segundos pra montar a ideia e fala em voz alta. No fim, marca o que foi bem e leva uma técnica nova. Quanto mais honesta na reflexão, mais você evolui.',
  steps: ['1 · Pense', '2 · Fale em voz alta', '3 · Reflita & evolua'],
  buttonLabel: 'Começar jogo →',
  footnote: '11 desafios reais • feito pra fazer sozinha, em qualquer lugar',
}

export default function Home() {
  return (
    <div className="su-page">
      <TopNav />

      <section className="su-hero-section">
        <div className="su-wrap su-hero-inner">
          <div className="su-hero-grid">
            <div>
              <span className="su-eyebrow-pill">
                <span className="su-eyebrow-dot" />
                Uma iniciativa de alunos, para alunos
              </span>
              <h1 className="su-hero-title">
                Sua ideia é boa.
                <br />
                <span className="su-hero-title-accent">Que tal dizê-la bem?</span>
              </h1>
              <p className="su-hero-copy">
                A escola quase não ensina a falar em público — e isso trava gente boa na hora que mais importa. A
                Speaking UP nasceu para mudar isso: uma iniciativa{' '}
                <strong className="su-strong-ink">pensada por alunos, para alunos</strong>, que ajuda jovens a
                desenvolver a comunicação para os estudos, a vida e o mercado de trabalho.
              </p>
              <div className="su-hero-ctas">
                <a href="/aulas" className="su-hero-cta-primary">
                  Comece agora a aprender <span>→</span>
                </a>
                <a href="#jogo" className="su-hero-cta-secondary">
                  <span className="su-eyebrow-dot" /> Jogar o Jogo Rápido
                </a>
              </div>
              <div className="su-hero-trust">
                <span>
                  <span className="su-check-mark">✓</span> Prática de verdade
                </span>
                <span>
                  <span className="su-check-mark">✓</span> Sem julgamento
                </span>
                <span>
                  <span className="su-check-mark">✓</span> No seu ritmo
                </span>
              </div>
            </div>

            <div className="su-voice-graphic-wrap">
              <div className="su-voice-graphic">
                <div className="su-voice-card">
                  <span className="su-voice-card-label">Você, com voz</span>
                  <p className="su-voice-card-quote">
                    "Posso falar
                    <br />
                    uma coisa?"
                  </p>
                  <div className="su-voice-eq">
                    {EQ_BARS.map((bar, i) => (
                      <span
                        key={i}
                        style={{ background: bar.color, animationDuration: bar.dur, animationDelay: bar.delay }}
                      />
                    ))}
                  </div>
                  <div className="su-voice-tail" />
                </div>
              </div>
              <span className="su-voice-chip su-voice-chip-1">🎤 Apresentações</span>
              <span className="su-voice-chip su-voice-chip-2">💼 Entrevistas</span>
              <span className="su-voice-chip su-voice-chip-3">🗣️ Reuniões</span>
            </div>
          </div>
        </div>
      </section>

      <section className="su-features-section">
        <div className="su-wrap su-features-inner">
          <div className="su-features-head">
            <span className="su-eyebrow">O que você encontra aqui</span>
            <h2>Aprender falando, no jeito da nossa geração.</h2>
            <p>Percebemos que o jovem de hoje aprende melhor de forma interativa. Por isso a plataforma junta três coisas:</p>
          </div>
          <div className="su-obj-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="su-feature-card">
                <div className="su-feature-icon" style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="jogo" className="su-game-section">
        <div className="su-wrap su-game-section-inner">
          <div className="su-game-head">
            <span className="su-eyebrow">Feature interativa</span>
            <h2>Jogo Rápido de Fala</h2>
            <p>
              Um desafio real de comunicação, segundos pra pensar e o convite: <strong className="su-strong-ink">fale em voz alta</strong>.
              Depois você reflete sobre como foi e leva uma técnica pra mandar melhor. Sem microfone, sem julgamento — só treino.
            </p>
          </div>
          <SpeakingGame
            scenarios={homeScenarios}
            prepTime={12}
            speakTime={40}
            checkLabels={homeCheckLabels}
            computeGain={homeComputeGain}
            feedbackFor={homeFeedbackFor}
            intro={gameIntro}
          />
        </div>
      </section>

      <section className="su-team-section">
        <div className="su-wrap su-team-inner">
          <div className="su-team-intro">
            <span className="su-eyebrow">Quem somos nós</span>
            <h2>Feito por alunos, para alunos.</h2>
            <p>
              Somos uma iniciativa pensada por alunos para alunos, com o objetivo de ajudar a melhorar a comunicação
              pública e formal — pensando nos ambientes estudantis e no ingresso no mercado de trabalho. Tudo num
              ambiente seguro e de fácil acesso.
            </p>
          </div>

          <h3 className="su-team-subhead">Quem faz acontecer</h3>
          <div className="su-collab-grid">
            {team.map((m) => (
              <div key={m.name} className="su-collab-card">
                <div className="su-collab-photo">
                  <Avatar photo={m.photo} name={m.name} size={96} />
                </div>
                <h4>{m.name}</h4>
                <p className="su-collab-role">{m.role}</p>
                <p className="su-collab-quote">"{m.quote}"</p>
              </div>
            ))}
          </div>
          <p className="su-contact-line">
            Quer falar com a gente?{' '}
            <a href="mailto:speakingup.communication@gmail.com" className="su-contact-link">
              speakingup.communication@gmail.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
