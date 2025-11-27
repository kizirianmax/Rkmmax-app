/**
 * SECURITY VALIDATOR API
 * Endpoint para validar código antes de commits automáticos
 * Vercel Serverless Function
 */

const SecurityValidator = require('../src/automation/SecurityValidator');

const validator = new SecurityValidator();

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { code, filePath, files } = req.body;

    // Validar um arquivo
    if (code && filePath) {
      console.log(`🔍 Validando arquivo: ${filePath}`);

      const validation = await validator.validateCode(code, filePath);

      return res.status(200).json({
        success: true,
        validation,
        recommendation: validation.isValid 
          ? '✅ Código aprovado para commit'
          : '❌ Código bloqueado - Corrija os erros',
      });
    }

    // Validar múltiplos arquivos
    if (files && Array.isArray(files)) {
      console.log(`🔍 Validando ${files.length} arquivos`);

      const validation = await validator.validateFiles(files);
      const report = validator.generateSecurityReport(validation);

      return res.status(200).json({
        success: true,
        validation,
        report,
      });
    }

    return res.status(400).json({
      error: 'Requisição inválida',
      message: 'Forneça "code" e "filePath" ou "files"',
    });
  } catch (error) {
    console.error('❌ Erro na validação:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro ao validar código',
      message: error.message,
    });
  }
}

module.exports = handler;
