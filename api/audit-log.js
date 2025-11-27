/**
 * AUDIT LOG API
 * Endpoint para receber e armazenar logs de auditoria
 * Vercel Serverless Function
 */

// Simulação de banco de dados (em produção, usar Supabase/MongoDB)
let auditLogs = [];

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Receber novo log
  if (req.method === 'POST') {
    try {
      const log = req.body;

      // Validar log
      if (!log.type || !log.timestamp) {
        return res.status(400).json({
          error: 'Log inválido: faltam campos obrigatórios',
        });
      }

      // Adicionar ID se não existir
      if (!log.id) {
        log.id = `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Adicionar ao array
      auditLogs.push(log);

      // Manter limite de logs em memória
      if (auditLogs.length > 10000) {
        auditLogs = auditLogs.slice(-10000);
      }

      console.log(`✅ Log registrado: ${log.type} (${log.id})`);

      return res.status(201).json({
        success: true,
        logId: log.id,
        message: 'Log registrado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao registrar log:', error);
      return res.status(500).json({
        error: 'Erro ao registrar log',
        message: error.message,
      });
    }
  }

  // GET: Buscar logs
  if (req.method === 'GET') {
    try {
      const { type, userId, status, limit = 100, offset = 0 } = req.query;

      let results = auditLogs;

      // Filtros
      if (type) {
        results = results.filter(log => log.type === type);
      }

      if (userId) {
        results = results.filter(log => log.userId === userId);
      }

      if (status) {
        results = results.filter(log => log.status === status);
      }

      // Paginação
      const total = results.length;
      results = results.slice(offset, offset + parseInt(limit));

      return res.status(200).json({
        success: true,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        logs: results,
      });
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      return res.status(500).json({
        error: 'Erro ao buscar logs',
        message: error.message,
      });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

module.exports = handler;
