/**
 * Google AI SDK Integration
 * Usa a biblioteca oficial do Google para Gemini
 * Suporta Gemini 2.0 Flash, Gemini 2.5 Pro
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar cliente Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Chamar Gemini 2.0 Flash via SDK oficial
 */
async function callGeminiFlashSDK(messages, systemPrompt) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt
    });

    // Converter mensagens para formato do SDK
    const history = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    // Iniciar chat
    const chat = model.startChat({ history });

    // Enviar última mensagem
    const lastMessage = messages[messages.length - 1];
    const response = await chat.sendMessage(lastMessage.content);
    const text = response.response.text();

    return {
      response: text,
      model: 'gemini-2.0-flash',
      provider: 'google',
      sdk: 'official',
      speed: 'fast',
      cost: 'low'
    };
  } catch (error) {
    throw new Error(`Gemini 2.0 Flash SDK error: ${error.message}`);
  }
}

/**
 * Chamar Gemini 2.5 Pro via SDK oficial
 */
async function callGeminiProSDK(messages, systemPrompt) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      systemInstruction: systemPrompt
    });

    // Converter mensagens para formato do SDK
    const history = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    // Iniciar chat
    const chat = model.startChat({ history });

    // Enviar última mensagem
    const lastMessage = messages[messages.length - 1];
    const response = await chat.sendMessage(lastMessage.content);
    const text = response.response.text();

    return {
      response: text,
      model: 'gemini-2.5-pro',
      provider: 'google',
      sdk: 'official',
      speed: 'medium',
      cost: 'high',
      quality: 'premium'
    };
  } catch (error) {
    throw new Error(`Gemini 2.5 Pro SDK error: ${error.message}`);
  }
}

/**
 * Handler para usar SDK Google AI
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, specialist = 'Serginho', mode = 'MANUAL' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY not configured',
        hint: 'Add GEMINI_API_KEY to Vercel environment variables'
      });
    }

    // Prompts especializados por agente
    const agentPrompts = {
      'Serginho': 'Você é Serginho, orquestrador de IA do RKMMAX. Responda de forma profissional, amigável e direto ao ponto.',
      'Pesquisador': 'Você é um pesquisador especialista. Analise profundamente o tema, cite fontes e traga insights valiosos.',
      'Escritor': 'Você é um escritor profissional. Crie conteúdo de qualidade, bem estruturado, envolvente e com boa formatação.',
      'Dev': 'Você é um desenvolvedor sênior. Forneça soluções técnicas robustas, bem otimizadas e com boas práticas.',
      'Designer': 'Você é um designer criativo. Sugira soluções visualmente impressionantes e funcionais.',
    };

    const systemPrompt = agentPrompts[specialist] || agentPrompts['Serginho'];

    // Tentar Gemini 2.0 Flash primeiro
    try {
      const result = await callGeminiFlashSDK(messages, systemPrompt);
      return res.status(200).json({
        ...result,
        usedProvider: 'gemini-2.0-flash-sdk',
        timestamp: new Date().toISOString()
      });
    } catch (error1) {
      console.error('❌ Gemini 2.0 Flash SDK failed:', error1.message);

      // Fallback para Gemini 2.5 Pro
      try {
        const result = await callGeminiProSDK(messages, systemPrompt);
        return res.status(200).json({
          ...result,
          usedProvider: 'gemini-2.5-pro-sdk',
          fallback: 'gemini-2.0-flash-sdk',
          timestamp: new Date().toISOString()
        });
      } catch (error2) {
        console.error('❌ Gemini 2.5 Pro SDK failed:', error2.message);

        return res.status(500).json({
          error: 'All Gemini SDK providers failed',
          errors: [
            { provider: 'gemini-2.0-flash-sdk', message: error1.message },
            { provider: 'gemini-2.5-pro-sdk', message: error2.message }
          ]
        });
      }
    }

  } catch (error) {
    console.error('Error in Google AI handler:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;
