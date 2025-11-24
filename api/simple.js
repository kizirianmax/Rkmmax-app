/**
 * SIMPLE ENDPOINT - FUNCIONA DE VERDADE
 * Sem dependências complexas, apenas IA + resposta
 */

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Apenas aceitar POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Apenas POST permitido' });
    }

    const { prompt, mode = 'manual' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Campo "prompt" é obrigatório' });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 PROCESSANDO REQUISIÇÃO SIMPLES`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📝 Prompt: ${prompt}`);
    console.log(`🎮 Modo: ${mode}`);
    console.log(`${'='.repeat(60)}\n`);

    // Chamar Gemini API
    console.log(`🤖 Chamando Gemini API...`);
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!aiResponse) {
      throw new Error('Nenhuma resposta da IA');
    }

    console.log(`✅ Resposta recebida: ${aiResponse.substring(0, 100)}...`);
    console.log(`${'='.repeat(60)}\n`);

    // Retornar resultado
    res.status(200).json({
      success: true,
      prompt,
      mode,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({
      error: 'Erro ao processar',
      message: error.message,
    });
  }
}

module.exports = handler;

