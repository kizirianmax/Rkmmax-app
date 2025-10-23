/**
 * Vercel Serverless Function para chat com especialistas
 * Cada especialista tem seu próprio system prompt personalizado
 */

import { specialists } from '../src/config/specialists.js';

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

    // Pegar API key das variáveis de ambiente do Vercel
    const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY || 
                         process.env.GROQ_API_KEY || 
                         process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!GROQ_API_KEY) {
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

    // Chamar Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
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
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Error calling Groq API' 
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return res.status(200).json({ 
      response: aiResponse,
      specialist: {
        id: specialist.id,
        name: specialist.name,
        emoji: specialist.emoji
      }
    });

  } catch (error) {
    console.error('Error in specialist chat API:', error);
    return res.status(500).json({ error: error.message });
  }
}

