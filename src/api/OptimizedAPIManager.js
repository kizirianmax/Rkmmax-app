/**
 * OPTIMIZED API MANAGER
 * 
 * Arquitetura otimizada para 2 providers:
 * 1. Groq GPT-OSS-120B (Principal - raciocínio e velocidade)
 * 2. Claude 4.5 Sonnet (Fallback - qualidade)
 * 
 * Estratégia:
 * - Groq GPT-OSS-120B para raciocínio e tarefas principais
 * - Claude 4.5 Sonnet como fallback de alta qualidade
 * - Gemini desabilitado como principal (pode ser usado via forceProvider)
 * 
 * ⚠️ SEGURANÇA: Usa SecretManager para injetar credenciais
 */

import secretManager from './SecretManager';
import { validateGroqApiKey } from '../utils/groqValidation.js';

class OptimizedAPIManager {
  constructor(config = {}) {
    // 🔐 INICIALIZAR SECRET MANAGER
    if (!secretManager.initialized) {
      secretManager.initialize();
    }

    this.config = {
      // 🔐 USAR SECRET MANAGER EM VEZ DE PROCESS.ENV DIRETO
      googleKey: secretManager.getSecret('gemini'),
      groqKey: secretManager.getSecret('groq'),
      claudeKey: secretManager.getSecret('anthropic') || process.env.ANTHROPIC_API_KEY,
      ...config,
    };

    this.providers = {
      groq: this.initGroq(),
      claude: this.initClaude(),
      gemini: this.initGemini(), // Mantido apenas para compatibilidade
    };

    this.cache = new Map();
    this.rateLimits = {
      groq: { calls: 0, resetTime: Date.now() + 60000 },
      claude: { calls: 0, resetTime: Date.now() + 60000 },
      gemini: { calls: 0, resetTime: Date.now() + 60000 },
    };

    this.stats = {
      totalCalls: 0,
      totalCost: 0,
      cacheHits: 0,
      cacheMisses: 0,
      fallbacks: 0,
    };
  }

  /**
   * INICIALIZAR GEMINI
   * 🔐 SEGURO: Usa SecretManager para obter API key
   */
  initGemini() {
    // 🔐 OBTER CHAVE DO SECRET MANAGER
    const apiKey = this.config.googleKey || secretManager.getSecret('gemini') || '';
    
    return {
      apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/models',
      isConfigured: !!apiKey,
      models: {
        'gemini-2.5-pro': {
          maxTokens: 1000000,
          costPer1kTokens: 0.00075,
          costOutputPer1kTokens: 0.003,
          description: 'Modelo de qualidade máxima para tarefas complexas (ESPECIALISTA 54)',
          priority: 1,
          tier: 'premium',
        },
        'gemini-2.5-flash-lite': {
          maxTokens: 1000000,
          costPer1kTokens: 0.0000375,
          costOutputPer1kTokens: 0.00015,
          description: 'Modelo rápido e barato para tarefas simples',
          priority: 1,
          tier: 'standard',
        },
      },
      defaultModel: 'gemini-2.5-flash-lite',
    };
  }

  /**
   * INICIALIZAR GROQ
   * 🔐 SEGURO: Usa SecretManager para obter API key
   * ATUALIZADO: Groq agora é o provider PRIMÁRIO com 3 modelos habilitados
   */
  initGroq() {
    // 🔐 OBTER CHAVE DO SECRET MANAGER
    const apiKey = this.config.groqKey || secretManager.getSecret('groq') || '';
    
    // ✅ VALIDAÇÃO USANDO A FUNÇÃO CENTRALIZADA
    let isConfigured = false;
    try {
      if (apiKey) {
        validateGroqApiKey(apiKey);
        isConfigured = true;
      }
    } catch (error) {
      console.warn('⚠️ Validação do Groq API falhou:');
      console.warn(error.message);
    }
    
    return {
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
      isConfigured,
      models: {
        'openai/gpt-oss-120b': {
          maxTokens: 8000,
          costPer1kTokens: 0.00027,
          description: 'Modelo principal de raciocínio (PRIMARY - 120B parâmetros)',
          priority: 1,
          tier: 'primary',
        },
        'llama-3.3-70b-versatile': {
          maxTokens: 8000,
          costPer1kTokens: 0.00024,
          description: 'Modelo versátil de uso geral (70B parâmetros)',
          priority: 1,
          tier: 'primary',
        },
        'llama-3.1-8b-instant': {
          maxTokens: 4000,
          costPer1kTokens: 0.00005,
          description: 'Modelo rápido para respostas simples (8B parâmetros)',
          priority: 1,
          tier: 'speed',
        },
      },
      defaultModel: 'openai/gpt-oss-120b',
    };
  }

  /**
   * INICIALIZAR CLAUDE
   * 🔐 SEGURO: Usa SecretManager para obter API key
   * Claude 4.5 Sonnet como FALLBACK de alta qualidade
   */
  initClaude() {
    // 🔐 OBTER CHAVE DO SECRET MANAGER OU ENV
    const apiKey = this.config.claudeKey || '';
    
    return {
      apiKey,
      baseURL: 'https://api.anthropic.com/v1',
      isConfigured: !!apiKey,
      models: {
        'claude-sonnet-4-5-20250929': {
          maxTokens: 8000,
          costPer1kTokens: 0.003,
          costOutputPer1kTokens: 0.015,
          description: 'Claude 4.5 Sonnet - Fallback de alta qualidade',
          priority: 2,
          tier: 'fallback',
        },
      },
      defaultModel: 'claude-sonnet-4-5-20250929',
      version: '2023-06-01', // API version
    };
  }

  /**
   * SELECIONAR MODELO IDEAL
   * ATUALIZADO: Groq GPT-OSS-120B como PRIMARY, Claude como FALLBACK
   * 
   * Estratégia:
   * - Todas as tarefas: Groq GPT-OSS-120B (raciocínio principal)
   * - Fallback: Claude 4.5 Sonnet (qualidade)
   * - Gemini: Apenas com forceProvider (legacy)
   */
  selectModel(complexity = 'simple', options = {}) {
    // Verificar se pelo menos um provider está inicializado
    if (!this.providers.groq && !this.providers.claude && !this.providers.gemini) {
      console.warn('⚠️ Nenhum provider inicializado!');
      // Retornar fallback default mesmo sem configuração
      return {
        provider: 'groq',
        model: 'openai/gpt-oss-120b',
      };
    }

    // Permitir forçar provider específico
    if (options.forceProvider === 'claude') {
      return {
        provider: 'claude',
        model: options.model || this.providers.claude.defaultModel,
        tier: 'fallback',
      };
    }

    if (options.forceProvider === 'groq') {
      return {
        provider: 'groq',
        model: options.model || this.providers.groq.defaultModel,
        tier: 'primary',
      };
    }

    if (options.forceProvider === 'gemini') {
      return {
        provider: 'gemini',
        model: options.model || this.providers.gemini.defaultModel,
        specialist: options.model === 'gemini-2.5-pro' ? 'specialist-54' : 'standard',
      };
    }

    // Seleção automática: SEMPRE Groq como primário
    // Independente da complexidade, usamos Groq GPT-OSS-120B
    return {
      provider: 'groq',
      model: 'openai/gpt-oss-120b',
      tier: 'primary',
      description: 'Raciocínio principal com GPT-OSS-120B',
    };
  }

  /**
   * CHAMAR API COM FALLBACK AUTOMÁTICO
   * ATUALIZADO: Groq (primary) → Claude (fallback) → Fail
   */
  async callWithFallback(prompt, options = {}) {
    const complexity = options.complexity || 'simple';
    const maxRetries = options.maxRetries || 2;

    // 1. Tentar Groq primeiro (PRIMARY)
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const selection = this.selectModel(complexity, options);
        
        console.log(`🚀 Tentativa ${attempt + 1}: ${selection.provider} (${selection.model})`);
        
        const result = await this.call(selection.provider, prompt, {
          ...options,
          model: selection.model,
        });

        return {
          success: true,
          provider: selection.provider,
          model: selection.model,
          tier: selection.tier,
          result,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.warn(`❌ Tentativa ${attempt + 1} falhou:`, error.message);

        if (attempt === maxRetries - 1) {
          // Groq falhou, tentar Claude como fallback
          try {
            this.stats.fallbacks++;
            console.log('⚠️ FALLBACK para CLAUDE 4.5 Sonnet');
            const result = await this.call('claude', prompt, options);

            return {
              success: true,
              provider: 'claude',
              model: this.providers.claude.defaultModel,
              result,
              fallback: true,
              timestamp: new Date().toISOString(),
            };
          } catch (fallbackError) {
            console.error('🔴 TODOS OS PROVIDERS FALHARAM');
            return {
              success: false,
              errors: [
                { provider: 'groq', error: error.message },
                { provider: 'claude', error: fallbackError.message },
              ],
              timestamp: new Date().toISOString(),
            };
          }
        }
      }
    }
  }

  /**
   * CHAMAR API ESPECÍFICA
   */
  async call(provider, prompt, options = {}) {
    // Verificar cache
    const cacheKey = `${provider}:${options.model || 'default'}:${prompt}`;
    if (this.cache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.cache.get(cacheKey);
    }

    this.stats.cacheMisses++;

    // Verificar rate limit
    if (!this.checkRateLimit(provider)) {
      throw new Error(`Rate limit exceeded for ${provider}`);
    }

    let result;

    switch (provider) {
      case 'groq':
        result = await this.callGroq(prompt, options);
        break;
      case 'claude':
        result = await this.callClaude(prompt, options);
        break;
      case 'gemini':
        result = await this.callGemini(prompt, options);
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    // Cachear resultado
    this.cache.set(cacheKey, result);
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.stats.totalCalls++;
    this.stats.totalCost += result.cost;

    return result;
  }

  /**
   * CHAMAR GEMINI
   * CORRIGIDO: Verificar se API key está configurada
   */
  async callGemini(prompt, options = {}) {
    // ✅ VERIFICAÇÃO CRÍTICA: Gemini Pro requer API key
    if (!this.providers.gemini.isConfigured) {
      throw new Error('❌ GEMINI_API_KEY não configurada! Especialista 54 não pode ser ativado.');
    }
    
    const model = options.model || this.providers.gemini.defaultModel;
    const maxTokens = options.maxTokens || 2000;
    
    // Log para debug
    if (model === 'gemini-2.5-pro') {
      console.log('🚀 Chamando ESPECIALISTA 54 (Gemini Pro)...');
    }

    const response = await fetch(
      `${this.providers.gemini.baseURL}/${model}:generateContent?key=${this.providers.gemini.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: options.temperature || 0.7,
            topP: options.topP || 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      throw new Error('Gemini API returned empty response');
    }

    const text = data.candidates[0].content.parts[0].text;
    const inputTokens = data.usageMetadata.promptTokenCount;
    const outputTokens = data.usageMetadata.candidatesTokenCount;
    const totalTokens = inputTokens + outputTokens;

    const modelConfig = this.providers.gemini.models[model];
    const cost =
      (inputTokens / 1000) * modelConfig.costPer1kTokens +
      (outputTokens / 1000) * modelConfig.costOutputPer1kTokens;

    return {
      text,
      model,
      provider: 'gemini',
      tokens: totalTokens,
      inputTokens,
      outputTokens,
      cost,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * CHAMAR GROQ
   * ATUALIZADO: Groq agora é o provider PRIMÁRIO
   */
  async callGroq(prompt, options = {}) {
    // ✅ VERIFICAÇÃO: Groq requer API key
    if (!this.providers.groq.isConfigured) {
      throw new Error('❌ GROQ_API_KEY não configurada! Provider primário não pode ser ativado.');
    }
    
    const model = options.model || this.providers.groq.defaultModel;
    const maxTokens = options.maxTokens || 2000;

    // ✅ LOG DE DEBUG (antes da requisição)
    console.log('🚀 Groq Request:', {
      model,
      endpoint: `${this.providers.groq.baseURL}/chat/completions`,
      promptLength: prompt.length,
      maxTokens,
      apiKeyPrefix: this.providers.groq.apiKey.substring(0, 8) + '...',
      timestamp: new Date().toISOString()
    });

    const response = await fetch(`${this.providers.groq.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.providers.groq.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: options.temperature || 0.7,
      }),
    });

    // ✅ TRATAMENTO DE ERRO DETALHADO
    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = { raw: errorText };
      }
      
      console.error('❌ Groq API Error:', {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Mensagens de erro específicas
      if (response.status === 401) {
        throw new Error(
          `❌ Groq API: Erro de autenticação (401)\n` +
          `Detalhes: ${errorDetails.error?.message || errorText}\n` +
          `Verifique se GROQ_API_KEY está correta no Vercel`
        );
      }
      
      if (response.status === 429) {
        throw new Error(
          `❌ Groq API: Limite de requisições excedido (429)\n` +
          `Detalhes: ${errorDetails.error?.message || errorText}\n` +
          `Aguarde alguns minutos antes de tentar novamente`
        );
      }
      
      if (response.status === 400) {
        throw new Error(
          `❌ Groq API: Requisição inválida (400)\n` +
          `Detalhes: ${errorDetails.error?.message || errorText}\n` +
          `Possível problema com formato das mensagens ou prompt`
        );
      }
      
      throw new Error(
        `❌ Groq API error (${response.status}): ${errorDetails.error?.message || errorText}`
      );
    }

    const data = await response.json();
    
    // ✅ VALIDAR RESPOSTA
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Resposta inválida do Groq:', data);
      throw new Error('Resposta do Groq está em formato inválido');
    }

    const text = data.choices[0].message.content;
    const totalTokens = data.usage.total_tokens;
    const inputTokens = data.usage.prompt_tokens;
    const outputTokens = data.usage.completion_tokens;

    const modelConfig = this.providers.groq.models[model];
    const cost = (totalTokens / 1000) * modelConfig.costPer1kTokens;

    // ✅ LOG DE SUCESSO
    console.log('✅ Groq Response:', {
      model: data.model || model,
      tokensUsed: totalTokens,
      responseLength: text.length,
      cost: cost.toFixed(6),
      timestamp: new Date().toISOString()
    });

    return {
      text,
      model,
      provider: 'groq',
      tokens: totalTokens,
      inputTokens,
      outputTokens,
      cost,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * CHAMAR CLAUDE
   * Claude 4.5 Sonnet como FALLBACK de alta qualidade
   */
  async callClaude(prompt, options = {}) {
    // ✅ VERIFICAÇÃO: Claude requer API key
    if (!this.providers.claude.isConfigured) {
      throw new Error('❌ ANTHROPIC_API_KEY não configurada! Fallback não pode ser ativado.');
    }
    
    // Validate API key format
    const apiKey = this.providers.claude.apiKey;
    if (!apiKey.startsWith('sk-ant-')) {
      throw new Error('❌ Invalid ANTHROPIC_API_KEY format. Must start with sk-ant-');
    }
    
    const model = options.model || this.providers.claude.defaultModel;
    const maxTokens = options.maxTokens || 2000;

    console.log(`🚀 Chamando Claude (${model})...`);
    
    // Debug logging
    console.log('🔑 Claude API Request:', {
      endpoint: `${this.providers.claude.baseURL}/messages`,
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey?.substring(0, 10) + '...',
      model: model,
      maxTokens: maxTokens
    });

    const response = await fetch(`${this.providers.claude.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': this.providers.claude.version,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = { raw: errorText };
      }
      
      console.error('Claude API Error:', {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      throw new Error(
        `Claude API error (${response.status}): ${errorDetails.error?.message || errorText}`
      );
    }

    const data = await response.json();

    const text = data.content[0].text;
    const inputTokens = data.usage.input_tokens;
    const outputTokens = data.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;

    const modelConfig = this.providers.claude.models[model];
    const cost =
      (inputTokens / 1000) * modelConfig.costPer1kTokens +
      (outputTokens / 1000) * modelConfig.costOutputPer1kTokens;

    return {
      text,
      model,
      provider: 'claude',
      tokens: totalTokens,
      inputTokens,
      outputTokens,
      cost,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * VERIFICAR RATE LIMIT
   */
  checkRateLimit(provider) {
    const limit = this.rateLimits[provider];
    const now = Date.now();

    if (now >= limit.resetTime) {
      limit.calls = 0;
      limit.resetTime = now + 60000;
    }

    limit.calls++;
    return limit.calls <= 100; // 100 chamadas por minuto
  }

  /**
   * COMPARAR CUSTOS
   */
  compareCosts(tokens = 1000) {
    const costs = {
      groq: {},
      claude: {},
      gemini: {},
    };

    // Groq
    for (const [model, config] of Object.entries(this.providers.groq.models)) {
      costs.groq[model] = (tokens / 1000) * config.costPer1kTokens;
    }

    // Claude
    for (const [model, config] of Object.entries(this.providers.claude.models)) {
      const inputCost = (tokens / 1000) * config.costPer1kTokens;
      const outputCost = (tokens / 1000) * config.costOutputPer1kTokens;
      costs.claude[model] = inputCost + outputCost;
    }

    // Gemini
    for (const [model, config] of Object.entries(this.providers.gemini.models)) {
      const inputCost = (tokens / 1000) * config.costPer1kTokens;
      const outputCost = (tokens / 1000) * config.costOutputPer1kTokens;
      costs.gemini[model] = inputCost + outputCost;
    }

    return costs;
  }

  /**
   * OBTER STATUS
   */
  getStatus() {
    return {
      groq: this.providers.groq ? 'available' : 'not-configured',
      claude: this.providers.claude ? 'available' : 'not-configured',
      gemini: this.providers.gemini ? 'available' : 'not-configured',
    };
  }

  /**
   * OBTER MODELOS DISPONÍVEIS
   */
  getAvailableModels() {
    return {
      groq: Object.keys(this.providers.groq?.models || {}),
      claude: Object.keys(this.providers.claude?.models || {}),
      gemini: Object.keys(this.providers.gemini?.models || {}),
    };
  }

  /**
   * OBTER ESTATÍSTICAS
   */
  getStats() {
    const cacheHitRate = this.stats.totalCalls > 0
      ? (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses)) * 100
      : 0;

    return {
      totalCalls: this.stats.totalCalls,
      totalCost: this.stats.totalCost.toFixed(4),
      cacheHits: this.stats.cacheHits,
      cacheMisses: this.stats.cacheMisses,
      cacheHitRate: cacheHitRate.toFixed(2) + '%',
      fallbacks: this.stats.fallbacks,
      cacheSize: this.cache.size,
      rateLimits: this.rateLimits,
    };
  }

  /**
   * LIMPAR CACHE
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * RESETAR ESTATÍSTICAS
   */
  resetStats() {
    this.stats = {
      totalCalls: 0,
      totalCost: 0,
      cacheHits: 0,
      cacheMisses: 0,
      fallbacks: 0,
    };
  }

  /**
   * RECOMENDAÇÃO DE MODELO
   */
  recommendModel(complexity = 'simple') {
    const selection = this.selectModel(complexity);
    const model = this.providers[selection.provider].models[selection.model];

    return {
      provider: selection.provider,
      model: selection.model,
      description: model.description,
      costPer1kTokens: model.costPer1kTokens,
      maxTokens: model.maxTokens,
    };
  }
}

// EXPORTAR COMO ES6 DEFAULT
export default OptimizedAPIManager;