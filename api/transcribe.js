/**
 * API de Transcrição de Áudio usando Google Cloud Speech-to-Text
 * Endpoint: /api/transcribe
 * Compatível com Vercel Serverless
 */

const busboy = require('busboy');

async function transcribeWithGoogleSpeech(audioBase64, apiKey) {
  try {
    console.log('🎤 Enviando para Google Speech-to-Text...');
    
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            encoding: 'MP3',
            sampleRateHertz: 16000,
            languageCode: 'pt-BR',
            enableAutomaticPunctuation: true,
            model: 'latest_long',
            useEnhanced: true
          },
          audio: {
            content: audioBase64
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Google Speech error:', error);
      throw new Error(`Google Speech: ${error.error?.message || 'Transcription failed'}`);
    }

    const data = await response.json();
    console.log('✅ Resposta Google:', data);
    
    if (!data.results?.[0]?.alternatives?.[0]?.transcript) {
      console.error('No transcript found:', data);
      throw new Error('No transcript in response');
    }

    const transcript = data.results[0].alternatives[0].transcript.trim();
    console.log('✅ Transcrição:', transcript);
    
    return transcript;
  } catch (error) {
    console.error('❌ Google Speech error:', error.message);
    throw error;
  }
}

async function transcribeWithGemini(audioBase64, apiKey) {
  try {
    console.log('🎤 Enviando para Gemini (fallback)...');
    
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
                  text: 'Transcreva este áudio em português. Retorne APENAS o texto transcrito.'
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
      throw new Error('No text in Gemini response');
    }

    const transcript = data.candidates[0].content.parts[0].text.trim();
    console.log('✅ Transcrição Gemini:', transcript);
    
    return transcript;
  } catch (error) {
    console.error('❌ Gemini error:', error.message);
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
      console.log(`📁 Arquivo recebido: ${fieldname}, tipo: ${info.mimeType}`);
      
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

        console.log('🎤 Iniciando transcrição...');
        let transcript;

        try {
          // Tenta Google Speech-to-Text primeiro
          transcript = await transcribeWithGoogleSpeech(audioBase64, apiKey);
          console.log('✅ Sucesso com Google Speech');
        } catch (googleError) {
          console.warn('⚠️ Google Speech falhou, tentando Gemini...');
          try {
            // Fallback para Gemini
            transcript = await transcribeWithGemini(audioBase64, apiKey);
            console.log('✅ Sucesso com Gemini (fallback)');
          } catch (geminiError) {
            console.error('❌ Ambos os serviços falharam');
            return res.status(500).json({ 
              error: 'Transcription failed',
              details: `Google: ${googleError.message} | Gemini: ${geminiError.message}`
            });
          }
        }

        if (!transcript || transcript.length === 0) {
          return res.status(400).json({ 
            error: 'No speech detected',
            message: 'Nenhuma fala foi detectada no áudio. Tente novamente.'
          });
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
