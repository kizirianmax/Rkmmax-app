/**
 * Endpoint para chat com especialistas
 * Redireciona para o endpoint principal /api/chat
 */

export default async function handler(req, res) {
  // Apenas redirecionar para /api/chat com os mesmos dados
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, specialistId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!specialistId) {
      return res.status(400).json({ error: 'specialistId is required' });
    }

    // Importar dados do especialista
    const { specialists } = await import('../src/config/specialists.js');
    const specialistData = specialists[specialistId];

    if (!specialistData) {
      return res.status(404).json({ error: 'Specialist not found' });
    }

    // Chamar a função principal do chat
    const chatHandler = await import('./chat.js');
    
    // Modificar o request para incluir specialistData
    const modifiedReq = {
      ...req,
      body: {
        ...req.body,
        specialistData: specialistData
      }
    };

    return chatHandler.default(modifiedReq, res);

  } catch (error) {
    console.error('Error in specialist-chat API:', error);
    return res.status(500).json({ error: error.message });
  }
}
