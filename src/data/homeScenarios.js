export const homeScenarios = [
  {
    tag: 'Entrevista',
    icon: '💼',
    text: 'O recrutador pede: "Me fale sobre você em um minuto." Vai!',
    hint: 'Presente → trajetória → para onde quer ir. Três frases bastam.',
    tech: [
      'Estrutura',
      'Passado–Presente–Futuro',
      'Conte quem você é hoje, um marco que te trouxe até aqui e onde quer chegar. Essa linha do tempo dá começo, meio e fim sem você decorar nada.',
    ],
  },
  {
    tag: 'Reunião',
    icon: '🗣️',
    text: 'Você discorda da ideia que todos estão elogiando. Levante sua objeção com respeito.',
    hint: 'Reconheça o ponto bom antes de discordar. "Concordo com X, e me preocupa Y."',
    tech: [
      'Diplomacia',
      'Sim, e… (em vez de "mas")',
      'Validar antes de contrapor desarma a defensiva. Troque o "mas" por "e" e a sala te escuta em vez de se fechar.',
    ],
  },
  {
    tag: 'Apresentação',
    icon: '🎤',
    text: 'Você tem 30 segundos pra abrir uma apresentação e prender a atenção da sala. Comece.',
    hint: 'Abra com uma pergunta, um dado que choca ou uma mini-história. Nunca com "então, é o seguinte".',
    tech: [
      'Abertura',
      'O gancho dos 10 segundos',
      'As primeiras frases decidem se prestam atenção. Comece por uma pergunta, um número surpreendente ou uma cena — o "boa tarde, meu nome é" pode vir depois.',
    ],
  },
  {
    tag: 'Networking',
    icon: '🤝',
    text: 'Numa roda de profissionais, alguém pergunta: "E você, com o que trabalha?" Responda de um jeito memorável.',
    hint: 'Diga o problema que você resolve, não só o cargo. "Ajudo X a conseguir Y."',
    tech: [
      'Pitch pessoal',
      'Venda o resultado, não o cargo',
      '"Sou analista" fecha a conversa. "Ajudo lojas a vender mais online" abre. Fale do impacto que você gera e o outro pergunta mais.',
    ],
  },
  {
    tag: 'Improviso',
    icon: '⚡',
    text: 'Te chamam pra "dizer algumas palavras" sem aviso. Fale 30 segundos sobre por que comunicação importa.',
    hint: 'Uma ideia só, bem dita, vence cinco ideias atropeladas. Escolha um ângulo e segure nele.',
    tech: [
      'Improviso',
      'Uma ideia, três frases',
      'Sob pressão, não tente dizer tudo. Escolha UM ponto, dê um exemplo e feche. Foco é o que separa o improviso elegante do desespero.',
    ],
  },
  {
    tag: 'Feedback',
    icon: '💬',
    text: 'Você precisa dar um feedback difícil a um colega. Diga a primeira frase em voz alta.',
    hint: 'Fato observável, não rótulo. "Notei que o relatório atrasou" em vez de "você é desorganizado".',
    tech: [
      'Feedback',
      'Fato, impacto, pedido',
      'Descreva o que viu, o efeito que teve e o que você pede daqui pra frente. Tira o julgamento e mantém a conversa adulta.',
    ],
  },
  {
    tag: 'Pergunta difícil',
    icon: '🎯',
    text: 'No meio da sua fala, alguém faz uma pergunta que você não sabe responder. Reaja em voz alta.',
    hint: 'Admitir com elegância passa mais confiança do que inventar. Ganhe tempo com uma boa devolução.',
    tech: [
      'Sob pressão',
      'Honestidade ancorada',
      '"Ótima pergunta, não tenho o dado agora, mas te trago até amanhã." Admitir com plano de ação preserva sua credibilidade muito mais do que um chute.',
    ],
  },
  {
    tag: 'Storytelling',
    icon: '📖',
    text: 'Conte em 40 segundos uma situação em que você aprendeu algo importante. Fale agora.',
    hint: 'Situação → tensão → virada → aprendizado. Toda boa história tem um momento em que algo muda.',
    tech: [
      'Narrativa',
      'O arco em quatro tempos',
      'Contexto, conflito, virada e lição. É o esqueleto de toda história que prende — e funciona até pra um caso de trabalho de 40 segundos.',
    ],
  },
  {
    tag: 'Telefone',
    icon: '📞',
    text: 'Você vai ligar pra remarcar um compromisso importante. Diga a abertura da ligação em voz alta.',
    hint: 'Identifique-se, diga o motivo em uma frase e já proponha a solução. Sem rodeio.',
    tech: [
      'Objetividade',
      'Quem–Porquê–Proposta',
      'No telefone o outro não te vê: seja claríssima. Nome, motivo e o que você propõe, nessa ordem, nos primeiros 10 segundos.',
    ],
  },
  {
    tag: 'Persuasão',
    icon: '🔑',
    text: 'Convença alguém em 30 segundos a experimentar algo de que você gosta. Comece.',
    hint: 'Fale do benefício pra ELA, não do que você acha legal. Comece pelo "isso te ajuda a…".',
    tech: [
      'Persuasão',
      'O benefício do outro primeiro',
      'Ninguém se move pelo seu entusiasmo, e sim pelo que ganha. Abra pelo que a pessoa resolve ou sente, e só depois explique o "o quê".',
    ],
  },
  {
    tag: 'Resumo',
    icon: '✂️',
    text: 'Explique o que você faz/estuda pra uma criança de 8 anos. Fale em voz alta.',
    hint: 'Sem jargão. Use comparação com algo do cotidiano. Se a criança entende, qualquer adulto entende.',
    tech: [
      'Clareza',
      'O teste da criança de 8 anos',
      'Se você consegue explicar sem termos técnicos e com uma analogia simples, você domina o assunto de verdade. Clareza é o ápice, não o atalho.',
    ],
  },
]

// computeGain/feedbackFor now take the Autofeedback questionnaire's total
// points (0-60, see src/data/autofeedback.js) instead of a checkbox count.
export function homeComputeGain(autofeedbackPoints) {
  return 20 + autofeedbackPoints
}

export function homeFeedbackFor(points) {
  if (points >= 50) return 'Mandou muito bem! Quando quase tudo flui, é sinal de que o treino tá pegando. Bora subir a dificuldade.'
  if (points >= 30) return 'Bom progresso! Você acertou pontos importantes — repita o desafio focando no que faltou.'
  if (points >= 10) return 'Todo começo conta. Cada resposta honesta já é mais do que ficar calada. A próxima vem mais solta.'
  return 'Falar é o primeiro passo, e você deu. Sem cobrança: repita o mesmo desafio e veja a diferença.'
}
