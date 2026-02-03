/**
 * 👁️ Análise de Imagens com Groq Llama 3.2 90B Vision
 * Endpoint: /api/vision
 * 
 * Analisa imagens usando Groq Vision API
 */

export default async function handler(req, res) {
  // CORS
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
    const { prompt, imageBase64, imageUrl } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt obrigatório',
        hint: 'Envie { "prompt": "o que tem nesta imagem?", "imageBase64": "..." }'
      });
    }

    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({
        error: 'Imagem obrigatória',
        hint: 'Envie imageBase64 ou imageUrl'
      });
    }

    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return res.status(500).json({
        error: 'GROQ_API_KEY não configurada',
        hint: 'Configure GROQ_API_KEY no Vercel: Settings → Environment Variables'
      });
    }

    console.log('👁️ Analisando imagem com Groq Llama Vision...');

    // Construir mensagens
    const content = [
      { type: 'text', text: prompt }
    ];

    if (imageUrl) {
      content.push({
        type: 'image_url',
        image_url: { url: imageUrl }
      });
    } else if (imageBase64) {
      // Detectar formato da imagem
      const mimeType = imageBase64.startsWith('data:') 
        ? imageBase64.split(';')[0].split(':')[1]
        : 'image/jpeg';
      
      const base64Data = imageBase64.startsWith('data:')
        ? imageBase64
        : `data:${mimeType};base64,${imageBase64}`;
      
      content.push({
        type: 'image_url',
        image_url: { url: base64Data }
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq Vision error: ${error}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      analysis,
      provider: 'groq-vision',
      model: 'llama-3.2-90b-vision-preview'
    });

  } catch (error) {
    console.error('❌ Erro na análise de imagem:', error);
    return res.status(500).json({
      error: 'Erro ao analisar imagem',
      message: error.message
    });
  }
}
