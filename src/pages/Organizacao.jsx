import TopNav from '../components/TopNav.jsx'
import Footer from '../components/Footer.jsx'
import Avatar from '../components/Avatar.jsx'
import { team } from '../data/team.js'
import { formats } from '../data/treinoScenarios.js'
import './Organizacao.css'

const STATS = [
  { num: '21', label: 'desafios de fala no Jogo Rápido' },
  { num: String(formats.length), label: 'exercícios guiados de oratória' },
  { num: String(team.length), label: 'alunas na equipe, por jovens para jovens' },
  { num: '0', label: 'julgamento quando você erra treinando' },
]

const VALUES = [
  {
    num: '01',
    title: 'A fala se aprimora com o treinamento contínuo',
    desc: 'Ninguém nasce sabendo apresentar. Como toda habilidade, a comunicação exige prática constante e se aprimora de forma gradual.',
    bg: '#EEF3FF',
    color: '#0F4C81',
  },
  {
    num: '02',
    title: 'Um bom profissional é aquele que sabe se comunicar',
    desc: 'A comunicação é a base das relações humanas, inclusive no mercado de trabalho. Não importa a área profissional, pessoas que sabem expressar suas ideias e negociar bem serão valorizadas por isso.',
    bg: '#FFF3CF',
    color: '#8A6A00',
  },
  {
    num: '03',
    title: 'Os seus pensamentos são seus maiores inimigos',
    desc: '"E se as pessoas julgarem minha fala?". Ficar se preocupando com a opinião alheia gera estresse e prejudica seu raciocínio e autoconfiança.',
    bg: '#EAF7F0',
    color: '#1F8A5B',
  },
  {
    num: '04',
    title: 'Acessível e seguro para todos',
    desc: 'O treinamento da comunicação e a liberdade para errar devem estar ao alcance de todos.',
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
          <h1>A escola te ensina a ter ideias. Quase ninguém te ensina a comunicá-las para os outros.</h1>
          <p>
            Diante da desvalorização da comunicação na educação brasileira, a Speaking UP nasceu para difundir a
            importância do tema para a estabilidade emocional e o ambiente profissional. Nosso trabalho foca nas
            principais dificuldades que os jovens enfrentam ao falar em público.
          </p>
        </div>
      </section>

      <section>
        <div className="su-wrap su-org-story-inner">
          <div className="su-story">
            <div>
              <span className="su-org-mission-eyebrow">Nossa missão</span>
              <h2>Tudo começou com uma pergunta: por que temos tanto medo de falar em público?</h2>
              <p>
                A iniciativa nasceu para compreender os motivos sociais e psicológicos por trás das dificuldades em
                falar em público. Ao percebermos que a prática da comunicação é importante para o futuro de qualquer
                um, porém negligenciada pelas escolas brasileiras, decidimos criar uma plataforma acessível de
                aprendizado, treinamento e desenvolvimento.
              </p>
              <p>
                A Speaking UP foi desenvolvida por jovens para jovens. Nossa missão é te acompanhar na construção de
                um futuro melhor para você e, assim, para o nosso planeta.
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
