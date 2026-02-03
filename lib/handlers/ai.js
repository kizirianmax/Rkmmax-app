/**
 * 🤖 ENDPOINT UNIFICADO DE IA - KIZI AI
 * 
 * Sistema inteligente com Groq Multi-Modelo (3 níveis) + Gemini Fallback:
 * - GROQ REASONING (DeepSeek R1 70B) = Raciocínio profundo, análises complexas, código
 * - GROQ STANDARD (Llama 3.3 70B) = Uso geral, conversas normais
 * - GROQ SPEED (Llama 3.2 3B) = Velocidade, respostas rápidas
 * - GEMINI FALLBACK (Gemini 1.5 Pro) = Fallback automático se Groq falhar
 * 
 * O sistema escolhe automaticamente o melhor motor baseado na complexidade.
 */

import geniusPrompts from '../../src/prompts/geniusPrompts.js';
import costOptimization from '../../src/utils/costOptimization.js';
import { specialists } from '../../src/config/specialists.js';
import { RKMMAXClaudeSystem } from '../claude-integration.js';
import { validateGroqApiKey, validatePromptSize } from '../../src/utils/groqValidation.js';

const { buildGeniusPrompt } = geniusPrompts;
const { optimizeRequest, cacheResponse } = costOptimization;

/**
 * Configuração dos modelos Groq (3 níveis de inteligência)
 */
const GROQ_MODELS = {
  // 🧠 Raciocínio profundo (análises complexas, código, estratégia)
  reasoning: 'deepseek-r1-distill-llama-70b',
  
  // ⚡ Uso geral (conversas normais, perguntas médias)
  standard: 'llama-3.3-70b-versatile',
  
  // 🚀 Velocidade (respostas rápidas, perguntas simples)
  speed: 'llama-3.2-3b-preview'
};

/**
 * Configuração do Gemini Fallback
 */
const GEMINI_FALLBACK = {
  model: 'gemini-1.5-pro',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'
};

/**
 * Get Google AI API key from environment variables
 * Supports multiple alias names for flexibility
 * @returns {string|undefined} API key or undefined if not set
 */
function getGoogleApiKey() {
  return process.env.GEMINI_API_KEY || 
         process.env.GOOGLE_API_KEY || 
         process.env.VERTEX_API_KEY;
}

/**
 * Seleção automática do modelo Groq baseado na complexidade da mensagem
 */
function selectGroqModel(messages) {
  const lastMessage = messages[messages.length - 1]?.content || '';
  const messageLength = lastMessage.length;
  
  // Indicadores de complexidade ALTA
  const complexPatterns = [
    /analis[ae]/i, /expliq/i, /código|code/i, /debug/i,
    /arquitetura/i, /estratégia/i, /implementa/i, /crie/i,
    /desenvolva/i, /construa/i, /planeja/i,
    /compar[ae]/i, /detalh/i, /passo a passo/i,
    /tutorial/i, /pesquis/i, /estud/i
  ];
  
  // Indicadores de simplicidade
  const simplePatterns = [
    /^(oi|olá|hey)/i, /^(sim|não|ok)/i, /bom dia/i,
    /boa tarde/i, /boa noite/i, /tudo bem/i,
    /obrigado|valeu/i
  ];
  
  let complexScore = 0;
  let simpleScore = 0;
  
  // Calcular scores
  for (const pattern of complexPatterns) {
    if (pattern.test(lastMessage)) {
      complexScore++;
    }
  }
  
  for (const pattern of simplePatterns) {
    if (pattern.test(lastMessage)) {
      simpleScore++;
    }
  }
  
  // Ajustar score baseado no tamanho
  if (messageLength > 500) complexScore += 2;
  else if (messageLength < 50) simpleScore += 1;
  
  // Decisão
  if (complexScore >= 2) return 'reasoning';  // DeepSeek R1
  if (simpleScore >= 2) return 'speed';       // Llama 3.2 3B
  return 'standard';                          // Llama 3.3 70B
}

/**
 * Otimizar system prompt (limitar tamanho)
 */
function optimizeSystemPrompt(prompt) {
  if (!prompt) return '';
  return prompt.substring(0, 2000); // Máximo 2000 caracteres
}

/**
 * Otimizar mensagens (limitar histórico e tamanho)
 */
function optimizeMessages(messages) {
  if (!messages || messages.length === 0) return [];
  
  // Manter apenas últimas 10 mensagens
  const recent = messages.slice(-10);
  
  // Truncar mensagens muito longas
  return recent.map(msg => ({
    ...msg,
    content: msg.content.substring(0, 4000) // Máximo 4000 caracteres por mensagem
  }));
}

/**
 * Chamar Groq API com modelo específico
 */
async function callGroq(messages, systemPrompt, apiKey, model) {
  // Validar API key
  validateGroqApiKey(apiKey);
  
  // Construir payload de mensagens
  const messagesPayload = [];
  
  if (systemPrompt) {
    const truncatedPrompt = optimizeSystemPrompt(systemPrompt);
    messagesPayload.push({ 
      role: 'system', 
      content: truncatedPrompt 
    });
  }
  
  // Adicionar mensagens otimizadas
  const optimizedMessages = optimizeMessages(messages);
  messagesPayload.push(...optimizedMessages);
  
  console.log(`🚀 Groq Request: ${model}`, {
    messagesCount: messagesPayload.length,
    hasSystemPrompt: !!systemPrompt
  });
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: messagesPayload,
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Resposta do Groq está em formato inválido');
  }
  
  console.log('✅ Groq Response:', {
    model: data.model,
    tokensUsed: data.usage?.total_tokens
  });
  
  return data.choices[0].message.content;
}

/**
 * Chamar Gemini 1.5 Pro (FALLBACK)
 */
async function callGemini(messages, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada');
  }
  
  // Construir conteúdo
  const contents = [];
  
  if (systemPrompt) {
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'Entendido.' }]
    });
  }
  
  for (const msg of messages) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    });
  }
  
  // Endpoint correto (API Key simples)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Chamar Vertex AI (Google) - Mantido para compatibilidade legada
 */
async function callVertex(messages, systemPrompt) {
  // Try multiple environment variable names for flexibility
  const vertexKey = getGoogleApiKey();
  
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
 * ARQUITETURA: Groq Multi-Modelo (3 níveis) → Gemini Fallback
 */
async function callKizi(messages, systemPrompt, groqKey) {
  const modelType = selectGroqModel(messages);
  const model = GROQ_MODELS[modelType];
  
  // 1. Tentar Groq (PRIMARY - 3 níveis de inteligência)
  if (groqKey) {
    try {
      console.log(`🤖 PRIMARY: Groq ${model}...`);
      const response = await callGroq(messages, systemPrompt, groqKey, model);
      return { response, model: `groq-${modelType}`, provider: 'groq' };
    } catch (error) {
      console.error(`❌ Groq falhou: ${error.message}`);
      // Continue to fallback
    }
  }
  
  // 2. Fallback: Gemini 1.5 Pro
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('🤖 FALLBACK: Google Gemini 1.5 Pro...');
      const response = await callGemini(messages, systemPrompt);
      return { response, model: 'gemini-1.5-pro', provider: 'gemini' };
    } catch (error) {
      console.error(`❌ Gemini falhou: ${error.message}`);
      // Fall through to error throw below
    }
  }
  
  throw new Error(
    'Todos os provedores de IA falharam. Verifique as configurações:\n' +
    '- GROQ_API_KEY (Primary)\n' +
    '- GEMINI_API_KEY (Fallback)'
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
      forceModel  // Opcional: forçar um modelo específico ('reasoning', 'standard', 'speed')
    } = req.body;

    // Verificar credenciais - pelo menos um provider necessário
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const hasGroq = !!groqKey;
    const hasGemini = !!geminiKey;

    if (!hasGroq && !hasGemini) {
      return res.status(500).json({
        error: 'No AI providers configured',
        message: 'Please configure at least one AI provider',
        hint: 'Set GROQ_API_KEY (Primary) or GEMINI_API_KEY (Fallback)',
        documentation: 'See .env.template for configuration instructions'
      });
    }

    console.log(`🤖 KIZI AI - Type: ${type}`);

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

      // Chamar KIZI com seleção automática de modelo Groq
      const { response, model, provider } = await callKizi(
        optimized.messages,
        optimized.systemPrompt,
        groqKey
      );

      const result = {
        response,
        model,
        provider,
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

      // Chamar KIZI com seleção automática de modelo Groq
      const { response, model, provider } = await callKizi(
        optimized.messages,
        optimized.systemPrompt,
        groqKey
      );

      const result = {
        response,
        model,
        provider,
        specialist: specialist.name,
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
