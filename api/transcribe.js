/**
 * API de Transcrição de Áudio usando Gemini 2.0 Flash
 * Endpoint: /api/transcribe
 * Fallback: Groq (se Gemini falhar)
 * 
 * Compatível com Vercel Serverless
 */

const busboy = require('busboy');

async function transcribeWithGemini(audioBase64, apiKey) {
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
                  mimeType: 'audio/mpeg',
                  data: audioBase64
                }
              },
              {
                text: 'Transcreva este áudio em português. Retorne APENAS o texto transcrito, sem explicações.'
              }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini transcription error: ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response');
  }

  return data.candidates[0].content.parts[0].text;
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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

    // Parse multipart form data
    const bb = busboy({ headers: req.headers });
    let audioBuffer = null;
    let audioMimeType = 'audio/mpeg';

    await new Promise((resolve, reject) => {
      bb.on('file', (fieldname, file, info) => {
        const chunks = [];
        
        file.on('data', (data) => {
          chunks.push(data);
        });

        file.on('end', () => {
          audioBuffer = Buffer.concat(chunks);
          audioMimeType = info.mimeType || 'audio/mpeg';
        });

        file.on('error', reject);
      });

      bb.on('error', reject);
      bb.on('close', resolve);

      req.pipe(bb);
    });

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ error: 'Áudio inválido ou vazio' });
    }

    // Validar tamanho do arquivo (máx 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (audioBuffer.length > MAX_SIZE) {
      return res.status(400).json({ error: 'Áudio muito grande (máximo 25MB)' });
    }

    // Converter áudio para base64
    const audioBase64 = audioBuffer.toString('base64');

    console.log(`📤 Transcrevendo áudio (${audioBuffer.length} bytes)...`);

    // Transcrever com Gemini
    let text = null;

    try {
      text = await transcribeWithGemini(audioBase64, GEMINI_API_KEY);
      console.log('✅ Transcrição concluída com Gemini');
    } catch (error) {
      console.error('❌ Gemini transcription failed:', error.message);
      return res.status(500).json({
        error: 'Erro ao transcrever áudio',
        message: error.message,
        hint: 'Verifique se a chave da API está configurada corretamente'
      });
    }

    // Retornar texto transcrito
    return res.status(200).json({
      success: true,
      transcript: text,
      text: text,
      language: 'pt-BR',
      provider: 'gemini-2.0-flash'
    });

  } catch (error) {
    console.error('❌ Erro na transcrição:', error);
    return res.status(500).json({
      error: 'Erro ao transcrever áudio',
      message: error.message
    });
  }
};
