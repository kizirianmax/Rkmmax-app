/**
 * 🍌 NANO BANANA - Gerador de Imagens RKMMAX
 * 
 * Sistema de geração de imagens usando Google Imagen API
 * Integrado com a mesma API key do Gemini
 * 
 * Uso: POST /api/image-generate
 * Body: { prompt: "descrição da imagem", style?: "realistic|anime|artistic" }
 */

/**
 * Gerar imagem usando Google Imagen 3 (via Gemini API)
 */
async function generateWithGoogleImagen(prompt, apiKey) {
  console.log('🍌 Nano Banana: Usando Google Imagen 3...');
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt
          }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: '1:1',
          safetyFilterLevel: 'block_some',
          personGeneration: 'allow_adult'
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Google Imagen error:', error);
    throw new Error(`Google Imagen error: ${error}`);
  }

  const data = await response.json();
  
  if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
    return {
      image: data.predictions[0].bytesBase64Encoded,
      format: 'base64',
      mimeType: data.predictions[0].mimeType || 'image/png',
      provider: 'google-imagen',
      model: 'imagen-3.0-generate-002'
    };
  }
  
  throw new Error('Google Imagen: Nenhuma imagem gerada');
}

/**
 * Fallback: Gerar imagem usando Gemini 2.0 Flash (experimental image generation)
 */
async function generateWithGeminiFlash(prompt, apiKey) {
  console.log('🍌 Nano Banana: Usando Gemini 2.0 Flash (experimental)...');
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate an image: ${prompt}`
          }]
        }],
        generationConfig: {
          responseModalities: ['image', 'text'],
          responseMimeType: 'image/png'
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini Flash error: ${error}`);
  }

  const data = await response.json();
  
  // Procurar por imagem na resposta
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    const parts = data.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return {
          image: part.inlineData.data,
          format: 'base64',
          mimeType: part.inlineData.mimeType || 'image/png',
          provider: 'gemini-flash',
          model: 'gemini-2.0-flash-exp'
        };
      }
    }
  }
  
  throw new Error('Gemini Flash: Nenhuma imagem gerada');
}

/**
 * Fallback: Usar Together AI se disponível
 */
async function generateWithTogether(prompt, apiKey) {
  console.log('🍌 Nano Banana: Usando Together AI (Flux Schnell)...');
  
  const response = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell-Free',
      prompt: prompt,
      width: 1024,
      height: 1024,
      steps: 4,
      n: 1,
      response_format: 'b64_json'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Together AI error: ${error}`);
  }

  const data = await response.json();
  
  if (data.data && data.data[0]) {
    return {
      image: data.data[0].b64_json,
      format: 'base64',
      mimeType: 'image/png',
      provider: 'together-ai',
      model: 'FLUX.1-schnell'
    };
  }
  
  throw new Error('Together AI: Nenhuma imagem gerada');
}

/**
 * Melhorar prompt para geração de imagens
 */
function enhancePrompt(prompt, style = 'realistic') {
  const styleEnhancements = {
    realistic: 'highly detailed, photorealistic, 8k resolution, professional photography, sharp focus, natural lighting',
    anime: 'anime style, vibrant colors, detailed illustration, studio ghibli inspired, high quality anime art',
    artistic: 'artistic, painterly, masterpiece, trending on artstation, beautiful composition, dramatic lighting',
    '3d': '3D render, octane render, unreal engine 5, highly detailed, volumetric lighting, ray tracing',
    minimal: 'minimalist, clean design, simple composition, elegant, modern aesthetic',
    cartoon: 'cartoon style, colorful, fun, playful, digital art',
    sketch: 'pencil sketch, hand drawn, detailed linework, artistic sketch'
  };
  
  const enhancement = styleEnhancements[style] || styleEnhancements.realistic;
  return `${prompt}, ${enhancement}`;
}

/**
 * Handler principal
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
    const { prompt, style = 'realistic', provider: preferredProvider } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt é obrigatório',
        hint: 'Envie { "prompt": "descrição da imagem" }',
        nanoBanana: '🍌 Nano Banana precisa de um prompt!'
      });
    }

    console.log(`🍌 Nano Banana: Gerando imagem...`);
    console.log(`📝 Prompt: ${prompt}`);
    console.log(`🎨 Estilo: ${style}`);

    // Melhorar prompt
    const enhancedPrompt = enhancePrompt(prompt, style);
    console.log(`✨ Prompt melhorado: ${enhancedPrompt}`);

    // Verificar APIs disponíveis
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GERMINI_API_KEY;
    const togetherKey = process.env.TOGETHER_API_KEY;

    // Lista de providers para tentar
    const providers = [];
    
    // Ordem: Google Imagen > Gemini Flash > Together AI
    if (geminiKey) {
      providers.push({ 
        name: 'google-imagen', 
        fn: () => generateWithGoogleImagen(enhancedPrompt, geminiKey) 
      });
      providers.push({ 
        name: 'gemini-flash', 
        fn: () => generateWithGeminiFlash(enhancedPrompt, geminiKey) 
      });
    }
    
    if (togetherKey) {
      providers.push({ 
        name: 'together', 
        fn: () => generateWithTogether(enhancedPrompt, togetherKey) 
      });
    }

    if (providers.length === 0) {
      return res.status(500).json({
        error: 'Nenhum provider de imagem configurado',
        hint: 'Configure GEMINI_API_KEY ou TOGETHER_API_KEY',
        nanoBanana: '🍌 Nano Banana precisa de uma API key para funcionar!'
      });
    }

    // Tentar cada provider em ordem
    let lastError = null;
    for (const provider of providers) {
      try {
        console.log(`🍌 Tentando provider: ${provider.name}...`);
        const result = await provider.fn();
        
        console.log(`✅ Imagem gerada com sucesso via ${provider.name}!`);
        
        return res.status(200).json({
          success: true,
          ...result,
          prompt: prompt,
          enhancedPrompt: enhancedPrompt,
          style: style,
          nanoBanana: '🍌 Imagem gerada pelo Nano Banana!'
        });
      } catch (error) {
        console.error(`❌ ${provider.name} falhou:`, error.message);
        lastError = error;
      }
    }

    // Todos os providers falharam
    return res.status(500).json({
      error: 'Falha ao gerar imagem',
      message: lastError?.message || 'Todos os providers falharam',
      nanoBanana: '🍌 Nano Banana não conseguiu gerar a imagem',
      hint: 'Verifique se a API key do Gemini tem acesso ao Imagen'
    });

  } catch (error) {
    console.error('❌ Nano Banana error:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: error.message,
      nanoBanana: '🍌 Erro no Nano Banana'
    });
  }
}
