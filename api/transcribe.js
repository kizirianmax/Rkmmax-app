/**
 * API de Transcrição de Áudio usando Whisper (OpenAI)
 * Endpoint: /api/transcribe
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

    // Criar FormData para enviar à API do Whisper
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioFile);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', 'pt'); // Português

    // Chamar API Whisper
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: whisperFormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro Whisper API:', errorData);
      throw new Error(errorData.error?.message || 'Erro na transcrição');
    }

    const data = await response.json();

    // Retornar texto transcrito
    return res.status(200).json({
      success: true,
      text: data.text,
      language: 'pt'
    });

  } catch (error) {
    console.error('❌ Erro na transcrição:', error);
    return res.status(500).json({
      error: 'Erro ao transcrever áudio',
      message: error.message
    });
  }
}

