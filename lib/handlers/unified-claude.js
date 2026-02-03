import { RKMMAXClaudeSystem } from '../claude-integration.js';

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
    const { tipo, requisicao, opcoes = {} } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        erro: 'ANTHROPIC_API_KEY não configurada',
        hint: 'Configure a variável de ambiente no Vercel'
      });
    }

    const rkmmax = new RKMMAXClaudeSystem();

    switch(tipo) {
      case 'texto':
        const resultadoTexto = await rkmmax.processar(requisicao, opcoes);
        return res.status(200).json(resultadoTexto);

      case 'vision':
      case 'imagem':
        const { prompt, image, imagemBase64, mediaType = 'image/jpeg' } = opcoes;
        const imgData = imagemBase64 || image;
        
        if (!imgData) {
          return res.status(400).json({ erro: 'Imagem obrigatória' });
        }
        
        const resultadoImg = await rkmmax.claude.processarComImagem(
          prompt || requisicao,
          imgData,
          mediaType
        );
        return res.status(200).json(resultadoImg);

      default:
        return res.status(400).json({ erro: 'Tipo inválido. Use: texto, imagem ou vision' });
    }

  } catch (error) {
    console.error('Erro unified-claude:', error);
    return res.status(500).json({
      erro: 'Erro interno',
      mensagem: error.message
    });
  }
}
