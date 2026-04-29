import type { CompetitorData } from './supabase';

export function generateMockData(competitorId: string, userId: string): Omit<CompetitorData, 'id'>[] {
  const now = new Date();
  const items: Omit<CompetitorData, 'id'>[] = [
    {
      competitor_id: competitorId,
      user_id: userId,
      data_type: 'price',
      title: 'Plano Pro atualizado',
      description: 'Preço do plano Pro aumentou de R$99 para R$129/mês',
      value: 'R$129/mês',
      change_detected: true,
      collected_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      competitor_id: competitorId,
      user_id: userId,
      data_type: 'product',
      title: 'Novo recurso: Exportação em PDF',
      description: 'Lançaram exportação de relatórios em PDF na versão gratuita',
      value: 'Recurso gratuito',
      change_detected: true,
      collected_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      competitor_id: competitorId,
      user_id: userId,
      data_type: 'content',
      title: '3 novos posts no blog',
      description: 'Publicaram conteúdo sobre automação, IA e tendências de mercado',
      value: '3 posts',
      change_detected: true,
      collected_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      competitor_id: competitorId,
      user_id: userId,
      data_type: 'site_update',
      title: 'Reformulação da página de preços',
      description: 'Layout da página de preços foi completamente redesenhado com nova proposta de valor',
      value: 'Redesign completo',
      change_detected: true,
      collected_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  return items;
}

export function generateMockReport(competitorNames: string[]) {
  const names = competitorNames.length > 0 ? competitorNames.join(', ') : 'seus concorrentes';
  return {
    executive_summary: `Esta semana, foram identificadas ${competitorNames.length * 4} mudanças relevantes entre ${names}. O movimento mais significativo foi o reajuste de preços e lançamento de novos recursos, indicando uma possível disputa por posicionamento no segmento premium. Recomenda-se atenção especial às estratégias de conteúdo e revisão do pricing atual.`,
    categories: {
      prices: {
        summary: 'Detectadas alterações de preço em planos principais, com tendência de alta.',
        items: [
          {
            what: 'Plano Pro aumentou de R$99 para R$129/mês',
            impact: 'Possível migração de clientes sensíveis a preço para alternativas mais baratas',
            why: 'Indica reposicionamento para o mercado mid-market e aumento de margem',
          },
          {
            what: 'Novo plano Starter lançado a R$49/mês',
            impact: 'Ampliação da base de clientes entry-level',
            why: 'Estratégia de expansão de market share no segmento iniciante',
          },
        ],
      },
      products: {
        summary: 'Lançamento de novos recursos com foco em produtividade e automação.',
        items: [
          {
            what: 'Exportação de relatórios em PDF disponível no plano gratuito',
            impact: 'Aumenta o valor percebido do plano gratuito, dificultando conversão para pago',
            why: 'Tática de crescimento orgânico via boca a boca e retenção de usuários freemium',
          },
        ],
      },
      marketing: {
        summary: 'Volume de conteúdo aumentou 40% comparado à semana anterior.',
        items: [
          {
            what: 'Publicados 3 artigos sobre automação e IA no blog',
            impact: 'Ganho de tráfego orgânico e autoridade em palavras-chave estratégicas',
            why: 'Disputa por posicionamento SEO em termos de alta intenção de compra',
          },
          {
            what: 'Nova campanha no LinkedIn com foco em gestores',
            impact: 'Atinge diretamente o público-alvo de tomadores de decisão',
            why: 'Indica mudança para estratégia B2B mais agressiva',
          },
        ],
      },
      site_updates: {
        summary: 'Reformulações na página de preços e homepage detectadas.',
        items: [
          {
            what: 'Redesign completo da página de preços com nova proposta de valor',
            impact: 'Possível melhoria na taxa de conversão do funil',
            why: 'Otimização baseada em testes A/B ou reposicionamento de marca',
          },
        ],
      },
    },
    insights: [
      'O concorrente está se movendo para o segmento premium ao mesmo tempo que cria uma âncora de entrada mais barata — estratégia de bifurcação de mercado.',
      'O aumento no volume de conteúdo sugere investimento em marketing orgânico como canal principal de aquisição.',
      'O lançamento de recursos no plano gratuito indica pressão competitiva de soluções open-source.',
    ],
    opportunities: [
      'Aproveitar a insatisfação de clientes com o aumento de preços do concorrente para capturar migrações.',
      'Criar conteúdo SEO competindo diretamente com os termos trabalhados pelo concorrente.',
      'Reforçar diferenciais de suporte e personalização, pontos fracos identificados nas avaliações públicas.',
    ],
    threats: [
      'O novo plano Starter pode atrair clientes que hoje estão na base da sua base.',
      'A estratégia de conteúdo acelerada pode resultar em domínio orgânico nos próximos 3-6 meses.',
      'Redesign da página de preços pode indicar melhoria significativa na taxa de conversão.',
    ],
    recommendations: [
      'Revisar a estratégia de pricing nas próximas 2 semanas, considerando um plano intermediário entre R$79-R$99.',
      'Publicar pelo menos 2 artigos por semana nos mesmos tópicos que o concorrente está explorando.',
      'Entrar em contato proativamente com clientes que podem estar avaliando migração para o plano mais barato do concorrente.',
      'Realizar análise detalhada do novo design da página de preços deles e testar variações na sua.',
    ],
  };
}
