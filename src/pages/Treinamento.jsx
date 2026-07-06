import TopNav from '../components/TopNav.jsx'
import Footer from '../components/Footer.jsx'
import SpeakingGame from '../components/SpeakingGame.jsx'
import {
  treinoScenarios,
  treinoCheckLabels,
  treinoComputeGain,
  treinoFeedbackFor,
  formats,
} from '../data/treinoScenarios.js'
import './Treinamento.css'

const gameIntro = {
  title: '10 desafios de oratória pra praticar',
  description:
    'Encare situações reais de fala em público, sustente por mais tempo e refine a entrega a cada rodada. O segredo não é talento — é o número de repetições.',
  steps: [],
  buttonLabel: 'Começar treino →',
  footnote: '',
}

export default function Treinamento() {
  return (
    <div className="su-page">
      <TopNav />

      <section className="su-treino-hero">
        <div className="su-treino-hero-dots" />
        <div className="su-wrap su-treino-hero-inner">
          <span className="su-treino-eyebrow">Treinamento</span>
          <h1>Saber a teoria não solta a língua. Treinar, sim.</h1>
          <p>
            Falar bem é repetição. Aqui você pratica em voz alta com rodadas do Jogo Rápido de Fala e exercícios
            guiados de oratória — quantas vezes precisar, sem plateia.
          </p>
        </div>
      </section>

      <section>
        <div className="su-wrap su-treino-game-inner">
          <div className="su-treino-game-head">
            <span className="su-eyebrow">Modo Treino</span>
            <h2>Jogo Rápido de Fala · sessão de oratória</h2>
            <p>
              Mesma mecânica do início, com desafios mais longos pra você{' '}
              <strong className="su-strong-ink">construir o hábito</strong> de pensar rápido e falar com estrutura.
              Pense, fale em voz alta, reflita e leve a técnica.
            </p>
          </div>
          <SpeakingGame
            scenarios={treinoScenarios}
            prepTime={15}
            speakTime={60}
            checkLabels={treinoCheckLabels}
            computeGain={treinoComputeGain}
            feedbackFor={treinoFeedbackFor}
            intro={gameIntro}
          />
        </div>
      </section>

      <section>
        <div className="su-wrap su-formats-inner">
          <h2>Exercícios de oratória</h2>
          <p>Práticas guiadas pra fazer sozinha ou com a turma. Cada uma trabalha um músculo diferente da fala.</p>
          <div className="su-formats">
            {formats.map((f) => (
              <div key={f.title} className="su-format-card">
                <div className="su-format-top">
                  <span className="su-format-icon" style={{ background: f.bg, color: f.color }}>
                    {f.icon}
                  </span>
                  <h3>{f.title}</h3>
                </div>
                <p>{f.desc}</p>
                <span className="su-format-time">◷ {f.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
