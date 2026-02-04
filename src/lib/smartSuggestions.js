// src/lib/smartSuggestions.js
// Detecta padrões nas mensagens e sugere ferramentas apropriadas

const TOOL_PATTERNS = [
  {
    id: 'abnt',
    name: 'Formatador ABNT',
    patterns: [
      /abnt/i, /apa/i, /normas?/i, /formata(r|ção)/i, /tcc/i, /monografia/i,
      /artigo científico/i, /trabalho acadêmico/i, /referências?/i, /citaç(ão|ões)/i,
      /bibliografia/i, /vancouver/i
    ],
    suggestion: '📝 Parece que você precisa formatar um trabalho acadêmico! Quer usar o **Formatador ABNT**?',
    action: { type: 'link', url: 'https://formatador-abnt.vercel.app', label: 'Abrir Formatador ABNT' }
  },
  {
    id: 'cronograma',
    name: 'Gerador de Cronogramas',
    patterns: [
      /cronograma/i, /planej(ar|amento)/i, /estud(ar|os)/i, /organiz(ar|ação)/i,
      /horário/i, /agenda/i, /rotina/i, /prova/i, /vestibular/i, /enem/i, /concurso/i
    ],
    suggestion: '📅 Precisa organizar seus estudos? O **Gerador de Cronogramas** pode te ajudar!',
    action: { type: 'navigate', path: '/cronograma', label: 'Criar Cronograma' }
  },
  {
    id: 'sourceproof',
    name: 'Source-Proof',
    patterns: [
      /fonte/i, /verificar/i, /confiável/i, /fake/i, /verdade/i, /checar/i,
      /credibilidade/i, /validar/i, /autêntic/i
    ],
    suggestion: '🔍 Quer verificar se uma fonte é confiável? Use o **Source-Proof**!',
    action: { type: 'navigate', path: '/source-proof', label: 'Verificar Fonte' }
  },
  {
    id: 'resumos',
    name: 'Gerador de Resumos',
    patterns: [
      /resum(o|ir)/i, /síntese/i, /condensar/i, /fichamento/i
    ],
    suggestion: '📚 Precisa resumir um texto? O **Gerador de Resumos** está disponível no Study Lab!',
    action: { type: 'navigate', path: '/study', label: 'Ir para Study Lab' }
  },
  {
    id: 'flashcards',
    name: 'Flashcards',
    patterns: [
      /flashcard/i, /cartões?/i, /memoriz(ar|ação)/i, /decorar/i, /anki/i
    ],
    suggestion: '🎴 Quer criar flashcards para memorização? Acesse o **Study Lab**!',
    action: { type: 'navigate', path: '/study', label: 'Ir para Study Lab' }
  },
  {
    id: 'mindmap',
    name: 'Mapas Mentais',
    patterns: [
      /mapa mental/i, /mind ?map/i, /diagrama/i, /organograma/i, /esquema/i
    ],
    suggestion: '🗺️ Precisa criar um mapa mental? O **Study Lab** tem essa ferramenta!',
    action: { type: 'navigate', path: '/study', label: 'Ir para Study Lab' }
  },
  {
    id: 'specialist',
    name: 'Especialistas',
    patterns: [
      /especialista em/i, /expert/i, /profissional de/i, /advogado/i, /médico/i,
      /programador/i, /designer/i, /contador/i, /psicólogo/i
    ],
    suggestion: '👥 Temos **54 especialistas** disponíveis! Quer ver a lista completa?',
    action: { type: 'navigate', path: '/specialists', label: 'Ver Especialistas' }
  }
];

/**
 * Detecta se a mensagem do usuário sugere uso de uma ferramenta
 * @param {string} message - Mensagem do usuário
 * @returns {object|null} - Sugestão de ferramenta ou null
 */
export function detectToolSuggestion(message) {
  if (!message || message.length < 5) return null;

  for (const tool of TOOL_PATTERNS) {
    for (const pattern of tool.patterns) {
      if (pattern.test(message)) {
        return {
          toolId: tool.id,
          toolName: tool.name,
          suggestion: tool.suggestion,
          action: tool.action
        };
      }
    }
  }

  return null;
}

/**
 * Gera uma resposta com sugestão de ferramenta integrada
 * @param {string} aiResponse - Resposta original da IA
 * @param {object} suggestion - Sugestão detectada
 * @returns {string} - Resposta com sugestão
 */
export function appendToolSuggestion(aiResponse, suggestion) {
  if (!suggestion) return aiResponse;

  const suggestionBlock = `

---

💡 **Dica:** ${suggestion.suggestion}

[${suggestion.action.label}](${suggestion.action.type === 'link' ? suggestion.action.url : suggestion.action.path})`;

  return aiResponse + suggestionBlock;
}

/**
 * Verifica se já sugerimos essa ferramenta recentemente
 * @param {string} toolId - ID da ferramenta
 * @returns {boolean} - Se deve sugerir ou não
 */
export function shouldSuggestTool(toolId) {
  try {
    const lastSuggestions = JSON.parse(localStorage.getItem('serginho_last_suggestions') || '{}');
    const lastTime = lastSuggestions[toolId];
    
    if (!lastTime) return true;
    
    // Não sugerir a mesma ferramenta em menos de 5 minutos
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - lastTime > fiveMinutes;
  } catch {
    return true;
  }
}

/**
 * Marca que sugerimos uma ferramenta
 * @param {string} toolId - ID da ferramenta
 */
export function markToolSuggested(toolId) {
  try {
    const lastSuggestions = JSON.parse(localStorage.getItem('serginho_last_suggestions') || '{}');
    lastSuggestions[toolId] = Date.now();
    localStorage.setItem('serginho_last_suggestions', JSON.stringify(lastSuggestions));
  } catch {
    // Ignorar erros de localStorage
  }
}

const smartSuggestionsExport = {
  detectToolSuggestion,
  appendToolSuggestion,
  shouldSuggestTool,
  markToolSuggested
};

export default smartSuggestionsExport;
