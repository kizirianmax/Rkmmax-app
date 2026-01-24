/**
 * 🤖 ENDPOINT UNIFICADO DE IA - KIZI AI
 * 
 * Sistema inteligente com 3 motores:
 * - KIZI 2.5 Pro (Gemini 2.5 Pro) = Raciocínio complexo, análises profundas
 * - KIZI Speed (Groq Llama 70B) = Velocidade, respostas rápidas
 * - KIZI Flash (Gemini Flash) = Respostas simples, conversas leves
 * 
 * O sistema escolhe automaticamente o melhor motor baseado na complexidade.
 */

import geniusPrompts from '../src/prompts/geniusPrompts.js';
import costOptimization from '../src/utils/costOptimization.js';
import { specialists } from '../src/config/specialists.js';
import { RKMMAXClaudeSystem } from '../lib/claude-integration.js';

const { buildGeniusPrompt } = geniusPrompts;
const { optimizeRequest, cacheResponse } = costOptimization;

/**
 * Analisar complexidade da mensagem para escolher o motor ideal
 */
function analyzeComplexity(messages) {
  const lastMessage = messages[messages.length - 1]?.content || '';
  const allContent = messages.map(m => m.content).join(' ');
  
  // Indicadores de complexidade ALTA (KIZI 2.5 Pro)
  const complexIndicators = [
    /analis[ae]/i, /compar[ae]/i, /expliq/i, /detalh/i,
    /código|code|programa/i, /debug/i, /erro|error|bug/i,
    /arquitetura/i, /sistema/i, /projeto/i, /planeja/i,
    /pesquis/i, /estud/i, /aprend/i,
    /estratégia/i, /negócio/i, /empresa/i,
    /matemática|cálculo|equação/i,
    /\?.*\?/,  // Múltiplas perguntas
    /por que|porque|como funciona/i,
    /passo a passo/i, /tutorial/i,
    /crie|desenvolva|construa|implemente/i
  ];
  
  // Indicadores de simplicidade (KIZI Flash)
  const simpleIndicators = [
    /^(oi|olá|hey|hi|hello|e aí)/i,
    /^(obrigado|valeu|thanks|ok|tá|beleza)/i,
    /^(sim|não|yes|no)$/i,
    /^.{1,30}$/,  // Mensagens muito curtas
    /^(qual|quem|onde|quando) .{1,50}\?$/i,  // Perguntas diretas curtas
    /bom dia|boa tarde|boa noite/i,
    /tudo bem|como vai/i
  ];
  
  // Calcular scores
  let complexScore = 0;
  let simpleScore = 0;
  
  for (const pattern of complexIndicators) {
    if (pattern.test(lastMessage) || pattern.test(allContent)) {
      complexScore++;
    }
  }
  
  for (const pattern of simpleIndicators) {
    if (pattern.test(lastMessage)) {
      simpleScore++;
    }
  }
  
  // Fatores adicionais
  const messageLength = lastMessage.length;
  const conversationLength = messages.length;
  
  if (messageLength > 500) complexScore += 2;
  else if (messageLength > 200) complexScore += 1;
  else if (messageLength < 50) simpleScore += 1;
  
  if (conversationLength > 10) complexScore += 1;
  
  // Decidir
  if (simpleScore >= 2 && complexScore === 0) {
    return 'flash';  // KIZI Flash para respostas simples
  } else if (complexScore >= 2) {
    return 'pro';    // KIZI 2.5 Pro para raciocínio complexo
  } else {
    return 'speed';  // KIZI Speed para velocidade (padrão)
  }
}

/**
 * Chamar KIZI 2.5 Pro (Gemini 2.5 Pro - raciocínio avançado)
 */
async function callKiziPro(messages, systemPrompt, apiKey) {
  // Construir contents com system prompt integrado
  const contents = [];
  
  // Adicionar system prompt como primeira mensagem do modelo (se existir)
  if (systemPrompt) {
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    contents.push({
      role: 'model', 
      parts: [{ text: 'Entendido. Vou seguir essas instruções.' }]
    });
  }
  
  // Adicionar mensagens do usuário
  for (const msg of messages) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents
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
 * Chamar KIZI Flash (Gemini Flash - respostas simples e rápidas)
 */
async function callKiziFlash(messages, systemPrompt, apiKey) {
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
          temperature: 0.7,
          maxOutputTokens: 4000,
          topP: 0.9
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`KIZI Flash error: ${error}`);
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
 * Chamar Vertex AI (Google)
 */
async function callVertex(messages, systemPrompt) {
  // Try multiple environment variable names for flexibility
  const vertexKey = process.env.VERTEX_API_KEY || 
                    process.env.GOOGLE_API_KEY || 
                    process.env.GEMINI_API_KEY;
  
  if (!vertexKey) {
    throw new Error(
      'Google AI API key not configured. Please set one of: ' +
      'GOOGLE_API_KEY, GEMINI_API_KEY, or VERTEX_API_KEY. ' +
      'Get your key at https://aistudio.google.com/app/apikey'
    );
  }
  
  const lastMsg = messages[messages.length - 1]?.content || '';
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUsuário: ${lastMsg}` : lastMsg;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${vertexKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.8,
          topP: 0.25,
          maxOutputTokens: 8192
        }
      })
    }
  );
  
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Resposta vazia do Vertex');
  
  return text;
}

/**
 * Chamar o motor KIZI apropriado com fallback automático
 * ORDEM: Vertex AI → Claude → Groq
 */
async function callKizi(messages, systemPrompt, complexity, geminiKey, groqKey) {
  const hasVertex = !!(process.env.VERTEX_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY);
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  const hasGroq = !!groqKey;
  
  // 1. Tentar Vertex AI primeiro
  if (hasVertex) {
    try {
      console.log('🤖 Tentando Vertex AI (Gemini 2.5 Pro)...');
      const response = await callVertex(messages, systemPrompt);
      return { response, model: 'vertex-gemini-2.5-pro' };
    } catch (error) {
      console.error('❌ Vertex falhou:', error.message);
    }
  }
  
  // 2. Fallback para Claude
  if (hasClaude) {
    try {
      console.log('🤖 Fallback: Claude 3.5 Sonnet...');
      const rkmmax = new RKMMAXClaudeSystem();
      const lastMsg = messages[messages.length - 1]?.content || '';
      const resultado = await rkmmax.processar(lastMsg, {});
      if (resultado.status === 'sucesso') {
        return { response: resultado.resultado.resposta, model: 'claude-3.5-sonnet' };
      }
      throw new Error(resultado.erro || 'Claude falhou');
    } catch (error) {
      console.error('❌ Claude falhou:', error.message);
    }
  }
  
  // 3. Fallback para Groq
  if (hasGroq) {
    try {
      console.log('🤖 Fallback: Groq Speed...');
      const response = await callKiziSpeed(messages, systemPrompt, groqKey);
      return { response, model: 'groq-llama-70b' };
    } catch (error) {
      console.error('❌ Groq falhou:', error.message);
    }
  }
  
  throw new Error(
    'All AI providers failed. Please check your configuration:\n' +
    '- VERTEX_API_KEY / GOOGLE_API_KEY / GEMINI_API_KEY for Google AI\n' +
    '- ANTHROPIC_API_KEY for Claude\n' +
    '- GROQ_API_KEY for Groq\n' +
    'See .env.template for setup instructions.'
  );
}

/**
 * Handler principal
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
      specialistId,
      forceModel  // Opcional: forçar um modelo específico ('pro', 'speed', 'flash')
    } = req.body;

    // Verificar credenciais - pelo menos um provider necessário
    const hasVertex = !!(process.env.VERTEX_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY);
    const hasClaude = !!process.env.ANTHROPIC_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const hasGroq = !!groqKey;

    if (!hasVertex && !hasClaude && !hasGroq) {
      return res.status(500).json({
        error: 'No AI providers configured',
        message: 'Please configure at least one AI provider',
        hint: 'Set one of: ANTHROPIC_API_KEY, GOOGLE_API_KEY/GEMINI_API_KEY, or GROQ_API_KEY',
        documentation: 'See .env.template for configuration instructions'
      });
    }

    // Analisar complexidade automaticamente ou usar modelo forçado
    const complexity = forceModel || analyzeComplexity(messages);
    console.log(`🤖 KIZI AI - Type: ${type} | Complexity: ${complexity}`);

    // ========================================
    // TIPO: GENIUS (Serginho + Híbrido)
    // ========================================
    if (type === 'genius' || type === 'chat' || type === 'intelligent' || type === 'hybrid') {
      const promptType = agentType || 'serginho';
      const systemPrompt = buildGeniusPrompt(promptType);
      const optimized = optimizeRequest(messages, systemPrompt);

      // Verificar cache
      if (optimized.cached) {
        console.log('💰 CACHE HIT!');
        return res.status(200).json({
          ...optimized.response,
          cached: true,
          type: promptType
        });
      }

      // Chamar KIZI com seleção automática
      const { response, model } = await callKizi(
        optimized.messages,
        optimized.systemPrompt,
        complexity,
        null, // Gemini desabilitado
        groqKey
      );

      const result = {
        response,
        model,
        provider: 'kizi',
        tier: complexity,
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
    }

    // ========================================
    // TIPO: SPECIALIST
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
        console.log('💰 CACHE HIT!');
        return res.status(200).json({
          ...optimized.response,
          cached: true,
          specialist: specialist.name
        });
      }

      // Chamar KIZI com seleção automática
      const { response, model } = await callKizi(
        optimized.messages,
        optimized.systemPrompt,
        complexity,
        null, // Gemini desabilitado
        groqKey
      );

      const result = {
        response,
        model,
        provider: 'kizi',
        specialist: specialist.name,
        tier: complexity,
        success: true
      };

      cacheResponse(messages, result);

      return res.status(200).json({
        ...result,
        cached: false,
        optimized: true,
        stats: optimized.stats
      });
    }

    // ========================================
    // TIPO: TRANSCRIBE
    // ========================================
    if (type === 'transcribe') {
      return res.status(501).json({
        error: 'Transcription not implemented yet'
      });
    }

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
