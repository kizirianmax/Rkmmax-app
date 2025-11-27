/**
 * CREDIT CALCULATOR API
 * Endpoint para cálculo de créditos, preços e margens
 * Vercel Serverless Function
 */

const CreditCalculator = require('../src/automation/CreditCalculator');

const calculator = new CreditCalculator();

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // POST: Calcular custo de automação
    if (req.method === 'POST' && req.body.action === 'calculate-cost') {
      const { mode = 'MANUAL', tokensUsed = 1000, model = 'gemini-2.0-flash' } = req.body;

      const cost = calculator.calculateAutomationCost(mode, tokensUsed, model);

      return res.status(200).json({
        success: true,
        cost,
      });
    }

    // POST: Verificar limite diário
    if (req.method === 'POST' && req.body.action === 'check-daily-limit') {
      const { planName, currentUsage } = req.body;

      if (!planName || !currentUsage) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios faltando',
          required: ['planName', 'currentUsage'],
        });
      }

      const check = calculator.checkDailyLimit(planName, currentUsage);

      return res.status(check.valid ? 200 : 429).json({
        success: check.valid,
        ...check,
      });
    }

    // GET: Informações de plano
    if (req.method === 'GET' && req.query.action === 'plan-info') {
      const { planName } = req.query;

      if (!planName) {
        return res.status(400).json({
          error: 'planName é obrigatório',
        });
      }

      const plan = calculator.getPlanInfo(planName);

      if (!plan) {
        return res.status(404).json({
          error: 'Plano não encontrado',
        });
      }

      return res.status(200).json({
        success: true,
        plan,
      });
    }

    // GET: Listar todos os planos
    if (req.method === 'GET' && req.query.action === 'list-plans') {
      const plans = calculator.listAllPlans();

      return res.status(200).json({
        success: true,
        total: plans.length,
        plans,
      });
    }

    // GET: Calcular preços
    if (req.method === 'GET' && req.query.action === 'calculate-prices') {
      const prices = calculator.calculatePlanPrices();

      return res.status(200).json({
        success: true,
        prices,
      });
    }

    // GET: Relatório de preços
    if (req.method === 'GET' && req.query.action === 'pricing-report') {
      const report = calculator.generatePricingReport();

      return res.status(200).json({
        success: true,
        report,
      });
    }

    // GET: Créditos restantes do dia
    if (req.method === 'GET' && req.query.action === 'remaining-credits') {
      const { planName, usedCredits = 0 } = req.query;

      if (!planName) {
        return res.status(400).json({
          error: 'planName é obrigatório',
        });
      }

      const remaining = calculator.getRemainingCreditsToday(planName, parseInt(usedCredits));

      return res.status(200).json({
        success: true,
        planName,
        usedCredits: parseInt(usedCredits),
        remainingCredits: remaining,
        hasLimit: remaining !== -1,
      });
    }

    return res.status(400).json({
      error: 'Ação não reconhecida',
      availableActions: [
        'calculate-cost',
        'check-daily-limit',
        'plan-info',
        'list-plans',
        'calculate-prices',
        'pricing-report',
        'remaining-credits',
      ],
    });
  } catch (error) {
    console.error('❌ Erro no cálculo de créditos:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro ao calcular créditos',
      message: error.message,
    });
  }
}

module.exports = handler;
