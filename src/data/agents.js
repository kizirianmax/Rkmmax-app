import avatars from "./avatars.json";

// Nome + pitch curtinho (ajuste como quiser)
export const AGENTS = [
  { id: "serginho", name: "Serginho", role: "Orquestrador", avatar: avatars.serginho,
    blurb: "Assessor pessoal. Orquestra os 12 agentes para resolver qualquer tarefa." },
  { id: "emo", name: "Emo", role: "Storytelling/UX Writing", avatar: avatars.emo,
    blurb: "Textos envolventes, tom de voz e narrativa da marca." },
  { id: "didak", name: "Didak", role: "Aprendizado/Resumos", avatar: avatars.didak,
    blurb: "Explica, resume e cria planos de estudo." },
  { id: "finna", name: "Finna", role: "Financeiro", avatar: avatars.finna,
    blurb: "Planos, custos, DRE simples, precificação." },
  { id: "care", name: "Care", role: "Suporte/CS", avatar: avatars.care,
    blurb: "Respostas de ajuda, macros e base de conhecimento." },
  { id: "criar", name: "Criar", role: "Ideação/Design", avatar: avatars.criar,
    blurb: "Ideias, roteiros, prompts criativos e referências visuais." },
  { id: "code", name: "Code", role: "Dev Helper", avatar: avatars.code,
    blurb: "Gera trechos, revisa e explica código." },
  { id: "talky", name: "Talky", role: "Conversão/Vendas", avatar: avatars.talky,
    blurb: "Scripts de call, follow-ups e copy de oferta." },
  { id: "focus", name: "Focus", role: "Produtividade", avatar: avatars.focus,
    blurb: "Pomodoro, checklists e rotinas." },
  { id: "bizu", name: "Bizu", role: "Growth/SEO", avatar: avatars.bizu,
    blurb: "Pautas, títulos e otimizações de alcance." },
  { id: "legalis", name: "Legalis", role: "Jurídico leve", avatar: avatars.legalis,
    blurb: "Rascunhos e checagens de clausulado comum." },
  { id: "planx", name: "Planx", role: "Planejamento", avatar: avatars.planx,
    blurb: "Roadmaps, OKRs e cronogramas." },
  { id: "orac", name: "Orac", role: "Análises/Insights", avatar: avatars.orac,
    blurb: "Sintetiza dados e recomendações práticas." }
];
