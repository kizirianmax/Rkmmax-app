// api/send-email.js

/**
 * Endpoint para enviar e-mails
 * 
 * Integração futura com:
 * - SendGrid
 * - Mailgun
 * - AWS SES
 * - Resend
 */

// CORS
function applyCORS(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store");
  
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  if (applyCORS(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { to, subject, html, text, type } = body;

    if (!to || !subject) {
      return res.status(400).json({ 
        ok: false, 
        error: "Missing required fields: to, subject" 
      });
    }

    // Log do e-mail (em produção, enviar via serviço real)
    console.log('📧 Enviando e-mail:', {
      to,
      subject,
      type: type || 'generic',
      timestamp: new Date().toISOString()
    });

    // TODO: Integrar com serviço de e-mail real
    // Exemplo com SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sgMail.send({
      to,
      from: 'suporte@kizirianmax.site',
      subject,
      html,
      text
    });
    */

    // Exemplo com Resend:
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'suporte@kizirianmax.site',
      to,
      subject,
      html,
      text
    });
    */

    // Por enquanto, apenas simular sucesso
    return res.status(200).json({ 
      ok: true, 
      message: 'Email sent successfully (simulated)',
      emailId: `sim_${Date.now()}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    return res.status(500).json({ 
      ok: false, 
      error: error.message || 'Internal server error' 
    });
  }
}

