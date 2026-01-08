/**
 * API de Análise de Imagem - Claude 3.5 Sonnet
 * Endpoint: /api/vision
 * 
 * Usa Claude para análise multimodal de imagens
 */

import { RKMMAXClaudeSystem } from '../lib/claude-integration.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    const { prompt, image, imageBase64, imagemBase64, mediaType = 'image/jpeg' } = req.body;
    
    // Suporta múltiplos formatos de entrada
    const base64Data = imagemBase64 || imageBase64 || image;
    const promptText = prompt || 'Analise esta imagem detalhadamente';

    if (!base64Data) {
      return res.status(400).json({ 
        erro: 'Imagem é obrigatória',
        hint: 'Envie imagemBase64, imageBase64 ou image no body'
      });
    }

    // Verificar se ANTHROPIC_API_KEY está configurada
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        erro: 'ANTHROPIC_API_KEY não configurada',
        hint: 'Configure a variável de ambiente no Vercel'
      });
    }

    const rkmmax = new RKMMAXClaudeSystem();
    const resultado = await rkmmax.claude.processarComImagem(
      promptText,
      base64Data,
      mediaType
    );

    // Formato compatível com resposta anterior
    return res.status(200).json({
      success: true,
      response: resultado.resposta,
      resposta: resultado.resposta,
      tokens: resultado.tokens,
      modelo: resultado.modelo,
      provider: 'claude',
      tipo: 'multimodal'
    });

  } catch (error) {
    console.error('❌ Erro análise de imagem Claude:', error);
    return res.status(500).json({
      success: false,
      erro: 'Erro ao processar imagem',
      mensagem: error.message
    });
  }
}
