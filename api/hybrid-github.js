/**
 * HYBRID SYSTEM - GITHUB INTEGRATION API
 * Processa requisições que envolvem análise de repositórios GitHub
 * Lê repo + executa tarefa conforme solicitado
 */

const GitHubService = require('../src/services/githubService');

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
 * Processar requisição com GitHub + Tarefa
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

    // 1. Analisar repositório
    console.log(`📖 Analisando repositório: ${githubUrl}`);
    const githubService = new GitHubService(process.env.GITHUB_TOKEN);
    const repoAnalysis = await githubService.analyzeRepository(githubUrl);

    if (!repoAnalysis.success) {
      return res.status(400).json({
        error: 'Erro ao analisar repositório',
        details: repoAnalysis.error,
      });
    }

    // 2. Preparar contexto para o sistema híbrido
    const repoContext = repoAnalysis.repository;
    const fullPrompt = `
Repositório: ${repoContext.info.name}
URL: ${repoContext.info.url}
Descrição: ${repoContext.info.description || 'N/A'}
Linguagem: ${repoContext.info.language || 'N/A'}
Stars: ${repoContext.info.stars}

README:
${repoContext.readme ? repoContext.readme.substring(0, 1000) : 'Não encontrado'}

Arquivos principais:
${repoContext.mainFiles.map(f => `- ${f.name}`).join('\n')}

Tarefa do usuário: ${task}

Por favor, analise o repositório e execute a tarefa solicitada.
`;

    // 3. Processar através do sistema híbrido
    const system = await initializeSystem();
    
    const response = await system.process(fullPrompt, {
      mode: mode.toUpperCase(),
      context: 'github',
      repository: `${repoContext.owner}/${repoContext.repo}`,
      timestamp: Date.now(),
    });

    // 4. Retornar resultado
    res.status(200).json({
      success: true,
      repository: {
        owner: repoContext.owner,
        repo: repoContext.repo,
        url: repoContext.info.url,
      },
      task,
      mode,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao processar GitHub:', error);
    res.status(500).json({
      error: 'Erro ao processar requisição',
      message: error.message,
    });
  }
}

module.exports = handler;

