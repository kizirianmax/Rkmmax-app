/**
 * API de Análise de Imagem usando Gemini 2.0 Flash Vision
 * Endpoint: /api/vision
 * 
 * Compatível com Vercel Serverless
 */
const busboy = require('busboy');

async function analyzeImageWithGemini(imageBase64, mimeType, apiKey) {
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
                  mimeType: mimeType,
                  data: imageBase64
                }
              },
              {
                text: 'Analise esta imagem e descreva o que você vê em português. Se houver código, extraia-o. Seja conciso e direto.'
              }
            ]
          }
        ]
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
    console.log('📸 Recebendo imagem para análise...');

    const bb = busboy({ headers: req.headers });
    let imageBuffer = null;
    let mimeType = 'image/jpeg';

    bb.on('file', (fieldname, file, info) => {
      console.log(`📁 Arquivo recebido: ${fieldname} (${info.mimeType})`);
      mimeType = info.mimeType;
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        imageBuffer = Buffer.concat(chunks);
        console.log(`✅ Imagem recebida: ${imageBuffer.length} bytes`);
      });
    });

    bb.on('close', async () => {
      if (!imageBuffer) {
        return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
      }

      try {
        const imageBase64 = imageBuffer.toString('base64');
        console.log('🔄 Iniciando análise com Gemini Vision...');

        const description = await analyzeImageWithGemini(imageBase64, mimeType, process.env.GOOGLE_API_KEY);
        console.log('✅ Análise bem-sucedida:', description);

        return res.status(200).json({
          success: true,
          description: description.trim(),
          text: description.trim()
        });
      } catch (error) {
        console.error('❌ Erro na análise:', error);
        return res.status(500).json({
          error: 'Erro ao processar imagem',
          message: error.message
        });
      }
    });

    req.pipe(bb);
  } catch (error) {
    console.error('❌ Erro ao processar requisição:', error);
    return res.status(500).json({
      error: 'Erro ao processar imagem',
      message: error.message
    });
  }
};
