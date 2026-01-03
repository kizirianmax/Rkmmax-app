/**
 * API de Análise de Imagem - DESABILITADA
 * Endpoint: /api/vision
 * 
 * Esta funcionalidade foi removida.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Funcionalidade desabilitada
  return res.status(410).json({ 
    error: 'Funcionalidade de análise de imagem foi removida',
    message: 'Esta funcionalidade não está mais disponível.'
  });
};
