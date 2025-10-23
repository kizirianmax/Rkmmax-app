/**
 * Vercel Serverless Function para chat com especialistas
 * Cada especialista tem seu próprio system prompt personalizado
 * Com fallback automático FREE → PAGO
 */

import { specialists } from '../src/config/specialists.js';

// Contador de uso (em memória - resetado diariamente)
let usageCounter = {
  free: 0,
  paid: 0,
  lastReset: new Date().toDateString(),
};

const FREE_LIMIT_PER_DAY = 14400; // Groq tier free

function resetCounterIfNewDay() {
  const today = new Date().toDateString();
  if (usageCounter.lastReset !== today) {
    usageCounter = { free: 0, paid: 0, lastReset: today };
    console.log('[Fallback] Contador resetado para novo dia');
  }
}

function shouldUseFree() {
  resetCounterIfNewDay();
  return usageCounter.free < FREE_LIMIT_PER_DAY;
}

async function callGroqAPI(apiKey, messages) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error?.message || 'Groq API error');
    error.status = response.status;
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
    const { messages, specialistId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!specialistId) {
      return res.status(400).json({ error: 'Specialist ID is required' });
    }

    // Verificar se o especialista existe
    const specialist = specialists[specialistId];
    if (!specialist) {
      return res.status(404).json({ error: 'Specialist not found' });
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

    // System prompt personalizado para o especialista
    const systemPrompt = {
      role: 'system',
      content: `${specialist.systemPrompt}

**Informações sobre você:**
- Nome: ${specialist.name}
- Especialidade: ${specialist.description}
- Emoji: ${specialist.emoji}

**Como você se comporta:**
1. Responde de forma clara, objetiva e bem estruturada
2. Usa emojis de forma moderada e contextual (não exagere)
3. Quando apropriado, fornece exemplos práticos
4. Se não souber algo, admite honestamente
5. Sempre busca entender o contexto antes de responder
6. É proativo em sugerir soluções e próximos passos
7. Mantém-se dentro da sua área de especialidade

**Tom de voz:**
Profissional mas acessível, como um especialista experiente e amigável.

Responda sempre em **Português Brasileiro** (pt-BR) a menos que seja solicitado outro idioma.`
    };

    // Adicionar system prompt no início das mensagens
    const messagesWithSystem = [systemPrompt, ...messages];

    // Decide qual tier usar
    const useFree = shouldUseFree();
    const apiKey = useFree ? GROQ_API_KEY_FREE : GROQ_API_KEY_PAID;
    let tier = useFree ? 'free' : 'paid';

    console.log(`[Specialist] ${specialistId} usando tier ${tier} (free: ${usageCounter.free}/${FREE_LIMIT_PER_DAY})`);

    try {
      // Tenta fazer a requisição
      const data = await callGroqAPI(apiKey, messagesWithSystem);
      
      // Sucesso! Incrementa contador
      resetCounterIfNewDay();
      usageCounter[tier]++;
      
      const aiResponse = data.choices[0].message.content;

      return res.status(200).json({ 
        response: aiResponse,
        specialist: {
          id: specialist.id,
          name: specialist.name,
          emoji: specialist.emoji
        },
        tier,
        fallback: false,
        usage: {
          free: usageCounter.free,
          paid: usageCounter.paid,
          freeLimit: FREE_LIMIT_PER_DAY,
        },
      });

    } catch (error) {
      // Se falhou no tier FREE por limite (429), tenta PAGO
      if (useFree && error.status === 429) {
        console.warn(`[Fallback] Tier FREE esgotado, tentando tier PAGO...`);
        
        try {
          const data = await callGroqAPI(GROQ_API_KEY_PAID, messagesWithSystem);
          
          // Sucesso no tier PAGO! Incrementa contador
          resetCounterIfNewDay();
          usageCounter.paid++;
          
          const aiResponse = data.choices[0].message.content;

          return res.status(200).json({ 
            response: aiResponse,
            specialist: {
              id: specialist.id,
              name: specialist.name,
              emoji: specialist.emoji
            },
            tier: 'paid',
            fallback: true,
            usage: {
              free: usageCounter.free,
              paid: usageCounter.paid,
              freeLimit: FREE_LIMIT_PER_DAY,
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
    console.error('Error in specialist chat API:', error);
    return res.status(500).json({ error: error.message });
  }
}

