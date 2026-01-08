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
    const { prompt, imagemBase64, mediaType = 'image/jpeg' } = req.body;

    if (!prompt || !imagemBase64) {
      return res.status(400).json({ 
        erro: 'Prompt e imagem são obrigatórios' 
      });
    }

    const rkmmax = new RKMMAXClaudeSystem();
    const resultado = await rkmmax.claude.processarComImagem(
      prompt,
      imagemBase64,
      mediaType
    );

    return res.status(200).json(resultado);

  } catch (error) {
    console.error('Erro processamento imagem Claude:', error);
    return res.status(500).json({
      erro: 'Erro ao processar imagem',
      mensagem: error.message
    });
  }
}
