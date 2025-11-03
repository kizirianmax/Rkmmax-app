/**
 * Vercel Serverless Function para chamar Google Gemini API
 * Versão simplificada para debug
 */

async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Credenciais Gemini
    const GEMINI_API_KEY = 'AIzaSyCX0gYhkbAS1fwchXJuUAh0POEuedwifeM';
    const GOOGLE_CLOUD_PROJECT_ID = 'RKMMax-PRODU';

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/projects/${GOOGLE_CLOUD_PROJECT_ID}/locations/global/publishers/google/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Construir request para Gemini
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Você é o Serginho, orquestrador de IA do RKMMAX. Responda de forma clara e profissional.'
            }
          ]
        },
        ...messages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [
            {
              text: msg.content
            }
          ]
        }))
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    };

    console.log('Calling Gemini API with endpoint:', endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Gemini response status:', response.status);

    // Ler resposta como texto primeiro
    const responseText = await response.text();
    console.log('Gemini raw response (first 500 chars):', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('Gemini API error:', { status: response.status, errorText: responseText });
      return res.status(response.status).json({ 
        error: `Gemini API error: ${response.status}`,
        details: responseText.substring(0, 200)
      });
    }

    // Tentar fazer parse de JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', { 
        error: parseError.message,
        responseText: responseText.substring(0, 500)
      });
      return res.status(500).json({ 
        error: 'Invalid JSON response from Gemini API',
        details: responseText.substring(0, 200)
      });
    }
    
    console.log('Gemini response:', JSON.stringify(data).substring(0, 200));

    // Extrair conteúdo da resposta
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      return res.status(200).json({ 
        response: aiResponse,
        model: 'gemini-2.0-flash'
      });
    }
    
    console.error('Invalid Gemini response structure:', data);
    return res.status(500).json({ 
      error: 'Invalid response from Gemini API',
      received: JSON.stringify(data).substring(0, 200)
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}

module.exports = handler;

