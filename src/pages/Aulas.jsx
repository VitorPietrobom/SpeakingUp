import TopNav from '../components/TopNav.jsx'
import Footer from '../components/Footer.jsx'
import { trilhas } from '../data/trilhas.js'
import './Aulas.css'

export default function Aulas() {
  return (
    <div className="su-page">
      <TopNav />

      <section className="su-aulas-hero">
        <div className="su-wrap su-aulas-hero-inner">
          <span className="su-eyebrow">Aulas</span>
          <h1>As habilidades que te fazem falar com confiança.</h1>
          <p>
            Cada trilha junta aulas curtas e práticas sobre um pilar da comunicação — da estrutura da fala ao
            controle do nervosismo. Comece pela que mais te trava hoje.
          </p>
        </div>
      </section>

      <section>
        <div className="su-wrap su-aulas-list-inner">
          <div className="su-aulas-list-head">
            <h2>6 trilhas disponíveis</h2>
            <span>Nível sugerido em cada card · você pode pular a ordem</span>
          </div>
          <div className="su-trilhas">
            {trilhas.map((t) => (
              <div key={t.title} className="su-trilha-card">
                <div className="su-trilha-bar" style={{ background: t.color }} />
                <div className="su-trilha-body">
                  <div className="su-trilha-top">
                    <span className="su-trilha-theme" style={{ color: t.color }}>
                      <span>{t.icon}</span>
                      {t.theme}
                    </span>
                    <span
                      className="su-trilha-level"
                      style={{ color: t.levelColor, background: t.levelBg }}
                    >
                      {t.level}
                    </span>
                  </div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                  <div className="su-trilha-meta">
                    <span>▸ {t.aulas} aulas</span>
                    <span>◷ {t.horas}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
