/**
 * API de Transcrição de Áudio - RKMMAX
 * Endpoint: /api/transcribe
 *
 * Usa Gemini 2.0 Flash como primário e Groq Whisper como fallback
 * Compatível com Vercel Serverless (ESM)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Transcrição com Gemini 2.0 Flash usando SDK oficial
async function transcribeWithGemini(audioBase64, apiKey, mimeType = "audio/webm") {
  console.log("🔄 Tentando transcrição com Gemini 2.0 Flash...");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent({
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64,
            },
          },
          {
            text: "Transcreva este áudio em português brasileiro. Retorne APENAS o texto transcrito, sem explicações ou comentários adicionais.",
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048,
    },
  });

  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Resposta inválida do Gemini - sem texto");
  }

  return text.trim();
}

// Transcrição com Groq Whisper (fallback confiável)
async function transcribeWithGroq(audioBuffer, apiKey, mimeType = "audio/webm") {
  console.log("🔄 Tentando transcrição com Groq Whisper...");

  // Criar FormData para enviar o arquivo
  const formData = new FormData();

  // Determinar extensão do arquivo
  const ext = mimeType.includes("webm")
    ? "webm"
    : mimeType.includes("mp3")
      ? "mp3"
      : mimeType.includes("wav")
        ? "wav"
        : mimeType.includes("m4a")
          ? "m4a"
          : "webm";

  // Criar Blob do áudio
  const audioBlob = new Blob([audioBuffer], { type: mimeType });
  formData.append("file", audioBlob, `audio.${ext}`);
  formData.append("model", "whisper-large-v3");
  formData.append("language", "pt");
  formData.append("response_format", "json");

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq Whisper error: ${error}`);
  }

  const data = await response.json();
  return data.text?.trim() || "";
}

// Função para parsear multipart form data manualmente
async function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers["content-type"] || "";

      // Extrair boundary do content-type
      const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
      if (!boundaryMatch) {
        reject(new Error("No boundary found in content-type"));
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
          const partBuffer = buffer.slice(start, idx - 2);
          parts.push(partBuffer);
        }
        start = idx + boundaryBuffer.length + 2;
      }

      // Processar cada parte
      for (const part of parts) {
        const headerEnd = part.indexOf("\r\n\r\n");
        if (headerEnd === -1) continue;

        const headers = part.slice(0, headerEnd).toString();
        const content = part.slice(headerEnd + 4);

        if (headers.includes('name="audio"') || headers.includes("filename=")) {
          const mimeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
          const mimeType = mimeMatch ? mimeMatch[1].trim() : "audio/webm";

          resolve({
            buffer: content,
            mimeType: mimeType,
          });
          return;
        }
      }

      reject(new Error("Nenhum arquivo de áudio encontrado no form data"));
    });

    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📝 Recebendo áudio para transcrição...");

    // Obter API keys
    const geminiKey =
      process.env.GEMINI_API_KEY || process.env.GERMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!geminiKey && !groqKey) {
      return res.status(500).json({
        error: "Nenhuma API key configurada",
        hint: "Configure GEMINI_API_KEY, GOOGLE_API_KEY ou GROQ_API_KEY",
      });
    }

    // Parsear o form data
    const { buffer, mimeType } = await parseMultipartForm(req);
    console.log(`✅ Áudio recebido: ${buffer.length} bytes (${mimeType})`);

    let transcript = null;
    let usedEngine = null;
    const errors = [];

    // Tentar Gemini primeiro (se disponível)
    if (geminiKey) {
      try {
        const audioBase64 = buffer.toString("base64");
        transcript = await transcribeWithGemini(audioBase64, geminiKey, mimeType);
        usedEngine = "Gemini 2.0 Flash";
        console.log("✅ Transcrição Gemini bem-sucedida");
      } catch (geminiError) {
        console.warn("⚠️ Gemini falhou:", geminiError.message);
        errors.push(`Gemini: ${geminiError.message}`);
      }
    }

    // Fallback para Groq Whisper
    if (!transcript && groqKey) {
      try {
        transcript = await transcribeWithGroq(buffer, groqKey, mimeType);
        usedEngine = "Groq Whisper";
        console.log("✅ Transcrição Groq bem-sucedida");
      } catch (groqError) {
        console.error("❌ Groq também falhou:", groqError.message);
        errors.push(`Groq: ${groqError.message}`);
      }
    }

    // Se nenhum funcionou
    if (!transcript) {
      return res.status(500).json({
        error: "Falha na transcrição",
        message: "Todos os motores de transcrição falharam",
        details: errors,
      });
    }

    return res.status(200).json({
      success: true,
      transcript: transcript,
      text: transcript,
      engine: usedEngine,
    });
  } catch (error) {
    console.error("❌ Erro na transcrição:", error);
    return res.status(500).json({
      error: "Erro na transcrição",
      message: error.message,
    });
  }
}
