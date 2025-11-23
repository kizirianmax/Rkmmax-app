/**
 * OPTIMIZED API MANAGER
 * 
 * Arquitetura otimizada para 3 providers:
 * 1. Gemini 2.5 Pro (Principal - qualidade)
 * 2. Gemini 2.5 Flash Lite (Principal - custo)
 * 3. Groq (Fallback - velocidade extrema)
 * 
 * Estratégia:
 * - Gemini Pro para tarefas complexas/críticas
 * - Gemini Flash Lite para tarefas simples/rápidas
 * - Groq como fallback em caso de falha
 */

class OptimizedAPIManager {
  constructor(config = {}) {
    this.config = {
      googleKey: process.env.GOOGLE_API_KEY,
      groqKey: process.env.GROQ_API_KEY,
      ...config,
    };

    this.providers = {
      gemini: this.initGemini(),
      groq: this.initGroq(),
    };

    this.cache = new Map();
    this.rateLimits = {
      gemini: { calls: 0, resetTime: Date.now() + 60000 },
      groq: { calls: 0, resetTime: Date.now() + 60000 },
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
   */
  initGemini() {
    if (!this.config.googleKey) return null;

    return {
      apiKey: this.config.googleKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/models',
      models: {
        'gemini-2.5-pro': {
          maxTokens: 1000000,
          costPer1kTokens: 0.00075,
          costOutputPer1kTokens: 0.003,
          description: 'Modelo de qualidade máxima para tarefas complexas',
          priority: 1,
        },
        'gemini-2.5-flash-lite': {
          maxTokens: 1000000,
          costPer1kTokens: 0.0000375,
          costOutputPer1kTokens: 0.00015,
          description: 'Modelo rápido e barato para tarefas simples',
          priority: 1,
        },
      },
      defaultModel: 'gemini-2.5-flash-lite',
    };
  }

  /**
   * INICIALIZAR GROQ
   */
  initGroq() {
    if (!this.config.groqKey) return null;

    return {
      apiKey: this.config.groqKey,
      baseURL: 'https://api.groq.com/openai/v1',
      models: {
        'llama-3.1-70b-versatile': {
          maxTokens: 8000,
          costPer1kTokens: 0.00027,
          description: 'Fallback rápido para tarefas simples',
          priority: 2,
        },
        'mixtral-8x7b-32768': {
          maxTokens: 32768,
          costPer1kTokens: 0.00024,
          description: 'Fallback para tarefas médias',
          priority: 2,
        },
      },
      defaultModel: 'llama-3.1-70b-versatile',
    };
  }

  /**
   * SELECIONAR MODELO IDEAL
   * 
   * Estratégia:
   * - Tarefas simples: Gemini Flash Lite (mais barato)
   * - Tarefas complexas: Gemini Pro (melhor qualidade)
   * - Fallback: Groq (velocidade extrema)
   */
  selectModel(complexity = 'simple', options = {}) {
    if (options.forceProvider === 'groq') {
      return {
        provider: 'groq',
        model: options.model || this.providers.groq.defaultModel,
      };
    }

    if (options.forceProvider === 'gemini') {
      return {
        provider: 'gemini',
        model: options.model || this.providers.gemini.defaultModel,
      };
    }

    // Seleção automática baseada em complexidade
    switch (complexity) {
      case 'simple':
        return {
          provider: 'gemini',
          model: 'gemini-2.5-flash-lite', // Mais barato
        };

      case 'medium':
        return {
          provider: 'gemini',
          model: 'gemini-2.5-flash-lite',
        };

      case 'complex':
        return {
          provider: 'gemini',
          model: 'gemini-2.5-pro', // Melhor qualidade
        };

      case 'critical':
        return {
          provider: 'gemini',
          model: 'gemini-2.5-pro', // Máxima qualidade
        };

      default:
        return {
          provider: 'gemini',
          model: this.providers.gemini.defaultModel,
        };
    }
  }

  /**
   * CHAMAR API COM FALLBACK AUTOMÁTICO
   */
  async callWithFallback(prompt, options = {}) {
    const complexity = options.complexity || 'simple';
    const maxRetries = options.maxRetries || 2;

    // Tentar Gemini primeiro
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const selection = this.selectModel(complexity, options);
        const result = await this.call(selection.provider, prompt, {
          ...options,
          model: selection.model,
        });

        return {
          success: true,
          provider: selection.provider,
          model: selection.model,
          result,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.warn(`Tentativa ${attempt + 1} falhou:`, error.message);

        if (attempt === maxRetries - 1) {
          // Última tentativa falhou, usar Groq como fallback
          try {
            this.stats.fallbacks++;
            const result = await this.call('groq', prompt, options);

            return {
              success: true,
              provider: 'groq',
              model: this.providers.groq.defaultModel,
              result,
              fallback: true,
              timestamp: new Date().toISOString(),
            };
          } catch (fallbackError) {
            return {
              success: false,
              errors: [
                { provider: 'gemini', error: error.message },
                { provider: 'groq', error: fallbackError.message },
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
      case 'gemini':
        result = await this.callGemini(prompt, options);
        break;
      case 'groq':
        result = await this.callGroq(prompt, options);
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
   */
  async callGemini(prompt, options = {}) {
    const model = options.model || this.providers.gemini.defaultModel;
    const maxTokens = options.maxTokens || 2000;

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
   */
  async callGroq(prompt, options = {}) {
    const model = options.model || this.providers.groq.defaultModel;
    const maxTokens = options.maxTokens || 2000;

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

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();

    const text = data.choices[0].message.content;
    const totalTokens = data.usage.total_tokens;
    const inputTokens = data.usage.prompt_tokens;
    const outputTokens = data.usage.completion_tokens;

    const modelConfig = this.providers.groq.models[model];
    const cost = (totalTokens / 1000) * modelConfig.costPer1kTokens;

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
      gemini: {},
      groq: {},
    };

    // Gemini
    for (const [model, config] of Object.entries(this.providers.gemini.models)) {
      const inputCost = (tokens / 1000) * config.costPer1kTokens;
      const outputCost = (tokens / 1000) * config.costOutputPer1kTokens;
      costs.gemini[model] = inputCost + outputCost;
    }

    // Groq
    for (const [model, config] of Object.entries(this.providers.groq.models)) {
      costs.groq[model] = (tokens / 1000) * config.costPer1kTokens;
    }

    return costs;
  }

  /**
   * OBTER STATUS
   */
  getStatus() {
    return {
      gemini: this.providers.gemini ? 'available' : 'not-configured',
      groq: this.providers.groq ? 'available' : 'not-configured',
    };
  }

  /**
   * OBTER MODELOS DISPONÍVEIS
   */
  getAvailableModels() {
    return {
      gemini: Object.keys(this.providers.gemini?.models || {}),
      groq: Object.keys(this.providers.groq?.models || {}),
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

module.exports = OptimizedAPIManager;

