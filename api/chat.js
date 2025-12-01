/**
 * RKMMAX Chat API - Otimizado com 3 IAs Premium
 * Arquitetura de Fallback Automático
 * 
 * Prioridade:
 * 1. Gemini 2.0 Flash (Principal - rápido e barato)
 * 2. Groq LLaMA 3.3 70B (Fallback - velocidade extrema)
 * 3. Gemini 2.5 Pro (Fallback 2 - qualidade máxima)
 */

async function callGeminiFlash(messages, systemPrompt, apiKey) {
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
    throw new Error(`Gemini 2.0 Flash error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response');
  }

  return {
    response: data.candidates[0].content.parts[0].text,
    model: 'gemini-2.0-flash',
    provider: 'google',
    speed: 'fast',
    cost: 'low'
  };
}

async function callGeminiPro(messages, systemPrompt, apiKey) {
  const geminiMessages = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
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
    throw new Error(`Gemini 2.5 Pro error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response');
  }

  return {
    response: data.candidates[0].content.parts[0].text,
    model: 'gemini-2.5-pro',
    provider: 'google',
    speed: 'medium',
    cost: 'high',
    quality: 'premium'
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
    provider: 'groq',
    speed: 'extreme',
    cost: 'low'
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

    // Estratégia de fallback com 3 IAs
    const providers = [];
    
    // DEBUG: Logar status das credenciais
    console.log('🔍 DEBUG - Verificando credenciais:');
    console.log('  GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Configurado' : '❌ Não configurado');
    console.log('  GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Configurado' : '❌ Não configurado');
    console.log('  forceProvider:', forceProvider || 'nenhum');

    // Se forçar provider específico
    if (forceProvider === 'groq' && process.env.GROQ_API_KEY) {
      providers.push({
        name: 'groq',
        fn: () => callGroq(messages, systemPrompt, process.env.GROQ_API_KEY)
      });
    } else if (forceProvider === 'gemini-pro' && process.env.GEMINI_API_KEY) {
      providers.push({
        name: 'gemini-2.5-pro',
        fn: () => callGeminiPro(messages, systemPrompt, process.env.GEMINI_API_KEY)
      });
    } else if (forceProvider === 'gemini-flash' && process.env.GEMINI_API_KEY) {
      providers.push({
        name: 'gemini-2.0-flash',
        fn: () => callGeminiFlash(messages, systemPrompt, process.env.GEMINI_API_KEY)
      });
    } else {
      // Ordem de fallback automático: Flash → Groq → Pro
      if (process.env.GEMINI_API_KEY) {
        providers.push({
          name: 'gemini-2.0-flash',
          fn: () => callGeminiFlash(messages, systemPrompt, process.env.GEMINI_API_KEY)
        });
      }
      if (process.env.GROQ_API_KEY) {
        providers.push({
          name: 'groq',
          fn: () => callGroq(messages, systemPrompt, process.env.GROQ_API_KEY)
        });
      }
      if (process.env.GEMINI_API_KEY) {
        providers.push({
          name: 'gemini-2.5-pro',
          fn: () => callGeminiPro(messages, systemPrompt, process.env.GEMINI_API_KEY)
        });
      }
    }

    if (providers.length === 0) {
      console.error('❌ ERRO: Nenhum provider configurado!');
      return res.status(500).json({
        error: 'No AI providers configured',
        hint: 'Configure GEMINI_API_KEY and GROQ_API_KEY in Vercel environment variables',
        debug: {
          gemini_configured: !!process.env.GEMINI_API_KEY,
          groq_configured: !!process.env.GROQ_API_KEY
        }
      });
    }
    
    console.log(`📊 Providers disponíveis: ${providers.map(p => p.name).join(', ')}`);

    // Tentar cada provider em ordem
    let lastError = null;
    const attemptedProviders = [];

    for (const provider of providers) {
      try {
        console.log(`🚀 Tentando provider: ${provider.name}`);
        const result = await provider.fn();
        console.log(`✅ Chat completed with ${provider.name}`);
        return res.status(200).json({
          ...result,
          usedProvider: provider.name,
          attemptedProviders: attemptedProviders,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`❌ ${provider.name} failed:`, error.message);
        attemptedProviders.push({
          provider: provider.name,
          error: error.message
        });
        lastError = error;
        // Continuar para próximo provider
      }
    }

    // Se chegou aqui, todos falharam
    console.error('🔴 CRÍTICO: Todos os providers falharam!');
    console.error('Providers tentados:', providers.map(p => p.name));
    return res.status(500).json({
      error: 'All AI providers failed',
      lastError: lastError?.message,
      attemptedProviders: attemptedProviders,
      providers: providers.map(p => p.name),
      debug: {
        gemini_configured: !!process.env.GEMINI_API_KEY,
        groq_configured: !!process.env.GROQ_API_KEY
      }
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

