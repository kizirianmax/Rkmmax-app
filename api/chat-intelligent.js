/**
 * RKMMAX INTELLIGENT CHAT API
 * Sistema de roteamento inteligente com 3 IAs
 * 
 * Arquitetura:
 * 1. Analisa complexidade da mensagem
 * 2. Roteia para IA ideal (Flash/GROQ/Pro)
 * 3. Fallback automático se falhar
 * 4. Otimiza custo e performance
 */

/**
 * Análise de complexidade (versão backend)
 */
function analyzeComplexity(message) {
  const text = message.toLowerCase();
  const wordCount = message.split(/\s+/).length;
  const charCount = message.length;
  const lineCount = message.split('\n').length;
  
  let complexityScore = 0;
  let speedScore = 0;
  
  // Palavras-chave complexas
  const complexKeywords = [
    'analisar', 'análise', 'debugar', 'debug', 'arquitetura',
    'refatorar', 'otimizar', 'planejar', 'estratégia',
    'complexo', 'avançado', 'profundo', 'detalhado',
    'resolver problema', 'solução', 'implementar',
    'banco de dados', 'segurança', 'performance',
    'algoritmo', 'estrutura de dados'
  ];
  
  complexKeywords.forEach(keyword => {
    if (text.includes(keyword)) complexityScore += 2;
  });
  
  // Detectar código
  const hasCode = /```|function|class|import|const.*=|=>/.test(message);
  if (hasCode) complexityScore += 5;
  
  // Tamanho
  if (wordCount > 100) complexityScore += 2;
  if (wordCount > 200) complexityScore += 3;
  
  return {
    wordCount,
    charCount,
    lineCount,
    hasCode,
    complexityScore,
    speedScore,
    isVeryShort: wordCount < 10,
    isLong: wordCount >= 100
  };
}

/**
 * Decide qual provider usar
 */
function routeToProvider(analysis, lastMessage) {
  const { complexityScore, speedScore, hasCode, isVeryShort, isLong } = analysis;
  
  // REGRA 1: Código = Gemini Pro
  if (hasCode) {
    return {
      provider: 'gemini-pro',
      reason: 'Código detectado - análise profunda necessária',
      confidence: 0.95
    };
  }
  
  // REGRA 2: Alta complexidade = Gemini Pro
  if (complexityScore >= 5) {
    return {
      provider: 'gemini-pro',
      reason: 'Alta complexidade detectada',
      confidence: 0.9
    };
  }
  
  // REGRA 3: GROQ é apenas fallback (removido)
  
  // REGRA 4: Mensagens longas com complexidade = Gemini Pro
  if (isLong && complexityScore > 2) {
    return {
      provider: 'gemini-pro',
      reason: 'Mensagem longa e complexa',
      confidence: 0.8
    };
  }
  
  // REGRA 5: Mensagens muito curtas = Gemini Flash
  if (isVeryShort) {
    return {
      provider: 'gemini-flash',
      reason: 'Mensagem curta - usando Flash',
      confidence: 0.8
    };
  }
  
  // REGRA 6: Padrão = Gemini Flash (custo-benefício)
  return {
    provider: 'gemini-flash',
    reason: 'Conversa padrão - otimizando custo',
    confidence: 0.7
  };
}

/**
 * Chamar Gemini Flash
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

  return {
    response: data.candidates[0].content.parts[0].text,
    model: 'gemini-2.0-flash-exp',
    provider: 'google',
    tier: 'standard',
    cost: 'low'
  };
}

/**
 * Chamar Gemini Pro 2.5
 */
async function callGeminiPro(messages, systemPrompt, apiKey) {
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
          temperature: 0.7,
          maxOutputTokens: 8000,
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
    model: 'gemini-2.0-flash-thinking-exp',
    provider: 'google',
    tier: 'premium',
    cost: 'high',
    quality: 'maximum'
  };
}

/**
 * Chamar GROQ
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

  return {
    response: data.choices[0].message.content,
    model: 'llama-3.3-70b-versatile',
    provider: 'groq',
    tier: 'turbo',
    cost: 'medium',
    speed: 'ultra-fast'
  };
}

/**
 * Fallback chain: GROQ é sempre fallback
 */
const FALLBACK_CHAIN = {
  'gemini-pro': ['gemini-flash', 'groq'],
  'gemini-flash': ['groq'],
  'groq': []
};

/**
 * Handler principal
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      messages, 
      specialistId = null, 
      specialistData = null,
      forceProvider = null,
      enableIntelligentRouting = true
    } = req.body;

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

    // Verificar credenciais
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasGroq = !!process.env.GROQ_API_KEY;

    if (!hasGemini && !hasGroq) {
      return res.status(500).json({
        error: 'No AI providers configured',
        hint: 'Configure GEMINI_API_KEY or GROQ_API_KEY'
      });
    }

    // Analisar última mensagem do usuário
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const messageText = lastUserMessage?.content || '';
    
    // Roteamento inteligente
    let selectedProvider = forceProvider;
    let routingInfo = null;
    
    if (!forceProvider && enableIntelligentRouting) {
      const analysis = analyzeComplexity(messageText);
      routingInfo = routeToProvider(analysis, messageText);
      selectedProvider = routingInfo.provider;
      
      console.log('🧠 ROTEAMENTO INTELIGENTE:');
      console.log('  Mensagem:', messageText.substring(0, 50) + '...');
      console.log('  Análise:', analysis);
      console.log('  Provider escolhido:', selectedProvider);
      console.log('  Razão:', routingInfo.reason);
      console.log('  Confiança:', routingInfo.confidence);
    }

    // Montar lista de providers para tentar
    const providersToTry = [];
    
    if (selectedProvider === 'gemini-pro' && hasGemini) {
      providersToTry.push({
        name: 'gemini-pro',
        fn: () => callGeminiPro(messages, systemPrompt, process.env.GEMINI_API_KEY)
      });
    } else if (selectedProvider === 'groq' && hasGroq) {
      providersToTry.push({
        name: 'groq',
        fn: () => callGroq(messages, systemPrompt, process.env.GROQ_API_KEY)
      });
    } else if (selectedProvider === 'gemini-flash' && hasGemini) {
      providersToTry.push({
        name: 'gemini-flash',
        fn: () => callGeminiFlash(messages, systemPrompt, process.env.GEMINI_API_KEY)
      });
    }

    // Adicionar fallbacks
    const fallbackChain = FALLBACK_CHAIN[selectedProvider] || ['gemini-flash', 'groq', 'gemini-pro'];
    const triedProviders = [selectedProvider];
    
    for (const fallback of fallbackChain) {
      if (triedProviders.includes(fallback)) continue;
      
      if (fallback === 'gemini-pro' && hasGemini) {
        providersToTry.push({
          name: 'gemini-pro',
          fn: () => callGeminiPro(messages, systemPrompt, process.env.GEMINI_API_KEY)
        });
        triedProviders.push('gemini-pro');
      } else if (fallback === 'groq' && hasGroq) {
        providersToTry.push({
          name: 'groq',
          fn: () => callGroq(messages, systemPrompt, process.env.GROQ_API_KEY)
        });
        triedProviders.push('groq');
      } else if (fallback === 'gemini-flash' && hasGemini) {
        providersToTry.push({
          name: 'gemini-flash',
          fn: () => callGeminiFlash(messages, systemPrompt, process.env.GEMINI_API_KEY)
        });
        triedProviders.push('gemini-flash');
      }
    }

    // Tentar cada provider
    let lastError = null;
    const attemptedProviders = [];

    for (const provider of providersToTry) {
      try {
        console.log(`🚀 Tentando provider: ${provider.name}`);
        const result = await provider.fn();
        
        console.log(`✅ Sucesso com ${provider.name}`);
        
        return res.status(200).json({
          ...result,
          intelligentRouting: routingInfo,
          attemptedProviders: [...attemptedProviders, provider.name],
          success: true
        });
      } catch (error) {
        console.error(`❌ Falha com ${provider.name}:`, error.message);
        attemptedProviders.push(provider.name);
        lastError = error;
      }
    }

    // Todos falharam
    console.error('❌ TODOS OS PROVIDERS FALHARAM');
    return res.status(500).json({
      error: 'All AI providers failed',
      lastError: lastError?.message,
      attemptedProviders,
      hint: 'Check API keys and provider status'
    });

  } catch (error) {
    console.error('❌ ERRO NO HANDLER:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

module.exports = handler;
