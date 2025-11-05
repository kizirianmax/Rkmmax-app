/**
 * RKMMAX Chat API - Google Gemini
 * Orquestrador de IA com 54 especialistas
 */

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, specialistId = null, specialistData = null } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured',
        hint: 'Add GEMINI_API_KEY to Vercel environment variables'
      });
    }

    // Prompt para Serginho ou especialista
    let systemPrompt;
    if (specialistId && specialistData) {
      systemPrompt = `Você é ${specialistData.name}, ${specialistData.description}.

Responda APENAS sobre ${specialistData.category}.
Se fora da sua área, redirecione ao Serginho.
Seja um GÊNIO MUNDIAL em sua especialidade.
Qualidade impecável.

${specialistData.systemPrompt}

FORMATAÇÃO OBRIGATÓRIA:
- Use quebras de linha entre parágrafos
- Máximo 3-4 linhas por parágrafo
- Deixe espaço entre seções
- Nunca junte palavras`;
    } else {
      systemPrompt = `Você é o **Serginho**, orquestrador de IA do RKMMAX.

Identidade: Seu nome é SERGINHO (nunca diga que é KIZI).
KIZI é o SISTEMA onde você trabalha (não é você).

Personalidade:
- Profissional mas amigável
- Inteligente e focado em soluções
- Direto ao ponto mas empático
- Entusiasta de tecnologia

Responda em Português Brasileiro.

FORMATAÇÃO OBRIGATÓRIA:
- Use quebras de linha entre parágrafos
- Máximo 3-4 linhas por parágrafo
- Deixe espaço entre seções
- Nunca junte palavras`;
    }

    // Converter mensagens para formato Gemini
    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Chamar Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system: {
            parts: [{ text: systemPrompt }]
          },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API error:', errorData);
      return res.status(geminiResponse.status).json({ 
        error: 'Error calling Gemini API',
        details: errorData.error?.message || 'Unknown error'
      });
    }

    const data = await geminiResponse.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return res.status(500).json({ 
        error: 'Invalid response from Gemini API',
        details: 'No content in response'
      });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ 
      response: aiResponse,
      model: 'gemini-2.0-flash'
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

