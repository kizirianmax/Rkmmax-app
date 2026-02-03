// api/feedback.js
import { Resend } from 'resend';

/**
 * Endpoint para receber feedbacks dos usuários
 * - Cria Issue no GitHub automaticamente
 * - Envia email de notificação
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

// Mapear tipo para label e emoji
const typeMap = {
  bug: { label: 'bug', emoji: '🐛', title: 'Bug Report' },
  feature: { label: 'enhancement', emoji: '💡', title: 'Feature Request' },
  question: { label: 'question', emoji: '❓', title: 'Question' },
  other: { label: 'feedback', emoji: '💬', title: 'Feedback' }
};

export default async function handler(req, res) {
  if (applyCORS(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { type, feedback, email, url, userAgent, timestamp, viewport, language } = body;

    if (!feedback) {
      return res.status(400).json({ ok: false, error: "Feedback is required" });
    }

    const typeInfo = typeMap[type] || typeMap.other;
    const userEmail = email || 'Anônimo';

    console.log('📝 Feedback recebido:', {
      type,
      email: userEmail,
      url,
      timestamp
    });

    // ===== 1. CRIAR ISSUE NO GITHUB =====
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || 'kizirianmax/Rkmmax-app';
    
    let githubIssueUrl = null;
    
    if (GITHUB_TOKEN) {
      try {
        const issueTitle = `${typeInfo.emoji} [${typeInfo.title}] ${feedback.substring(0, 50)}${feedback.length > 50 ? '...' : ''}`;
        
        const issueBody = `## ${typeInfo.emoji} ${typeInfo.title}

### Descrição
${feedback}

### Informações do Usuário
| Campo | Valor |
|-------|-------|
| **Email** | ${userEmail} |
| **URL** | ${url || 'N/A'} |
| **Viewport** | ${viewport || 'N/A'} |
| **Idioma** | ${language || 'N/A'} |
| **User Agent** | ${userAgent || 'N/A'} |
| **Data/Hora** | ${timestamp || new Date().toISOString()} |

---
*Feedback enviado automaticamente via RKMMAX App*`;

        const githubResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'RKMMAX-Feedback-Bot'
          },
          body: JSON.stringify({
            title: issueTitle,
            body: issueBody,
            labels: [typeInfo.label, 'user-feedback']
          })
        });

        if (githubResponse.ok) {
          const issueData = await githubResponse.json();
          githubIssueUrl = issueData.html_url;
          console.log('✅ Issue criada no GitHub:', githubIssueUrl);
        } else {
          const errorText = await githubResponse.text();
          console.error('❌ Erro ao criar issue:', githubResponse.status, errorText);
        }
      } catch (githubError) {
        console.error('❌ Erro GitHub:', githubError.message);
      }
    } else {
      console.warn('⚠️ GITHUB_TOKEN não configurado - Issue não criada');
    }

    // ===== 2. ENVIAR EMAIL DE NOTIFICAÇÃO =====
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const OWNER_EMAIL = process.env.OWNER_EMAIL || 'suporte@kizirianmax.site';
    const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    
    let emailSent = false;

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 12px 12px 0 0; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
    .footer { background: #1e293b; color: #94a3b8; padding: 15px; border-radius: 0 0 12px 12px; font-size: 12px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-bug { background: #fef2f2; color: #dc2626; }
    .badge-feature { background: #fef3c7; color: #d97706; }
    .badge-question { background: #dbeafe; color: #2563eb; }
    .badge-other { background: #f3e8ff; color: #7c3aed; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
    td:first-child { font-weight: 600; width: 120px; color: #64748b; }
    .feedback-text { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 15px 0; }
    .btn { display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">${typeInfo.emoji} Novo Feedback Recebido</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">RKMMAX App</p>
    </div>
    
    <div class="content">
      <p><span class="badge badge-${type}">${typeInfo.title}</span></p>
      
      <div class="feedback-text">
        <strong>Mensagem:</strong><br>
        ${feedback}
      </div>
      
      <table>
        <tr><td>Email</td><td>${userEmail}</td></tr>
        <tr><td>URL</td><td>${url || 'N/A'}</td></tr>
        <tr><td>Viewport</td><td>${viewport || 'N/A'}</td></tr>
        <tr><td>Idioma</td><td>${language || 'N/A'}</td></tr>
        <tr><td>Data/Hora</td><td>${timestamp || new Date().toISOString()}</td></tr>
      </table>
      
      ${githubIssueUrl ? `<p><a href="${githubIssueUrl}" class="btn">Ver Issue no GitHub</a></p>` : ''}
    </div>
    
    <div class="footer">
      <p style="margin: 0;">Este email foi enviado automaticamente pelo sistema de feedback do RKMMAX.</p>
    </div>
  </div>
</body>
</html>`;

        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: [OWNER_EMAIL],
          subject: `${typeInfo.emoji} [RKMMAX Feedback] ${typeInfo.title}: ${feedback.substring(0, 30)}...`,
          html: emailHtml
        });

        if (error) {
          console.error('❌ Erro ao enviar email:', error);
        } else {
          emailSent = true;
          console.log('✅ Email enviado:', data.id);
        }
      } catch (emailError) {
        console.error('❌ Erro email:', emailError.message);
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY não configurado - Email não enviado');
    }

    // ===== RESPOSTA =====
    return res.status(200).json({
      ok: true,
      message: 'Feedback recebido com sucesso!',
      githubIssue: githubIssueUrl,
      emailSent,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao processar feedback:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error'
    });
  }
}
