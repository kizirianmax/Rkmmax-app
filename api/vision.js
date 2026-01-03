/**
 * API de Análise de Imagem usando Gemini 1.5 Flash
 * Endpoint: /api/vision
 * 
 * Compatível com Vercel Serverless
 */

async function analyzeWithGemini(imageBase64, apiKey) {
  // Remover prefixo data:image/...;base64, se existir
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
                  data: base64Data
                }
              },
              {
                text: 'Analise esta imagem detalhadamente em português brasileiro. Descreva o que você vê, incluindo objetos, pessoas, texto, cores, contexto e qualquer informação relevante. Seja detalhado mas conciso.'
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024
        }
      })
    }
  );

  // Ler o body apenas uma vez
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Gemini Vision error: ${data.error?.message || JSON.stringify(data)}`);
  }

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response: ' + JSON.stringify(data));
  }

  return data.candidates[0].content.parts[0].text;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    console.log('🖼️ Recebendo imagem para análise...');

    // Prioridade: GERMINI_API_KEY (configurado no projeto) > GEMINI_API_KEY > GOOGLE_API_KEY
    const apiKey = process.env.GERMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log('🔑 API Key encontrada:', apiKey ? 'SIM (primeiros 10 chars: ' + apiKey.substring(0, 10) + '...)' : 'NÃO');
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key não configurada',
        hint: 'Configure GERMINI_API_KEY no Vercel'
      });
    }

    const description = await analyzeWithGemini(imageBase64, apiKey);
    console.log('✅ Análise concluída:', description.substring(0, 100) + '...');

    return res.status(200).json({
      success: true,
      description: description.trim()
    });

  } catch (error) {
    console.error('❌ Erro na análise de imagem:', error.message);
    return res.status(500).json({
      error: 'Erro ao analisar imagem',
      message: error.message
    });
  }
};
