/**
 * Vercel Serverless Function - Groq API
 * Usando Groq com 14.700 tokens gratuitos por dia
 * Mantém todas as configurações de compliance (GDPR, LGPD, etc)
 */

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, specialistId = null, specialistData = null } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'Groq API key not configured',
        hint: 'Add GROQ_API_KEY to Vercel environment variables'
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

    // Chamar Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      console.error('Groq API error:', errorData);
      return res.status(groqResponse.status).json({ 
        error: 'Error calling Groq API',
        details: errorData.error?.message || 'Unknown error'
      });
    }

    const data = await groqResponse.json();
    const aiResponse = data.choices[0].message.content;

    return res.status(200).json({ 
      response: aiResponse,
      model: 'mixtral-8x7b-32768'
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message });
  }
};

