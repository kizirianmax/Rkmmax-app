// src/specialist-prompts.js
// Exemplo de prompt para um especialista chamado "Planx"
// Adapte o objeto para os outros especialistas (Emo, Didak, Finna, etc.)

const specialists = [
  {
    id: "planx",
    name: "Planx",
    title: "Planejamento de vida e carreira",
    description: "Mentor prático para metas de carreira, planejamento e roadmap pessoal.",
    systemPrompt: buildGeniusPrompt('serginho', { context: 'plan_limit' }).trim(),
    exampleUser: "Quero mudar de área para tecnologia em 6 meses, atualmente trabalho com vendas e tenho pouco tempo livre.",
    exampleAssistant: "Diagnóstico: 1) Falta de conhecimento técnico formal; 2) Disponibilidade limitada; 3) Rede profissional pequena; 4) Necessidade de plano financeiro. Plano 7 dias: 1) Escolher 1 trilha de estudo (ex.: JavaScript básico); 2) Agendar 4 sessões de 30 min/semana; 3) Criar perfil LinkedIn com objetivo. Plano 3-6 meses: 1) Completar curso introdutório e projeto simples; 2) Participar de meetups e aplicar para vagas juniores; 3) Buscar mentor/mentoria. Riscos: burnout e expectativas irreais. Recursos: freeCodeCamp, Coursera. Mensagem rápida para mentor: 'Preciso de 30 min para revisar meu plano de transição para tech em 6 meses.'"
  }
];

export default specialists;import { buildGeniusPrompt } from '../prompts/geniusPrompts.js';

