const LEVEL_STYLE = {
  Iniciante: { levelColor: '#1F8A5B', levelBg: '#EAF7F0' },
  Intermediário: { levelColor: '#8A6A00', levelBg: '#FFF3CF' },
  Avançado: { levelColor: '#C2410C', levelBg: '#FCE8DF' },
}

const RAW = [
  {
    theme: 'Vencer o nervosismo',
    icon: '🌬️',
    color: '#C2410C',
    level: 'Iniciante',
    title: 'Da mão tremendo à voz firme',
    desc: 'Respiração, preparo e técnicas para domar a ansiedade antes de falar — e transformar o frio na barriga em energia.',
    aulas: 5,
    horas: '~1h40',
  },
  {
    theme: 'Estrutura da fala',
    icon: '🧱',
    color: '#0F4C81',
    level: 'Iniciante',
    title: 'Como organizar uma ideia antes de abrir a boca',
    desc: 'Começo, meio e fim em qualquer situação. Frameworks simples para nunca mais se perder no meio da frase.',
    aulas: 7,
    horas: '~2h20',
  },
  {
    theme: 'Presença & voz',
    icon: '🎙️',
    color: '#7A3FB8',
    level: 'Intermediário',
    title: 'Postura, olhar e o poder das pausas',
    desc: 'O que seu corpo diz enquanto você fala. Use voz, ritmo e silêncio a seu favor para prender quem ouve.',
    aulas: 6,
    horas: '~2h00',
  },
  {
    theme: 'Entrevistas & carreira',
    icon: '💼',
    color: '#1F8A5B',
    level: 'Intermediário',
    title: 'Se contar bem em entrevistas e processos',
    desc: 'Do "fale sobre você" às perguntas difíceis. Construa respostas que mostram seu valor sem soar decoradas.',
    aulas: 6,
    horas: '~2h10',
  },
  {
    theme: 'Argumentação',
    icon: '🎯',
    color: '#B8860B',
    level: 'Avançado',
    title: 'Defender uma ideia e discordar com elegância',
    desc: 'Estruture argumentos sólidos, responda a objeções e diga "não concordo" sem brigar. Comunicação que convence.',
    aulas: 7,
    horas: '~2h40',
  },
  {
    theme: 'Storytelling',
    icon: '📖',
    color: '#0EA5A5',
    level: 'Iniciante',
    title: 'Contar histórias que ninguém esquece',
    desc: 'Por que história engaja mais que dado solto — e como usar narrativa em apresentações, pitches e no dia a dia.',
    aulas: 5,
    horas: '~1h50',
  },
]

// Editors (Firestore docs) only set `level`; the badge colors derive from it.
export function applyLevelStyle(t) {
  return { ...(LEVEL_STYLE[t.level] || LEVEL_STYLE.Iniciante), ...t }
}

export const trilhas = RAW.map(applyLevelStyle)
