/**
 * API de Análise de Imagem usando GPT-4 Vision (OpenAI)
 * Endpoint: /api/vision
 */

export default async function handler(req, res) {
  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY não configurada');
      return res.status(500).json({ 
        error: 'Chave da API não configurada',
        message: 'Configure OPENAI_API_KEY nas variáveis de ambiente do Vercel'
      });
    }

    const { imageBase64, prompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    // Prompt padrão se não fornecido
    const userPrompt = prompt || 'Descreva esta imagem em detalhes em português.';

    // Chamar API GPT-4 Vision
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modelo mais econômico com visão
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') 
                    ? imageBase64 
                    : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro GPT-4 Vision API:', errorData);
      throw new Error(errorData.error?.message || 'Erro na análise de imagem');
    }

    const data = await response.json();
    const description = data.choices[0]?.message?.content || 'Não foi possível analisar a imagem.';

    // Retornar descrição
    return res.status(200).json({
      success: true,
      description,
      model: 'gpt-4o-mini'
    });

  } catch (error) {
    console.error('❌ Erro na análise de imagem:', error);
    return res.status(500).json({
      error: 'Erro ao analisar imagem',
      message: error.message
    });
  }
}

