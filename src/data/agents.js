// src/data/agents.js
// Lista completa (13). Export default para combinar com seus imports atuais.

const AGENTS = [
  {
    id: "serginho",
    principal: true,
    name: "Serginho",
    emoji: "⚡🧠",
    role: "Agente Principal — orquestrador dos 12 especialistas",
    description:
      "Gênio generalista, confiável e metódico. Aprende e evolui sobre qualquer assunto, prioriza fontes confiáveis e explica passo a passo. Orquestra e coordena os 12 agentes especialistas.",
    tags: ["generalista", "estratégia", "pesquisa", "explicações", "citações"],
    controls: [
      "emo","didak","finna","care","criar","code",
      "talky","focus","bizu","legalis","planx","orac"
    ],
    learns: true,
    avatar_url: "https://i.pravatar.cc/150?img=13"
  },

  // 12 especialistas
  {
    id: "emo",
    name: "Emo",
    role: "Mentor emocional",
    description: "Apoio psicológico, motivação e inteligência emocional.",
    avatar_url: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "didak",
    name: "Didak",
    role: "Instrutor",
    description: "Explica conceitos, ensina conteúdos e facilita o aprendizado.",
    avatar_url: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "finna",
    name: "Finna",
    role: "Inteligência financeira",
    description: "Ajuda no controle de gastos e planejamento financeiro.",
    avatar_url: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "care",
    name: "Care",
    role: "Saúde e bem-estar",
    description: "Dicas de autocuidado e saúde do dia a dia.",
    avatar_url: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: "criar",
    name: "Criar",
    role: "Criatividade",
    description: "Inspira ideias em escrita, arte e inovação.",
    avatar_url: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "code",
    name: "Code",
    role: "Programador",
    description: "Auxilia em código, lógica e depuração de sistemas.",
    avatar_url: "https://i.pravatar.cc/150?img=6"
  },
  {
    id: "talky",
    name: "Talky",
    role: "Comunicação",
    description: "Aprimora textos, discursos e interações sociais.",
    avatar_url: "https://i.pravatar.cc/150?img=7"
  },
  {
    id: "focus",
    name: "Focus",
    role: "Produtividade",
    description: "Ajuda a organizar, focar e atingir metas.",
    avatar_url: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: "bizu",
    name: "Bizu",
    role: "Resumos e provas",
    description: "Faz resumos rápidos e ajuda em revisões de estudo.",
    avatar_url: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: "legalis",
    name: "Legalis",
    role: "IA jurídica",
    description: "Explica leis, contratos e direitos de forma clara.",
    avatar_url: "https://i.pravatar.cc/150?img=10"
  },
  {
    id: "planx",
    name: "Planx",
    role: "Planejamento de vida e carreira",
    description: "Orienta em decisões profissionais e pessoais.",
    avatar_url: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: "orac",
    name: "Orac",
    role: "Visão estratégica",
    description: "Ajuda em estratégia, cenários e tomada de decisão.",
    avatar_url: "https://i.pravatar.cc/150?img=12"
  }
];

export default AGENTS;
