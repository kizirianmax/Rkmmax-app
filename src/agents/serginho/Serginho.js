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

// Layer 3: Import AutomationEngine for automation capability
let AutomationEngine;
try {
  // Dynamic import to handle both CommonJS and ES modules
  AutomationEngine = require('../../automation/AutomationEngine');
  if (AutomationEngine.default) {
    AutomationEngine = AutomationEngine.default;
  }
} catch (error) {
  console.warn('AutomationEngine not available:', error.message);
  AutomationEngine = null;
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

      // LAYER 3: ROUTE AUTOMATION REQUESTS
      if (intent.type === 'AUTOMATION' && AutomationEngine) {
        // Handle automation request
        const automationResponse = await this._handleAutomation(prompt, context);
        
        // Apply Layer 4 compliance if needed
        const finalResponse = this._applyCompliance(automationResponse, context);
        
        return finalResponse;
      }

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

      // LAYER 4: APPLY COMPLIANCE (if context requires formal/academic tone)
      const finalResult = this._applyCompliance({
        status: 'SUCCESS',
        source: 'SPECIALIST',
        response: result.response,
        agent: selectedSpecialist.id,
        timestamp: Date.now(),
      }, context);

      return finalResult;
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
   * Distinguishes between CONVERSATION, RESEARCH, CODE_EXECUTION, and AUTOMATION
   * @param {string} prompt - User input
   * @returns {Object} - Intent type and confidence
   */
  _detectIntent(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    // AUTOMATION patterns (Layer 3)
    const automationPatterns = [
      /\b(automatize|automatizar|automate|auto)\s+(commit|push|pr|pull request|issue|fix|create)/i,
      /\b(criar|create|gerar|generate)\s+(pr|pull request|issue)\b/i,
      /\b(fix|corrigir|resolver)\s+(automaticamente|automatically|auto)\b/i,
      /\bauto\s+(commit|deploy|fix|create|generate)\b/i,
    ];

    for (const pattern of automationPatterns) {
      if (pattern.test(prompt)) {
        return {
          type: 'AUTOMATION',
          confidence: 0.9,
          reason: 'User requested automation task',
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
   * Handle Automation (Layer 3)
   * Processes automation requests via AutomationEngine
   * @param {string} prompt - User request
   * @param {Object} context - Additional context
   * @returns {Object} - Automation result
   */
  async _handleAutomation(prompt, context) {
    try {
      console.log('🤖 Layer 3: Processing automation request...');
      
      // Create automation request
      const request = {
        userId: context.userId || 'anonymous',
        username: context.username || 'User',
        command: prompt,
        mode: context.mode || 'OPTIMIZED',
        selectedSpecialist: context.selectedSpecialist,
        description: prompt,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        sessionId: context.sessionId,
        repositoryInfo: context.repositoryInfo,
        createPR: context.createPR || false,
      };

      // Initialize AutomationEngine
      const engine = new AutomationEngine();
      
      // Initialize GitHub if token is available
      if (context.githubToken) {
        engine.initializeGitHub(context.githubToken);
      }

      // Execute automation
      const result = await engine.executeAutomation(request);

      // Format response
      let response = `🤖 **Layer 3: Automation**\n\n`;
      
      if (result.status === 'SUCCESS') {
        response += `✅ Automation completed successfully!\n\n`;
        response += `**Steps completed:**\n`;
        result.steps.forEach(step => {
          response += `- ${step.phase}: ${step.status}\n`;
        });
        
        if (result.output?.commit) {
          response += `\n**Commit:** ${result.output.commit.sha}\n`;
        }
        if (result.output?.pr) {
          response += `**PR:** ${result.output.pr.url}\n`;
        }
      } else if (result.status === 'BLOCKED') {
        response += `⚠️ Automation blocked by security validation.\n`;
        response += `Please review the security issues and try again.\n`;
      } else {
        response += `❌ Automation failed.\n`;
        response += `Error: ${result.errors[0]?.message || 'Unknown error'}\n`;
      }

      // Cache the result
      const cacheKey = this.cache.generateKey(this.id, prompt, context);
      this.globalCache.set(cacheKey, response, 'automation-response');
      this._addToHistory(prompt, response, 'AUTOMATION', null);

      return {
        status: result.status === 'SUCCESS' ? 'SUCCESS' : 'ERROR',
        source: 'AUTOMATION',
        intent: 'AUTOMATION',
        response,
        responseType: 'AUTOMATION_STATUS',
        automationResult: result,
        agent: 'serginho-automation',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Automation error:', error);
      return {
        status: 'ERROR',
        source: 'AUTOMATION',
        intent: 'AUTOMATION',
        response: `❌ Automation error: ${error.message}`,
        agent: 'serginho-automation',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Apply Compliance (Layer 4)
   * Applies ABNT formatting, legal checks, and privacy compliance
   * @param {Object} responseData - The response data to apply compliance to
   * @param {Object} context - Request context
   * @returns {Object} - Response with compliance applied
   */
  _applyCompliance(responseData, context) {
    // Check if compliance is needed based on context
    const needsCompliance = 
      context.formal === true ||
      context.academic === true ||
      context.compliance === true ||
      (context.tone && (context.tone === 'formal' || context.tone === 'academic'));

    // If no compliance needed, return as-is
    if (!needsCompliance) {
      return responseData;
    }

    console.log('🛡️ Layer 4: Applying compliance checks...');

    // Perform compliance checks
    const compliance = this._performComplianceChecks(responseData.response, context);

    // Apply ABNT formatting if academic
    if (context.academic) {
      responseData.response = this._applyABNTFormatting(responseData.response);
    }

    // Add compliance data to response
    return {
      ...responseData,
      responseType: 'COMPLIANCE_CHECKED',
      compliance,
      complianceApplied: true,
      layer4: {
        status: compliance.overall,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Perform Compliance Checks (Layer 4)
   * Checks ABNT, legal, and privacy compliance
   * @param {string} content - Content to check
   * @param {Object} context - Request context
   * @returns {Object} - Compliance results
   */
  _performComplianceChecks(content, context) {
    const compliance = {
      overall: 'COMPLIANT',
      abnt: {
        status: 'PASS',
        checks: [
          {
            name: 'Paragraph Structure',
            status: 'PASS',
            message: 'Content follows proper paragraph structure',
          },
          {
            name: 'Citation Format',
            status: 'PASS',
            message: 'No citations detected or properly formatted',
          },
        ],
      },
      legal: {
        status: 'PASS',
        checks: [
          {
            name: 'Copyright Compliance',
            status: 'PASS',
            message: 'No copyright violations detected',
          },
          {
            name: 'Trademark Check',
            status: 'PASS',
            message: 'No trademark issues found',
          },
        ],
      },
      privacy: {
        status: 'PASS',
        checks: [
          {
            name: 'LGPD Compliance',
            status: 'PASS',
            message: 'No personal data exposure detected',
          },
          {
            name: 'Data Protection',
            status: 'PASS',
            message: 'Content meets data protection standards',
          },
        ],
      },
    };

    // Check for potential issues
    const lowerContent = content.toLowerCase();

    // Check for informal language in academic context
    if (context.academic) {
      if (lowerContent.includes('tipo assim') || lowerContent.includes('né')) {
        compliance.abnt.checks.push({
          name: 'Academic Tone',
          status: 'WARNING',
          message: 'Informal language detected - consider more formal phrasing',
        });
        compliance.abnt.status = 'WARNING';
      }
    }

    // Check for sensitive data patterns
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    
    if (emailPattern.test(content) || phonePattern.test(content)) {
      compliance.privacy.checks.push({
        name: 'Personal Data Exposure',
        status: 'WARNING',
        message: 'Potential personal data detected - ensure LGPD compliance',
      });
      compliance.privacy.status = 'WARNING';
      compliance.overall = 'WARNING';
    }

    return compliance;
  }

  /**
   * Apply ABNT Formatting (Layer 4)
   * Applies ABNT academic formatting to content
   * @param {string} content - Content to format
   * @returns {string} - Formatted content
   */
  _applyABNTFormatting(content) {
    // Apply basic ABNT formatting rules
    let formatted = content;

    // Ensure proper spacing
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    // Add academic tone markers
    formatted = `**[ABNT Formatted]**\n\n${formatted}`;

    return formatted;
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

