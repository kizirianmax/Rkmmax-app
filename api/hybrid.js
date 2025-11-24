/**
 * HYBRID SYSTEM API ENDPOINT
 * Processa requisições do Sistema Híbrido RKMMAX v2.0.0
 * Suporta modo manual e autônomo com 55+ agentes
 */

let HybridAgentSystem = null;

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

// Cache global do sistema (reutilizar instância)
let globalSystem = null;
let systemInitialized = false;

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
    // Carregar sistema híbrido
    const SystemClass = loadHybridSystem();
    if (!SystemClass) {
      return res.status(503).json({
        error: 'Sistema híbrido não disponível',
        message: 'O sistema de agentes está em manutenção',
      });
    }

    // Inicializar sistema
    const system = await initializeSystem();

    // Rotas
    if (req.method === 'POST' && req.url === '/api/hybrid/process') {
      return handleProcess(req, res, system);
    }

    if (req.method === 'GET' && req.url === '/api/hybrid/stats') {
      return handleStats(req, res, system);
    }

    if (req.method === 'GET' && req.url === '/api/hybrid/agents') {
      return handleAgents(req, res, system);
    }

    if (req.method === 'GET' && req.url === '/api/hybrid/health') {
      return handleHealth(req, res, system);
    }

    // Rota não encontrada
    res.status(404).json({
      error: 'Rota não encontrada',
      available: [
        'POST /api/hybrid/process',
        'GET /api/hybrid/stats',
        'GET /api/hybrid/agents',
        'GET /api/hybrid/health',
      ],
    });
  } catch (error) {
    console.error('Erro no endpoint híbrido:', error);
    res.status(500).json({
      error: 'Erro ao processar requisição',
      message: error.message,
    });
  }
}

/**
 * Processar requisição (POST /api/hybrid/process)
 */
async function handleProcess(req, res, system) {
  try {
    const { prompt, mode = 'MANUAL', context = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Campo "prompt" é obrigatório',
      });
    }

    // Processar através do Serginho
    const response = await system.process(prompt, {
      mode: mode.toUpperCase(),
      ...context,
      timestamp: Date.now(),
    });

    res.status(200).json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao processar:', error);
    res.status(500).json({
      error: 'Erro ao processar requisição',
      message: error.message,
    });
  }
}

/**
 * Obter estatísticas (GET /api/hybrid/stats)
 */
async function handleStats(req, res, system) {
  try {
    const stats = system.getGlobalStats();

    res.status(200).json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao obter stats:', error);
    res.status(500).json({
      error: 'Erro ao obter estatísticas',
      message: error.message,
    });
  }
}

/**
 * Listar agentes (GET /api/hybrid/agents)
 */
async function handleAgents(req, res, system) {
  try {
    const stats = system.getGlobalStats();
    const agents = stats?.loader?.specialists || [];

    res.status(200).json({
      success: true,
      agents,
      total: agents.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao listar agentes:', error);
    res.status(500).json({
      error: 'Erro ao listar agentes',
      message: error.message,
    });
  }
}

/**
 * Health check (GET /api/hybrid/health)
 */
async function handleHealth(req, res, system) {
  try {
    const stats = system.getGlobalStats();

    res.status(200).json({
      success: true,
      status: 'HEALTHY',
      initialized: stats?.system?.initialized || false,
      specialists: stats?.loader?.specialists?.length || 0,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro no health check:', error);
    res.status(500).json({
      success: false,
      status: 'UNHEALTHY',
      error: error.message,
    });
  }
}



module.exports = handler;

