import { RKMMAXClaudeSystem } from '../lib/claude-integration.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { image, prompt = 'Analise esta imagem' } = req.body;
    
    if (!image) {
      return res.status(400).json({ erro: 'Imagem obrigatória' });
    }

    const rkmmax = new RKMMAXClaudeSystem();
    const resultado = await rkmmax.claude.processarComImagem(
      prompt,
      image,
      'image/jpeg'
    );

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
}
