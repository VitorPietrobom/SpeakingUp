export const treinoScenarios = [
  {
    tag: 'Apresentação',
    icon: '🎤',
    text: 'Apresente um projeto (real ou inventado) em 1 minuto, como se a sala decidisse aprová-lo. Comece.',
    hint: 'Problema → solução → por que agora. Termine pedindo algo concreto.',
    tech: [
      'Pitch',
      'Problema–Solução–Pedido',
      'Toda apresentação que convence segue esse trio: mostre a dor, apresente sua resposta e feche com um pedido claro. Sem pedido, vira só informação.',
    ],
  },
  {
    tag: 'Reunião',
    icon: '🗣️',
    text: 'Você precisa interromper educadamente uma reunião que saiu do trilho e retomar o foco. Fale.',
    hint: 'Reconheça, redirecione, proponha. "Ótimos pontos — pra fecharmos no horário, podemos voltar a X?"',
    tech: [
      'Condução',
      'Reconhecer e redirecionar',
      'Cortar sem atropelar é uma arte: valide o que foi dito, lembre do objetivo e proponha o próximo passo. A sala agradece quem organiza.',
    ],
  },
  {
    tag: 'Improviso',
    icon: '⚡',
    text: 'Defenda em 45 segundos uma opinião impopular sua sobre qualquer tema. Sustente com convicção.',
    hint: 'Uma tese, dois motivos, um exemplo. Convicção mora na estrutura, não no tom de voz.',
    tech: [
      'Argumentação',
      'Tese, motivos, exemplo',
      'Diga sua posição de cara, dê dois porquês e aterrisse num exemplo concreto. Estrutura clara faz qualquer opinião soar firme.',
    ],
  },
  {
    tag: 'Storytelling',
    icon: '📖',
    text: 'Conte uma história de um momento em que você superou um medo. Fale por até 1 minuto.',
    hint: 'Situação → tensão → virada → o que ficou. Deixe a emoção aparecer.',
    tech: [
      'Narrativa',
      'O arco em quatro tempos',
      'Contexto, conflito, virada e lição: o esqueleto de toda história que prende. Funciona em palco, entrevista e roda de amigos.',
    ],
  },
  {
    tag: 'Persuasão',
    icon: '🔑',
    text: 'Convença a sala a adotar um hábito que mudou sua vida. Você tem 45 segundos. Comece.',
    hint: 'Abra pelo benefício de quem ouve, não pela sua experiência. "Isso te dá…"',
    tech: [
      'Persuasão',
      'Benefício do outro primeiro',
      'As pessoas se movem pelo que ganham. Abra pelo resultado que a pessoa quer e só depois explique o como. Entusiasmo seu não convence ninguém sozinho.',
    ],
  },
  {
    tag: 'Entrevista',
    icon: '💼',
    text: '"Qual seu maior defeito?" Responda em voz alta de um jeito honesto e estratégico.',
    hint: 'Defeito real + o que você faz pra lidar com ele. Honestidade com plano vence o clichê.',
    tech: [
      'Entrevista',
      'Defeito com plano de ação',
      'Não invente uma falsa fraqueza. Cite uma real e mostre o que você já faz pra contornar. Isso revela autoconhecimento, que é o que de fato avaliam.',
    ],
  },
  {
    tag: 'Resumo',
    icon: '✂️',
    text: 'Explique uma notícia recente que te marcou em 30 segundos, pra quem não viu nada. Fale.',
    hint: 'O quê, por que importa, e o seu ponto. Corte todo detalhe que não muda o entendimento.',
    tech: [
      'Síntese',
      'O quê–por quê–meu ponto',
      'Resumir é escolher o que cortar. Diga o fato, por que ele importa e o que você acha. Três camadas e pronto — o resto é ruído.',
    ],
  },
  {
    tag: 'Feedback',
    icon: '💬',
    text: 'Elogie publicamente o trabalho de alguém de um jeito específico e sincero. Fale agora.',
    hint: 'Elogio genérico não gruda. Aponte O QUE a pessoa fez e o efeito que teve.',
    tech: [
      'Reconhecimento',
      'Elogio específico',
      '"Mandou bem" evapora. "A forma como você reorganizou o slide deixou tudo claro" fica. Especificar mostra que você viu de verdade.',
    ],
  },
  {
    tag: 'Pergunta difícil',
    icon: '🎯',
    text: 'Alguém discorda de você na frente de todos. Responda mantendo a calma e a posição. Fale.',
    hint: 'Respire, valide o ponto, reafirme com um argumento novo. Nunca eleve o tom.',
    tech: [
      'Sob pressão',
      'Validar e reancorar',
      'Discordância pública testa sua serenidade. Reconheça o ponto do outro, mantenha o tom baixo e traga um argumento que sustente sua posição. Calma é autoridade.',
    ],
  },
  {
    tag: 'Abertura',
    icon: '🚀',
    text: 'Abra uma palestra sobre um assunto que você domina, prendendo a sala nos primeiros 15 segundos. Comece.',
    hint: 'Pergunta, dado chocante ou cena. Fuja do "bom dia, hoje vou falar sobre".',
    tech: [
      'Abertura',
      'O gancho dos 10 segundos',
      'O início decide a atenção. Comece por uma pergunta provocativa, um número surpreendente ou uma cena viva. As formalidades podem esperar.',
    ],
  },
]

// computeGain/feedbackFor now take the Autofeedback questionnaire's total
// points (0-60, see src/data/autofeedback.js) instead of a checkbox count.
export function treinoComputeGain(autofeedbackPoints) {
  return 25 + autofeedbackPoints
}

export function treinoFeedbackFor(points) {
  if (points >= 50) return 'Entrega completa! Esse é o nível que vira natural com repetição. Aumente o desafio na próxima.'
  if (points >= 30) return 'Boa! Pontos sólidos marcados. Repita focando no que faltou — é assim que o hábito se constrói.'
  if (points >= 10) return 'Um ponto já é progresso real. Cada rodada solta mais a língua. Bora de novo.'
  return 'Você falou, e isso é o que importa hoje. Sem cobrança: repita e sinta a diferença na segunda vez.'
}

export const formats = [
  {
    icon: '🪞',
    title: 'Espelho de 1 minuto',
    desc: 'Fale por um minuto na frente do espelho (ou da câmera) sobre o seu dia. Observe expressão, mãos e ritmo. Repita até soltar.',
    time: '1–3 min',
    bg: '#FFF3CF',
    color: '#8A6A00',
  },
  {
    icon: '🎲',
    title: 'Tema no sorteio',
    desc: 'Sorteie uma palavra qualquer e fale 30 segundos sobre ela sem parar. Treina improviso e o fim do medo do silêncio.',
    time: '30 seg',
    bg: '#EEF3FF',
    color: '#0F4C81',
  },
  {
    icon: '🐢',
    title: 'Fala em câmera lenta',
    desc: 'Conte algo falando propositalmente devagar, com pausas. Quebra o hábito de acelerar quando bate o nervoso.',
    time: '2 min',
    bg: '#EAF7F0',
    color: '#1F8A5B',
  },
  {
    icon: '🎙️',
    title: 'Roda de apresentação',
    desc: 'Em grupo: cada pessoa apresenta a do lado em 30 segundos. Treina escuta, síntese e falar sobre o outro com generosidade.',
    time: '15–20 min',
    bg: '#FCE8DF',
    color: '#C2410C',
  },
]
