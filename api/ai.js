/**
 * 🤖 ENDPOINT UNIFICADO DE IA - KIZI AI
 * 
 * Dois modos de operação:
 * - KIZI 2.5 Pro (Gemini) = Respostas inteligentes e complexas
 * - KIZI Speed (Groq Llama 70B) = Respostas ultra-rápidas
 * 
 * Consolida TODOS os endpoints de chat em um único endpoint:
 * - /api/chat.js → /api/ai?type=chat
 * - /api/chat-genius.js → /api/ai?type=genius
 * - /api/chat-intelligent.js → /api/ai?type=intelligent
 * - /api/specialist-chat.js → /api/ai?type=specialist
 * - /api/hybrid.js → /api/ai?type=hybrid
 * - /api/transcribe.js → /api/ai?type=transcribe
 */

import geniusPrompts from '../src/prompts/geniusPrompts.js';
import costOptimization from '../src/utils/costOptimization.js';
import { specialists } from '../src/config/specialists.js';

const { buildGeniusPrompt } = geniusPrompts;
const { optimizeRequest, cacheResponse } = costOptimization;

/**
 * Chamar KIZI 2.5 Pro (Gemini - raciocínio avançado)
 */
async function callKiziPro(messages, systemPrompt, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
        contents: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 16000,
          topP: 0.95,
          topK: 64
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`KIZI Pro error: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Chamar KIZI Speed (Groq Llama 70B - ultra-rápido)
 */
async function callKiziSpeed(messages, systemPrompt, apiKey) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: systemPrompt 
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages,
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`KIZI Speed error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Handler principal - Roteia para função correta
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      type = 'genius', 
      messages, 
      agentType, 
      mode, 
      specialistId,
      speedMode = false  // NOVO: modo velocidade (usa Groq)
    } = req.body;

    console.log(`🤖 KIZI AI - Type: ${type} | Agent: ${agentType || 'default'} | Speed: ${speedMode}`);

    // Verificar credenciais
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GERMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const hasGemini = !!geminiKey;
    const hasGroq = !!groqKey;

    if (!hasGemini && !hasGroq) {
      return res.status(500).json({
        error: 'No AI providers configured',
        hint: 'Configure GEMINI_API_KEY or GROQ_API_KEY'
      });
    }

    // ========================================
    // TIPO: GENIUS (Serginho + Híbrido)
    // ========================================
    if (type === 'genius' || type === 'chat' || type === 'intelligent' || type === 'hybrid') {
      const promptType = agentType || 'serginho';
      const systemPrompt = buildGeniusPrompt(promptType);
      const optimized = optimizeRequest(messages, systemPrompt);

      // Verificar cache
      if (optimized.cached) {
        console.log('💰 CACHE HIT! Economia total!');
        return res.status(200).json({
          ...optimized.response,
          cached: true,
          type: promptType
        });
      }

      console.log(`💰 Otimização: ${optimized.stats.originalMessages} → ${optimized.stats.optimizedMessages} msgs`);

      // ========================================
      // MODO SPEED (Groq - Ultra-rápido)
      // ========================================
      if (speedMode && hasGroq) {
        console.log('⚡ KIZI Speed Mode - Usando Groq Llama 70B...');
        try {
          const response = await callKiziSpeed(
            optimized.messages,
            optimized.systemPrompt,
            groqKey
          );

          return res.status(200).json({
            response,
            model: 'kizi-speed',
            provider: 'kizi',
            tier: 'speed',
            type: promptType,
            success: true,
            speedMode: true
          });
        } catch (error) {
          console.error('❌ KIZI Speed falhou:', error.message);
          // Se Speed falhar, tentar Pro como fallback
          if (hasGemini) {
            console.log('🔄 Fallback: Tentando KIZI Pro...');
          } else {
            throw error;
          }
        }
      }

      // ========================================
      // MODO PRO (Gemini - Raciocínio avançado)
      // ========================================
      if (hasGemini) {
        try {
          console.log('🧠 KIZI 2.5 Pro - Usando Gemini...');
          const response = await callKiziPro(
            optimized.messages,
            optimized.systemPrompt,
            geminiKey
          );

          const result = {
            response,
            model: 'kizi-2.5-pro',
            provider: 'kizi',
            tier: 'pro',
            type: promptType,
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
          console.error('❌ KIZI Pro falhou:', error.message);
          
          // Fallback para KIZI Speed
          if (hasGroq) {
            console.log('🔄 Fallback: Tentando KIZI Speed...');
            try {
              const response = await callKiziSpeed(
                optimized.messages,
                optimized.systemPrompt,
                groqKey
              );

              return res.status(200).json({
                response,
                model: 'kizi-speed',
                provider: 'kizi',
                tier: 'fallback',
                type: promptType,
                success: true,
                fallback: true
              });
            } catch (groqError) {
              console.error('❌ KIZI Speed também falhou:', groqError.message);
              throw groqError;
            }
          }

          throw error;
        }
      }

      // Se não tem Gemini, usar KIZI Speed direto
      if (hasGroq) {
        console.log('⚡ Usando KIZI Speed (sem Pro disponível)...');
        const response = await callKiziSpeed(
          optimized.messages,
          optimized.systemPrompt,
          groqKey
        );

        return res.status(200).json({
          response,
          model: 'kizi-speed',
          provider: 'kizi',
          tier: 'primary',
          type: promptType,
          success: true
        });
      }
    }

    // ========================================
    // TIPO: SPECIALIST (Especialistas)
    // ========================================
    if (type === 'specialist') {
      if (!specialistId) {
        return res.status(400).json({ error: 'specialistId required' });
      }

      const specialist = specialists[specialistId];
      if (!specialist) {
        return res.status(404).json({ error: 'Specialist not found' });
      }

      const systemPrompt = buildGeniusPrompt('specialist', {
        name: specialist.name,
        description: specialist.description,
        category: specialist.category,
        systemPrompt: specialist.systemPrompt
      });

      const optimized = optimizeRequest(messages, systemPrompt);

      if (optimized.cached) {
        console.log('💰 CACHE HIT! Economia total!');
        return res.status(200).json({
          ...optimized.response,
          cached: true,
          specialist: specialist.name
        });
      }

      console.log(`🎯 Especialista: ${specialist.name}`);
      console.log(`💰 Otimização: ${optimized.stats.originalMessages} → ${optimized.stats.optimizedMessages} msgs`);

      // MODO SPEED para especialistas
      if (speedMode && hasGroq) {
        console.log('⚡ KIZI Speed Mode (Especialista)...');
        try {
          const response = await callKiziSpeed(
            optimized.messages,
            optimized.systemPrompt,
            groqKey
          );

          return res.status(200).json({
            response,
            model: 'kizi-speed',
            provider: 'kizi',
            specialist: specialist.name,
            tier: 'speed',
            success: true,
            speedMode: true
          });
        } catch (error) {
          console.error('❌ KIZI Speed falhou:', error.message);
          if (!hasGemini) throw error;
        }
      }

      // MODO PRO para especialistas
      if (hasGemini) {
        try {
          console.log('🧠 KIZI 2.5 Pro (Especialista)...');
          const response = await callKiziPro(
            optimized.messages,
            optimized.systemPrompt,
            geminiKey
          );

          const result = {
            response,
            model: 'kizi-2.5-pro',
            provider: 'kizi',
            specialist: specialist.name,
            tier: 'pro',
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
          console.error(`❌ KIZI Pro falhou para ${specialist.name}:`, error.message);
          
          if (hasGroq) {
            console.log('🔄 Fallback: Tentando KIZI Speed...');
            try {
              const response = await callKiziSpeed(
                optimized.messages,
                optimized.systemPrompt,
                groqKey
              );

              return res.status(200).json({
                response,
                model: 'kizi-speed',
                provider: 'kizi',
                specialist: specialist.name,
                tier: 'fallback',
                success: true,
                fallback: true
              });
            } catch (groqError) {
              console.error('❌ KIZI Speed também falhou:', groqError.message);
              throw groqError;
            }
          }

          throw error;
        }
      }

      // Se não tem Gemini, usar KIZI Speed direto
      if (hasGroq) {
        console.log('⚡ Usando KIZI Speed (sem Pro disponível)...');
        const response = await callKiziSpeed(
          optimized.messages,
          optimized.systemPrompt,
          groqKey
        );

        return res.status(200).json({
          response,
          model: 'kizi-speed',
          provider: 'kizi',
          specialist: specialist.name,
          tier: 'primary',
          success: true
        });
      }
    }

    // ========================================
    // TIPO: TRANSCRIBE (Whisper)
    // ========================================
    if (type === 'transcribe') {
      const { audioBase64 } = req.body;

      if (!audioBase64) {
        return res.status(400).json({ error: 'audioBase64 required' });
      }

      return res.status(501).json({
        error: 'Transcription not implemented yet',
        hint: 'Will be implemented in next version'
      });
    }

    // Tipo desconhecido
    return res.status(400).json({
      error: 'Invalid type',
      hint: 'Use type: genius, specialist, or transcribe'
    });

  } catch (error) {
    console.error('❌ KIZI AI error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
