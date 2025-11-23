/**
 * TESTES - Sistema Híbrido Completo
 * Valida: Serginho, SpecialistRegistry, SpecialistFactory, Loader
 */

const {
  HybridAgentSystem,
  Serginho,
  SpecialistFactory,
  SpecialistRegistry,
  SpecialistLoader,
} = require('../agents');

describe('🤖 HYBRID AGENT SYSTEM', () => {
  let system;

  beforeAll(async () => {
    system = new HybridAgentSystem();
  });

  afterAll(() => {
    if (system) {
      system.shutdown();
    }
  });

  describe('SpecialistRegistry', () => {
    let registry;

    beforeEach(() => {
      registry = new SpecialistRegistry();
    });

    test('deve registrar especialista com metadados', () => {
      registry.registerSpecialist('test-specialist', {
        name: 'Test Specialist',
        role: 'Test Role',
        capabilities: ['testing'],
      });

      expect(registry.count()).toBe(1);
      const metadata = registry.getSpecialistMetadata('test-specialist');
      expect(metadata.name).toBe('Test Specialist');
    });

    test('deve suportar número ilimitado de especialistas', () => {
      for (let i = 0; i < 100; i++) {
        registry.registerSpecialist(`specialist-${i}`, {
          name: `Specialist ${i}`,
          role: 'Test',
          capabilities: ['test'],
        });
      }

      expect(registry.count()).toBe(100);
    });

    test('deve buscar por capacidade', () => {
      registry.registerSpecialist('code-specialist', {
        name: 'Code',
        capabilities: ['code', 'debugging'],
      });
      registry.registerSpecialist('design-specialist', {
        name: 'Design',
        capabilities: ['design', 'ui'],
      });

      const coders = registry.findByCapability('code');
      expect(coders.length).toBe(1);
      expect(coders[0].id).toBe('code-specialist');
    });

    test('deve buscar por categoria', () => {
      registry.registerSpecialist('tech-1', {
        name: 'Tech 1',
        category: 'technical',
      });
      registry.registerSpecialist('tech-2', {
        name: 'Tech 2',
        category: 'technical',
      });
      registry.registerSpecialist('biz-1', {
        name: 'Biz 1',
        category: 'business',
      });

      const technical = registry.findByCategory('technical');
      expect(technical.length).toBe(2);
    });

    test('deve fazer lazy loading de especialistas', async () => {
      registry.registerSpecialist('lazy-test', {
        name: 'Lazy Test',
        role: 'Test',
      });

      // Não deve estar carregado inicialmente
      expect(registry.getSpecialist('lazy-test')).toBeNull();

      // Carregar sob demanda
      const loaded = await registry.loadSpecialist('lazy-test');
      expect(loaded).toBeDefined();
      expect(loaded.loaded).toBe(true);

      // Agora deve estar em cache
      expect(registry.getSpecialist('lazy-test')).toBeDefined();
    });

    test('deve enforçar limite de memória', async () => {
      // Registrar 30 especialistas
      for (let i = 0; i < 30; i++) {
        registry.registerSpecialist(`mem-test-${i}`, {
          name: `Mem Test ${i}`,
          role: 'Test',
        });
      }

      // Carregar todos
      for (let i = 0; i < 30; i++) {
        await registry.loadSpecialist(`mem-test-${i}`);
      }

      // Deve ter descarregado alguns (máximo 20)
      expect(registry.countLoaded()).toBeLessThanOrEqual(20);
    });

    test('deve gerar estatísticas corretas', () => {
      registry.registerSpecialist('stat-test', {
        name: 'Stat Test',
      });

      const stats = registry.getStats();
      expect(stats.totalSpecialists).toBe(1);
      expect(stats.loadedSpecialists).toBe(0);
      expect(stats.totalRequests).toBe(0);
    });
  });

  describe('SpecialistFactory', () => {
    test('deve criar especialista dinamicamente', () => {
      const specialist = SpecialistFactory.createSpecialist({
        id: 'dynamic-test',
        name: 'Dynamic Test',
        role: 'Test Role',
        capabilities: ['testing'],
      });

      expect(specialist).toBeDefined();
      expect(specialist.id).toBe('dynamic-test');
      expect(specialist.name).toBe('Dynamic Test');
    });

    test('deve validar configuração de especialista', () => {
      const valid = SpecialistFactory.validateConfig({
        id: 'test',
        name: 'Test',
        role: 'Test Role',
      });

      expect(valid.valid).toBe(true);
    });

    test('deve rejeitar configuração inválida', () => {
      const invalid = SpecialistFactory.validateConfig({
        id: 'test',
        // falta name e role
      });

      expect(invalid.valid).toBe(false);
      expect(invalid.errors.length).toBeGreaterThan(0);
    });

    test('deve criar múltiplos especialistas', () => {
      const configs = [
        { id: 'test-1', name: 'Test 1', role: 'Role 1' },
        { id: 'test-2', name: 'Test 2', role: 'Role 2' },
      ];

      const specialists = SpecialistFactory.createSpecialists(configs);
      expect(specialists.length).toBe(2);
    });

    test('deve criar especialistas padrão', () => {
      const specialists = SpecialistFactory.createDefaultSpecialists();
      expect(specialists.length).toBeGreaterThan(0);
      expect(specialists[0].id).toBe('didak');
    });
  });

  describe('SpecialistLoader', () => {
    let loader;

    beforeEach(() => {
      loader = new SpecialistLoader();
    });

    test('deve registrar especialistas de configuração', async () => {
      const config = {
        specialists: [
          {
            id: 'loader-test-1',
            name: 'Loader Test 1',
            role: 'Test',
            capabilities: ['test'],
            category: 'technical',
          },
          {
            id: 'loader-test-2',
            name: 'Loader Test 2',
            role: 'Test',
            capabilities: ['test'],
            category: 'technical',
          },
        ],
      };

      const result = await loader.registerAllFromConfig(config);
      expect(result.registered).toBe(2);
      expect(loader.countSpecialists()).toBe(2);
    });

    test('deve criar especialista sob demanda', async () => {
      const config = {
        specialists: [
          {
            id: 'demand-test',
            name: 'Demand Test',
            role: 'Test',
            capabilities: ['test'],
          },
        ],
      };

      await loader.registerAllFromConfig(config);
      const specialist = await loader.createSpecialist('demand-test');

      expect(specialist).toBeDefined();
      expect(specialist.name).toBe('Demand Test');
    });

    test('deve listar especialistas por capacidade', async () => {
      const config = {
        specialists: [
          {
            id: 'cap-test-1',
            name: 'Cap Test 1',
            role: 'Test',
            capabilities: ['coding', 'testing'],
          },
          {
            id: 'cap-test-2',
            name: 'Cap Test 2',
            role: 'Test',
            capabilities: ['design'],
          },
        ],
      };

      await loader.registerAllFromConfig(config);
      const coders = loader.getSpecialistsByCapability('coding');

      expect(coders.length).toBe(1);
      expect(coders[0].id).toBe('cap-test-1');
    });

    test('deve gerar relatório', async () => {
      const config = {
        specialists: [
          {
            id: 'report-test',
            name: 'Report Test',
            role: 'Test',
            capabilities: ['test'],
            category: 'technical',
          },
        ],
      };

      await loader.registerAllFromConfig(config);
      const report = loader.generateReport();

      expect(report).toContain('SPECIALIST LOADER');
      expect(report).toContain('Report Test');
    });
  });

  describe('Serginho (Orquestrador)', () => {
    let serginho;

    beforeEach(() => {
      serginho = new Serginho();

      // Registrar alguns especialistas
      serginho.registerSpecialist('test-code', {
        id: 'test-code',
        name: 'Test Code',
        role: 'Code',
        capabilities: ['code'],
        mode: 'AUTONOMOUS',
      });

      serginho.registerSpecialist('test-design', {
        id: 'test-design',
        name: 'Test Design',
        role: 'Design',
        capabilities: ['design'],
        mode: 'MANUAL',
      });
    });

    test('deve processar requisição com sucesso', async () => {
      const result = await serginho.process('Como fazer um loop em JavaScript?');

      expect(result).toBeDefined();
      expect(result.status).toBe('SUCCESS');
    });

    test('deve rotear para especialista correto', async () => {
      const result = await serginho.process('Escreva um código em Python');

      expect(result.agent).toBeDefined();
    });

    test('deve bloquear prompts maliciosos', async () => {
      const result = await serginho.process(
        "'; DROP TABLE users; --" // SQL injection
      );

      expect(result.status).toBe('BLOCKED');
    });

    test('deve obter estatísticas globais', () => {
      const stats = serginho.getGlobalStats();

      expect(stats).toBeDefined();
      expect(stats.registry).toBeDefined();
      expect(stats.cache).toBeDefined();
    });

    test('deve gerar relatório global', () => {
      const report = serginho.generateGlobalReport();

      expect(report).toContain('SERGINHO');
      expect(report).toContain('GLOBAL REPORT');
    });
  });

  describe('HybridAgentSystem', () => {
    test('deve inicializar sistema com sucesso', async () => {
      const sys = new HybridAgentSystem();
      const result = await sys.initialize();

      expect(result.success).toBe(true);
      expect(result.specialists).toBeGreaterThan(0);
    });

    test('deve processar requisição através do sistema', async () => {
      const sys = new HybridAgentSystem();
      await sys.initialize();

      const result = await sys.process('Teste de requisição');

      expect(result).toBeDefined();
      expect(result.status).toBe('SUCCESS');
    });

    test('deve gerar relatório global do sistema', async () => {
      const sys = new HybridAgentSystem();
      await sys.initialize();

      const report = sys.generateGlobalReport();

      expect(report).toContain('SERGINHO');
      expect(report).toContain('SPECIALIST LOADER');
    });

    test('deve desligar sistema corretamente', async () => {
      const sys = new HybridAgentSystem();
      await sys.initialize();

      sys.shutdown();

      expect(sys.initialized).toBe(false);
    });
  });

  describe('Escalabilidade', () => {
    test('deve suportar 100+ especialistas', async () => {
      const registry = new SpecialistRegistry();

      for (let i = 0; i < 100; i++) {
        registry.registerSpecialist(`scale-test-${i}`, {
          name: `Scale Test ${i}`,
          role: 'Test',
          capabilities: ['test'],
          category: i % 2 === 0 ? 'technical' : 'business',
        });
      }

      expect(registry.count()).toBe(100);
    });

    test('deve fazer lazy loading eficiente', async () => {
      const registry = new SpecialistRegistry();

      // Registrar 50 especialistas
      for (let i = 0; i < 50; i++) {
        registry.registerSpecialist(`efficiency-${i}`, {
          name: `Efficiency ${i}`,
          role: 'Test',
        });
      }

      // Carregar apenas 5
      for (let i = 0; i < 5; i++) {
        await registry.loadSpecialist(`efficiency-${i}`);
      }

      // Deve ter apenas 5 carregados
      expect(registry.countLoaded()).toBe(5);

      // Mas todos devem estar no índice
      expect(registry.count()).toBe(50);
    });
  });
});

