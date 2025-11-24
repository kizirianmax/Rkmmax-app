/**
 * HYBRID SYSTEM - GITHUB INTEGRATION API (REAL EXECUTION)
 * Executa tarefas REAIS em repositórios GitHub
 * Tipo Manus: lê repo + executa tarefa + retorna resultado
 */

const GitHubService = require('../src/services/githubService');
const TaskExecutor = require('../src/services/taskExecutor');

// Cache global do sistema
let HybridAgentSystem = null;
let globalSystem = null;
let systemInitialized = false;

// Lazy load do sistema híbrido
function loadHybridSystem() {
  if (!HybridAgentSystem) {
    try {
      const agentsModule = require('../src/agents');
      HybridAgentSystem = agentsModule.HybridAgentSystem;
    } catch (error) {
      console.warn('Aviso: Sistema híbrido não disponível:', error.message);
      return null;
    }
  }
  return HybridAgentSystem;
}

/**
 * Inicializar sistema uma única vez
 */
async function initializeSystem() {
  if (systemInitialized && globalSystem) {
    return globalSystem;
  }

  try {
    const SystemClass = loadHybridSystem();
    if (!SystemClass) {
      throw new Error('Sistema híbrido não disponível');
    }

    console.log('🚀 Inicializando Sistema Híbrido...');
    globalSystem = new SystemClass();
    const result = await globalSystem.initialize();
    
    if (result.success) {
      systemInitialized = true;
      console.log(`✅ Sistema inicializado: ${result.specialists} especialistas`);
      return globalSystem;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar sistema:', error);
    throw error;
  }
}

/**
 * Chamar IA para gerar conteúdo
 */
async function callAI(prompt, mode = 'MANUAL') {
  try {
    // Usar o chat API existente
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Erro ao chamar IA:', error);
    throw error;
  }
}

/**
 * Handler principal
 */
async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST' && req.url === '/api/hybrid-github/process') {
      return handleGitHubProcess(req, res);
    }

    if (req.method === 'POST' && req.url === '/api/hybrid-github/analyze') {
      return handleGitHubAnalyze(req, res);
    }

    // Rota não encontrada
    res.status(404).json({
      error: 'Rota não encontrada',
      available: [
        'POST /api/hybrid-github/process',
        'POST /api/hybrid-github/analyze',
      ],
    });
  } catch (error) {
    console.error('Erro no endpoint híbrido-github:', error);
    res.status(500).json({
      error: 'Erro ao processar requisição',
      message: error.message,
    });
  }
}

/**
 * Analisar repositório GitHub
 * POST /api/hybrid-github/analyze
 */
async function handleGitHubAnalyze(req, res) {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({
        error: 'Campo "githubUrl" é obrigatório',
      });
    }

    const githubService = new GitHubService(process.env.GITHUB_TOKEN);
    const analysis = await githubService.analyzeRepository(githubUrl);

    res.status(200).json({
      success: analysis.success,
      data: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao analisar GitHub:', error);
    res.status(500).json({
      error: 'Erro ao analisar repositório',
      message: error.message,
    });
  }
}

/**
 * PROCESSAR REQUISIÇÃO COM GITHUB + TAREFA (EXECUÇÃO REAL)
 * POST /api/hybrid-github/process
 * 
 * Body:
 * {
 *   "githubUrl": "https://github.com/user/repo",
 *   "task": "Crie um README.md",
 *   "mode": "MANUAL" ou "AUTONOMOUS"
 * }
 */
async function handleGitHubProcess(req, res) {
  try {
    const { githubUrl, task, mode = 'MANUAL' } = req.body;

    if (!githubUrl || !task) {
      return res.status(400).json({
        error: 'Campos "githubUrl" e "task" são obrigatórios',
      });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 INICIANDO EXECUÇÃO DE TAREFA`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📦 Repositório: ${githubUrl}`);
    console.log(`📝 Tarefa: ${task}`);
    console.log(`🎮 Modo: ${mode}`);
    console.log(`${'='.repeat(60)}\n`);

    // 1. Analisar repositório
    console.log(`📖 [1/4] Analisando repositório...`);
    const githubService = new GitHubService(process.env.GITHUB_TOKEN);
    const repoAnalysis = await githubService.analyzeRepository(githubUrl);

    if (!repoAnalysis.success) {
      return res.status(400).json({
        error: 'Erro ao analisar repositório',
        details: repoAnalysis.error,
      });
    }

    const repoData = repoAnalysis.repository;
    console.log(`✅ Repositório analisado: ${repoData.info.name}`);
    console.log(`   - Descrição: ${repoData.info.description}`);
    console.log(`   - Linguagem: ${repoData.info.language}`);
    console.log(`   - Stars: ${repoData.info.stars}\n`);

    // 2. Gerar prompt para IA
    console.log(`🤖 [2/4] Gerando conteúdo com IA...`);
    const aiPrompt = `
Você é um especialista em desenvolvimento de software. Analise este repositório e execute a seguinte tarefa:

**Repositório:** ${repoData.info.name}
**Descrição:** ${repoData.info.description}
**Linguagem:** ${repoData.info.language}
**URL:** ${repoData.info.url}

**README (primeiras 500 chars):**
${repoData.readme ? repoData.readme.substring(0, 500) : 'Não encontrado'}

**Arquivos principais:**
${repoData.mainFiles.map(f => `- ${f.name}`).join('\n')}

**Tarefa do usuário:** ${task}

Por favor, execute a tarefa de forma profissional e completa. Retorne o resultado pronto para usar.
`;

    let aiResponse = '';
    try {
      aiResponse = await callAI(aiPrompt, mode);
      console.log(`✅ Conteúdo gerado pela IA\n`);
    } catch (error) {
      console.warn(`⚠️ Erro ao chamar IA, usando gerador local\n`);
    }

    // 3. Executar tarefa
    console.log(`⚙️ [3/4] Executando tarefa...`);
    const taskExecutor = new TaskExecutor(process.env.GITHUB_TOKEN);
    const executionResult = await taskExecutor.executeTask(repoData, task, aiResponse);

    if (!executionResult.success) {
      return res.status(500).json({
        error: 'Erro ao executar tarefa',
        details: executionResult.error,
      });
    }

    console.log(`✅ Tarefa executada: ${executionResult.taskType}`);
    console.log(`   - Arquivo: ${executionResult.result.filename}`);
    console.log(`   - Tamanho: ${executionResult.result.content.length} caracteres\n`);

    // 4. Retornar resultado
    console.log(`📤 [4/4] Retornando resultado...`);
    console.log(`${'='.repeat(60)}\n`);

    res.status(200).json({
      success: true,
      repository: {
        owner: repoData.owner,
        repo: repoData.repo,
        url: repoData.info.url,
        name: repoData.info.name,
        description: repoData.info.description,
      },
      task,
      mode,
      execution: {
        taskType: executionResult.taskType,
        filename: executionResult.result.filename,
        content: executionResult.result.content,
        description: executionResult.result.description,
        size: executionResult.result.content.length,
      },
      aiGenerated: aiResponse.length > 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Erro ao processar GitHub:', error);
    res.status(500).json({
      error: 'Erro ao processar requisição',
      message: error.message,
    });
  }
}

module.exports = handler;

