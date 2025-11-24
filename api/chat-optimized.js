/**
 * RKMMAX Chat API - Otimizado com Múltiplas IAs
 * Orquestrador de IA com fallback automático
 * 
 * Prioridade de IAs:
 * 1. Gemini 2.0 Flash (Principal - rápido e barato)
 * 2. Groq LLaMA 3.3 70B (Fallback - velocidade extrema)
 * 3. OpenAI GPT-3.5 Turbo (Fallback 2)
 * 4. Anthropic Claude (Fallback 3)
 */

async function callGemini(messages, systemPrompt, apiKey) {
  const geminiMessages = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response');
  }

  return {
    response: data.candidates[0].content.parts[0].text,
    model: 'gemini-2.0-flash',
    provider: 'google'
  };
}

async function callGroq(messages, systemPrompt, apiKey) {
  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid Groq response');
  }

  return {
    response: data.choices[0].message.content,
    model: 'llama-3.3-70b-versatile',
    provider: 'groq'
  };
}

async function callOpenAI(messages, systemPrompt, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid OpenAI response');
  }

  return {
    response: data.choices[0].message.content,
    model: 'gpt-3.5-turbo',
    provider: 'openai'
  };
}

async function callAnthropic(messages, systemPrompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.content?.[0]?.text) {
    throw new Error('Invalid Anthropic response');
  }

  return {
    response: data.content[0].text,
    model: 'claude-3-sonnet-20240229',
    provider: 'anthropic'
  };
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, specialistId = null, specialistData = null, forceProvider = null } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Construir system prompt
    let systemPrompt;
    if (specialistId && specialistData) {
      systemPrompt = `Você é ${specialistData.name}, ${specialistData.description}.

Responda APENAS sobre ${specialistData.category}.
Se fora da sua área, redirecione ao Serginho.
Seja um GÊNIO MUNDIAL em sua especialidade.
Qualidade impecável.

${specialistData.systemPrompt || ''}

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

    // Estratégia de fallback
    const providers = [];

    // Se forçar provider específico
    if (forceProvider === 'groq' && process.env.GROQ_API_KEY) {
      providers.push({
        name: 'groq',
        fn: () => callGroq(messages, systemPrompt, process.env.GROQ_API_KEY)
      });
    } else if (forceProvider === 'openai' && process.env.OPENAI_API_KEY) {
      providers.push({
        name: 'openai',
        fn: () => callOpenAI(messages, systemPrompt, process.env.OPENAI_API_KEY)
      });
    } else if (forceProvider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      providers.push({
        name: 'anthropic',
        fn: () => callAnthropic(messages, systemPrompt, process.env.ANTHROPIC_API_KEY)
      });
    } else {
      // Ordem de fallback automático
      if (process.env.GEMINI_API_KEY) {
        providers.push({
          name: 'gemini',
          fn: () => callGemini(messages, systemPrompt, process.env.GEMINI_API_KEY)
        });
      }
      if (process.env.GROQ_API_KEY) {
        providers.push({
          name: 'groq',
          fn: () => callGroq(messages, systemPrompt, process.env.GROQ_API_KEY)
        });
      }
      if (process.env.OPENAI_API_KEY) {
        providers.push({
          name: 'openai',
          fn: () => callOpenAI(messages, systemPrompt, process.env.OPENAI_API_KEY)
        });
      }
      if (process.env.ANTHROPIC_API_KEY) {
        providers.push({
          name: 'anthropic',
          fn: () => callAnthropic(messages, systemPrompt, process.env.ANTHROPIC_API_KEY)
        });
      }
    }

    if (providers.length === 0) {
      return res.status(500).json({
        error: 'No AI providers configured',
        hint: 'Configure at least one of: GEMINI_API_KEY, GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY'
      });
    }

    // Tentar cada provider em ordem
    let lastError = null;
    for (const provider of providers) {
      try {
        const result = await provider.fn();
        console.log(`✅ Chat completed with ${provider.name}`);
        return res.status(200).json({
          ...result,
          usedProvider: provider.name,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`❌ ${provider.name} failed:`, error.message);
        lastError = error;
        // Continuar para próximo provider
      }
    }

    // Se chegou aqui, todos falharam
    return res.status(500).json({
      error: 'All AI providers failed',
      lastError: lastError?.message,
      providers: providers.map(p => p.name)
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

