/**
 * API de Transcrição de Áudio usando Gemini 2.0 Flash
 * Endpoint: /api/transcribe
 * Fallback: Groq (se Gemini falhar)
 */

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
                  mimeType: 'audio/wav',
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

async function transcribeWithGroq(audioBase64, apiKey) {
  // Groq não suporta áudio diretamente, então usamos como fallback apenas se Gemini falhar
  // Neste caso, retornamos um erro indicando que Groq não pode processar áudio
  throw new Error('Groq does not support audio transcription. Use Gemini.');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY não configurada');
      return res.status(500).json({
        error: 'Chave da API não configurada',
        message: 'Configure GEMINI_API_KEY nas variáveis de ambiente do Vercel'
      });
    }

    // Receber o áudio do FormData
    let formData;
    try {
      formData = await req.formData();
    } catch (err) {
      return res.status(400).json({ error: 'Erro ao processar FormData', details: err.message });
    }

    const audioFile = formData.get('audio');

    if (!audioFile || audioFile.size === 0) {
      return res.status(400).json({ error: 'Áudio inválido ou vazio' });
    }

    // Validar tamanho do arquivo (máx 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (audioFile.size > MAX_SIZE) {
      return res.status(400).json({ error: 'Áudio muito grande (máximo 25MB)' });
    }

    // Converter áudio para base64
    const buffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(buffer).toString('base64');

    // Tentar transcrever com Gemini primeiro
    let text = null;
    let usedProvider = 'gemini';

    try {
      text = await transcribeWithGemini(audioBase64, GEMINI_API_KEY);
      console.log('✅ Transcrição concluída com Gemini');
    } catch (error) {
      console.error('❌ Gemini transcription failed:', error.message);

      // Groq não suporta áudio, então retornar erro
      return res.status(500).json({
        error: 'Erro ao transcrever áudio',
        message: error.message,
        hint: 'Gemini é necessário para transcrição de áudio'
      });
    }

    // Retornar texto transcrito
    return res.status(200).json({
      success: true,
      text: text,
      language: 'pt',
      provider: usedProvider
    });

  } catch (error) {
    console.error('❌ Erro na transcrição:', error);
    return res.status(500).json({
      error: 'Erro ao transcrever áudio',
      message: error.message
    });
  }
}

