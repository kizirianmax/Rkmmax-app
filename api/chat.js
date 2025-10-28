/**
 * Vercel Serverless Function para chamar Groq API
 * Com fallback automático FREE → PAGO quando atingir limites
 */

// Contador de uso (em memória - resetado diariamente)
let usageCounter = {
  free: 0,
  paid: 0,
  lastReset: new Date().toDateString(),
};

const FREE_LIMIT_PER_DAY = 14400; // Groq tier free

/**
 * Reseta contador se for um novo dia
 */
function resetCounterIfNewDay() {
  const today = new Date().toDateString();
  if (usageCounter.lastReset !== today) {
    usageCounter = { free: 0, paid: 0, lastReset: today };
    console.log('[Fallback] Contador resetado para novo dia');
  }
}

/**
 * Verifica se deve usar tier FREE ou PAGO
 */
function shouldUseFree() {
  resetCounterIfNewDay();
  return usageCounter.free < FREE_LIMIT_PER_DAY;
}

/**
 * Gera prompt profissional para especialista
 */
function getSpecialistPrompt(specialistId, specialistData) {
  return `Você é ${specialistData.name}, ${specialistData.description}.

**REGRAS:**
1. Responda APENAS sobre ${specialistData.category}
2. Se fora da sua área, redirecione ao Serginho
3. Seja um GÊNIO MUNDIAL
4. Qualidade impecável

${specialistData.systemPrompt}

**Nível:** PhD/Gênio mundial
**Tom:** Profissional
**Idioma:** Português Brasileiro`;
}

/**
 * Faz requisição para Groq API
 */
async function callGroqAPI(apiKey, messages, specialistId = null, specialistData = null) {
  // Usar prompt específico do especialista ou prompt padrão do Serginho
  let promptContent;
  
  if (specialistId && specialistData) {
    promptContent = getSpecialistPrompt(specialistId, specialistData);
  } else {
    promptContent = `Você é o **Serginho**, o agente orquestrador de IA do sistema RKMMAX.

**IDENTIDADE OBRIGATÓRIA:**
- Seu nome é **SERGINHO** (nunca diga que é KIZI)
- Você é um dos 45 especialistas do RKMMAX
- Sua função: orquestrar os outros especialistas
- KIZI é o SISTEMA onde você trabalha (não é você)
- Quando perguntarem seu nome, responda: "Sou o Serginho, orquestrador de IA"

**Sua personalidade:**
- 🤖 Profissional mas amigável e acessível
- 💡 Inteligente e sempre focado em soluções práticas
- 🎯 Direto ao ponto, mas empático e atencioso
- 🚀 Entusiasta de tecnologia e inovação
- 🧠 Tem memória infinita e aprende continuamente

**Como você se comporta:**
1. Responde de forma clara, objetiva e bem estruturada
2. Usa emojis de forma moderada e contextual (não exagere)
3. Quando apropriado, fornece exemplos práticos
4. Se não souber algo, admite honestamente
5. Sempre busca entender o contexto antes de responder
6. É proativo em sugerir soluções e próximos passos

**Suas especialidades:**
- Programação e desenvolvimento (Python, JavaScript, React, etc.)
- Gerenciamento de projetos e produtividade
- Análise de dados e resolução de problemas
- Explicações técnicas de forma acessível
- Criatividade e brainstorming
- Orquestração dos 45 especialistas do RKMMAX

**Tom de voz:**
Profissional mas descontraído, como um colega de trabalho expert e confiável.

**REGRA ABSOLUTA:** Você é SERGINHO. KIZI é o sistema. Nunca confunda!

Responda sempre em **Português Brasileiro** (pt-BR) a menos que seja solicitado outro idioma.`;
  }

  const systemPrompt = {
    role: 'system',
    content: promptContent
  };

  const messagesWithSystem = [systemPrompt, ...messages];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error?.message || 'Error calling Groq API');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return await response.json();
}

export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Pegar API keys das variáveis de ambiente
    const GROQ_API_KEY_FREE = process.env.GROQ_API_KEY_FREE || 
                              process.env.VITE_GROQ_API_KEY || 
                              process.env.GROQ_API_KEY || 
                              process.env.NEXT_PUBLIC_GROQ_API_KEY;

    const GROQ_API_KEY_PAID = process.env.GROQ_API_KEY_PAID || GROQ_API_KEY_FREE;

    if (!GROQ_API_KEY_FREE) {
      console.error('GROQ API KEY NOT FOUND. Available env vars:', Object.keys(process.env).filter(k => k.includes('GROQ')));
      return res.status(500).json({ 
        error: 'Groq API key not configured',
        hint: 'Add GROQ_API_KEY to Vercel environment variables'
      });
    }

    // Decide qual tier usar
    const useFree = shouldUseFree();
    const apiKey = useFree ? GROQ_API_KEY_FREE : GROQ_API_KEY_PAID;
    let tier = useFree ? 'free' : 'paid';
    let fallbackOccurred = false;

    console.log(`[Fallback] Tentando tier ${tier.toUpperCase()} (free: ${usageCounter.free}/${FREE_LIMIT_PER_DAY})`);

    try {
      // Tenta fazer a requisição
      const data = await callGroqAPI(apiKey, messages);
      
      // Sucesso! Incrementa contador
      resetCounterIfNewDay();
      usageCounter[tier]++;
      
      const aiResponse = data.choices[0].message.content;

      return res.status(200).json({ 
        response: aiResponse,
        tier,
        fallback: false,
        usage: {
          free: usageCounter.free,
          paid: usageCounter.paid,
          freeLimit: FREE_LIMIT_PER_DAY,
          percentUsed: (usageCounter.free / FREE_LIMIT_PER_DAY * 100).toFixed(1),
        },
      });

    } catch (error) {
      // Se falhou no tier FREE por limite (429), tenta PAGO
      if (useFree && error.status === 429) {
        console.warn('[Fallback] Tier FREE esgotado, tentando tier PAGO...');
        
        try {
          const data = await callGroqAPI(GROQ_API_KEY_PAID, messages);
          
          // Sucesso no tier PAGO! Incrementa contador
          resetCounterIfNewDay();
          usageCounter.paid++;
          tier = 'paid';
          fallbackOccurred = true;
          
          const aiResponse = data.choices[0].message.content;

          return res.status(200).json({ 
            response: aiResponse,
            tier: 'paid',
            fallback: true,
            usage: {
              free: usageCounter.free,
              paid: usageCounter.paid,
              freeLimit: FREE_LIMIT_PER_DAY,
              percentUsed: (usageCounter.free / FREE_LIMIT_PER_DAY * 100).toFixed(1),
            },
          });

        } catch (paidError) {
          console.error('[Fallback] Tier PAGO também falhou:', paidError);
          return res.status(paidError.status || 500).json({ 
            error: paidError.message || 'Error calling Groq API (paid tier)',
            tier: 'paid',
            fallback: true,
          });
        }
      }

      // Erro não relacionado a limite, propaga
      return res.status(error.status || 500).json({ 
        error: error.message || 'Error calling Groq API',
        tier,
      });
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message });
  }
}

