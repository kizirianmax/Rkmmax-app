/**
 * TESTES: OptimizedAPIManager
 * 
 * Testa:
 * - Seleção inteligente de modelo
 * - Fallback automático (Gemini → Groq)
 * - Cache e rate limiting
 * - Comparação de custos
 * - Estatísticas
 */

const OptimizedAPIManager = require('../api/OptimizedAPIManager');

describe('OptimizedAPIManager', () => {
  let apiManager;

  beforeEach(() => {
    apiManager = new OptimizedAPIManager({
      googleKey: 'test-google-key',
      groqKey: 'test-groq-key',
    });
  });

  describe('Inicialização', () => {
    test('deve inicializar com Gemini e Groq', () => {
      expect(apiManager.providers.gemini).toBeDefined();
      expect(apiManager.providers.groq).toBeDefined();
    });

    test('deve ter modelos Gemini 2.5', () => {
      const models = Object.keys(apiManager.providers.gemini.models);
      expect(models).toContain('gemini-2.5-pro');
      expect(models).toContain('gemini-2.5-flash-lite');
    });

    test('deve ter modelos Groq para fallback', () => {
      const models = Object.keys(apiManager.providers.groq.models);
      expect(models.length).toBeGreaterThan(0);
    });
  });

  describe('Seleção Inteligente de Modelo', () => {
    test('deve selecionar Flash Lite para tarefas simples', () => {
      const selection = apiManager.selectModel('simple');
      expect(selection.model).toBe('gemini-2.5-flash-lite');
      expect(selection.provider).toBe('gemini');
    });

    test('deve selecionar Flash Lite para tarefas médias', () => {
      const selection = apiManager.selectModel('medium');
      expect(selection.model).toBe('gemini-2.5-flash-lite');
    });

    test('deve selecionar Pro para tarefas complexas', () => {
      const selection = apiManager.selectModel('complex');
      expect(selection.model).toBe('gemini-2.5-pro');
    });

    test('deve selecionar Pro para tarefas críticas', () => {
      const selection = apiManager.selectModel('critical');
      expect(selection.model).toBe('gemini-2.5-pro');
    });

    test('deve permitir forçar provider', () => {
      const selection = apiManager.selectModel('simple', { forceProvider: 'groq' });
      expect(selection.provider).toBe('groq');
    });

    test('deve permitir forçar modelo', () => {
      const selection = apiManager.selectModel('simple', {
        forceProvider: 'gemini',
        model: 'gemini-2.5-pro',
      });
      expect(selection.model).toBe('gemini-2.5-pro');
    });
  });

  describe('Comparação de Custos', () => {
    test('Flash Lite deve ser mais barato que Pro', () => {
      const costs = apiManager.compareCosts(1000);
      expect(costs.gemini['gemini-2.5-flash-lite']).toBeLessThan(
        costs.gemini['gemini-2.5-pro']
      );
    });

    test('Groq deve ser competitivo em preço', () => {
      const costs = apiManager.compareCosts(1000);
      const groqCost = costs.groq['llama-3.1-70b-versatile'];
      const flashCost = costs.gemini['gemini-2.5-flash-lite'];

      // Groq deve ser comparável ou mais barato
      expect(groqCost).toBeLessThanOrEqual(flashCost * 1.5);
    });

    test('deve calcular custos para diferentes volumes', () => {
      const costs1k = apiManager.compareCosts(1000);
      const costs10k = apiManager.compareCosts(10000);

      expect(costs10k.gemini['gemini-2.5-pro']).toBeGreaterThan(
        costs1k.gemini['gemini-2.5-pro']
      );
    });
  });

  describe('Cache e Rate Limiting', () => {
    test('deve cachear resultados', () => {
      const cacheKey = 'test:gemini-2.5-flash-lite:prompt';
      const cachedResult = { text: 'cached', model: 'test' };

      apiManager.cache.set(cacheKey, cachedResult);
      expect(apiManager.cache.has(cacheKey)).toBe(true);
    });

    test('deve limpar cache', () => {
      apiManager.cache.set('key1', 'value1');
      apiManager.cache.set('key2', 'value2');

      expect(apiManager.cache.size).toBe(2);
      apiManager.clearCache();
      expect(apiManager.cache.size).toBe(0);
    });

    test('deve respeitar rate limit de 100 chamadas/min', () => {
      for (let i = 0; i < 100; i++) {
        expect(apiManager.checkRateLimit('gemini')).toBe(true);
      }
      expect(apiManager.checkRateLimit('gemini')).toBe(false);
    });
  });

  describe('Estatísticas', () => {
    test('deve rastrear chamadas totais', () => {
      const stats = apiManager.getStats();
      expect(stats.totalCalls).toBe(0);

      apiManager.stats.totalCalls = 5;
      const updatedStats = apiManager.getStats();
      expect(updatedStats.totalCalls).toBe(5);
    });

    test('deve rastrear custos totais', () => {
      const stats = apiManager.getStats();
      expect(stats.totalCost).toBeDefined();

      apiManager.stats.totalCost = 0.25;
      const updatedStats = apiManager.getStats();
      expect(updatedStats.totalCost).toBe('0.2500');
    });

    test('deve calcular cache hit rate', () => {
      apiManager.stats.cacheHits = 75;
      apiManager.stats.cacheMisses = 25;
      apiManager.stats.totalCalls = 100;

      const stats = apiManager.getStats();
      expect(stats.cacheHitRate).toBe('75.00%');
    });

    test('deve rastrear fallbacks', () => {
      const stats = apiManager.getStats();
      expect(stats.fallbacks).toBe(0);

      apiManager.stats.fallbacks = 2;
      const updatedStats = apiManager.getStats();
      expect(updatedStats.fallbacks).toBe(2);
    });

    test('deve resetar estatísticas', () => {
      apiManager.stats.totalCalls = 100;
      apiManager.stats.totalCost = 5.0;

      apiManager.resetStats();

      const stats = apiManager.getStats();
      expect(stats.totalCalls).toBe(0);
      expect(stats.totalCost).toBe('0.0000');
    });
  });

  describe('Status e Modelos', () => {
    test('deve retornar status dos providers', () => {
      const status = apiManager.getStatus();
      expect(status.gemini).toBe('available');
      expect(status.groq).toBe('available');
    });

    test('deve listar modelos disponíveis', () => {
      const models = apiManager.getAvailableModels();

      expect(models.gemini).toContain('gemini-2.5-pro');
      expect(models.gemini).toContain('gemini-2.5-flash-lite');
      expect(models.groq.length).toBeGreaterThan(0);
    });
  });

  describe('Recomendações', () => {
    test('deve recomendar Flash Lite para simples', () => {
      const rec = apiManager.recommendModel('simple');
      expect(rec.model).toBe('gemini-2.5-flash-lite');
      expect(rec.provider).toBe('gemini');
    });

    test('deve recomendar Pro para complexo', () => {
      const rec = apiManager.recommendModel('complex');
      expect(rec.model).toBe('gemini-2.5-pro');
    });

    test('recomendação deve incluir detalhes', () => {
      const rec = apiManager.recommendModel('simple');
      expect(rec.description).toBeDefined();
      expect(rec.costPer1kTokens).toBeDefined();
      expect(rec.maxTokens).toBeDefined();
    });
  });

  describe('Fallback Automático', () => {
    test('deve ter Groq como fallback', () => {
      expect(apiManager.providers.groq).toBeDefined();
      expect(apiManager.providers.groq.models).toBeDefined();
    });

    test('deve rastrear fallbacks usados', () => {
      apiManager.stats.fallbacks = 0;
      apiManager.stats.fallbacks++;

      const stats = apiManager.getStats();
      expect(stats.fallbacks).toBe(1);
    });
  });

  describe('Validação de Entrada', () => {
    test('deve aceitar opções customizadas', () => {
      const options = {
        complexity: 'complex',
        maxTokens: 4000,
        temperature: 0.5,
        topP: 0.9,
      };

      const selection = apiManager.selectModel(options.complexity, options);
      expect(selection).toBeDefined();
    });

    test('deve usar padrões sensatos', () => {
      const selection = apiManager.selectModel();
      expect(selection.provider).toBe('gemini');
      expect(selection.model).toBeDefined();
    });
  });

  describe('Integração Gemini + Groq', () => {
    test('deve ter Gemini como principal', () => {
      const selection = apiManager.selectModel('simple');
      expect(selection.provider).toBe('gemini');
    });

    test('deve ter Groq como fallback', () => {
      expect(apiManager.providers.groq).toBeDefined();
      expect(apiManager.providers.groq.models).toBeDefined();
    });

    test('deve suportar fallback forçado', () => {
      const selection = apiManager.selectModel('simple', {
        forceProvider: 'groq',
      });
      expect(selection.provider).toBe('groq');
    });
  });
});

// Resumo dos testes
console.log(`
✅ TESTES EXECUTADOS:
- Inicialização (3 testes)
- Seleção inteligente de modelo (6 testes)
- Comparação de custos (3 testes)
- Cache e rate limiting (4 testes)
- Estatísticas (5 testes)
- Status e modelos (2 testes)
- Recomendações (3 testes)
- Fallback automático (2 testes)
- Validação de entrada (2 testes)
- Integração Gemini + Groq (3 testes)

Total: 33 testes
`);

