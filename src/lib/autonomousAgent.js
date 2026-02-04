/**
 * RKMMAX AUTONOMOUS AGENT
 * Sistema de Agente Autônomo nível Manus
 * 
 * Capacidades:
 * - Planejamento automático de tarefas
 * - Execução sequencial de etapas
 * - Uso de ferramentas (código, pesquisa, análise)
 * - Auto-reflexão e correção
 * - Streaming de progresso em tempo real
 */

// Estados do agente
export const AgentState = {
  IDLE: 'idle',
  PLANNING: 'planning',
  EXECUTING: 'executing',
  THINKING: 'thinking',
  USING_TOOL: 'using_tool',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Tipos de ferramentas disponíveis
export const ToolType = {
  CODE: 'code',
  SEARCH: 'search',
  ANALYZE: 'analyze',
  WRITE: 'write',
  CALCULATE: 'calculate',
  VISION: 'vision',
  IMAGE_GENERATE: 'image_generate'  // 🍌 Nano Banana
};

// Classe principal do Agente Autônomo
export class AutonomousAgent {
  constructor(options = {}) {
    this.state = AgentState.IDLE;
    this.currentTask = null;
    this.plan = [];
    this.currentStep = 0;
    this.results = [];
    this.onStateChange = options.onStateChange || (() => {});
    this.onProgress = options.onProgress || (() => {});
    this.onMessage = options.onMessage || (() => {});
    this.onToolUse = options.onToolUse || (() => {});
    this.conversationHistory = [];
    this.maxRetries = 3;
  }

  // Atualizar estado e notificar
  setState(newState, data = {}) {
    this.state = newState;
    this.onStateChange(newState, data);
  }

  // Adicionar mensagem ao histórico
  addMessage(role, content, metadata = {}) {
    const message = { role, content, timestamp: Date.now(), ...metadata };
    this.conversationHistory.push(message);
    this.onMessage(message);
    return message;
  }

  // Analisar tarefa e criar plano
  async planTask(userInput) {
    this.setState(AgentState.PLANNING);
    this.currentTask = userInput;
    
    const planningPrompt = `Você é um agente autônomo de IA avançado. Analise a tarefa do usuário e crie um plano de execução.

TAREFA DO USUÁRIO:
${userInput}

INSTRUÇÕES:
1. Analise a complexidade da tarefa
2. Divida em etapas claras e executáveis
3. Identifique quais ferramentas serão necessárias
4. Retorne um JSON com o plano

FERRAMENTAS DISPONÍVEIS:
- code: Executar ou gerar código
- search: Pesquisar informações
- analyze: Analisar dados ou texto
- write: Escrever documentos ou textos
- calculate: Fazer cálculos
- vision: Analisar imagens
- image_generate: Gerar imagens com IA (Nano Banana)

FORMATO DE RESPOSTA (JSON):
{
  "taskAnalysis": "Análise breve da tarefa",
  "complexity": "simple|medium|complex",
  "estimatedSteps": 3,
  "plan": [
    {
      "step": 1,
      "action": "Descrição da ação",
      "tool": "nome_da_ferramenta ou null",
      "expectedOutput": "O que esperar desta etapa"
    }
  ],
  "finalDeliverable": "O que será entregue ao final"
}

Responda APENAS com o JSON, sem texto adicional.`;

    try {
      const response = await this.callAI(planningPrompt, 'planning');
      
      // Tentar extrair JSON da resposta
      let plan;
      try {
        // Procurar JSON na resposta
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          plan = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('JSON não encontrado');
        }
      } catch (e) {
        // Se não conseguir parsear, criar plano simples
        plan = {
          taskAnalysis: "Tarefa analisada",
          complexity: "medium",
          estimatedSteps: 1,
          plan: [
            {
              step: 1,
              action: "Executar tarefa solicitada",
              tool: null,
              expectedOutput: "Resposta completa"
            }
          ],
          finalDeliverable: "Resposta para o usuário"
        };
      }

      this.plan = plan.plan || [];
      this.onProgress({
        type: 'plan_created',
        plan: plan,
        totalSteps: this.plan.length
      });

      return plan;
    } catch (error) {
      this.setState(AgentState.ERROR, { error: error.message });
      throw error;
    }
  }

  // Executar o plano
  async executePlan() {
    this.setState(AgentState.EXECUTING);
    this.currentStep = 0;
    this.results = [];

    for (let i = 0; i < this.plan.length; i++) {
      this.currentStep = i + 1;
      const step = this.plan[i];
      
      this.onProgress({
        type: 'step_start',
        step: this.currentStep,
        totalSteps: this.plan.length,
        action: step.action,
        tool: step.tool
      });

      try {
        const result = await this.executeStep(step);
        this.results.push({ step: this.currentStep, result, success: true });
        
        this.onProgress({
          type: 'step_complete',
          step: this.currentStep,
          totalSteps: this.plan.length,
          result: result
        });
      } catch (error) {
        this.results.push({ step: this.currentStep, error: error.message, success: false });
        
        this.onProgress({
          type: 'step_error',
          step: this.currentStep,
          error: error.message
        });

        // Tentar recuperar do erro
        const recovered = await this.handleError(step, error);
        if (!recovered) {
          break;
        }
      }
    }

    return this.generateFinalResponse();
  }

  // Executar uma etapa específica
  async executeStep(step) {
    if (step.tool) {
      return await this.useTool(step.tool, step.action);
    } else {
      return await this.think(step.action);
    }
  }

  // Usar uma ferramenta
  async useTool(toolType, action) {
    this.setState(AgentState.USING_TOOL, { tool: toolType });
    this.onToolUse({ tool: toolType, action });

    // 🍌 Nano Banana - Geração de Imagens
    if (toolType === 'image_generate' || toolType === 'nano_banana') {
      return await this.generateImage(action);
    }

    const toolPrompt = `Você é um agente autônomo executando uma ferramenta.

FERRAMENTA: ${toolType}
AÇÃO: ${action}
CONTEXTO DA TAREFA: ${this.currentTask}
RESULTADOS ANTERIORES: ${JSON.stringify(this.results.slice(-3))}

Execute a ação usando a ferramenta especificada e retorne o resultado de forma clara e estruturada.
Se for código, inclua o código completo.
Se for análise, seja detalhado.
Se for escrita, produza o texto completo.`;

    return await this.callAI(toolPrompt, 'tool');
  }

  // 🍌 Nano Banana - Gerar imagem com IA
  async generateImage(prompt) {
    console.warn('🍌 Nano Banana: Gerando imagem...');
    
    try {
      const response = await fetch('/api/image-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          style: 'realistic'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao gerar imagem');
      }

      const data = await response.json();
      
      if (data.success && data.image) {
        // Retornar resultado com a imagem
        const imageUrl = data.format === 'base64' 
          ? `data:${data.mimeType || 'image/png'};base64,${data.image}`
          : data.image;
        
        return {
          type: 'image',
          url: imageUrl,
          provider: data.provider,
          model: data.model,
          prompt: data.prompt,
          message: `🍌 Imagem gerada com sucesso pelo Nano Banana!\n\n![Imagem Gerada](${imageUrl})\n\n**Provider:** ${data.provider}\n**Modelo:** ${data.model}`
        };
      }
      
      throw new Error('Nenhuma imagem foi gerada');
    } catch (error) {
      console.error('❌ Nano Banana error:', error);
      return {
        type: 'error',
        message: `🍌 Nano Banana não conseguiu gerar a imagem: ${error.message}`
      };
    }
  }

  // Pensar/raciocinar sobre algo
  async think(action) {
    this.setState(AgentState.THINKING);

    const thinkPrompt = `Você é um agente autônomo raciocinando sobre uma tarefa.

AÇÃO ATUAL: ${action}
TAREFA ORIGINAL: ${this.currentTask}
RESULTADOS ANTERIORES: ${JSON.stringify(this.results.slice(-3))}

Raciocine sobre a ação e produza o resultado necessário.
Seja completo e detalhado na sua resposta.`;

    return await this.callAI(thinkPrompt, 'think');
  }

  // Lidar com erros
  async handleError(step, error) {
    const recoveryPrompt = `Ocorreu um erro na execução:
ETAPA: ${step.action}
ERRO: ${error.message}

Como posso recuperar e continuar a tarefa?`;

    try {
      const recovery = await this.callAI(recoveryPrompt, 'recovery');
      this.addMessage('assistant', `⚠️ Recuperando de erro: ${recovery}`);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Gerar resposta final
  async generateFinalResponse() {
    this.setState(AgentState.THINKING);

    const finalPrompt = `Você é um agente autônomo finalizando uma tarefa.

TAREFA ORIGINAL: ${this.currentTask}

RESULTADOS DAS ETAPAS:
${this.results.map((r, i) => `Etapa ${i + 1}: ${r.success ? r.result : 'Erro: ' + r.error}`).join('\n\n')}

Compile todos os resultados em uma resposta final completa, bem formatada em Markdown.
Inclua:
- Resumo do que foi feito
- Resultados principais
- Código ou documentos gerados (se houver)
- Próximos passos sugeridos (se aplicável)`;

    const finalResponse = await this.callAI(finalPrompt, 'final');
    
    this.setState(AgentState.COMPLETED);
    
    return finalResponse;
  }

  // Chamar a API de IA
  async callAI(prompt, type = 'general') {
    const messages = [
      ...this.conversationHistory.slice(-10),
      { role: 'user', content: prompt }
    ];

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'genius',
        messages: messages,
        agentType: 'hybrid',
        mode: 'OTIMIZADO',
        context: type
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    return data.response || '';
  }

  // Detectar se é pedido de geração de imagem (v2.0 - Nano Banana)
  isImageGenerationRequest(input) {
    console.warn('🍌 Nano Banana: Verificando se é pedido de imagem:', input);
    const imageKeywords = [
      /gere?\s+(uma?\s+)?imagem/i,
      /crie?\s+(uma?\s+)?imagem/i,
      /faça\s+(uma?\s+)?imagem/i,
      /desenhe?/i,
      /ilustração/i,
      /nano\s*banana/i,
      /gerar?\s+imagem/i,
      /criar?\s+imagem/i,
      /image\s*generat/i,
      /generate\s+image/i,
      /create\s+image/i
    ];
    return imageKeywords.some(pattern => pattern.test(input));
  }

  // Extrair prompt de imagem do input do usuário
  extractImagePrompt(input) {
    // Remover palavras-chave de comando
    let prompt = input
      .replace(/gere?\s+(uma?\s+)?imagem\s+(de?\s+)?/i, '')
      .replace(/crie?\s+(uma?\s+)?imagem\s+(de?\s+)?/i, '')
      .replace(/faça\s+(uma?\s+)?imagem\s+(de?\s+)?/i, '')
      .replace(/desenhe?\s+/i, '')
      .replace(/use\s+o?\s*nano\s*banana\s+(para\s+)?/i, '')
      .replace(/usando\s+o?\s*nano\s*banana/i, '')
      .trim();
    return prompt || input;
  }

  // Executar tarefa completa (planejamento + execução)
  async run(userInput) {
    try {
      // Mensagem do usuário já foi adicionada no handleSend
      
      // 🍌 NANO BANANA - Detectar pedido de imagem automaticamente
      if (this.isImageGenerationRequest(userInput)) {
        this.addMessage('assistant', '🍌 Nano Banana ativado! Gerando imagem...', { type: 'status' });
        const imagePrompt = this.extractImagePrompt(userInput);
        const result = await this.generateImage(imagePrompt);
        
        if (result.type === 'image') {
          this.addMessage('assistant', result.message, { type: 'image', imageUrl: result.url });
          this.setState(AgentState.COMPLETED);
          return result.message;
        } else {
          // Se falhou, continua com o fluxo normal
          this.addMessage('assistant', `⚠️ ${result.message}. Tentando abordagem alternativa...`, { type: 'warning' });
        }
      }
      
      // Fase 1: Planejamento
      this.addMessage('assistant', '🧠 Analisando tarefa e criando plano de execução...', { type: 'status' });
      const plan = await this.planTask(userInput);
      
      this.addMessage('assistant', `📋 Plano criado com ${plan.plan?.length || 1} etapas. Iniciando execução...`, { 
        type: 'plan',
        plan: plan 
      });

      // Fase 2: Execução
      const result = await this.executePlan();
      
      // Fase 3: Entrega
      this.addMessage('assistant', result, { type: 'final' });
      
      return result;
    } catch (error) {
      this.setState(AgentState.ERROR, { error: error.message });
      this.addMessage('assistant', `❌ Erro: ${error.message}`, { type: 'error' });
      throw error;
    }
  }

  // Modo simples (sem planejamento)
  async runSimple(userInput) {
    try {
      // Mensagem do usuário já foi adicionada no handleSend
      this.setState(AgentState.THINKING);
      
      const response = await this.callAI(userInput, 'simple');
      
      // Remover thinking tags
      const cleanResponse = response.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
      
      this.addMessage('assistant', cleanResponse, { type: 'response' });
      this.setState(AgentState.COMPLETED);
      
      return cleanResponse;
    } catch (error) {
      this.setState(AgentState.ERROR, { error: error.message });
      throw error;
    }
  }

  // Resetar agente
  reset() {
    this.state = AgentState.IDLE;
    this.currentTask = null;
    this.plan = [];
    this.currentStep = 0;
    this.results = [];
    this.conversationHistory = [];
  }
}

// Hook para usar o agente em React
export function useAutonomousAgent(options = {}) {
  const agentRef = { current: null };
  
  if (!agentRef.current) {
    agentRef.current = new AutonomousAgent(options);
  }
  
  return agentRef.current;
}

export default AutonomousAgent;
