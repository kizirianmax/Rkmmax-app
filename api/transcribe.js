/**
 * API de Transcrição de Áudio usando Gemini 2.0 Flash
 * Endpoint: /api/transcribe
 * 
 * Compatível com Vercel Serverless (ESM)
 */

export const config = {
  api: {
    bodyParser: false,
  },
};

async function transcribeWithGemini(audioBase64, apiKey, mimeType = 'audio/webm') {
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
                  data: audioBase64
                }
              },
              {
                text: 'Transcreva este áudio em português brasileiro. Retorne APENAS o texto transcrito, sem explicações ou comentários.'
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024
        }
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

// Função para parsear multipart form data manualmente
async function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';
      
      // Extrair boundary do content-type
      const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
      if (!boundaryMatch) {
        reject(new Error('No boundary found'));
        return;
      }
      
      const boundary = boundaryMatch[1] || boundaryMatch[2];
      const boundaryBuffer = Buffer.from(`--${boundary}`);
      
      // Encontrar as partes
      const parts = [];
      let start = 0;
      let idx;
      
      while ((idx = buffer.indexOf(boundaryBuffer, start)) !== -1) {
        if (start > 0) {
          // Pegar o conteúdo entre os boundaries
          const partBuffer = buffer.slice(start, idx - 2); // -2 para remover \r\n
          parts.push(partBuffer);
        }
        start = idx + boundaryBuffer.length + 2; // +2 para pular \r\n
      }
      
      // Processar cada parte
      for (const part of parts) {
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1) continue;
        
        const headers = part.slice(0, headerEnd).toString();
        const content = part.slice(headerEnd + 4);
        
        // Verificar se é o arquivo de áudio
        if (headers.includes('name="audio"') || headers.includes('filename=')) {
          // Extrair mime type
          const mimeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
          const mimeType = mimeMatch ? mimeMatch[1].trim() : 'audio/webm';
          
          resolve({
            buffer: content,
            mimeType: mimeType
          });
          return;
        }
      }
      
      reject(new Error('No audio file found in form data'));
    });
    
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
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
    console.log('📝 Recebendo áudio para transcrição...');

    const apiKey = process.env.GEMINI_API_KEY || process.env.GERMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key não configurada',
        hint: 'Configure GEMINI_API_KEY ou GOOGLE_API_KEY'
      });
    }

    // Parsear o form data
    const { buffer, mimeType } = await parseMultipartForm(req);
    console.log(`✅ Áudio recebido: ${buffer.length} bytes (${mimeType})`);

    // Converter para base64
    const audioBase64 = buffer.toString('base64');
    console.log('🔄 Iniciando transcrição com Gemini...');

    // Transcrever com Gemini
    const transcript = await transcribeWithGemini(audioBase64, apiKey, mimeType);
    console.log('✅ Transcrição bem-sucedida:', transcript);

    return res.status(200).json({
      success: true,
      transcript: transcript.trim(),
      text: transcript.trim()
    });

  } catch (error) {
    console.error('❌ Erro na transcrição:', error);
    return res.status(500).json({
      error: 'Erro na transcrição',
      message: error.message
    });
  }
}
