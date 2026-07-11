import TopNav from '../components/TopNav.jsx'
import Footer from '../components/Footer.jsx'
import Avatar from '../components/Avatar.jsx'
import { team } from '../data/team.js'
import { formats } from '../data/treinoScenarios.js'
import './Organizacao.css'

const STATS = [
  { num: '21', label: 'desafios de fala no Jogo Rápido' },
  { num: String(formats.length), label: 'exercícios guiados de oratória' },
  { num: String(team.length), label: 'alunas na equipe, por alunos para alunos' },
  { num: '0', label: 'julgamento quando você erra treinando' },
]

const VALUES = [
  {
    num: '01',
    title: 'Falar é habilidade, não dom',
    desc: 'Ninguém nasce sabendo se apresentar. Como toda habilidade, comunicação se aprende com método e prática.',
    bg: '#EEF3FF',
    color: '#0F4C81',
  },
  {
    num: '02',
    title: 'Errar faz parte do treino',
    desc: 'Aqui o erro é combustível. Um espaço onde travar, gaguejar e recomeçar é não só permitido — é esperado.',
    bg: '#FFF3CF',
    color: '#8A6A00',
  },
  {
    num: '03',
    title: 'Prática acima de teoria',
    desc: 'Você não aprende a nadar lendo sobre natação. Por isso colocamos você pra falar desde o primeiro minuto.',
    bg: '#EAF7F0',
    color: '#1F8A5B',
  },
  {
    num: '04',
    title: 'Acessível pra todo mundo',
    desc: 'Nada de jargão de coach ou preço de curso caro. Comunicação qualificada é um direito, não um luxo.',
    bg: '#FCE8DF',
    color: '#C2410C',
  },
]

export default function Organizacao() {
  return (
    <div className="su-page">
      <TopNav />

      <section className="su-org-hero">
        <div className="su-wrap su-org-hero-inner">
          <span className="su-eyebrow">Organização · Quem somos</span>
          <h1>A escola te ensina a escrever. Quase ninguém te ensina a falar.</h1>
          <p>
            Diante da desvalorização do tema na educação brasileira, a Speaking UP nasceu para difundir a
            importância da comunicação qualificada no ambiente profissional — com foco nos obstáculos que os jovens
            enfrentam ao falar em público.
          </p>
        </div>
      </section>

      <section>
        <div className="su-wrap su-org-story-inner">
          <div className="su-story">
            <div>
              <span className="su-org-mission-eyebrow">Nossa missão</span>
              <h2>Começou com uma pergunta: por que dá tanto medo falar em público?</h2>
              <p>
                O projeto nasceu para entender os motivos biológicos e sociais por trás do medo — ou do anseio — de
                falar em público. Foi aí que decidimos criar um site e uma série de aulas para ajudar os jovens da
                nossa geração, já que o treino da fala é tão negligenciado pelas escolas no Brasil e, ao mesmo tempo,
                tão essencial para o nosso futuro.
              </p>
              <p>
                Somos uma iniciativa pensada por alunos, para alunos. Temos uma série de metas que você pode ajudar a
                construir — num ambiente seguro e de fácil acesso, tudo o que queremos é ajudar a construir um futuro
                melhor para você e para o nosso planeta.
              </p>
            </div>
            <div className="su-stats-card">
              <div className="su-stats-dots" />
              <div className="su-stats-grid">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="su-stats-num">{s.num}</div>
                    <p>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="su-values-section">
        <div className="su-wrap su-values-inner">
          <h2>No que a gente acredita</h2>
          <p>Quatro princípios que guiam tudo o que fazemos.</p>
          <div className="su-values">
            {VALUES.map((v) => (
              <div key={v.num} className="su-value-card">
                <div className="su-value-num" style={{ background: v.bg, color: v.color }}>
                  {v.num}
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="su-wrap su-org-team-inner">
          <span className="su-eyebrow">A equipe</span>
          <h2>Quem faz a Speaking UP</h2>
          <p className="su-org-team-lead">
            Duas fundadoras, unidas pela mesma vontade: que nenhum jovem perca uma oportunidade por não saber se
            expressar.
          </p>
          <div className="su-team">
            {team.map((m) => (
              <div key={m.name} className="su-team-card">
                <div className="su-team-photo">
                  <Avatar photo={m.photo} name={m.name} size={84} />
                </div>
                <div>
                  <h3>{m.name}</h3>
                  <p className="su-team-role">{m.role}</p>
                  <p className="su-team-bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="su-contact-line">
            Fale com a gente:{' '}
            <a href="mailto:speakingup.communication@gmail.com" className="su-contact-link">
              speakingup.communication@gmail.com
            </a>
          </p>
        </div>
      </section>

      <section className="su-quote-section">
        <div className="su-wrap su-quote-inner">
          <p>
            "As melhores oportunidades vão para quem consegue dizer o que pensa. A gente quer que esse alguém seja
            você."
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
