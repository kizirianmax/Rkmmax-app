/**
 * Vercel Serverless Function para chamar Google Gemini API
 * Versão com diagnóstico completo
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

    // Credenciais Gemini - SEMPRE usar variável de ambiente
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    // Debug: verificar se variável foi carregada
    console.log('=== GEMINI API DEBUG ===');
    console.log('GEMINI_API_KEY present:', !!GEMINI_API_KEY);
    console.log('GEMINI_API_KEY length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
    console.log('GEMINI_API_KEY type:', typeof GEMINI_API_KEY);
    console.log('All env vars count:', Object.keys(process.env).length);
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY environment variable not configured',
        hint: 'Configure GEMINI_API_KEY in Vercel Settings → Environment Variables',
        debug: {
          envVarsPresent: Object.keys(process.env).length > 0
        }
      });
    }

    // Validar formato da chave
    if (!GEMINI_API_KEY.startsWith('AIza')) {
      console.error('GEMINI_API_KEY has invalid format');
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY has invalid format',
        hint: 'Key should start with "AIza"'
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

    console.log('Calling Gemini API...');
    console.log('API Key starts with:', GEMINI_API_KEY.substring(0, 10) + '...');

    let response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError.message);
      return res.status(500).json({ 
        error: 'Failed to call Gemini API',
        details: fetchError.message
      });
    }

    console.log('Gemini response status:', response.status);

    // Ler resposta como texto primeiro
    const responseText = await response.text();
    console.log('Gemini raw response (first 200 chars):', responseText.substring(0, 200));

    // IMPORTANTE: Verificar status ANTES de tentar fazer parse de JSON
    if (!response.ok) {
      console.error('Gemini API HTTP error:', { 
        status: response.status,
        statusText: response.statusText,
        errorText: responseText.substring(0, 200)
      });
      return res.status(500).json({ 
        error: `Gemini API returned HTTP ${response.status}`,
        details: responseText.substring(0, 100),
        httpStatus: response.status
      });
    }

    // Agora sim, tentar fazer parse de JSON (só se status foi OK)
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', { 
        error: parseError.message,
        responseText: responseText.substring(0, 200),
        status: response.status
      });
      return res.status(500).json({ 
        error: 'Invalid JSON response from Gemini API',
        details: responseText.substring(0, 100)
      });
    }
    
    console.log('Gemini response parsed successfully');

    // Extrair conteúdo da resposta
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      console.log('Success: Returning AI response');
      return res.status(200).json({ 
        response: aiResponse,
        model: 'gemini-2.5-flash'
      });
    }
    
    console.error('Invalid Gemini response structure:', JSON.stringify(data).substring(0, 200));
    return res.status(500).json({ 
      error: 'Invalid response from Gemini API',
      debug: {
        hasCandidates: !!data.candidates,
        candidatesLength: data.candidates ? data.candidates.length : 0
      }
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}

module.exports = handler;

