import { useEffect, useState } from 'react'
import TopNav from '../components/TopNav.jsx'
import Footer from '../components/Footer.jsx'
import { subscribeModulos } from '../lib/modulos.js'
import './Aulas.css'

export default function Aulas() {
  // undefined = loading, null = unconfigured/unreachable, [] = configured but empty, [...] = módulos
  const [modulos, setModulos] = useState(undefined)

  useEffect(() => subscribeModulos(setModulos), [])

  const list = modulos || []
  const hasModulos = Array.isArray(modulos) && modulos.length > 0

  return (
    <div className="su-page">
      <TopNav />

      <section className="su-aulas-hero">
        <div className="su-wrap su-aulas-hero-inner">
          <span className="su-eyebrow">Aulas</span>
          <h1>As habilidades que te fazem falar com confiança.</h1>
          <p>
            Cada módulo junta aulas curtas e práticas sobre um pilar da comunicação — da estrutura da fala ao
            controle do nervosismo. Comece pelo que mais te trava hoje.
          </p>
        </div>
      </section>

      <section>
        <div className="su-wrap su-aulas-list-inner">
          <div className="su-aulas-list-head">
            <h2>{hasModulos ? `${modulos.length} módulos disponíveis` : 'Módulos'}</h2>
            <span>Nível sugerido em cada card · você pode pular a ordem</span>
          </div>

          {hasModulos ? (
            <div className="su-modulos">
              {list.map((m) => (
                <div key={m.id} className="su-modulo-card">
                  <div className="su-modulo-bar" style={{ background: m.color }} />
                  <div className="su-modulo-body">
                    <div className="su-modulo-top">
                      <span className="su-modulo-theme" style={{ color: m.color }}>
                        <span>{m.icon}</span>
                        {m.theme}
                      </span>
                      <span className="su-modulo-level" style={{ color: m.levelColor, background: m.levelBg }}>
                        {m.level}
                      </span>
                    </div>
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                    <div className="su-modulo-meta">
                      <span>▸ {m.aulas} aulas</span>
                      <span>◷ {m.horas}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="su-modulos-empty">
              <p>Novos módulos em breve.</p>
              <p className="su-modulos-empty-sub">Estamos preparando o conteúdo — volte em breve para conferir.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
