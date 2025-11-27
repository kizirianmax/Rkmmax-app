/**
 * GITHUB BOT API
 * Webhook endpoint para processar eventos do GitHub
 * Vercel Serverless Function
 */

const GitHubBot = require('../src/automation/GitHubBot');
const crypto = require('crypto');

const bot = new GitHubBot(process.env.GITHUB_TOKEN);

// Verificar assinatura do webhook
function verifyWebhookSignature(payload, signature) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET || 'your-secret';
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `sha256=${hash}` === signature;
}

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Hub-Signature-256');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Verificar assinatura do webhook
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);

    if (signature && !verifyWebhookSignature(payload, signature)) {
      console.warn('⚠️ Webhook signature inválida');
      return res.status(401).json({ error: 'Assinatura inválida' });
    }

    const event = req.headers['x-github-event'];
    console.log(`\n🔔 Webhook GitHub: ${event}`);

    // Processar webhook
    const result = await bot.processWebhook(req.body);

    return res.status(200).json({
      success: true,
      event,
      processed: result?.processed || false,
      result,
    });
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro ao processar webhook',
      message: error.message,
    });
  }
}

module.exports = handler;
