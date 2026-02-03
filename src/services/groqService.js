/**
 * Groq API Service
 * Serviço para integração com Groq AI
 * PRIMARY MODEL: openai/gpt-oss-120b para raciocínio
 */

// Usar API serverless do Vercel ao invés de chamar Groq diretamente
const API_URL = '/api/chat';

/**
 * Envia mensagem para o Groq AI
 * @param {Array} messages - Array de mensagens no formato OpenAI
 * @param {Object} options - Opções adicionais
 * @returns {Promise<string>} - Resposta do AI
 */
export async function sendMessageToGroq(messages) {
  try {
    // ✅ VALIDAR MENSAGENS
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('❌ Mensagens inválidas: array vazio ou inválido');
    }
    
    // ✅ LOG DE DEBUG
    console.log('🚀 Groq Service Request:', {
      endpoint: API_URL,
      messagesCount: messages.length,
      timestamp: new Date().toISOString()
    });
    
    // Chamar API serverless do Vercel
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    // ✅ TRATAMENTO DE ERRO DETALHADO
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { raw: errorText };
      }
      
      console.error('❌ Groq Service Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Mensagens de erro específicas
      if (response.status === 500 && errorData.error?.includes('GROQ_API_KEY')) {
        throw new Error(
          '❌ Groq não configurado!\n' +
          'Configure GROQ_API_KEY no Vercel.\n' +
          'Obtenha sua chave em: https://console.groq.com/keys'
        );
      }
      
      throw new Error(
        errorData.error || 
        errorData.message || 
        `Erro ao comunicar com API (${response.status})`
      );
    }

    // Parsear resposta
    const data = await response.json();
    
    // ✅ VALIDAR RESPOSTA
    if (!data.response) {
      console.error('❌ Resposta inválida:', data);
      throw new Error('Resposta da API está em formato inválido');
    }
    
    // ✅ LOG DE SUCESSO
    console.log('✅ Groq Service Response:', {
      responseLength: data.response.length,
      timestamp: new Date().toISOString()
    });
    
    // Retornar conteúdo da mensagem
    return data.response;
    
  } catch (error) {
    console.error('❌ Erro no Groq Service:', error);
    throw error;
  }
}

/**
 * Gera resposta com streaming (para mostrar texto aparecendo aos poucos)
 * @param {Array} messages - Array de mensagens
 * @param {Function} onChunk - Callback para cada chunk de texto
 * @returns {Promise<string>} - Texto completo
 */
export async function sendMessageToGroqStream(messages, onChunk) {
  try {
    // Streaming não suportado via API serverless por enquanto
    // Usar método normal e simular streaming

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao comunicar com API');
    }

    const data = await response.json();
    const fullText = data.response;
    
    // Simular streaming dividindo o texto
    const words = fullText.split(' ');
    for (const word of words) {
      onChunk(word + ' ');
      await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay
    }

    return fullText;
    
  } catch (error) {
    console.error('Erro no Groq Stream:', error);
    throw error;
  }
}

/**
 * Modelos disponíveis no Groq
 * PRIMARY: GPT-OSS-120B para raciocínio principal
 */
export const GROQ_MODELS = {
  GPT_OSS_120B: 'openai/gpt-oss-120b', // PRIMARY - Raciocínio avançado
  GPT_OSS_20B: 'openai/gpt-oss-20b',   // Alternativo
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',  // Alternativo
  // Llama models mantidos apenas para compatibilidade (não devem ser primários)
  LLAMA_70B: 'llama-3.3-70b-versatile',
  LLAMA_8B: 'llama-3.1-8b-instant',
};

// Modelo padrão/primário
export const DEFAULT_MODEL = GROQ_MODELS.GPT_OSS_120B;

const groqService = {
  sendMessageToGroq,
  sendMessageToGroqStream,
  GROQ_MODELS,
  DEFAULT_MODEL,
};

export default groqService;

