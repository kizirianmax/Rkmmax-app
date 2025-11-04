/**
 * Vercel Serverless Function para chamar Google Gemini API
 * Versão minimalista para teste
 */

module.exports = async (req, res) => {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Teste 1: Verificar se a chave existe
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY not configured'
      });
    }

    // Teste 2: Fazer chamada simples à API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: messages[messages.length - 1].content }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Gemini API error: ${response.status}`,
        details: errorText.substring(0, 100)
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return res.status(500).json({ error: 'No response from Gemini' });
    }

    return res.status(200).json({ 
      response: aiResponse,
      model: 'gemini-2.5-flash'
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message
    });
  }
};

