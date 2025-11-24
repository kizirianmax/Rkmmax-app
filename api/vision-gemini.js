/**
 * API de Análise de Imagem usando Gemini 2.0 Flash
 * Endpoint: /api/vision
 * Fallback: Groq (não suporta imagens, então apenas Gemini)
 */

async function analyzeImageWithGemini(imageBase64, prompt, apiKey) {
  // Remover data URL prefix se existir
  let cleanBase64 = imageBase64;
  if (imageBase64.startsWith('data:')) {
    cleanBase64 = imageBase64.split(',')[1];
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini vision error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response');
  }

  return data.candidates[0].content.parts[0].text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY não configurada');
      return res.status(500).json({
        error: 'Chave da API não configurada',
        message: 'Configure GEMINI_API_KEY nas variáveis de ambiente do Vercel'
      });
    }

    const { imageBase64, prompt } = req.body;

    if (!imageBase64 || (typeof imageBase64 === 'string' && imageBase64.trim() === '')) {
      return res.status(400).json({ error: 'Imagem inválida ou vazia' });
    }

    // Validar tamanho da imagem (máx 20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (imageBase64.length > MAX_SIZE) {
      return res.status(400).json({ error: 'Imagem muito grande (máximo 20MB)' });
    }

    // Prompt padrão se não fornecido
    const userPrompt = prompt || 'Descreva esta imagem em detalhes em português.';

    // Analisar imagem com Gemini
    let description = null;
    let usedProvider = 'gemini';

    try {
      description = await analyzeImageWithGemini(imageBase64, userPrompt, GEMINI_API_KEY);
      console.log('✅ Análise de imagem concluída com Gemini');
    } catch (error) {
      console.error('❌ Gemini vision failed:', error.message);
      throw error;
    }

    // Retornar descrição
    return res.status(200).json({
      success: true,
      description: description,
      model: 'gemini-2.0-flash',
      provider: usedProvider
    });

  } catch (error) {
    console.error('❌ Erro na análise de imagem:', error);
    return res.status(500).json({
      error: 'Erro ao analisar imagem',
      message: error.message
    });
  }
}

