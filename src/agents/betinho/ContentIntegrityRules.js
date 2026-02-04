// src/agents/betinho/ContentIntegrityRules.js
/**
 * REGRA DE INTEGRIDADE DE CONTEÚDO
 * 
 * Especialistas normativos (ABNT, ISO, APA, Vancouver)
 * NUNCA alteram CONTEÚDO, apenas FORMA e ESTRUTURA,
 * salvo autorização explícita do usuário.
 */

export default class ContentIntegrityRules {
  constructor() {
    // Especialistas que aplicam normas técnicas
    this.normativeSpecialists = [
      'abnt',
      'iso',
      'apa',
      'vancouver',
      'chicago',
      'mla',
      'ieee',
      'compliance',
      'lgpd'
    ];
    
    // Ações permitidas SEM autorização (só forma/estrutura)
    this.allowedActions = {
      FORMATTING: [
        'adjust_margins',
        'adjust_spacing',
        'adjust_font',
        'adjust_font_size',
        'apply_bold',
        'apply_italic',
        'apply_underline',
        'line_spacing',
        'paragraph_spacing',
        'page_breaks',
        'alignment',
        'indentation'
      ],
      
      STRUCTURE: [
        'organize_sections',
        'add_section_numbers',
        'create_table_of_contents',
        'create_index',
        'add_headers',
        'add_footers',
        'add_page_numbers',
        'order_references',
        'format_citations',
        'apply_templates'
      ],
      
      TECHNICAL: [
        'format_references_abnt',
        'format_references_apa',
        'format_references_iso',
        'format_citations_inline',
        'format_footnotes',
        'format_bibliography',
        'apply_nbr_rules',
        'apply_iso_standards'
      ]
    };
    
    // Ações que alteram CONTEÚDO (precisam autorização)
    this.restrictedActions = {
      CONTENT_MODIFICATION: [
        'change_words',
        'rewrite_sentences',
        'paraphrase',
        'summarize',
        'expand_text',
        'fix_grammar',
        'fix_spelling',
        'fix_punctuation',
        'improve_writing',
        'change_style',
        'add_content',
        'remove_content',
        'translate'
      ]
    };
  }

  /**
   * Verifica se ação é permitida sem autorização
   */
  isAllowedWithoutPermission(specialistId, action) {
    // Se não é especialista normativo, tem liberdade
    if (!this.isNormativeSpecialist(specialistId)) {
      return true;
    }
    
    // Se é normativo, só pode fazer formatação/estrutura
    return this.isFormattingAction(action) || 
           this.isStructureAction(action) ||
           this.isTechnicalAction(action);
  }

  /**
   * Verifica se é especialista normativo
   */
  isNormativeSpecialist(specialistId) {
    return this.normativeSpecialists.includes(specialistId.toLowerCase());
  }

  /**
   * Verifica se ação é de formatação
   */
  isFormattingAction(action) {
    return this.allowedActions.FORMATTING.includes(action);
  }

  /**
   * Verifica se ação é de estrutura
   */
  isStructureAction(action) {
    return this.allowedActions.STRUCTURE.includes(action);
  }

  /**
   * Verifica se ação é técnica (normas)
   */
  isTechnicalAction(action) {
    return this.allowedActions.TECHNICAL.includes(action);
  }

  /**
   * Verifica se ação altera conteúdo
   */
  isContentModification(action) {
    return this.restrictedActions.CONTENT_MODIFICATION.includes(action);
  }

  /**
   * Cria mensagem de autorização necessária
   */
  createAuthorizationRequest(specialistId, actions) {
    const actionsNeedingAuth = actions.filter(a => 
      !this.isAllowedWithoutPermission(specialistId, a.type)
    );
    
    if (actionsNeedingAuth.length === 0) {
      return null;
    }
    
    return {
      title: "⚠️ Autorização Necessária",
      specialist: specialistId,
      rule: `📜 **Regra de Integridade:**\n\nEspecialistas normativos (${this.normativeSpecialists.join(', ')})\nNUNCA alteram CONTEÚDO sem sua autorização expressa.\n\nEles ajustam apenas:\n✅ Formatação (margens, fontes, espaços)\n✅ Estrutura (ordem, numeração, organização)\n✅ Normas técnicas (referências, citações)\n\nPara alterar palavras, frases ou significado,\nvocê precisa autorizar explicitamente.`,
      
      actionsNeedingAuth: actionsNeedingAuth.map(action => ({
        type: action.type,
        description: this.describeAction(action),
        example: action.example,
        impact: "Altera CONTEÚDO do seu trabalho"
      })),
      
      warning: `⚠️ ATENÇÃO:\n\nVocê mantém total responsabilidade pelo conteúdo.\nMesmo autorizando correções, você é o autor do trabalho\ne deve revisar todas as alterações.\n\nAutorizar estas modificações de conteúdo?`,
      
      options: [
        { value: 'authorize_all', label: '✅ Autorizar Todas' },
        { value: 'choose', label: '🔧 Escolher Quais Autorizar' },
        { value: 'deny', label: '❌ Não Autorizar' }
      ]
    };
  }

  /**
   * Descreve ação em português claro
   */
  describeAction(action) {
    const descriptions = {
      change_words: 'Alterar palavras ou termos',
      rewrite_sentences: 'Reescrever frases',
      paraphrase: 'Parafrasear trechos',
      summarize: 'Resumir conteúdo',
      expand_text: 'Expandir texto',
      fix_grammar: 'Corrigir gramática',
      fix_spelling: 'Corrigir ortografia',
      fix_punctuation: 'Corrigir pontuação',
      improve_writing: 'Melhorar redação',
      change_style: 'Alterar estilo de escrita',
      add_content: 'Adicionar conteúdo novo',
      remove_content: 'Remover conteúdo existente',
      translate: 'Traduzir texto'
    };
    
    return descriptions[action.type] || action.type;
  }

  /**
   * Valida autorização do usuário
   */
  validateAuthorization(authorization) {
    return {
      valid: authorization && authorization.confirmed === true,
      timestamp: authorization?.timestamp,
      actions: authorization?.authorizedActions || [],
      userId: authorization?.userId
    };
  }

  /**
   * Cria log de auditoria para ação de conteúdo
   */
  createAuditLog(specialistId, action, authorization, userId) {
    return {
      type: 'CONTENT_MODIFICATION',
      specialist: specialistId,
      action: action.type,
      description: action.description,
      authorization: {
        required: true,
        granted: authorization.valid,
        timestamp: authorization.timestamp,
        userId: userId
      },
      timestamp: new Date(),
      hash: this.generateAuthorizationHash(specialistId, action, userId)
    };
  }

  /**
   * Gera hash de autorização (para auditoria)
   */
  generateAuthorizationHash(specialistId, action, userId) {
    const data = `${specialistId}-${action.type}-${userId}-${Date.now()}`;
    // Em produção, usar crypto.createHash('sha256')
    return Buffer.from(data).toString('base64');
  }

  /**
   * Explica regra de integridade em português
   */
  explainRule() {
    return `📜 **REGRA DE INTEGRIDADE DE CONTEÚDO**\n\n╔══════════════════════════════════════════════════╗\n║  Especialistas normativos (ABNT, ISO, APA, etc) ║\n║  NUNCA alteram CONTEÚDO, apenas FORMA.          ║\n╚══════════════════════════════════════════════════╝\n\n**O que PODE fazer SEM pedir:**\n✅ Ajustar margens, espaçamento, fontes\n✅ Formatar referências (ordem, pontuação)\n✅ Corrigir estrutura (seções, numeração)\n✅ Aplicar normas visuais (negrito, itálico)\n\n**O que NÃO PODE fazer sem autorização:**\n❌ Mudar palavras ou frases\n❌ Adicionar/remover conteúdo\n❌ Corrigir gramática/ortografia\n❌ Reescrever parágrafos\n❌ Alterar significado\n\n**Por quê esta regra existe?**\n\n1. **Preserva autoria:** Seu trabalho continua 100% seu\n2. **Evita plágio:** Nada é alterado sem seu conhecimento\n3. **Mantém integridade:** O significado nunca muda\n4. **Segurança acadêmica:** Você sempre sabe o que foi feito\n5. **Conformidade ética:** Respeita normas acadêmicas\n\n**Quando precisar de correções de conteúdo:**\n\nVocê pode autorizar explicitamente, e o Betinho:\n1. Mostra exatamente o que vai mudar (antes/depois)\n2. Pede sua confirmação para cada mudança\n3. Registra tudo em log de auditoria\n4. Você mantém controle total`;\n  }\n}