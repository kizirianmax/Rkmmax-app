// src/agents/betinho/ContentIntegrityRules.js
/**
 * REGRA DE INTEGRIDADE DE CONTEÚDO DO BETINHO
 * Especialistas normativos nunca alteram conteúdo sem autorização
 */

export default class ContentIntegrityRules {
  constructor() {
    this.normativeSpecialists = ['abnt', 'iso', 'apa', 'vancouver', 'chicago', 'mla', 'ieee', 'compliance'];
    
    this.allowedActions = {
      FORMATTING: ['adjust_margins', 'adjust_spacing', 'adjust_font', 'apply_bold_italic', 'numbering', 'indentation', 'line_spacing', 'page_breaks'],
      STRUCTURE: ['organize_sections', 'order_references', 'create_index', 'add_headers_footers', 'apply_templates'],
      NORMATIVE: ['format_references', 'format_citations', 'apply_standards', 'validate_structure']
    };
    
    this.restrictedActions = {
      CONTENT_CHANGES: ['change_words', 'rewrite_sentences', 'fix_grammar', 'fix_spelling', 'improve_writing', 'add_content', 'remove_content', 'paraphrase']
    };
  }

  isNormativeSpecialist(specialistId) {
    return this.normativeSpecialists.includes(specialistId);
  }

  isAllowedWithoutPermission(specialistId, action) {
    if (!this.isNormativeSpecialist(specialistId)) return true;
    const allowed = [...this.allowedActions.FORMATTING, ...this.allowedActions.STRUCTURE, ...this.allowedActions.NORMATIVE];
    return allowed.includes(action);
  }

  isContentChangingAction(action) {
    return this.restrictedActions.CONTENT_CHANGES.includes(action);
  }

  analyzeWorkflowSteps(steps, specialist) {
    const result = { allowedSteps: [], restrictedSteps: [], requiresAuthorization: false };
    for (const step of steps) {
      if (this.isAllowedWithoutPermission(specialist, step.action)) {
        result.allowedSteps.push(step);
      } else {
        result.restrictedSteps.push(step);
        result.requiresAuthorization = true;
      }
    }
    return result;
  }

  createAuthorizationRequest(specialist, restrictedSteps) {
    return {
      title: "⚠️ Autorização Necessária",
      intro: `O especialista ${specialist} precisa de autorização para alterar conteúdo.`,
      rule: {
        title: "📜 Regra de Integridade",
        description: "Especialistas normativos formatam apenas ESTRUTURA, nunca CONTEÚDO sem autorização."
      },
      restrictedActions: {
        title: "⚠️ Requer autorização:",
        items: restrictedSteps.map(s => ({ action: s.action, description: s.description, impact: "Altera conteúdo" }))
      },
      options: [
        { value: 'authorize_all', label: '✅ Autorizar Todas' },
        { value: 'authorize_selected', label: '🔧 Escolher' },
        { value: 'deny', label: '❌ Não Autorizar' }
      ]
    };
  }

  getSpecialistName(specialistId) {
    const names = {
      'abnt': 'ABNT', 'iso': 'ISO', 'apa': 'APA', 'vancouver': 'Vancouver',
      'chicago': 'Chicago', 'mla': 'MLA', 'ieee': 'IEEE'
    };
    return names[specialistId] || specialistId.toUpperCase();
  }
}