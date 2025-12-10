/**
 * SPECIALIST CHAT API
 * Endpoint para os 54 especialistas
 * 
 * ARQUITETURA:
 * - Especialistas usam Gemini Flash (otimizado para custo)
 * - Serginho usa Gemini Pro 2.5 (nível ChatGPT-5)
 * - GROQ como fallback se Gemini falhar
 */

const { specialists } = require('../src/config/specialists.js');
const { buildGeniusPrompt } = require('../src/prompts/geniusPrompts.js');
const { optimizeRequest, cacheResponse } = require('../src/utils/costOptimization.js');

/**
 * Chamar Gemini Flash para especialistas
 */
async function callGeminiFlash(messages, systemPrompt, apiKey) {
  const geminiMessages = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
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
    throw new Error(`Gemini Flash error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response');
  }

  return data.candidates[0].content.parts[0].text;
}

/**
 * Chamar GROQ como fallback
 */
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

  return data.choices[0].message.content;
}

/**
 * Handler principal
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, specialistId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!specialistId) {
      return res.status(400).json({ error: 'Specialist ID is required' });
    }

    // Buscar dados do especialista
    const specialist = specialists[specialistId];
    if (!specialist) {
      return res.status(404).json({ error: 'Specialist not found' });
    }

    // Construir prompt de gênio do especialista
    const systemPrompt = buildGeniusPrompt('specialist', {
      name: specialist.name,
      description: specialist.description,
      category: specialist.category,
      systemPrompt: specialist.systemPrompt
    });

    // Verificar credenciais
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasGroq = !!process.env.GROQ_API_KEY;

    if (!hasGemini && !hasGroq) {
      return res.status(500).json({
        error: 'No AI providers configured',
        hint: 'Configure GEMINI_API_KEY or GROQ_API_KEY'
      });
    }

    console.log(`🎯 Especialista: ${specialist.name} (${specialistId})`);

    // Otimizar requisição
    const optimized = optimizeRequest(messages, systemPrompt);
    
    // Se encontrou no cache, retornar imediatamente
    if (optimized.cached) {
      console.log('💰 CACHE HIT! Economia total de custo!');
      return res.status(200).json({
        ...optimized.response,
        cached: true,
        specialist: specialist.name
      });
    }

    console.log(`💰 Otimização: ${optimized.stats.originalMessages} → ${optimized.stats.optimizedMessages} msgs`);

    // Tentar Gemini Flash primeiro (otimizado para especialistas)
    if (hasGemini) {
      try {
        console.log('🚀 Tentando Gemini Flash (especialista)...');
        const response = await callGeminiFlash(optimized.messages, optimized.systemPrompt, process.env.GEMINI_API_KEY);
        
        console.log(`✅ Sucesso com Gemini Flash para ${specialist.name}`);
        
        // Salvar no cache
        const result = {
          response,
          model: 'gemini-2.0-flash-exp',
          provider: 'google',
          specialist: specialist.name,
          tier: 'optimized',
          success: true
        };
        cacheResponse(messages, result);
        
        return res.status(200).json({
          ...result,
          cached: false,
          optimized: true,
          stats: optimized.stats
        });
      } catch (error) {
        console.error(`❌ Gemini Flash falhou para ${specialist.name}:`, error.message);
        
        // Fallback para GROQ
        if (hasGroq) {
          try {
            console.log('🚀 Tentando GROQ (fallback)...');
            const response = await callGroq(messages, systemPrompt, process.env.GROQ_API_KEY);
            
            console.log(`✅ Sucesso com GROQ para ${specialist.name}`);
            
            return res.status(200).json({
              response,
              model: 'llama-3.3-70b-versatile',
              provider: 'groq',
              specialist: specialist.name,
              tier: 'fallback',
              success: true
            });
          } catch (groqError) {
            console.error(`❌ GROQ também falhou:`, groqError.message);
            throw groqError;
          }
        } else {
          throw error;
        }
      }
    } else if (hasGroq) {
      // Se só tiver GROQ, usar direto
      console.log('🚀 Usando GROQ (única opção)...');
      const response = await callGroq(messages, systemPrompt, process.env.GROQ_API_KEY);
      
      return res.status(200).json({
        response,
        model: 'llama-3.3-70b-versatile',
        provider: 'groq',
        specialist: specialist.name,
        tier: 'standard',
        success: true
      });
    }

  } catch (error) {
    console.error('❌ ERRO NO HANDLER:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

module.exports = handler;
