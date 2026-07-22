// The Autofeedback questionnaire shown at the end of every round, across
// both games (Home and Treinamento share this — it's not per-scenario).
// Content and per-answer feedback text come directly from the team's
// "Jogo & Feedback" research doc. Point values per option are our own
// design call (the doc gives qualitative good/OK/weak framing, not
// numbers): best answer in a question = 10, partial-credit answers scale
// down from there, weakest = 0.
export const AUTOFEEDBACK_SECTIONS = [
  {
    section: 'Conteúdo',
    questions: [
      {
        id: 'conteudo-tese',
        text: 'Consigo identificar uma separação tese, argumento, evidência?',
        options: [
          {
            id: 'sim',
            label: 'Sim',
            points: 10,
            feedback:
              'Realize o teste disponibilizado no material escrito "Estruturação de um argumento: tornando sua mensagem mais convincente" para verificar a eficácia de seu conteúdo.',
          },
          {
            id: 'parcial',
            label: 'Não, mas citei ao menos um desses elementos',
            points: 5,
            feedback:
              'Sua dificuldade foi mais no planejamento de suas ideias. Veja a matéria "Estruturação de um argumento: tornando sua mensagem mais convincente", e comece a treinar reservando 1 minuto prévio para completar as etapas indicadas na matéria. Ao falar, lembre-se de citar todos esses elementos, assim você não esquece de nada e transmite sua mensagem de forma muito mais segura.',
          },
          {
            id: 'nao',
            label: 'Não citei nenhum desses elementos',
            points: 0,
            feedback:
              'Você pode estar errando na argumentação. Veja a matéria "Estruturação de um argumento: tornando sua mensagem mais convincente", e lembre de seguir todas as etapas indicadas por ela. Planeje sua argumentação com 1 minuto de antecedência.',
          },
        ],
      },
    ],
  },
  {
    section: 'Postura',
    questions: [
      {
        id: 'postura-olhar',
        text: 'Para onde olhei durante minha fala?',
        options: [
          {
            id: 'frente',
            label: 'Para frente',
            points: 10,
            feedback: 'Ótimo, olhar para frente chama a atenção do público e ajuda a projetar sua voz.',
          },
          {
            id: 'ambos',
            label: 'Ambos (frente e baixo/lados)',
            points: 5,
            feedback:
              'Priorize olhar para frente. Muitas pessoas apresentam boa linha de raciocínio e dicção, porém sem olhar para frente, onde está situado o público, nada se torna suficientemente persuasivo.',
          },
          {
            id: 'baixo-lados',
            label: 'Para baixo/lados',
            points: 0,
            feedback:
              'Tente evitar isso. Na próxima vez, você pode treinar olhando no espelho ou com alguém para fazer você lembrar de sempre olhar para frente. É justamente nessa direção que seu público está situado!',
          },
        ],
      },
      {
        id: 'postura-corpo',
        text: 'Como meu corpo agiu durante minha fala?',
        options: [
          {
            id: 'gesticulava',
            label: 'Gesticulava com as mãos, me mexia moderadamente',
            points: 10,
            feedback:
              'No geral, é o que funciona melhor para atrair o público, pois deixa o discurso menos monótono e você pode dar ênfase em certas ideias utilizando suas mãos. Entretanto, atente-se com excessos de movimentos, pois isso pode deslocar totalmente a atenção da plateia e passar uma imagem de nervosismo.',
          },
          {
            id: 'soltos',
            label: 'Braços soltos, corpo relaxado e sem muito movimento',
            points: 7,
            feedback:
              'Isso demonstra certa confiança para o público. Entretanto, cuidado com excessos pois o público pode pensar que você não está levando sua mensagem e função a sério, então adapte-se ao contexto.',
          },
          {
            id: 'cruzados',
            label: 'Braços cruzados, mais encolhido(a)',
            points: 0,
            feedback:
              'Isso não é tão aconselhável, já que causa a impressão que você está se escondendo das pessoas, e, assim, sua mensagem dificilmente é transmitida com confiança e de forma persuasiva.',
          },
          {
            id: 'mexendo',
            label: 'Não conseguia parar de me mexer',
            points: 0,
            feedback:
              'Isso pode deslocar a atenção do público aos seus movimentos físicos em vez de sua mensagem. Por isso, tome cuidado com movimentos de braços muito abruptos, ficar andando indo e voltando…',
          },
        ],
      },
    ],
  },
  {
    section: 'Entonação',
    questions: [
      {
        id: 'entonacao-volume',
        text: 'Consigo me ouvir direito?',
        options: [
          {
            id: 'sim',
            label: 'Sim',
            points: 10,
            feedback:
              'Ótimo. Você deve sempre ajustar a intensidade de sua voz de acordo com o tamanho do público. Fale como se houvesse mais pessoas do que o real.',
          },
          {
            id: 'nao',
            label: 'Não',
            points: 0,
            feedback:
              'Aumente o volume de sua voz da próxima vez. Isso é essencial para manter a plateia acordada! Fale sempre como se houvesse mais pessoas do que o real na plateia.',
          },
        ],
      },
      {
        id: 'entonacao-velocidade',
        text: 'Qual foi a velocidade da minha fala?',
        options: [
          {
            id: 'rapida-clara',
            label: 'Rápida com mensagem clara',
            points: 10,
            feedback: 'Ótimo, continue pronunciando bem as palavras.',
          },
          {
            id: 'devagar-clara',
            label: 'Devagar com mensagem clara',
            points: 10,
            feedback: 'Ótimo, continue pronunciando bem as palavras.',
          },
          {
            id: 'rapida-pouco-clara',
            label: 'Rápida com pouca clareza',
            points: 3,
            feedback: 'Foque em pronunciar bem as palavras. Faça pausas, isso torna sua fala mais refinada.',
          },
          {
            id: 'devagar-pouco-clara',
            label: 'Devagar com pouca clareza',
            points: 3,
            feedback:
              'Foque em pronunciar bem as palavras. Planeje o conteúdo do seu discurso, faça pausas para recuperar o raciocínio.',
          },
        ],
      },
      {
        id: 'entonacao-ritmo',
        text: 'Como foi o ritmo da minha fala?',
        options: [
          {
            id: 'enfase',
            label: 'Dei ênfase nas partes que julguei importante',
            points: 10,
            feedback: 'Ótima forma de tornar seu discurso mais convincente.',
          },
          {
            id: 'estatica',
            label: 'Estruturei bem o conteúdo, mas a fala ficou estática',
            points: 5,
            feedback:
              'Você possui habilidades em planejar sua fala. Agora, falta brincar com entonação e volume da voz para ficar mais convincente. Faça pausas pontuais, fale mais alto.',
          },
          {
            id: 'monotona',
            label: 'Falei de forma monótona e sem muito sentido',
            points: 0,
            feedback:
              'Procure planejar seu discurso. Veja a matéria "Estruturação de um argumento: tornando sua mensagem mais convincente".',
          },
        ],
      },
    ],
  },
]

export const AUTOFEEDBACK_QUESTIONS = AUTOFEEDBACK_SECTIONS.flatMap((s) => s.questions)

export const AUTOFEEDBACK_MAX_POINTS = AUTOFEEDBACK_QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
  0,
)

function optionFor(question, answers) {
  const selectedId = answers[question.id]
  return question.options.find((o) => o.id === selectedId) || null
}

export function isAutofeedbackComplete(answers) {
  return AUTOFEEDBACK_QUESTIONS.every((q) => Boolean(answers[q.id]))
}

export function computeAutofeedbackPoints(answers) {
  return AUTOFEEDBACK_QUESTIONS.reduce((sum, q) => {
    const opt = optionFor(q, answers)
    return sum + (opt ? opt.points : 0)
  }, 0)
}

/** Flattened { section, questionText, answerLabel, feedback }[] for the reveal breakdown. */
export function feedbackItemsFor(answers) {
  const items = []
  for (const { section, questions } of AUTOFEEDBACK_SECTIONS) {
    for (const q of questions) {
      const opt = optionFor(q, answers)
      if (opt) items.push({ section, questionText: q.text, answerLabel: opt.label, feedback: opt.feedback })
    }
  }
  return items
}
