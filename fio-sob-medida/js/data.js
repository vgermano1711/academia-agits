// ============================================================
// FIO SOB MEDIDA — Data Layer
// Products, Brands, Schedule Templates
// ============================================================

const HAIR_TYPES = {
  liso: { label: 'Liso', icon: '〰️', desc: 'Fios retos sem curvatura natural' },
  ondulado: { label: 'Ondulado', icon: '〜', desc: 'Ondas suaves a moderadas' },
  cacheado: { label: 'Cacheado', icon: '🌀', desc: 'Cachos definidos e volumosos' },
  crespo: { label: 'Crespo', icon: '✦', desc: 'Cachos fechados e afro' },
};

const CONDITIONS = {
  seco: { label: 'Seco', icon: '🍂', desc: 'Fios sem brilho, ressecados' },
  oleoso: { label: 'Oleoso', icon: '💧', desc: 'Raiz oleosa rapidamente' },
  misto: { label: 'Misto', icon: '⚖️', desc: 'Raiz oleosa e pontas secas' },
  normal: { label: 'Normal', icon: '✨', desc: 'Equilibrado, com brilho natural' },
  danificado: { label: 'Danificado', icon: '⚡', desc: 'Poroso, quebradiço, com dano químico/térmico' },
  queda: { label: 'Queda excessiva', icon: '🍃', desc: 'Perda de fios acima do normal' },
};

const OBJECTIVES = {
  hidratacao: { label: 'Hidratação', icon: '💦', desc: 'Repor a água perdida nos fios', category: 'H' },
  nutricao: { label: 'Nutrição', icon: '🌿', desc: 'Reposição de óleos e lipídios', category: 'N' },
  reconstrucao: { label: 'Reconstrução', icon: '🔬', desc: 'Reposição de proteínas e queratina', category: 'R' },
  crescimento: { label: 'Crescimento', icon: '📈', desc: 'Estimular crescimento saudável', category: 'C' },
  antiqueda: { label: 'Anti-queda', icon: '🛡️', desc: 'Fortalecer e reduzir queda', category: 'AQ' },
  oleosidade: { label: 'Controle de oleosidade', icon: '🫧', desc: 'Equilíbrio do couro cabeludo', category: 'O' },
};

const TIME_OPTIONS = {
  dois: { label: '2 dias por semana', days: 2, icon: '🕐', desc: 'Rotina leve e prática' },
  tres: { label: '3 dias por semana', days: 3, icon: '🕒', desc: 'Rotina equilibrada' },
  cinco: { label: '4–5 dias por semana', days: 5, icon: '🕔', desc: 'Rotina intensiva e dedicada' },
};

const PRODUCTS = [
  {
    id: 1,
    name: 'Máscara Reconstrução Intensa Pro',
    brand: 'Cadiveu',
    category: 'R',
    hairTypes: ['cacheado', 'crespo', 'ondulado', 'liso'],
    conditions: ['danificado', 'seco'],
    objectives: ['reconstrucao'],
    price: 89.90,
    rating: 4.9,
    reviews: 1240,
    description: 'Máscara de reconstrução com queratina vegetal e proteínas de trigo. Restaura a fibra capilar danificada em até 3 aplicações.',
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&q=80',
    affiliateLink: '#',
    badge: 'Mais Vendido',
    badgeColor: '#E8889A',
  },
  {
    id: 2,
    name: 'Óleo de Argan Premium',
    brand: 'Inoar',
    category: 'N',
    hairTypes: ['liso', 'ondulado', 'cacheado', 'crespo'],
    conditions: ['seco', 'danificado', 'normal'],
    objectives: ['nutricao', 'hidratacao'],
    price: 67.50,
    rating: 4.8,
    reviews: 890,
    description: 'Sérum nutritivo de Argan marroquino puro. Proporciona brilho intenso, selamento e proteção térmica.',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80',
    affiliateLink: '#',
    badge: 'Favorita',
    badgeColor: '#C9A96E',
  },
  {
    id: 3,
    name: 'Shampoo Low-Poo Crespos e Cachos',
    brand: 'Wella Professionals',
    category: 'H',
    hairTypes: ['cacheado', 'crespo'],
    conditions: ['seco', 'normal', 'danificado'],
    objectives: ['hidratacao', 'crescimento'],
    price: 54.90,
    rating: 4.7,
    reviews: 654,
    description: 'Shampoo de baixa espuma para cabelos crespos e cacheados. Limpeza suave sem sulfatos agressivos.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80',
    affiliateLink: '#',
    badge: null,
    badgeColor: null,
  },
  {
    id: 4,
    name: 'Tônico Capilar Anti-Queda',
    brand: 'Natura Ekos',
    category: 'AQ',
    hairTypes: ['liso', 'ondulado', 'cacheado', 'crespo'],
    conditions: ['queda', 'normal', 'oleoso'],
    objectives: ['antiqueda', 'crescimento'],
    price: 112.00,
    rating: 4.6,
    reviews: 412,
    description: 'Tônico com extrato de priprioca e biotina. Atua no couro cabeludo para fortalecer e estimular os folículos.',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80',
    affiliateLink: '#',
    badge: 'Natural',
    badgeColor: '#7AB87A',
  },
  {
    id: 5,
    name: 'Condicionador Hidratação Profunda',
    brand: 'L\'Oréal Professionnel',
    category: 'H',
    hairTypes: ['liso', 'ondulado'],
    conditions: ['seco', 'misto', 'normal'],
    objectives: ['hidratacao'],
    price: 78.00,
    rating: 4.7,
    reviews: 1098,
    description: 'Condicionador com ácido hialurônico capilar. Hidratação de até 72h e fios sedosos ao toque.',
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=400&q=80',
    affiliateLink: '#',
    badge: 'Pro',
    badgeColor: '#6B9FD4',
  },
  {
    id: 6,
    name: 'Shampoo Purificante Couro Oleoso',
    brand: 'Schwarzkopf',
    category: 'O',
    hairTypes: ['liso', 'ondulado', 'cacheado'],
    conditions: ['oleoso', 'misto'],
    objectives: ['oleosidade'],
    price: 49.90,
    rating: 4.5,
    reviews: 723,
    description: 'Shampoo com zinco e sálvia para cabelos com tendência oleosa. Remove excesso de sebo sem ressecar as pontas.',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
    affiliateLink: '#',
    badge: null,
    badgeColor: null,
  },
  {
    id: 7,
    name: 'Leave-in Crespos Definição Total',
    brand: 'Cadiveu',
    category: 'H',
    hairTypes: ['crespo', 'cacheado'],
    conditions: ['seco', 'normal', 'danificado'],
    objectives: ['hidratacao', 'nutricao'],
    price: 59.90,
    rating: 4.8,
    reviews: 987,
    description: 'Leave-in sem enxágue com manteiga de karité e pantenol. Define cachos, reduz frizz e proporciona maciez intensa.',
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&q=80',
    affiliateLink: '#',
    badge: 'Novo',
    badgeColor: '#9B7ED4',
  },
  {
    id: 8,
    name: 'Máscara Nutrição Lipídica',
    brand: 'Inoar',
    category: 'N',
    hairTypes: ['crespo', 'cacheado', 'ondulado'],
    conditions: ['seco', 'danificado'],
    objectives: ['nutricao', 'reconstrucao'],
    price: 74.90,
    rating: 4.7,
    reviews: 543,
    description: 'Máscara com blend de óleos vegetais (côco, rícino e jojoba). Reposição lipídica intensa para fios ultraporosos.',
    image: 'https://images.unsplash.com/photo-1607602132700-068258431443?w=400&q=80',
    affiliateLink: '#',
    badge: null,
    badgeColor: null,
  },
  {
    id: 9,
    name: 'Spray Finalizador Brilho Intenso',
    brand: 'Wella Professionals',
    category: 'H',
    hairTypes: ['liso', 'ondulado'],
    conditions: ['normal', 'seco', 'misto'],
    objectives: ['hidratacao', 'nutricao'],
    price: 62.00,
    rating: 4.6,
    reviews: 389,
    description: 'Spray de acabamento com proteção UV e partículas de brilho. Sela a cutícula e mantém o frizz controlado.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
    affiliateLink: '#',
    badge: null,
    badgeColor: null,
  },
  {
    id: 10,
    name: 'Ampola Reconstrução SOS',
    brand: 'Natura Ekos',
    category: 'R',
    hairTypes: ['liso', 'ondulado', 'cacheado', 'crespo'],
    conditions: ['danificado', 'seco', 'queda'],
    objectives: ['reconstrucao', 'antiqueda'],
    price: 28.50,
    rating: 4.9,
    reviews: 2341,
    description: 'Ampola de tratamento intensivo com queratina hidrolisada. Uso semanal para recuperação emergencial dos fios.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
    affiliateLink: '#',
    badge: 'Mais Avaliado',
    badgeColor: '#E8889A',
  },
  {
    id: 11,
    name: 'Condicionador Proteínas de Seda',
    brand: 'L\'Oréal Professionnel',
    category: 'R',
    hairTypes: ['liso', 'ondulado', 'cacheado'],
    conditions: ['danificado', 'seco', 'normal'],
    objectives: ['reconstrucao', 'hidratacao'],
    price: 92.00,
    rating: 4.8,
    reviews: 761,
    description: 'Condicionador com proteínas de seda e aminoácidos. Promove reconstrução progressiva e toque sedoso imediato.',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
    affiliateLink: '#',
    badge: 'Premium',
    badgeColor: '#C9A96E',
  },
  {
    id: 12,
    name: 'Óleo Capilar Anti-Queda Mamão',
    brand: 'Natura Ekos',
    category: 'AQ',
    hairTypes: ['liso', 'ondulado', 'cacheado', 'crespo'],
    conditions: ['queda', 'oleoso', 'normal'],
    objectives: ['antiqueda', 'crescimento'],
    price: 98.00,
    rating: 4.5,
    reviews: 298,
    description: 'Óleo capilar com extrato de mamão e cafeína. Estimula a microcirculação e combate a miniaturização folicular.',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80',
    affiliateLink: '#',
    badge: 'Natural',
    badgeColor: '#7AB87A',
  },
];

const BRANDS = [
  {
    id: 1,
    name: 'Cadiveu',
    logo: '💎',
    description: 'Referência em tratamentos de reconstrução e química capilar de alto padrão.',
    specialty: ['reconstrucao', 'nutricao'],
    partnerSince: '2023',
    website: '#',
  },
  {
    id: 2,
    name: 'Inoar',
    logo: '🌿',
    description: 'Tecnologia brasileira em cuidados capilares naturais e tratamentos profissionais.',
    specialty: ['nutricao', 'hidratacao'],
    partnerSince: '2023',
    website: '#',
  },
  {
    id: 3,
    name: 'Natura Ekos',
    logo: '🌱',
    description: 'Beleza sustentável com ingredientes da biodiversidade brasileira.',
    specialty: ['antiqueda', 'crescimento', 'natural'],
    partnerSince: '2024',
    website: '#',
  },
  {
    id: 4,
    name: 'Wella Professionals',
    logo: '✨',
    description: 'Expertise global em coloração e cuidados profissionais há mais de 140 anos.',
    specialty: ['hidratacao', 'reconstrucao'],
    partnerSince: '2024',
    website: '#',
  },
  {
    id: 5,
    name: 'L\'Oréal Professionnel',
    logo: '👑',
    description: 'A ciência francesa a serviço da beleza capilar de alta performance.',
    specialty: ['reconstrucao', 'hidratacao'],
    partnerSince: '2023',
    website: '#',
  },
  {
    id: 6,
    name: 'Schwarzkopf',
    logo: '🔬',
    description: 'Inovação alemã em produtos para todos os tipos de cabelo.',
    specialty: ['oleosidade', 'hidratacao'],
    partnerSince: '2024',
    website: '#',
  },
];

const SCHEDULE_TEMPLATES = {
  // [hairType]_[condition]_[objective]_[days]
  getTemplate(profile) {
    const { hairType, condition, objective, timeDays, userName } = profile;

    let steps = [];
    const isOily = condition === 'oleoso' || condition === 'misto';
    const isDamaged = condition === 'danificado' || condition === 'seco';
    const isCurly = hairType === 'cacheado' || hairType === 'crespo';

    if (timeDays === 2) {
      steps = [
        {
          day: 'Segunda-feira',
          dayNum: 1,
          treatments: isDamaged
            ? ['Shampoo hidratante', 'Máscara de reconstrução (15–20 min)', 'Leave-in']
            : isOily
            ? ['Shampoo purificante', 'Condicionador leve (pontas)', 'Tônico regulador de sebo']
            : ['Shampoo nutritivo', 'Condicionador', 'Óleo finalizador'],
          duration: '45 min',
          priority: 'high',
        },
        {
          day: 'Quinta-feira',
          dayNum: 4,
          treatments: isCurly
            ? ['Co-wash ou Low-poo', 'Máscara de nutrição (10 min)', 'Creme de pentear + Leave-in']
            : ['Shampoo suave', 'Hidratação express (5 min)', 'Finalizador'],
          duration: '35 min',
          priority: 'medium',
        },
      ];
    } else if (timeDays === 3) {
      steps = [
        {
          day: 'Segunda-feira',
          dayNum: 1,
          treatments: isDamaged
            ? ['Shampoo com proteínas', 'Máscara de reconstrução profunda (20 min)', 'Leave-in proteico']
            : isOily
            ? ['Shampoo purificante', 'Condicionador (somente pontas)', 'Spray tônico couro cabeludo']
            : ['Shampoo nutritivo', 'Máscara de nutrição (10 min)', 'Leave-in hidratante'],
          duration: '50 min',
          priority: 'high',
        },
        {
          day: 'Quarta-feira',
          dayNum: 3,
          treatments: ['Hidratação express', 'Condicionador leave-in', 'Óleo capilar (pontas)'],
          duration: '25 min',
          priority: 'medium',
        },
        {
          day: 'Sexta-feira',
          dayNum: 5,
          treatments: isCurly
            ? ['Low-poo', 'Geleia definidora', 'Difusor ou plop method']
            : isDamaged
            ? ['Shampoo suave', 'Ampola de reconstrução SOS', 'Protetor térmico (se usar calor)']
            : ['Shampoo', 'Condicionador', 'Spray de brilho'],
          duration: '40 min',
          priority: 'medium',
        },
      ];
    } else {
      steps = [
        {
          day: 'Segunda-feira',
          dayNum: 1,
          treatments: isDamaged
            ? ['Shampoo proteico', 'Máscara de reconstrução (20–30 min)', 'Leave-in proteico + Óleo']
            : ['Shampoo nutritivo', 'Máscara hidratante (15 min)', 'Leave-in'],
          duration: '60 min',
          priority: 'high',
        },
        {
          day: 'Terça-feira',
          dayNum: 2,
          treatments: ['Tônico capilar (couro cabeludo)', 'Massagem capilar 5 min', 'Spray protetor UV'],
          duration: '15 min',
          priority: 'low',
        },
        {
          day: 'Quarta-feira',
          dayNum: 3,
          treatments: isOily
            ? ['Shampoo a seco (se necessário)', 'Spray sérum revitalizante', 'Tônico regulador']
            : isCurly
            ? ['Co-wash', 'Geleia ou creme de pentear', 'Difusor']
            : ['Hidratação express', 'Leave-in leve', 'Óleo nas pontas'],
          duration: '30 min',
          priority: 'medium',
        },
        {
          day: 'Quinta-feira',
          dayNum: 4,
          treatments: ['Ampola nutritiva ou de reconstrução', 'Selante de cutículas', 'Protetor térmico'],
          duration: '25 min',
          priority: 'medium',
        },
        {
          day: 'Sexta-feira',
          dayNum: 5,
          treatments: isDamaged
            ? ['Banho de creme intensivo (30 min + calor)', 'Queratina leave-in', 'Óleo vegetal selante']
            : ['Shampoo suave', 'Condicionador nutritivo', 'Finalizador de brilho'],
          duration: '50 min',
          priority: 'high',
        },
      ];
    }

    return {
      userName,
      hairType,
      condition,
      objective,
      timeDays,
      steps,
      generatedAt: new Date().toLocaleDateString('pt-BR'),
      weeklyGoal: getWeeklyGoal(objective),
      tips: getTips(hairType, condition, objective),
    };
  },
};

function getWeeklyGoal(objective) {
  const goals = {
    hidratacao: 'Repor os níveis hídricos dos fios, devolvendo elasticidade e brilho natural.',
    nutricao: 'Repor os lipídios e óleos naturais, selando a cutícula e devolvendo maciez.',
    reconstrucao: 'Reconstruir as proteínas da córtex capilar, fortalecendo os fios danificados.',
    crescimento: 'Estimular os folículos e nutrir o couro cabeludo para crescimento acelerado.',
    antiqueda: 'Fortalecer os fios desde a raiz e reduzir o ciclo de queda telógena.',
    oleosidade: 'Equilibrar a produção de sebo e manter o couro cabeludo saudável por mais tempo.',
  };
  return goals[objective] || 'Manter a saúde capilar e o equilíbrio dos fios.';
}

function getTips(hairType, condition, objective) {
  const tips = [];

  if (condition === 'danificado') {
    tips.push('Evite calor acima de 180°C — use sempre protetor térmico antes de qualquer ferramenta.');
    tips.push('Faça a técnica do fio elástico para monitorar a porosidade antes de cada protocolo.');
  }
  if (condition === 'oleoso' || condition === 'misto') {
    tips.push('Não aplique condicionador ou máscaras na raiz — mantenha o foco nas pontas.');
    tips.push('Lave o cabelo com água morna, nunca quente — o calor estimula mais produção de sebo.');
  }
  if (hairType === 'cacheado' || hairType === 'crespo') {
    tips.push('Aplique produtos com o cabelo ainda molhado para melhor definição e absorção.');
    tips.push('Use fronha de cetim ou touca de cetim para dormir — reduz o frizz e a quebra noturna.');
  }
  if (hairType === 'liso') {
    tips.push('Use finalizadores leves para não pesar o fio e perder o volume natural.');
  }
  if (objective === 'crescimento' || objective === 'antiqueda') {
    tips.push('Faça massagem no couro cabeludo por 5 minutos durante a lavagem para estimular circulação.');
    tips.push('Considere suplementação com biotina, zinco e vitamina D após consulta médica.');
  }

  if (tips.length === 0) {
    tips.push('Sempre faça o teste de elasticidade antes de escolher o próximo tratamento.');
    tips.push('Hidrate-se! A hidratação interna reflete diretamente na saúde dos fios.');
  }

  return tips.slice(0, 3);
}

// Storage helpers
const Storage = {
  save(key, value) {
    try {
      localStorage.setItem(`fio_${key}`, JSON.stringify(value));
    } catch (e) { /* silent */ }
  },
  load(key, fallback = null) {
    try {
      const v = localStorage.getItem(`fio_${key}`);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  clear(key) {
    localStorage.removeItem(`fio_${key}`);
  },
};

export { HAIR_TYPES, CONDITIONS, OBJECTIVES, TIME_OPTIONS, PRODUCTS, BRANDS, SCHEDULE_TEMPLATES, Storage };
