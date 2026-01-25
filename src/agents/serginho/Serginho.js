/**
 * SERGINHO - Orquestrador Principal
 * Coordena 55+ especialistas
 * Roteamento inteligente de tarefas
 * Gerenciamento de cache global
 */

const AgentBase = require('../core/AgentBase');
const SpecialistRegistry = require('../core/SpecialistRegistry');
const IntelligentCache = require('../../cache/IntelligentCache');

// Layer 2: Import WebBrowserService for research capability
let WebBrowserService;
try {
  // Dynamic import to handle both CommonJS and ES modules
  WebBrowserService = require('../../services/WebBrowserService');
  if (WebBrowserService.default) {
    WebBrowserService = WebBrowserService.default;
  }
} catch (error) {
  console.warn('WebBrowserService not available:', error.message);
  WebBrowserService = null;
}

class Serginho extends AgentBase {
  constructor(config = {}) {
    super({
      id: 'serginho',
      name: 'Serginho',
      role: 'Orquestrador Principal',
      mode: 'AUTONOMOUS',
      ...config,
    });

    // Registro de especialistas (escalável)
    this.registry = new SpecialistRegistry();

    // Cache global compartilhado
    this.globalCache = new IntelligentCache({ maxMemory: 1024 });

    // Fila de tarefas
    this.taskQueue = [];
    this.maxConcurrentTasks = 10;
    this.activeTasks = new Map();

    // Roteador de especialistas
    this.router = new TaskRouter();

    // Configuração
    this.config = {
      taskTimeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  /**
   * Processar Requisição (Sobrescreve AgentBase)
   * Roteador inteligente para especialistas
   * Layer 2: Enhanced with intent detection for RESEARCH and CODE_EXECUTION
   */
  async process(prompt, context = {}) {
    try {
      // 1. VALIDAÇÃO DE SEGURANÇA
      const securityAnalysis = this.modelArmor.analyzePrompt(prompt);

      if (securityAnalysis.recommendation === 'BLOCK') {
        return {
          status: 'BLOCKED',
          reason: 'Prompt violates security policies',
          violations: securityAnalysis.violations,
          timestamp: Date.now(),
        };
      }

      // 2. BUSCA EM CACHE GLOBAL
      const cacheKey = this.cache.generateKey(this.id, prompt, context);
      const cachedResponse = this.cache.get(cacheKey);

      if (cachedResponse) {
        this._addToHistory(prompt, cachedResponse, 'CACHE', null);
        return {
          status: 'SUCCESS',
          source: 'CACHE',
          response: cachedResponse,
          agent: 'serginho',
          timestamp: Date.now(),
        };
      }

      // LAYER 2: DETECT INTENT (The Brain)
      const intent = this._detectIntent(prompt);

      // LAYER 2: ROUTE BASED ON INTENT
      if (intent.type === 'RESEARCH' && WebBrowserService) {
        // Handle web search request
        try {
          const searchResult = await WebBrowserService.search(prompt);
          
          if (searchResult.success) {
            const response = this._formatSearchResponse(searchResult);
            
            // Cache the result
            this.globalCache.set(cacheKey, response, 'research-response');
            this._addToHistory(prompt, response, 'RESEARCH', null);
            
            return {
              status: 'SUCCESS',
              source: 'RESEARCH',
              intent: intent.type,
              response,
              searchData: searchResult,
              agent: 'serginho-research',
              timestamp: Date.now(),
            };
          } else {
            // Fallback to specialist if search fails
            console.warn('Web search failed, falling back to specialist:', searchResult.error);
          }
        } catch (error) {
          console.error('Research intent error:', error);
          // Fallback to specialist
        }
      }

      if (intent.type === 'CODE_EXECUTION') {
        // Handle code execution request
        const codeResponse = await this._generateCodeExecution(prompt, context);
        
        // Cache the result
        this.globalCache.set(cacheKey, codeResponse.response, 'code-execution');
        this._addToHistory(prompt, codeResponse.response, 'CODE_EXECUTION', null);
        
        return {
          status: 'SUCCESS',
          source: 'CODE_EXECUTION',
          intent: intent.type,
          response: codeResponse.response,
          code: codeResponse.code,
          responseType: 'CODE_EXECUTION',
          agent: 'serginho-code',
          timestamp: Date.now(),
        };
      }

      // LAYER 3: Handle AUTOMATION intent
      if (intent.type === 'AUTOMATION') {
        const automationResponse = this._handleAutomationIntent(prompt, context);
        
        // Cache the result
        this.globalCache.set(cacheKey, automationResponse.response, 'automation');
        this._addToHistory(prompt, automationResponse.response, 'AUTOMATION', null);
        
        return {
          status: 'SUCCESS',
          source: 'AUTOMATION',
          intent: intent.type,
          response: automationResponse.response,
          automationData: automationResponse.data,
          responseType: 'AUTOMATION',
          agent: 'serginho-automation',
          timestamp: Date.now(),
        };
      }

      // LAYER 4: Handle COMPLIANCE intent
      if (intent.type === 'COMPLIANCE') {
        const complianceResponse = this._handleComplianceIntent(prompt, context);
        
        // Cache the result
        this.globalCache.set(cacheKey, complianceResponse.response, 'compliance');
        this._addToHistory(prompt, complianceResponse.response, 'COMPLIANCE', null);
        
        return {
          status: 'SUCCESS',
          source: 'COMPLIANCE',
          intent: intent.type,
          response: complianceResponse.response,
          complianceData: complianceResponse.data,
          responseType: 'COMPLIANCE',
          agent: 'serginho-compliance',
          timestamp: Date.now(),
        };
      }

      // 3. ROTEAMENTO INTELIGENTE (Original flow for CONVERSATION)
      const selectedSpecialist = await this._routeToSpecialist(prompt, context);

      if (!selectedSpecialist) {
        return {
          status: 'ERROR',
          reason: 'No suitable specialist found',
          timestamp: Date.now(),
        };
      }

      // 4. DELEGAÇÃO PARA ESPECIALISTA
      const result = await this._delegateToSpecialist(
        selectedSpecialist,
        prompt,
        context
      );

      // 5. ARMAZENAR EM CACHE GLOBAL
      this.globalCache.set(cacheKey, result.response, 'specialist-response');

      // 6. ADICIONAR AO HISTÓRICO
      this._addToHistory(prompt, result.response, 'AUTONOMOUS', null);

      return {
        status: 'SUCCESS',
        source: 'SPECIALIST',
        response: result.response,
        agent: selectedSpecialist.id,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        status: 'ERROR',
        error: error.message,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Roteamento Inteligente para Especialista
   */
  async _routeToSpecialist(prompt, context) {
    // Análise de prompt para determinar especialista ideal
    const analysis = this._analyzePromptIntent(prompt);

    // Buscar especialistas por capacidade
    const candidates = this.registry.findByCapability(analysis.primaryCapability);

    if (candidates.length === 0) {
      // Fallback: usar especialista genérico
      return this.registry.getSpecialistMetadata('didak');
    }

    // Selecionar melhor candidato baseado em:
    // 1. Modo (AUTONOMOUS preferido)
    // 2. Cache hit rate
    // 3. Disponibilidade
    const selected = candidates.sort((a, b) => {
      const aScore = this._calculateSpecialistScore(a);
      const bScore = this._calculateSpecialistScore(b);
      return bScore - aScore;
    })[0];

    return selected;
  }

  /**
   * Analisar Intenção do Prompt
   */
  _analyzePromptIntent(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    // Mapeamento simples de intenção → capacidade
    const intentMap = {
      'código|programação|javascript|python|java': 'code',
      'design|ui|ux|interface|visual': 'design',
      'marketing|vendas|negócio|estratégia': 'marketing',
      'dados|análise|estatística|gráfico': 'data-analysis',
      'segurança|vulnerabilidade|criptografia': 'security',
      'performance|otimização|velocidade': 'performance',
      'acessibilidade|wcag|a11y': 'accessibility',
      'documentação|escrita|conteúdo': 'technical-writing',
    };

    for (const [keywords, capability] of Object.entries(intentMap)) {
      const regex = new RegExp(keywords, 'i');
      if (regex.test(lowerPrompt)) {
        return {
          primaryCapability: capability,
          confidence: 0.8,
        };
      }
    }

    // Default: didática (ensino)
    return {
      primaryCapability: 'teaching',
      confidence: 0.5,
    };
  }

  /**
   * Detect Intent (Layer 2: The Brain)
   * Distinguishes between CONVERSATION, RESEARCH, CODE_EXECUTION, AUTOMATION, and COMPLIANCE
   * @param {string} prompt - User input
   * @returns {Object} - Intent type and confidence
   */
  _detectIntent(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    // AUTOMATION patterns (Layer 3)
    const automationPatterns = [
      /\b(automatize|automatizar|automatiza|automate)\s+(this|isso|este|esta)/i,
      /\b(criar|crie|faça|execute)\s+(uma\s+)?(automação|automation)/i,
      /\b(commit|push|deploy|automatizar)\s+(código|code|repositório|repository)/i,
      /\bautomação\s+(de\s+)?(tarefas|tasks|código|code)/i,
      /\b(gere|generate|crie|create)\s+(e|and)?\s*(commit|push|pr|pull request)/i,
      /\bautomação\s+(github|git)/i,
    ];

    for (const pattern of automationPatterns) {
      if (pattern.test(prompt)) {
        return {
          type: 'AUTOMATION',
          confidence: 0.9,
          reason: 'User requested automation workflow',
        };
      }
    }

    // COMPLIANCE patterns (Layer 4)
    const compliancePatterns = [
      /\b(verif(ique|icar|ica)|check|valide|validar)\s+(abnt|lgpd|compliance|conformidade)/i,
      /\b(abnt|lgpd)\s+(check|verification|validação|análise)/i,
      /\b(normas|rules|regras)\s+(abnt|brasileiras)/i,
      /\b(proteção|protection)\s+(de\s+)?dados\s+(pessoais|lgpd)/i,
      /\b(conformidade|compliance)\s+(legal|jurídica)/i,
      /\b(formata(r|ção)|format(ting)?)\s+(abnt|acadêmico|normas)/i,
      /\breferências\s+(bibliográficas|abnt)/i,
    ];

    for (const pattern of compliancePatterns) {
      if (pattern.test(prompt)) {
        return {
          type: 'COMPLIANCE',
          confidence: 0.9,
          reason: 'User requested compliance checking or validation',
        };
      }
    }

    // CODE_EXECUTION patterns
    const codePatterns = [
      /\b(criar|crie|faça|construa|desenvolva|gere)\s+(um\s+)?(app|aplicativo|aplicação|componente|interface|página|site|dashboard)/i,
      /\b(build|create|make|develop|generate)\s+(a|an)?\s*(app|application|component|interface|page|website|dashboard)/i,
      /\bquero\s+(ver|executar|rodar|testar)\s+código/i,
      /\bshow me (live|running|working)\s+code/i,
      /\b(react|vue|angular|svelte)\s+(app|component)/i,
    ];

    for (const pattern of codePatterns) {
      if (pattern.test(prompt)) {
        return {
          type: 'CODE_EXECUTION',
          confidence: 0.9,
          reason: 'User requested code creation or execution',
        };
      }
    }

    // RESEARCH patterns
    const researchPatterns = [
      /\b(pesquise|pesquisar|busque|buscar|procure|procurar|encontre|encontrar)\s+(sobre|na web|na internet|no google)/i,
      /\b(search|look up|find|research)\s+(for|about)?\s+(on the web|online|on internet)/i,
      /\bwhat (is|are) the (latest|current|recent)/i,
      /\bo que (é|são) (o|a|os|as) (mais recente|atual)/i,
      /\b(notícias|news)\s+(sobre|about)/i,
      /\b(informações|information|dados|data)\s+(atualizad|current|recent)/i,
    ];

    for (const pattern of researchPatterns) {
      if (pattern.test(prompt)) {
        return {
          type: 'RESEARCH',
          confidence: 0.85,
          reason: 'User requested web search or current information',
        };
      }
    }

    // Default: CONVERSATION (delegate to specialist)
    return {
      type: 'CONVERSATION',
      confidence: 0.7,
      reason: 'Standard conversational query',
    };
  }

  /**
   * Format Search Response (Layer 2)
   * Formats web search results into a readable response
   * @param {Object} searchResult - Result from WebBrowserService
   * @returns {string} - Formatted response
   */
  _formatSearchResponse(searchResult) {
    let response = '';

    if (searchResult.answer) {
      response += `🔍 **Web Search Result**\n\n`;
      response += `${searchResult.answer}\n\n`;
    }

    if (searchResult.sources && searchResult.sources.length > 0) {
      response += `**Sources:**\n`;
      searchResult.sources.forEach((source, index) => {
        response += `${index + 1}. [${source.title}](${source.url})\n`;
        if (source.content) {
          response += `   ${source.content.substring(0, 150)}...\n`;
        }
      });
    }

    if (!searchResult.answer && searchResult.sources.length === 0) {
      response = 'I searched the web but couldn\'t find relevant information. Please try rephrasing your query.';
    }

    return response;
  }

  /**
   * Generate Code Execution (Layer 2)
   * Generates React code for execution in LiveCodeRunner
   * @param {string} prompt - User request
   * @param {Object} context - Additional context
   * @returns {Object} - Code and response
   */
  async _generateCodeExecution(prompt, context) {
    // Extract what the user wants to build
    const appName = this._extractAppName(prompt);
    
    // Generate a simple React component based on the request
    const code = this._generateReactCode(prompt, appName);
    
    const response = `🚀 **Live Code Execution**\n\n` +
      `I've created a ${appName} for you! You can see it running live below.\n\n` +
      `**Features:**\n` +
      `- Interactive React component\n` +
      `- Real-time preview\n` +
      `- Editable code\n\n` +
      `Feel free to modify the code to customize it!`;

    return {
      response,
      code,
      appName,
    };
  }

  /**
   * Extract App Name from prompt
   * @param {string} prompt - User request
   * @returns {string} - App name
   */
  _extractAppName(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Try to extract common app types
    if (lowerPrompt.includes('todo') || lowerPrompt.includes('tarefa')) {
      return 'Todo App';
    }
    if (lowerPrompt.includes('counter') || lowerPrompt.includes('contador')) {
      return 'Counter App';
    }
    if (lowerPrompt.includes('calculator') || lowerPrompt.includes('calculadora')) {
      return 'Calculator App';
    }
    if (lowerPrompt.includes('timer') || lowerPrompt.includes('temporizador')) {
      return 'Timer App';
    }
    if (lowerPrompt.includes('weather') || lowerPrompt.includes('clima')) {
      return 'Weather App';
    }
    if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('painel')) {
      return 'Dashboard';
    }
    
    return 'Interactive App';
  }

  /**
   * Generate React Code based on prompt
   * @param {string} prompt - User request
   * @param {string} appName - App name
   * @returns {string} - React code
   */
  _generateReactCode(prompt, appName) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Generate different code based on app type
    if (lowerPrompt.includes('todo') || lowerPrompt.includes('tarefa')) {
      return this._generateTodoCode();
    }
    if (lowerPrompt.includes('counter') || lowerPrompt.includes('contador')) {
      return this._generateCounterCode();
    }
    if (lowerPrompt.includes('timer') || lowerPrompt.includes('temporizador')) {
      return this._generateTimerCode();
    }
    
    // Default: Simple interactive component
    return this._generateDefaultCode(appName);
  }

  /**
   * Generate Todo App Code
   */
  _generateTodoCode() {
    return `import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, done: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#6366f1' }}>✅ Todo App</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={addTodo} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ padding: '10px', marginBottom: '5px', background: '#f3f4f6', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none', flex: 1 }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}`;
  }

  /**
   * Generate Counter App Code
   */
  _generateCounterCode() {
    return `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#6366f1' }}>🔢 Counter App</h1>
      <div style={{ fontSize: '72px', fontWeight: 'bold', margin: '30px 0', color: '#1f2937' }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => setCount(count - 1)} style={{ padding: '15px 30px', fontSize: '18px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          - Decrease
        </button>
        <button onClick={() => setCount(0)} style={{ padding: '15px 30px', fontSize: '18px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Reset
        </button>
        <button onClick={() => setCount(count + 1)} style={{ padding: '15px 30px', fontSize: '18px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          + Increase
        </button>
      </div>
    </div>
  );
}`;
  }

  /**
   * Generate Timer App Code
   */
  _generateTimerCode() {
    return `import { useState, useEffect } from 'react';

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#6366f1' }}>⏱️ Timer App</h1>
      <div style={{ fontSize: '72px', fontWeight: 'bold', margin: '30px 0', color: '#1f2937', fontFamily: 'monospace' }}>
        {formatTime(seconds)}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={toggle} style={{ padding: '15px 30px', fontSize: '18px', background: isActive ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} style={{ padding: '15px 30px', fontSize: '18px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Reset
        </button>
      </div>
    </div>
  );
}`;
  }

  /**
   * Generate Default App Code
   */
  _generateDefaultCode(appName) {
    return `import { useState } from 'react';

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#6366f1' }}>🚀 ${appName}</h1>
      <p style={{ fontSize: '18px', color: '#6b7280' }}>
        Welcome to your interactive app!
      </p>
      <div style={{ margin: '30px 0' }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
          You clicked {clicks} times
        </p>
        <button 
          onClick={() => setClicks(clicks + 1)}
          style={{ padding: '15px 30px', fontSize: '18px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
        >
          Click me!
        </button>
      </div>
      <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '40px' }}>
        Edit the code above to customize this app!
      </p>
    </div>
  );
}`;
  }

  /**
   * Calcular Score do Especialista
   */
  _calculateSpecialistScore(specialist) {
    let score = 0;

    // Modo AUTONOMOUS é preferido
    if (specialist.mode === 'AUTONOMOUS') {
      score += 50;
    }

    // Especialistas carregados têm prioridade
    const loaded = this.registry.getSpecialist(specialist.id);
    if (loaded) {
      score += 30;
    }

    // Menos recentemente usado tem prioridade
    // (para balancear carga)
    score += Math.random() * 20;

    return score;
  }

  /**
   * Delegar para Especialista
   */
  async _delegateToSpecialist(specialist, prompt, context) {
    try {
      // Carregar especialista (lazy loading)
      const loaded = await this.registry.loadSpecialist(specialist.id);

      // Simular chamada de API do especialista
      const response = await this._callSpecialistAPI(loaded, prompt, context);

      return {
        response,
        specialist: specialist.id,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Error delegating to ${specialist.id}:`, error);
      throw error;
    }
  }

  /**
   * Chamar API do Especialista (Implementação)
   */
  async _callSpecialistAPI(specialist, prompt, context) {
    // Simulação: em produção, isso chamaria a API específica do especialista
    return `Response from ${specialist.name}: ${prompt.substring(0, 50)}...`;
  }

  /**
   * Chamar API (Implementação do AgentBase)
   */
  async _callAPI(prompt, context) {
    // Serginho delega para especialistas, não chama API diretamente
    throw new Error('Serginho does not call API directly. Use process() instead.');
  }

  /**
   * Registrar Especialista
   */
  registerSpecialist(specialistId, metadata) {
    this.registry.registerSpecialist(specialistId, metadata);
  }

  /**
   * Registrar Múltiplos Especialistas
   */
  registerSpecialists(specialists) {
    for (const specialist of specialists) {
      this.registerSpecialist(specialist.id, specialist);
    }
  }

  /**
   * Obter Estatísticas Globais
   */
  getGlobalStats() {
    const registryStats = this.registry.getStats();
    const cacheStats = this.globalCache.getStats();

    return {
      serginho: {
        uptime: Date.now() - this.createdAt,
        mode: this.mode,
      },
      registry: registryStats,
      cache: cacheStats,
      activeTasks: this.activeTasks.size,
      taskQueue: this.taskQueue.length,
    };
  }

  /**
   * Gerar Relatório Global
   */
  generateGlobalReport() {
    const stats = this.getGlobalStats();

    return `
╔════════════════════════════════════════╗
║     SERGINHO - GLOBAL REPORT           ║
╚════════════════════════════════════════╝

Serginho Status:
- Mode: ${stats.serginho.mode}
- Uptime: ${(stats.serginho.uptime / 1000 / 60).toFixed(2)} minutes

Specialists Registry:
- Total: ${stats.registry.totalSpecialists}
- Loaded: ${stats.registry.loadedSpecialists}
- Memory: ${stats.registry.memoryUsage}

Global Cache:
- Hit Rate: ${stats.cache.hitRate}
- Hits: ${stats.cache.hits}
- Misses: ${stats.cache.misses}
- Estimated Savings: ${stats.cache.estimatedSavings}

Task Management:
- Active Tasks: ${stats.activeTasks}
- Queue Size: ${stats.taskQueue}

Timestamp: ${new Date().toISOString()}
`;
  }

  /**
   * Handle Automation Intent (Layer 3)
   * Provides information about automation workflow and redirects to /automation page
   * @param {string} prompt - User request
   * @param {Object} context - Additional context
   * @returns {Object} - Response and automation data
   */
  _handleAutomationIntent(prompt, context) {
    const response = `🤖 **Automation System**

I can help you automate your repository tasks! The Automation System provides:

**Features:**
- ✅ Intelligent code generation
- ✅ Automatic commit & push
- ✅ Security validation
- ✅ GitHub integration
- ✅ Pull request creation
- ✅ Specialist selection (Manual/Hybrid/Optimized modes)

**Workflow Steps:**
1. **Analysis** - Parse your command
2. **Selection** - Choose the right specialist
3. **Generation** - Generate code or changes
4. **Validation** - Security checks
5. **Execution** - Commit & push to repository

🔗 **Access the full Automation Dashboard:** [/automation](/automation)

You can trigger automations directly there, or tell me what you'd like to automate and I'll help you!

**Example commands:**
- "Create a login component with validation"
- "Add a new API endpoint for user management"
- "Refactor the authentication service"

What would you like to automate?`;

    // Create mock automation data structure
    const data = {
      steps: [
        { id: 'analysis', phase: 'ANALYSIS', status: 'PENDING' },
        { id: 'selection', phase: 'SPECIALIST_SELECTION', status: 'PENDING' },
        { id: 'generation', phase: 'CODE_GENERATION', status: 'PENDING' },
        { id: 'validation', phase: 'SECURITY_VALIDATION', status: 'PENDING' },
        { id: 'execution', phase: 'EXECUTION', status: 'PENDING' },
      ],
      currentStep: 'analysis',
      status: 'ready',
      link: '/automation',
    };

    return { response, data };
  }

  /**
   * Handle Compliance Intent (Layer 4)
   * Provides information about ABNT/LGPD compliance checking
   * @param {string} prompt - User request
   * @param {Object} context - Additional context (may include { text: string })
   * @returns {Object} - Response and compliance data
   */
  _handleComplianceIntent(prompt, context) {
    // Extract text if provided in context
    const textToAnalyze = context.text || '';
    
    const response = `📋 **Compliance & Validation System**

I can help you verify ABNT formatting and LGPD compliance! The system checks:

**ABNT - Brazilian Standards:**
- ✓ Formatting (NBR guidelines)
- ✓ References (NBR 6023)
- ✓ Citations (NBR 10520)
- ✓ Academic work structure

**LGPD - Data Protection:**
- ✓ Personal data identification
- ✓ Sensitive data handling
- ✓ Consent requirements
- ✓ Security measures

**Legal Compliance:**
- ✓ Copyright verification
- ✓ Terms & conditions
- ✓ Accessibility standards

🔗 **Access the full Compliance Tools:** [/compliance](/compliance)

You can paste your text there for detailed analysis, or share it with me and I'll provide a quick check!

${textToAnalyze ? '\n**Analyzing your text...**\n' : '**Example use cases:**\n- Academic papers\n- Legal documents\n- Privacy policies\n- Terms of service\n'}

Would you like me to analyze specific text for compliance?`;

    // Create mock compliance data structure
    const data = {
      abnt: {
        status: 'ready',
        checks: [
          { id: 'formatting', label: 'Formatação NBR', passed: null },
          { id: 'references', label: 'Referências (NBR 6023)', passed: null },
          { id: 'citations', label: 'Citações (NBR 10520)', passed: null },
          { id: 'structure', label: 'Estrutura de Trabalho', passed: null },
        ],
      },
      lgpd: {
        status: 'ready',
        checks: [
          { id: 'personal_data', label: 'Dados Pessoais', passed: null },
          { id: 'sensitive_data', label: 'Dados Sensíveis', passed: null },
          { id: 'consent', label: 'Consentimento', passed: null },
          { id: 'security', label: 'Medidas de Segurança', passed: null },
        ],
      },
      legal: {
        status: 'ready',
        checks: [
          { id: 'copyright', label: 'Direitos Autorais', passed: null },
          { id: 'terms', label: 'Termos e Condições', passed: null },
          { id: 'accessibility', label: 'Acessibilidade', passed: null },
        ],
      },
      link: '/compliance',
    };

    return { response, data };
  }
}

/**
 * TASK ROUTER - Roteador de Tarefas
 */
class TaskRouter {
  constructor() {
    this.routes = new Map();
  }

  registerRoute(pattern, specialistId) {
    this.routes.set(pattern, specialistId);
  }

  findRoute(prompt) {
    for (const [pattern, specialistId] of this.routes) {
      if (pattern.test(prompt)) {
        return specialistId;
      }
    }
    return null;
  }
}

module.exports = Serginho;

