/**
 * MULTIMODAL API
 * Endpoints para processamento de áudio e imagem
 * Vercel Serverless Function
 */

const MultimodalProcessor = require('../src/automation/MultimodalProcessor');

const processor = new MultimodalProcessor();

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // POST: Processar áudio
    if (req.method === 'POST' && req.body.action === 'process-audio') {
      const { audio, format = 'mp3' } = req.body;

      if (!audio) {
        return res.status(400).json({
          error: 'Áudio é obrigatório',
        });
      }

      // Validar arquivo
      const validation = processor.validateAudioFile(`file.${format}`, audio.length);
      if (!validation.valid) {
        return res.status(400).json({
          error: validation.error,
        });
      }

      const result = await processor.processAudio(Buffer.from(audio, 'base64'), format);

      return res.status(200).json({
        success: true,
        result,
      });
    }

    // POST: Processar imagem
    if (req.method === 'POST' && req.body.action === 'process-image') {
      const { image, format = 'png' } = req.body;

      if (!image) {
        return res.status(400).json({
          error: 'Imagem é obrigatória',
        });
      }

      // Validar arquivo
      const validation = processor.validateImageFile(`file.${format}`, image.length);
      if (!validation.valid) {
        return res.status(400).json({
          error: validation.error,
        });
      }

      const result = await processor.processImage(Buffer.from(image, 'base64'), format);

      return res.status(200).json({
        success: true,
        result,
      });
    }

    // POST: Extrair texto de imagem
    if (req.method === 'POST' && req.body.action === 'extract-text') {
      const { image, format = 'png' } = req.body;

      if (!image) {
        return res.status(400).json({
          error: 'Imagem é obrigatória',
        });
      }

      const result = await processor.extractTextFromImage(Buffer.from(image, 'base64'), format);

      return res.status(200).json({
        success: true,
        result,
      });
    }

    // POST: Descrever imagem
    if (req.method === 'POST' && req.body.action === 'describe-image') {
      const { image, format = 'png' } = req.body;

      if (!image) {
        return res.status(400).json({
          error: 'Imagem é obrigatória',
        });
      }

      const result = await processor.describeImage(Buffer.from(image, 'base64'), format);

      return res.status(200).json({
        success: true,
        result,
      });
    }

    // POST: Detectar código em imagem
    if (req.method === 'POST' && req.body.action === 'detect-code') {
      const { image, format = 'png' } = req.body;

      if (!image) {
        return res.status(400).json({
          error: 'Imagem é obrigatória',
        });
      }

      const result = await processor.detectCodeInImage(Buffer.from(image, 'base64'), format);

      return res.status(200).json({
        success: true,
        result,
      });
    }

    // POST: Processar multimodal
    if (req.method === 'POST' && req.body.action === 'process-multimodal') {
      const { audio, image, audioFormat = 'mp3', imageFormat = 'png' } = req.body;

      if (!audio && !image) {
        return res.status(400).json({
          error: 'Forneça áudio e/ou imagem',
        });
      }

      const inputs = {};

      if (audio) {
        inputs.audio = {
          buffer: Buffer.from(audio, 'base64'),
          format: audioFormat,
        };
      }

      if (image) {
        inputs.image = {
          buffer: Buffer.from(image, 'base64'),
          format: imageFormat,
        };
      }

      const result = await processor.processMultimodal(inputs);

      return res.status(200).json({
        success: true,
        result,
      });
    }

    // GET: Informações de suporte
    if (req.method === 'GET' && req.query.action === 'support-info') {
      const info = processor.getSupportInfo();

      return res.status(200).json({
        success: true,
        info,
      });
    }

    return res.status(400).json({
      error: 'Ação não reconhecida',
      availableActions: [
        'process-audio',
        'process-image',
        'extract-text',
        'describe-image',
        'detect-code',
        'process-multimodal',
        'support-info',
      ],
    });
  } catch (error) {
    console.error('❌ Erro no processamento multimodal:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro ao processar entrada multimodal',
      message: error.message,
    });
  }
}

module.exports = handler;
