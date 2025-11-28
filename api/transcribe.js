/**
 * API de Transcrição de Áudio usando Gemini 2.0 Flash
 * Endpoint: /api/transcribe
 * Compatível com Vercel Serverless
 */

const busboy = require('busboy');

async function transcribeAudio(audioBase64, apiKey) {
  try {
    console.log('🎤 Enviando para Gemini 2.0 Flash...');
    
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

    const responseText = await response.text();
    console.log('📥 Resposta:', responseText);

    if (!response.ok) {
      console.error('Erro HTTP:', response.status, responseText);
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Resposta inválida:', data);
      throw new Error('No text in response');
    }

    const transcript = data.candidates[0].content.parts[0].text.trim();
    console.log('✅ Transcrição:', transcript);
    
    return transcript;
  } catch (error) {
    console.error('❌ Erro:', error.message);
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
    console.log('📥 Recebendo áudio...');
    
    const bb = busboy({ headers: req.headers });
    let audioBuffer = null;

    bb.on('file', (fieldname, file, info) => {
      console.log(`📁 Arquivo: ${fieldname}`);
      
      const chunks = [];
      file.on('data', (data) => {
        chunks.push(data);
      });

      file.on('end', () => {
        audioBuffer = Buffer.concat(chunks);
        console.log(`✅ Áudio: ${audioBuffer.length} bytes`);
      });
    });

    bb.on('close', async () => {
      try {
        if (!audioBuffer || audioBuffer.length === 0) {
          return res.status(400).json({ error: 'No audio file' });
        }

        const audioBase64 = audioBuffer.toString('base64');
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
          return res.status(500).json({ error: 'API key not configured' });
        }

        const transcript = await transcribeAudio(audioBase64, apiKey);

        return res.status(200).json({
          success: true,
          transcript: transcript,
          text: transcript
        });
      } catch (error) {
        console.error('❌ Erro:', error.message);
        return res.status(500).json({ 
          error: 'Transcription failed',
          message: error.message 
        });
      }
    });

    bb.on('error', (error) => {
      console.error('❌ Erro busboy:', error.message);
      return res.status(400).json({ error: 'Invalid request' });
    });

    req.pipe(bb);
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
};
