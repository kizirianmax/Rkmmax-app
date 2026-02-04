// src/agents/betinho/IntentValidator.js
/**
 * VALIDADOR DE INTENÇÃO
 * 
 * Analisa o que o usuário quer fazer e valida antes de executar.
 * Garante que Betinho nunca executa às cegas.
 */

export default class IntentValidator {
  constructor() {
    this.intentPatterns = this.loadIntentPatterns();
  }

  /**
   * Analisa intenção do usuário
   */
  async analyze(descricao, context = {}) {
    // Detecta tipo de tarefa
    const tipo = this.detectTaskType(descricao);
    
    // Extrai parâmetros
    const parametros = this.extractParameters(descricao, tipo);
    
    // Determina complexidade
    const complexidade = this.assessComplexity(tipo, parametros);
    
    // Identifica especialistas necessários
    const especialistas = this.identifyRequiredSpecialists(tipo, parametros);
    
    // Verifica operações GitHub
    const githubOps = this.detectGitHubOperations(descricao);
    
    return {
      tipo,
      verbo: this.extractVerb(descricao),
      objeto: this.extractObject(descricao),
      descricaoCompleta: descricao,
      parametros,
      complexidade,
      especialistas,
      githubOps,
      context,
      timestamp: new Date()
    };
  }

  /**
   * Detecta tipo de tarefa
   */
  detectTaskType(descricao) {
    const desc = descricao.toLowerCase();
    
    // Acadêmico
    if (this.matchesPattern(desc, this.intentPatterns.academico)) {
      if (desc.includes('abnt') || desc.includes('apa')) return 'FORMATAR_NORMAS';
      if (desc.includes('tcc') || desc.includes('monografia')) return 'CRIAR_TCC';
      if (desc.includes('artigo')) return 'CRIAR_ARTIGO';
      if (desc.includes('resumo')) return 'GERAR_RESUMO';
      if (desc.includes('cronograma')) return 'CRIAR_CRONOGRAMA';
      return 'ACADEMICO_GERAL';
    }
    
    // Desenvolvimento
    if (this.matchesPattern(desc, this.intentPatterns.desenvolvimento)) {
      if (desc.includes('app') || desc.includes('aplicativo')) return 'CRIAR_APP';
      if (desc.includes('api')) return 'CRIAR_API';
      if (desc.includes('site') || desc.includes('website')) return 'CRIAR_SITE';
      if (desc.includes('componente')) return 'CRIAR_COMPONENTE';
      if (desc.includes('teste')) return 'CRIAR_TESTES';
      return 'DESENVOLVIMENTO_GERAL';
    }
    
    // GitHub
    if (this.matchesPattern(desc, this.intentPatterns.github)) {
      if (desc.includes('repositório') || desc.includes('repo')) return 'CRIAR_REPO';
      if (desc.includes('commit')) return 'FAZER_COMMIT';
      if (desc.includes('pull request') || desc.includes('pr')) return 'CRIAR_PR';
      if (desc.includes('issue')) return 'CRIAR_ISSUE';
      return 'GITHUB_OPERATION';
    }
    
    // Produtividade
    if (this.matchesPattern(desc, this.intentPatterns.produtividade)) {
      if (desc.includes('relatório')) return 'GERAR_RELATORIO';
      if (desc.includes('apresentação')) return 'CRIAR_APRESENTACAO';
      if (desc.includes('planilha')) return 'CRIAR_PLANILHA';
      return 'PRODUTIVIDADE_GERAL';
    }
    
    // Criativo
    if (this.matchesPattern(desc, this.intentPatterns.criativo)) {
      if (desc.includes('post') || desc.includes('artigo')) return 'ESCREVER_CONTEUDO';
      if (desc.includes('roteiro')) return 'CRIAR_ROTEIRO';
      return 'CRIATIVO_GERAL';
    }
    
    return 'DESCONHECIDO';
  }

  /**
   * Extrai parâmetros da descrição
   */
  extractParameters(descricao, tipo) {
    const params = {};
    
    // Tema/assunto
    const temaMatch = descricao.match(/sobre\s+(.+?)(?:\s+em|\s+para|\s+com|$)/i);
    if (temaMatch) params.tema = temaMatch[1];
    
    // Linguagem de programação
    const linguagemMatch = descricao.match(/(javascript|python|java|go|rust|typescript|php|ruby)/i);
    if (linguagemMatch) params.linguagem = linguagemMatch[1];
    
    // Framework
    const frameworkMatch = descricao.match(/(react|vue|angular|django|express|next|nuxt|flask)/i);
    if (frameworkMatch) params.framework = frameworkMatch[1];
    
    // Norma técnica
    const normaMatch = descricao.match(/(abnt|apa|iso|vancouver|chicago|mla)/i);
    if (normaMatch) params.norma = normaMatch[1];
    
    // Tamanho/extensão
    const tamanhoMatch = descricao.match(/(\d+)\s*(páginas?|palavras?|linhas?)/i);
    if (tamanhoMatch) {
      params.tamanho = parseInt(tamanhoMatch[1]);
      params.unidade = tamanhoMatch[2];
    }
    
    // Prazo
    const prazoMatch = descricao.match(/em\s+(\d+)\s*(dias?|semanas?|meses?|horas?)/i);
    if (prazoMatch) {
      params.prazo = parseInt(prazoMatch[1]);
      params.unidadeTempo = prazoMatch[2];
    }
    
    return params;
  }

  /**
   * Avalia complexidade da tarefa
   */
  assessComplexity(tipo, parametros) {
    let score = 0;
    
    // Complexidade base por tipo
    const complexidadeBase = {
      'FORMATAR_NORMAS': 2,
      'CRIAR_TCC': 5,
      'CRIAR_ARTIGO': 4,
      'CRIAR_APP': 5,
      'CRIAR_API': 4,
      'CRIAR_SITE': 4,
      'GERAR_RELATORIO': 3,
      'CRIAR_CRONOGRAMA': 2
    };
    
    score = complexidadeBase[tipo] || 3;
    
    // Ajusta por parâmetros
    if (parametros.tamanho > 50) score += 1;
    if (parametros.tamanho > 100) score += 1;
    if (parametros.prazo && parametros.prazo < 7) score += 1;
    
    // Normaliza (1-5)
    score = Math.min(5, Math.max(1, score));
    
    return {
      nivel: score,
      descricao: this.getComplexityDescription(score)
    };
  }

  getComplexityDescription(score) {
    const descriptions = {
      1: 'Simples (poucos minutos)',
      2: 'Moderada (15-30 minutos)',
      3: 'Média (30-60 minutos)',
      4: 'Alta (1-2 horas)',
      5: 'Muito Alta (2+ horas)'
    };
    return descriptions[score] || 'Indefinida';
  }

  /**
   * Identifica especialistas necessários
   */
  identifyRequiredSpecialists(tipo, parametros) {
    const especialistas = [];
    
    // Mapeamento tipo -> especialistas
    const mapping = {
      'FORMATAR_NORMAS': ['abnt', 'metodologia'],
      'CRIAR_TCC': ['pesquisa_academica', 'metodologia', 'abnt', 'redacao_tecnica'],
      'CRIAR_ARTIGO': ['pesquisa_academica', 'redacao_tecnica'],
      'CRIAR_APP': ['arquitetura_software', 'frontend', 'backend'],
      'CRIAR_API': ['backend', 'arquitetura_software'],
      'CRIAR_CRONOGRAMA': ['produtividade', 'planejamento'],
      'GERAR_RESUMO': ['redacao_tecnica']
    };
    
    if (mapping[tipo]) {
      especialistas.push(...mapping[tipo]);
    }
    
    // Adiciona especialista de norma se especificado
    if (parametros.norma) {
      especialistas.push(parametros.norma.toLowerCase());
    }
    
    return [...new Set(especialistas)];
  }

  /**
   * Detecta operações GitHub
   */
  detectGitHubOperations(descricao) {
    const desc = descricao.toLowerCase();
    const ops = [];
    
    if (desc.includes('criar repo') || desc.includes('criar repositório')) {
      ops.push('CREATE_REPO');
    }
    if (desc.includes('commit') || desc.includes('salvar no github')) {
      ops.push('COMMIT');
    }
    if (desc.includes('pull request') || desc.includes('pr')) {
      ops.push('CREATE_PR');
    }
    if (desc.includes('issue')) {
      ops.push('CREATE_ISSUE');
    }
    if (desc.includes('deploy') || desc.includes('publicar')) {
      ops.push('DEPLOY');
    }
    
    return ops;
  }

  /**
   * Solicita confirmação do usuário
   */
  async requestConfirmation(resumo, usuarioId) {
    // Interface de confirmação (será conectada ao UI)
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.betinhoUI) {
        window.betinhoUI.showConfirmation(resumo, (resposta) => {
          resolve(this.processarResposta(resposta));
        });
      } else {
        // Fallback para testes
        resolve({
          aprovado: true,
          acao: 'CONFIRMAR',
          usuarioId
        });
      }
    });
  }

  processarResposta(resposta) {
    return {
      aprovado: resposta.acao === 'CONFIRMAR',
      acao: resposta.acao, // CONFIRMAR | AJUSTAR | CANCELAR
      feedback: resposta.feedback || '',
      ajustes: resposta.ajustes || {},
      acoesAutorizadas: resposta.acoesAutorizadas || [],
      timestamp: new Date()
    };
  }

  /**
   * Helpers
   */
  matchesPattern(text, patterns) {
    return patterns.some(pattern => text.includes(pattern));
  }

  extractVerb(descricao) {
    const verbos = {
      'criar': ['criar', 'cria', 'crie'],
      'gerar': ['gerar', 'gera', 'gere'],
      'formatar': ['formatar', 'formata', 'formate'],
      'escrever': ['escrever', 'escreve', 'escreva'],
      'fazer': ['fazer', 'faz', 'faça'],
      'desenvolver': ['desenvolver', 'desenvolve', 'desenvolva'],
      'automatizar': ['automatizar', 'automatiza', 'automatize']
    };
    
    for (const [verbo, variantes] of Object.entries(verbos)) {
      if (variantes.some(v => descricao.toLowerCase().startsWith(v))) {
        return verbo;
      }
    }
    
    return 'executar';
  }

  extractObject(descricao) {
    const objetos = ['tcc', 'artigo', 'app', 'site', 'api', 'cronograma', 
                     'resumo', 'relatório', 'código', 'projeto'];
    
    for (const obj of objetos) {
      if (descricao.toLowerCase().includes(obj)) {
        return obj;
      }
    }
    
    return 'tarefa';
  }

  loadIntentPatterns() {
    return {
      academico: ['tcc', 'monografia', 'artigo', 'trabalho', 'abnt', 'apa', 
                  'referências', 'citações', 'resumo', 'abstract', 'cronograma'],
      desenvolvimento: ['app', 'aplicativo', 'código', 'programa', 'sistema',
                       'api', 'site', 'website', 'frontend', 'backend'],
      github: ['github', 'repositório', 'repo', 'commit', 'pull request',
               'pr', 'issue', 'branch', 'merge'],
      produtividade: ['relatório', 'apresentação', 'planilha', 'documento',
                     'análise', 'dashboard'],
      criativo: ['post', 'artigo', 'conteúdo', 'texto', 'roteiro', 
                 'narrativa', 'história']
    };
  }
}