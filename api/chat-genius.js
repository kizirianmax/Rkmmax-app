/**
 * RKMMAX GENIUS CHAT API
 * Endpoint otimizado com prompts de nível gênio + otimização de custo
 * 
 * Características:
 * - Prompts de nível ChatGPT-5+
 * - Cache inteligente (40-60% economia)
 * - Compressão de contexto
 * - Deduplicação automática
 * - Fallback robusto
 * 
 * Arquitetura:
 * 1. Gemini 2.5 Pro (SEMPRE para Serginho/Híbrido)
 * 2. GROQ (Fallback se Gemini falhar)
 */

import { buildGeniusPrompt } from '../src/prompts/geniusPrompts.js';
import { optimizeRequest, cacheResponse } from '../src/utils/costOptimization.js';

/**
 * Chamar Gemini Pro 2.5 com prompts de gênio
 */
async function callGeminiProGenius(messages, systemPrompt, apiKey) {
  const geminiMessages = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.9,        // Alta criatividade
          maxOutputTokens: 8000,   // Respostas longas e detalhadas
          topP: 0.95,              // Diversidade
          topK: 40                 // Qualidade
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini Pro error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response');
  }

  return {
    response: data.candidates[0].content.parts[0].text,
    model: 'gemini-2.0-flash-thinking-exp-01-21',
    provider: 'google',
    tier: 'genius',
    quality: 'maximum'
  };
}

/**
 * Chamar GROQ como fallback
 */
async function callGroqFallback(messages, systemPrompt, apiKey) {
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
      temperature: 0.9,
      max_tokens: 8000,
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
    tier: 'fallback',
    quality: 'high'
  };
}

/**
 * Handler principal
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, agentType = 'serginho', mode = 'OTIMIZADO' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Verificar credenciais
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasGroq = !!process.env.GROQ_API_KEY;

    if (!hasGemini && !hasGroq) {
      return res.status(500).json({
        error: 'No AI providers configured',
        hint: 'Configure GEMINI_API_KEY or GROQ_API_KEY'
      });
    }

    console.log(`🎯 Agente: ${agentType} | Modo: ${mode}`);

    // 1. Construir prompt de gênio
    const geniusPrompt = buildGeniusPrompt(agentType);
    
    console.log(`🧠 Prompt de gênio construído (${geniusPrompt.length} caracteres)`);

    // 2. Otimizar requisição (cache, compressão, etc)
    const optimized = optimizeRequest(messages, geniusPrompt);
    
    // Se encontrou no cache, retornar imediatamente
    if (optimized.cached) {
      console.log('💰 CACHE HIT! Economia total de custo!');
      return res.status(200).json({
        ...optimized.response,
        cached: true,
        costSaved: true
      });
    }

    console.log(`💰 Otimização aplicada:`);
    console.log(`   - Mensagens: ${optimized.stats.originalMessages} → ${optimized.stats.optimizedMessages}`);
    console.log(`   - Tokens: ${optimized.stats.totalTokens}`);
    console.log(`   - Custo estimado: $${optimized.stats.estimatedCost.toFixed(6)}`);

    // 3. Tentar Gemini Pro 2.5 (SEMPRE primeira escolha)
    if (hasGemini) {
      try {
        console.log('🚀 Chamando Gemini Pro 2.5 (Nível Gênio)...');
        
        const result = await callGeminiProGenius(
          optimized.messages,
          optimized.systemPrompt,
          process.env.GEMINI_API_KEY
        );
        
        console.log(`✅ Sucesso com Gemini Pro 2.5!`);
        
        // Salvar no cache para próximas requisições
        cacheResponse(messages, result);
        
        return res.status(200).json({
          ...result,
          cached: false,
          optimized: true,
          stats: optimized.stats,
          success: true
        });
        
      } catch (error) {
        console.error(`❌ Gemini Pro falhou:`, error.message);
        
        // Fallback para GROQ
        if (hasGroq) {
          try {
            console.log('🚀 Tentando GROQ (Fallback)...');
            
            const result = await callGroqFallback(
              optimized.messages,
              optimized.systemPrompt,
              process.env.GROQ_API_KEY
            );
            
            console.log(`✅ Sucesso com GROQ!`);
            
            // Salvar no cache
            cacheResponse(messages, result);
            
            return res.status(200).json({
              ...result,
              cached: false,
              optimized: true,
              stats: optimized.stats,
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
      
      const result = await callGroqFallback(
        optimized.messages,
        optimized.systemPrompt,
        process.env.GROQ_API_KEY
      );
      
      // Salvar no cache
      cacheResponse(messages, result);
      
      return res.status(200).json({
        ...result,
        cached: false,
        optimized: true,
        stats: optimized.stats,
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

export default handler;
