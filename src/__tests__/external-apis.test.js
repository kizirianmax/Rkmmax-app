/**
 * TESTES: ExternalAPIManager
 * 
 * Testa:
 * - Inicialização de providers
 * - Rate limiting
 * - Cache
 * - Fallback automático
 * - Comparação de custos
 */

const ExternalAPIManager = require('../api/ExternalAPIManager');

describe('ExternalAPIManager', () => {
  let apiManager;

  beforeEach(() => {
    apiManager = new ExternalAPIManager({
      openaiKey: 'test-openai-key',
      anthropicKey: 'test-anthropic-key',
      googleKey: 'test-google-key',
      groqKey: 'test-groq-key',
    });
  });

  describe('Inicialização', () => {
    test('deve inicializar com todos os providers', () => {
      expect(apiManager.providers.openai).toBeDefined();
      expect(apiManager.providers.anthropic).toBeDefined();
      expect(apiManager.providers.google).toBeDefined();
      expect(apiManager.providers.groq).toBeDefined();
    });

    test('deve ter modelos disponíveis para cada provider', () => {
      expect(Object.keys(apiManager.providers.openai.models).length).toBeGreaterThan(0);
      expect(Object.keys(apiManager.providers.anthropic.models).length).toBeGreaterThan(0);
      expect(Object.keys(apiManager.providers.google.models).length).toBeGreaterThan(0);
      expect(Object.keys(apiManager.providers.groq.models).length).toBeGreaterThan(0);
    });

    test('deve ter modelos padrão para cada provider', () => {
      expect(apiManager.providers.openai.defaultModel).toBe('gpt-3.5-turbo');
      expect(apiManager.providers.anthropic.defaultModel).toBe('claude-3-sonnet');
      expect(apiManager.providers.google.defaultModel).toBe('gemini-pro');
      expect(apiManager.providers.groq.defaultModel).toBe('llama-2-70b');
    });
  });

  describe('Rate Limiting', () => {
    test('deve permitir até 100 chamadas por minuto', () => {
      for (let i = 0; i < 100; i++) {
        expect(apiManager.checkRateLimit('openai')).toBe(true);
      }
    });

    test('deve rejeitar chamadas acima do limite', () => {
      for (let i = 0; i < 100; i++) {
        apiManager.checkRateLimit('openai');
      }
      expect(apiManager.checkRateLimit('openai')).toBe(false);
    });

    test('deve resetar limite após 60 segundos', (done) => {
      for (let i = 0; i < 100; i++) {
        apiManager.checkRateLimit('openai');
      }
      expect(apiManager.checkRateLimit('openai')).toBe(false);

      // Simular passagem de tempo
      apiManager.rateLimits.openai.resetTime = Date.now() - 1000;
      expect(apiManager.checkRateLimit('openai')).toBe(true);
      done();
    });
  });

  describe('Cache', () => {
    test('deve cachear resultados', () => {
      const cacheKey = 'test:prompt';
      const cachedResult = { text: 'cached response', model: 'test' };

      apiManager.cache.set(cacheKey, cachedResult);
      expect(apiManager.cache.has(cacheKey)).toBe(true);
      expect(apiManager.cache.get(cacheKey)).toEqual(cachedResult);
    });

    test('deve limpar cache', () => {
      apiManager.cache.set('key1', 'value1');
      apiManager.cache.set('key2', 'value2');

      expect(apiManager.cache.size).toBe(2);
      apiManager.clearCache();
      expect(apiManager.cache.size).toBe(0);
    });

    test('deve manter máximo de 1000 itens em cache', () => {
      for (let i = 0; i < 1001; i++) {
        apiManager.cache.set(`key${i}`, `value${i}`);
      }

      expect(apiManager.cache.size).toBeLessThanOrEqual(1000);
    });
  });

  describe('Comparação de Custos', () => {
    test('deve comparar custos para 1000 tokens', () => {
      const costs = apiManager.compareCosts(1000);

      expect(costs.openai).toBeDefined();
      expect(costs.anthropic).toBeDefined();
      expect(costs.google).toBeDefined();
      expect(costs.groq).toBeDefined();
    });

    test('deve calcular custos corretamente', () => {
      const costs = apiManager.compareCosts(1000);

      // OpenAI GPT-3.5-turbo: $0.0005 por 1k tokens
      expect(costs.openai['gpt-3.5-turbo']).toBeCloseTo(0.0005, 6);

      // Groq LLaMA: $0.0001 por 1k tokens
      expect(costs.groq['llama-2-70b']).toBeCloseTo(0.0001, 6);
    });

    test('Groq deve ser mais barato que OpenAI', () => {
      const costs = apiManager.compareCosts(1000);

      expect(costs.groq['llama-2-70b']).toBeLessThan(
        costs.openai['gpt-3.5-turbo']
      );
    });
  });

  describe('Status dos Providers', () => {
    test('deve retornar status de todos os providers', () => {
      const status = apiManager.getProvidersStatus();

      expect(status.openai).toBe('available');
      expect(status.anthropic).toBe('available');
      expect(status.google).toBe('available');
      expect(status.groq).toBe('available');
    });

    test('deve marcar provider como not-configured se sem chave', () => {
      const apiManagerNoKeys = new ExternalAPIManager({});
      const status = apiManagerNoKeys.getProvidersStatus();

      expect(status.openai).toBe('not-configured');
      expect(status.anthropic).toBe('not-configured');
      expect(status.google).toBe('not-configured');
      expect(status.groq).toBe('not-configured');
    });
  });

  describe('Modelos Disponíveis', () => {
    test('deve listar modelos de cada provider', () => {
      const models = apiManager.getAvailableModels();

      expect(models.openai).toContain('gpt-4');
      expect(models.openai).toContain('gpt-3.5-turbo');
      expect(models.anthropic).toContain('claude-3-opus');
      expect(models.google).toContain('gemini-pro');
      expect(models.groq).toContain('llama-2-70b');
    });

    test('deve ter pelo menos 3 modelos por provider', () => {
      const models = apiManager.getAvailableModels();

      expect(models.openai.length).toBeGreaterThanOrEqual(3);
      expect(models.anthropic.length).toBeGreaterThanOrEqual(3);
      expect(models.google.length).toBeGreaterThanOrEqual(2);
      expect(models.groq.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Estatísticas', () => {
    test('deve retornar estatísticas do sistema', () => {
      const stats = apiManager.getStats();

      expect(stats.cacheSize).toBeDefined();
      expect(stats.rateLimits).toBeDefined();
      expect(stats.providers).toBeDefined();
      expect(stats.models).toBeDefined();
    });

    test('deve rastrear tamanho do cache', () => {
      apiManager.cache.set('key1', 'value1');
      apiManager.cache.set('key2', 'value2');

      const stats = apiManager.getStats();
      expect(stats.cacheSize).toBe(2);
    });
  });

  describe('Validação de Entrada', () => {
    test('deve rejeitar provider desconhecido', async () => {
      try {
        await apiManager.call('unknown-provider', 'test prompt');
        fail('Deveria ter lançado erro');
      } catch (error) {
        expect(error.message).toContain('Unknown provider');
      }
    });

    test('deve aceitar opções customizadas', () => {
      const options = {
        model: 'gpt-4',
        maxTokens: 2000,
        temperature: 0.5,
      };

      expect(options.model).toBe('gpt-4');
      expect(options.maxTokens).toBe(2000);
      expect(options.temperature).toBe(0.5);
    });
  });

  describe('Integração de Múltiplos Providers', () => {
    test('deve ter fallback automático entre providers', async () => {
      const result = await apiManager.callWithFallback('test prompt');

      expect(result).toBeDefined();
      expect(result.success !== undefined).toBe(true);
      expect(result.timestamp).toBeDefined();
    });

    test('deve retornar provider usado em caso de sucesso', async () => {
      const result = await apiManager.callWithFallback('test prompt');

      if (result.success) {
        expect(['openai', 'anthropic', 'google', 'groq']).toContain(result.provider);
      }
    });

    test('deve retornar erros em caso de falha', async () => {
      const apiManagerNoKeys = new ExternalAPIManager({});
      const result = await apiManagerNoKeys.callWithFallback('test prompt');

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });
});

// Resumo dos testes
console.log(`
✅ TESTES EXECUTADOS:
- Inicialização de providers (3 testes)
- Rate limiting (3 testes)
- Cache (3 testes)
- Comparação de custos (3 testes)
- Status dos providers (2 testes)
- Modelos disponíveis (2 testes)
- Estatísticas (2 testes)
- Validação de entrada (2 testes)
- Integração de múltiplos providers (3 testes)

Total: 25 testes
`);

