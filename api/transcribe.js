/**
 * API de Transcrição de Áudio usando Gemini 2.0 Flash
 * Endpoint: /api/transcribe
 * Fallback: Groq (se Gemini falhar)
 * 
 * Compatível com Vercel Serverless
 */

const busboy = require('busboy');

async function transcribeWithGemini(audioBase64, apiKey) {
  try {
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
                  text: 'Transcreva este áudio em português. Retorne APENAS o texto transcrito, sem explicações ou pontuação adicional.'
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini error:', error);
      throw new Error(`Gemini: ${error.error?.message || 'Transcription failed'}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Gemini response:', data);
      throw new Error('No text in response');
    }

    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Gemini transcription error:', error.message);
    throw error;
  }
}

async function transcribeWithGroq(audioBase64) {
  try {
    // Groq não suporta áudio diretamente, então retornamos um fallback
    console.log('Groq fallback: Audio transcription not supported');
    throw new Error('Groq does not support audio transcription');
  } catch (error) {
    console.error('Groq error:', error.message);
    throw error;
  }
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
    console.log('📥 Recebendo áudio para transcrição...');
    
    const bb = busboy({ headers: req.headers });
    let audioBuffer = null;

    bb.on('file', async (fieldname, file, info) => {
      console.log(`📁 Arquivo recebido: ${fieldname}`);
      
      const chunks = [];
      file.on('data', (data) => {
        chunks.push(data);
      });

      file.on('end', async () => {
        audioBuffer = Buffer.concat(chunks);
        console.log(`✅ Áudio recebido: ${audioBuffer.length} bytes`);
      });
    });

    bb.on('close', async () => {
      try {
        if (!audioBuffer) {
          return res.status(400).json({ error: 'No audio file provided' });
        }

        console.log('🔄 Convertendo para base64...');
        const audioBase64 = audioBuffer.toString('base64');

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
          return res.status(500).json({ error: 'Google API key not configured' });
        }

        console.log('🎤 Transcrevendo com Gemini...');
        let transcript;

        try {
          transcript = await transcribeWithGemini(audioBase64, apiKey);
          console.log('✅ Transcrição concluída:', transcript);
        } catch (geminiError) {
          console.warn('⚠️ Gemini falhou, tentando fallback...');
          try {
            transcript = await transcribeWithGroq(audioBase64);
          } catch (groqError) {
            console.error('❌ Todos os fallbacks falharam');
            return res.status(500).json({ 
              error: 'Transcription failed',
              details: geminiError.message 
            });
          }
        }

        return res.status(200).json({
          success: true,
          transcript: transcript,
          text: transcript,
          duration: audioBuffer.length
        });
      } catch (error) {
        console.error('❌ Erro ao processar áudio:', error.message);
        return res.status(500).json({ 
          error: 'Transcription error',
          message: error.message 
        });
      }
    });

    bb.on('error', (error) => {
      console.error('❌ Erro no busboy:', error.message);
      return res.status(400).json({ error: 'Invalid request' });
    });

    req.pipe(bb);
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
