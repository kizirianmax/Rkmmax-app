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
    const { tipo, requisicao, opcoes = {} } = req.body;

    // Verificar API Key
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        erro: 'ANTHROPIC_API_KEY não configurada',
        hint: 'Configure a variável de ambiente no Vercel'
      });
    }

    const rkmmax = new RKMMAXClaudeSystem();

    // Roteamento baseado no tipo
    switch(tipo) {
      case 'texto':
        const resultadoTexto = await rkmmax.processar(requisicao, opcoes);
        return res.status(200).json(resultadoTexto);

      case 'imagem':
        const { prompt, imagemBase64, mediaType = 'image/jpeg' } = opcoes;
        if (!prompt || !imagemBase64) {
          return res.status(400).json({ erro: 'Prompt e imagem obrigatórios' });
        }
        const resultadoImagem = await rkmmax.claude.processarComImagem(
          prompt,
          imagemBase64,
          mediaType
        );
        return res.status(200).json(resultadoImagem);

      default:
        return res.status(400).json({ erro: 'Tipo inválido. Use: texto ou imagem' });
    }

  } catch (error) {
    console.error('Erro unified-claude:', error);
    return res.status(500).json({
      erro: 'Erro interno',
      mensagem: error.message
    });
  }
}
