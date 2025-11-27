/**
 * AUTOMATION API
 * Endpoint principal para executar automações
 * Vercel Serverless Function
 */

const AutomationEngine = require('../src/automation/AutomationEngine');

let engine;

// Inicializar engine
try {
  engine = new AutomationEngine({
    aiModel: 'gemini-2.0-flash',
    temperature: 0.7,
  });

  // Inicializar GitHub
  if (process.env.GITHUB_TOKEN) {
    engine.initializeGitHub(process.env.GITHUB_TOKEN);
  }
} catch (error) {
  console.error('Erro ao inicializar AutomationEngine:', error.message);
}

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!engine) {
    return res.status(500).json({
      error: 'AutomationEngine não inicializado',
    });
  }

  try {
    // POST: Executar automação
    if (req.method === 'POST' && req.body.action === 'execute') {
      const {
        userId,
        username,
        command,
        mode = 'OPTIMIZED',
        selectedSpecialist,
        description,
        repositoryInfo,
        createPR = false,
        creditsUsed = 0,
        ipAddress,
        userAgent,
        sessionId,
      } = req.body;

      if (!userId || !command) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios faltando',
          required: ['userId', 'command'],
        });
      }

      console.log(`\n🚀 AUTOMAÇÃO INICIADA: ${command}`);
      console.log(`   Usuário: ${userId}`);
      console.log(`   Modo: ${mode}`);
      console.log(`   Especialista: ${selectedSpecialist || 'Automático'}`);

      const result = await engine.executeAutomation({
        userId,
        username,
        command,
        mode,
        selectedSpecialist,
        description: description || command,
        repositoryInfo,
        createPR,
        creditsUsed,
        ipAddress,
        userAgent,
        sessionId,
      });

      const statusCode = result.status === 'SUCCESS' ? 200 : 
                        result.status === 'BLOCKED' ? 403 : 500;

      return res.status(statusCode).json({
        success: result.status === 'SUCCESS',
        ...result,
      });
    }

    // GET: Histórico de automações
    if (req.method === 'GET' && req.query.action === 'history') {
      const { userId, limit = 50 } = req.query;

      if (!userId) {
        return res.status(400).json({
          error: 'userId é obrigatório',
        });
      }

      const history = engine.getAutomationHistory(userId, parseInt(limit));

      return res.status(200).json({
        success: true,
        total: history.length,
        automations: history,
      });
    }

    // GET: Estatísticas
    if (req.method === 'GET' && req.query.action === 'stats') {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          error: 'userId é obrigatório',
        });
      }

      const stats = engine.getAutomationStats(userId);

      return res.status(200).json({
        success: true,
        stats,
      });
    }

    // GET: Listar especialistas
    if (req.method === 'GET' && req.query.action === 'specialists') {
      const specialists = engine.specialistSelector.listAllSpecialists();

      return res.status(200).json({
        success: true,
        total: specialists.length,
        specialists,
      });
    }

    // GET: Informações de especialista
    if (req.method === 'GET' && req.query.action === 'specialist-info') {
      const { name } = req.query;

      if (!name) {
        return res.status(400).json({
          error: 'name é obrigatório',
        });
      }

      const info = engine.specialistSelector.getSpecialistInfo(name);

      if (!info) {
        return res.status(404).json({
          error: 'Especialista não encontrado',
        });
      }

      return res.status(200).json({
        success: true,
        specialist: info,
      });
    }

    return res.status(400).json({
      error: 'Ação não reconhecida',
      availableActions: [
        'execute',
        'history',
        'stats',
        'specialists',
        'specialist-info',
      ],
    });
  } catch (error) {
    console.error('❌ Erro na automação:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro ao executar automação',
      message: error.message,
    });
  }
}

module.exports = handler;
