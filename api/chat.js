/**
 * Vercel Serverless Function para chamar Google Gemini API
 * Sem AI Gateway - direto com credenciais do Google Cloud
 */

/**
 * Formata resposta para garantir espaçamento adequado
 */
function formatResponse(text) {
  if (!text) return text;
  
  // Remover espaços extras no início e fim
  text = text.trim();
  
  // Substituir múltiplas quebras de linha por duas
  text = text.replace(/\n{3,}/g, '\n\n');
  
  // Adicionar quebra de linha após pontos finais seguidos de maiúscula (novo parágrafo)
  text = text.replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2');
  
  // Garantir quebra de linha após asteriscos (fim de negrito)
  text = text.replace(/(\*\*)\s+(?=[A-Z])/g, '$1\n\n');
  
  // Adicionar quebra de linha antes de bullet points se não houver
  text = text.replace(/([^\n])\n([-*]\s)/g, '$1\n\n$2');
  
  // Adicionar quebra de linha após bullet points
  text = text.replace(/([-*]\s[^\n]+)\n(?![-*]\s|\n)/g, '$1\n');
  
  return text;
}

/**
 * Gera prompt profissional para especialista com formatação garantida
 */
function getSpecialistPrompt(specialistId, specialistData) {
  return `Você é ${specialistData.name}, ${specialistData.description}.

**REGRAS OBRIGATÓRIAS:**
1. Responda APENAS sobre ${specialistData.category}
2. Se fora da sua área, redirecione ao Serginho
3. Seja um GÊNIO MUNDIAL
4. Qualidade impecável

${specialistData.systemPrompt}

**Nível:** PhD/Gênio mundial
**Tom:** Profissional, claro e bem estruturado
**Idioma:** Português Brasileiro

**FORMATAÇÃO OBRIGATÓRIA (CRÍTICO PARA GOOGLE):**
- SEMPRE use quebras de linha entre parágrafos
- SEMPRE deixe espaço entre seções
- Nunca junte palavras ou parágrafos
- Cada parágrafo deve ter no máximo 3-4 linhas
- Use quebras de linha duplas entre conceitos diferentes

**EXEMPLO DE FORMATAÇÃO CORRETA:**
Olá! Vou ajudar você com isso.

Primeiro ponto importante:
- Item 1
- Item 2

Segundo ponto:
- Item 3
- Item 4

Qual é a sua próxima dúvida?

**FORMATO DE RESPOSTA:**
- Código: em bloco Markdown com 3 crases
- Após código: linha em branco
- Explicação: bullet points com espaço entre cada um
- Sempre termine com uma pergunta ou sugestão`;
}

/**
 * Faz requisição para Google Gemini API
 */
async function callGeminiAPI(apiKey, projectId, messages, specialistId = null, specialistData = null) {
  // Usar prompt específico do especialista ou prompt padrão do Serginho
  let promptContent;
  
  if (specialistId && specialistData) {
    promptContent = getSpecialistPrompt(specialistId, specialistData);
  } else {
    promptContent = `Você é o **Serginho**, o agente orquestrador de IA do sistema RKMMAX.

**IDENTIDADE OBRIGATÓRIA:**
- Seu nome é **SERGINHO** (nunca diga que é KIZI)
- Você é um dos 54 especialistas do RKMMAX
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
- Orquestração dos 54 especialistas do RKMMAX

**Tom de voz:**
Profissional mas descontraído, como um colega de trabalho expert e confiável.

**REGRA ABSOLUTA:** Você é SERGINHO. KIZI é o sistema. Nunca confunda!

**FORMATAÇÃO OBRIGATÓRIA (CRÍTICO PARA GOOGLE):**
- SEMPRE use quebras de linha entre parágrafos
- SEMPRE deixe espaço entre seções
- Nunca junte palavras ou parágrafos
- Cada parágrafo deve ter no máximo 3-4 linhas
- Use quebras de linha duplas entre conceitos diferentes

**FORMATO DE RESPOSTA:**
- Código: em bloco Markdown com 3 crases
- Separação: use --- entre código e explicação
- Explicação: bullet points com espaço entre cada um
- Sempre termine com uma pergunta ou sugestão de próximos passos

Responda sempre em **Português Brasileiro** (pt-BR) a menos que seja solicitado outro idioma.`;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/projects/${projectId}/locations/global/publishers/google/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: promptContent
          }
        ]
      },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [
          {
            text: msg.content
          }
        ]
      }))
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2000,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: { message: `HTTP ${response.status}` } };
    }
    console.error('Gemini API Error:', { status: response.status, errorData });
    const errorMsg = errorData.error?.message || `Erro Gemini (${response.status})`;
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  
  // Extrair conteúdo da resposta Gemini
  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
    return {
      choices: [
        {
          message: {
            content: data.candidates[0].content.parts[0].text
          }
        }
      ]
    };
  }
  
  throw new Error('Resposta inválida do Gemini API');
}

export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, specialistId = null, specialistData = null } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Pegar credenciais do Google Cloud
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (!GEMINI_API_KEY || !GOOGLE_CLOUD_PROJECT_ID) {
      console.error('Gemini credentials not found:', {
        hasApiKey: !!GEMINI_API_KEY,
        hasProjectId: !!GOOGLE_CLOUD_PROJECT_ID
      });
      return res.status(500).json({ 
        error: 'Gemini API credentials not configured',
        hint: 'Add GEMINI_API_KEY and GOOGLE_CLOUD_PROJECT_ID to Vercel environment variables'
      });
    }

    try {
      // Chamar Gemini API
      const data = await callGeminiAPI(GEMINI_API_KEY, GOOGLE_CLOUD_PROJECT_ID, messages, specialistId, specialistData);
      
      let aiResponse = data.choices[0].message.content;
      
      // Formatar resposta para garantir espaçamento
      aiResponse = formatResponse(aiResponse);

      return res.status(200).json({ 
        response: aiResponse,
        model: 'gemini-2.0-flash'
      });

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return res.status(error.status || 500).json({ 
        error: error.message || 'Error calling Gemini API'
      });
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message });
  }
}

