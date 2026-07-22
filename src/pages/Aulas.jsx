import { useEffect, useState } from 'react'
import TopNav from '../components/TopNav.jsx'
import Footer from '../components/Footer.jsx'
import { subscribeModules } from '../lib/modules.js'
import './Aulas.css'

export default function Aulas() {
  // undefined = loading, null = unconfigured/unreachable, [] = configured but empty, [...] = modules
  const [modules, setModules] = useState(undefined)

  useEffect(() => subscribeModules(setModules), [])

  const list = modules || []
  const hasModules = Array.isArray(modules) && modules.length > 0

  return (
    <div className="su-page">
      <TopNav />

      <section className="su-aulas-hero">
        <div className="su-wrap su-aulas-hero-inner">
          <span className="su-eyebrow">Aulas</span>
          <h1>As habilidades que te fazem falar com confiança.</h1>
          <p>
            Um aprendizado efetivo é aquele que equilibra qualidade e versatilidade. Por isso, cada módulo explora
            um tema da comunicação por meio de aulas escritas e videoaulas longas e curtas. As aulas também são
            focadas nas principais dificuldades dos jovens e baseadas em pesquisas e experiências de comunicadores.
            Comece agora com o que mais te desafia!
          </p>
        </div>
      </section>

      <section>
        <div className="su-wrap su-aulas-list-inner">
          <div className="su-aulas-list-head">
            <h2>{hasModules ? `${modules.length} módulos disponíveis` : 'Módulos'}</h2>
            <span>Nível sugerido em cada card · você pode pular a ordem</span>
          </div>

          {hasModules ? (
            <div className="su-modules">
              {list.map((m) => (
                <div key={m.id} className="su-module-card">
                  <div className="su-module-bar" style={{ background: m.color }} />
                  <div className="su-module-body">
                    <div className="su-module-top">
                      <span className="su-module-theme" style={{ color: m.color }}>
                        <span>{m.icon}</span>
                        {m.theme}
                      </span>
                      <span className="su-module-level" style={{ color: m.levelColor, background: m.levelBg }}>
                        {m.level}
                      </span>
                    </div>
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                    <div className="su-module-meta">
                      <span>▸ {m.aulas} aulas</span>
                      <span>◷ {m.horas}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="su-modules-empty">
              <p>Novos módulos em breve.</p>
              <p className="su-modules-empty-sub">Estamos preparando o conteúdo — volte em breve para conferir.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
