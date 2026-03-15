// Mock data for development - will be replaced by real API calls

export const mockAnalysisReport = {
  overallScore: 62,
  categoryScores: {
    visual: 7,
    positioning: 5,
    content: 6,
    network: 8,
  },
  sectionScores: [
    { section: "Foto de Perfil", score: 7, status: "Bom" },
    { section: "Banner/Capa", score: 4, status: "Atenção" },
    { section: "Headline", score: 5, status: "Atenção" },
    { section: "Sobre/About", score: 6, status: "Bom" },
    { section: "Experiência", score: 7, status: "Bom" },
    { section: "Formação", score: 8, status: "Forte" },
    { section: "Habilidades", score: 6, status: "Bom" },
    { section: "Recomendações", score: 3, status: "Crítico" },
    { section: "Em Destaque", score: 4, status: "Atenção" },
    { section: "Publicações", score: 5, status: "Atenção" },
    { section: "Certificações", score: 7, status: "Bom" },
    { section: "Prêmios", score: 2, status: "Crítico" },
    { section: "Idiomas", score: 8, status: "Forte" },
    { section: "Voluntariado", score: 3, status: "Crítico" },
    { section: "Interesses", score: 6, status: "Bom" },
    { section: "Atividade/Posts", score: 5, status: "Atenção" },
    { section: "Estratégia de Conteúdo", score: 4, status: "Atenção" },
  ],
  radarData: [
    { dimension: "Foto", score: 7, fullMark: 10 },
    { dimension: "Banner", score: 4, fullMark: 10 },
    { dimension: "Headline", score: 5, fullMark: 10 },
    { dimension: "Sobre", score: 6, fullMark: 10 },
    { dimension: "Experiência", score: 7, fullMark: 10 },
    { dimension: "Formação", score: 8, fullMark: 10 },
    { dimension: "Skills", score: 6, fullMark: 10 },
    { dimension: "Recomend.", score: 3, fullMark: 10 },
    { dimension: "Destaque", score: 4, fullMark: 10 },
    { dimension: "Publicações", score: 5, fullMark: 10 },
    { dimension: "Certificações", score: 7, fullMark: 10 },
    { dimension: "Prêmios", score: 2, fullMark: 10 },
    { dimension: "Idiomas", score: 8, fullMark: 10 },
    { dimension: "Voluntariado", score: 3, fullMark: 10 },
    { dimension: "Interesses", score: 6, fullMark: 10 },
    { dimension: "Atividade", score: 5, fullMark: 10 },
    { dimension: "Conteúdo", score: 4, fullMark: 10 },
  ],
  executiveDiagnosis: `Seu perfil de LinkedIn está operando a 62% do seu potencial — e para alguém que quer se tornar referência em Tecnologia nos próximos 12 meses, isso é um problema sério. Você tem um perfil "existente" mas não "estratégico". A diferença? Um perfil existente mostra que você trabalha. Um perfil estratégico faz as pessoas certas virem até você.

O maior gap que identifico está na tríade crítica: headline genérica (desperdiçando os 220 caracteres mais valiosos), seção Sobre sem call-to-action (você conta sua história mas não direciona o leitor), e zero recomendações estratégicas (a prova social mais poderosa do LinkedIn está vazia).

A boa notícia: sua base é sólida. Formação forte, experiências relevantes, e uma rede que já tem massa crítica. O que falta é posicionamento intencional. Em 90 dias, com as mudanças que vou recomendar, esse 62 pode virar 85+.`,
  pullQuote: "Você tem um perfil 'existente' mas não 'estratégico'. A diferença? Um perfil existente mostra que você trabalha. Um perfil estratégico faz as pessoas certas virem até você.",
  sections: [
    {
      name: "Foto de Perfil",
      icon: "📸",
      score: 7,
      status: "Bom" as const,
      aiSees: "Foto com boa resolução, sorriso natural, fundo neutro. Enquadramento do ombro para cima. Iluminação lateral suave.",
      working: [
        "Resolução adequada (400x400px mínimo atingido)",
        "Expressão facial aberta e acessível",
        "Vestimenta alinhada ao segmento",
      ],
      needsChange: [
        "Fundo branco genérico não cria associação de marca",
        "Enquadramento corta a testa — reduz percepção de autoridade",
        "Sem cores de marca pessoal no fundo ou acessórios",
      ],
      immediateAction: "Refaça a foto com um fundo que tenha a cor da sua marca pessoal (azul marinho ou verde escuro). Mantenha o sorriso. Enquadre do peito para cima.",
      strategy90days: "Invista em um ensaio fotográfico profissional com 10-15 variações. Use as fotos no LinkedIn, palestras, artigos e redes sociais para criar reconhecimento visual consistente.",
    },
    {
      name: "Banner/Capa",
      icon: "🎨",
      score: 4,
      status: "Atenção" as const,
      aiSees: "Banner padrão do LinkedIn (azul genérico). Sem personalização, sem texto, sem marca.",
      working: [
        "Pelo menos não tem uma imagem de baixa qualidade",
      ],
      needsChange: [
        "Banner completamente genérico — desperdiça 1584x396px de real estate premium",
        "Não comunica sua proposta de valor",
        "Não reforça seu posicionamento ou segmento",
        "Sem call-to-action ou informação de contato",
      ],
      immediateAction: "Crie um banner no Canva (1584x396px) com: seu nome + título de autoridade + 1 frase de posicionamento + link ou QR code para seu melhor conteúdo.",
      strategy90days: "Atualize o banner a cada trimestre com conquistas recentes, próximas palestras ou lançamentos. O banner é sua vitrine — use para contar a história do momento.",
    },
    {
      name: "Headline",
      icon: "✍️",
      score: 5,
      status: "Atenção" as const,
      aiSees: "Headline atual: 'Gerente de Tecnologia na Empresa X'. 42 de 220 caracteres utilizados. Sem palavras-chave estratégicas. Sem proposta de valor.",
      working: [
        "Contém cargo atual e empresa",
      ],
      needsChange: [
        "Utiliza apenas 42 de 220 caracteres disponíveis (19% de aproveitamento)",
        "Não contém nenhum resultado quantificado",
        "Não diferencia de outros 50.000+ gerentes de tecnologia no Brasil",
        "Sem palavras-chave que o público-alvo busca",
      ],
      immediateAction: "Substitua sua headline por uma das 5 versões abaixo — todas otimizadas para seu objetivo e segmento.",
      strategy90days: "Teste uma headline diferente a cada 2 semanas. Monitore views do perfil. A que gerar mais views em 14 dias é a vencedora.",
      alternatives: [
        "Gerente de Tecnologia | Transformo times de 5 em squads de alta performance | +300% em entregas no último ano | Speaker sobre liderança tech",
        "Liderança em Tecnologia → Times de alta performance → Resultados mensuráveis | Gerente @EmpresaX | Mentoro líderes tech em transição",
        "De dev a líder: 12 anos construindo times que entregam | Gerente de Tecnologia @EmpresaX | Escritor sobre gestão de engenharia",
        "Gerente de Tecnologia que fala a língua do negócio | +R$2M em projetos entregues | Palestro sobre Product Engineering & Leadership",
        "🚀 Escalo times de tecnologia com método | Gerente @EmpresaX | Top 3% entregas Q4/2024 | Aberto a board advisory",
      ],
    },
  ],
  topVoicePotential: {
    level: "Médio",
    monthsToTopVoice: 8,
    accelerators: [
      "Experiência sólida e credenciais verificáveis",
      "Rede com massa crítica (+2000 conexões)",
      "Segmento com alta demanda por conteúdo",
    ],
    blockers: [
      "Frequência de publicação inconsistente",
      "Zero recomendações estratégicas",
      "Headline e About não otimizados para descoberta",
    ],
  },
  actionPlan: {
    phases: [
      {
        phase: 30,
        theme: "Fundação Estratégica",
        color: "destructive",
        actions: [
          "Reescrever headline com proposta de valor clara",
          "Refazer a seção Sobre com CTA",
          "Solicitar 5 recomendações estratégicas",
          "Criar banner personalizado",
          "Ativar Creator Mode",
        ],
      },
      {
        phase: 60,
        theme: "Construção de Autoridade",
        color: "warning",
        actions: [
          "Publicar 3x por semana consistentemente",
          "Criar série de conteúdo no seu nicho",
          "Otimizar seção de Experiências com resultados",
          "Adicionar 5+ itens na seção Em Destaque",
          "Solicitar mais 5 recomendações",
        ],
      },
      {
        phase: 90,
        theme: "Aceleração e Escala",
        color: "success",
        actions: [
          "Lançar Newsletter no LinkedIn",
          "Publicar primeiro artigo long-form",
          "Criar conteúdo em vídeo (1x/semana)",
          "Engajar estrategicamente em 10 perfis de influência",
          "Avaliar resultados e ajustar estratégia",
        ],
      },
    ],
    topPriorities: [
      {
        rank: 1,
        action: "Reescrever a Headline",
        why: "É a primeira coisa que 100% dos visitantes leem. Sua headline atual desperdiça 80% do espaço disponível.",
        how: "Copie uma das 5 versões sugeridas acima. Cole no LinkedIn. Leva 30 segundos.",
        xp: 150,
      },
      {
        rank: 2,
        action: "Reescrever o Sobre/About",
        why: "É onde você converte curiosos em conexões. Seu About atual não tem CTA — as pessoas leem e saem.",
        how: "Use o texto reescrito na seção de análise. Adicione o CTA sugerido no final.",
        xp: 200,
      },
      {
        rank: 3,
        action: "Solicitar 5 Recomendações",
        why: "Você tem 0 recomendações. Isso é um red flag silencioso. Prova social é o ativo mais subestimado.",
        how: "Envie as 3 mensagens-modelo que preparamos. Mire em ex-gestores e colegas seniores.",
        xp: 100,
      },
      {
        rank: 4,
        action: "Criar Banner Personalizado",
        why: "Seu banner padrão grita 'não me importo com minha marca'. É o maior espaço visual do perfil.",
        how: "Use Canva com o template sugerido (1584x396px). Inclua nome + título + proposta de valor.",
        xp: 100,
      },
      {
        rank: 5,
        action: "Ativar Creator Mode",
        why: "Multiplica sua visibilidade e libera ferramentas exclusivas de crescimento.",
        how: "Configurações > Creator Mode > Ativar. Adicione 5 hashtags do seu nicho.",
        xp: 50,
      },
    ],
  },
  xpAwarded: 350,
  rank: { icon: "🔥", name: "RELEVANTE", range: "50–64" },
  badges: [
    { icon: "📸", name: "Primeira Impressão", rarity: "common", earned: true, xp: 150 },
    { icon: "✍️", name: "Wordsmith", rarity: "common", earned: false, xp: 150 },
    { icon: "🎨", name: "Identidade Visual", rarity: "common", earned: false, xp: 100 },
    { icon: "💬", name: "Bem Recomendado", rarity: "rare", earned: false, xp: 200 },
    { icon: "🎯", name: "Posicionado", rarity: "rare", earned: false, xp: 200 },
    { icon: "🚀", name: "Decolagem", rarity: "epic", earned: false, xp: 300 },
    { icon: "👑", name: "Top Voice Candidate", rarity: "legendary", earned: false, xp: 500 },
  ],
};

export const mockProfile = {
  name: "Ana Carolina Ferreira",
  firstName: "Ana Carolina",
  role: "Gerente de Tecnologia",
  company: "TechCorp Brasil",
  segment: "Tecnologia",
  linkedinUrl: "https://linkedin.com/in/anacarolinaferreira",
  profilePicUrl: "",
  goal: "Ser referência em liderança tech e ser convidada para conselhos",
  timeline: "12 meses",
  yearsExperience: 12,
};

export const RANKS = [
  { icon: "🥚", name: "INVISÍVEL", min: 0, max: 19, color: "gray" },
  { icon: "🌱", name: "INICIANTE", min: 20, max: 34, color: "green" },
  { icon: "⚡", name: "EMERGENTE", min: 35, max: 49, color: "yellow" },
  { icon: "🔥", name: "RELEVANTE", min: 50, max: 64, color: "orange" },
  { icon: "💎", name: "AUTORIDADE", min: 65, max: 79, color: "cyan" },
  { icon: "🚀", name: "REFERÊNCIA", min: 80, max: 89, color: "purple" },
  { icon: "🏆", name: "TOP VOICE", min: 90, max: 99, color: "gold" },
  { icon: "👑", name: "ÍCONE", min: 100, max: 100, color: "white" },
];

export const SEGMENTS = [
  { icon: "💻", label: "Tecnologia" },
  { icon: "💰", label: "Finanças" },
  { icon: "📈", label: "Marketing & Growth" },
  { icon: "👥", label: "RH & People" },
  { icon: "🏥", label: "Saúde & Wellness" },
  { icon: "⚖️", label: "Direito" },
  { icon: "🔧", label: "Engenharia" },
  { icon: "🚀", label: "Empreendedorismo" },
  { icon: "📚", label: "Educação" },
  { icon: "🎯", label: "Consultoria" },
  { icon: "💼", label: "Vendas & Comercial" },
  { icon: "🌍", label: "ESG & Sustentabilidade" },
  { icon: "📋", label: "Outro" },
];

export const OBJECTIVES = [
  { icon: "🎯", label: "Ser referência no meu nicho" },
  { icon: "💼", label: "Cargo executivo / C-level" },
  { icon: "🚀", label: "Atrair clientes e oportunidades" },
  { icon: "🎤", label: "Ser convidado para palestras" },
  { icon: "📚", label: "Lançar livro, curso ou mentoria" },
  { icon: "🏢", label: "Entrar para um Conselho (Board)" },
  { icon: "🌍", label: "Visibilidade internacional" },
  { icon: "💡", label: "Empreender ou escalar negócio" },
  { icon: "🏆", label: "Conquistar o selo Top Voice" },
  { icon: "📰", label: "Ser fonte para a imprensa" },
];

export const LINKEDIN_LEVELS = [
  { icon: "😬", label: "Básico", desc: "Está lá, mas quase não mexo" },
  { icon: "😐", label: "Mediano", desc: "Tenho perfil mas não gera resultados" },
  { icon: "🙂", label: "Bom", desc: "Já tenho engajamento, quero escalar" },
  { icon: "😎", label: "Forte", desc: "Só preciso de ajustes estratégicos" },
];

export const POST_FREQUENCIES = [
  "Nunca",
  "Raramente (1x/mês)",
  "Às vezes (1-2x/sem)",
  "Regularmente (3-4x/sem)",
  "Todo dia",
];

export const CONTENT_TYPES = [
  "Posts de texto",
  "Carrosséis",
  "Artigos",
  "Vídeos",
  "Compartilhamentos",
  "Comentários estratégicos",
  "Não posto",
];

export const CHALLENGES = [
  "Não sei o que postar",
  "Posto mas não tenho engajamento",
  "Não consigo transmitir minha autoridade",
  "Minha rede não é qualificada",
  "Não tenho tempo para ser consistente",
  "Não sei como me diferenciar",
  "Tenho vergonha de aparecer",
  "Não entendo o algoritmo",
];

export const TIMELINES = [
  "3 meses",
  "6 meses",
  "1 ano",
  "2 anos",
  "3 anos",
];

export const LOADING_MESSAGES = [
  "Baixando seu perfil do LinkedIn...",
  "Analisando sua foto de perfil com visão computacional...",
  "Avaliando banner e identidade visual...",
  "Lendo sua headline com olhos de estrategista...",
  "Mergulhando no seu Sobre/About...",
  "Mapeando suas experiências profissionais...",
  "Verificando suas habilidades e skills...",
  "Analisando recomendações e rede...",
  "Avaliando seção Em Destaque...",
  "Checando certificações e prêmios...",
  "Cruzando tudo com seus objetivos de carreira...",
  "Gerando plano estratégico de 90 dias...",
  "Calculando seu potencial Top Voice...",
  "Finalizando seu relatório executivo...",
];
