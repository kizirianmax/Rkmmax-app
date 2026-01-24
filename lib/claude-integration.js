/**
 * RKMMAX + Claude 4.5 Sonnet Integration
 * Integração completa para substituir Gemini por Claude
 * Suporta texto E imagens (multimodal)
 */

import Anthropic from '@anthropic-ai/sdk';

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const CLAUDE_CONFIG = {
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-sonnet-4-5-20250929',
  maxTokens: 8000,
  temperature: 0.7
};

// ============================================================================
// CLIENTE CLAUDE
// ============================================================================

class ClaudeClient {
  constructor() {
    this.client = new Anthropic({
      apiKey: CLAUDE_CONFIG.apiKey
    });
    this.requestHistory = [];
  }

  /**
   * Processa requisição de TEXTO
   */
  async processarTexto(prompt, config = {}) {
    try {
      const response = await this.client.messages.create({
        model: config.model || CLAUDE_CONFIG.model,
        max_tokens: config.maxTokens || CLAUDE_CONFIG.maxTokens,
        temperature: config.temperature || CLAUDE_CONFIG.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const resultado = {
        status: 'sucesso',
        resposta: response.content[0].text,
        tokens: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens
        },
        modelo: response.model,
        timestamp: new Date().toISOString()
      };

      this.requestHistory.push({
        tipo: 'texto',
        prompt: prompt.substring(0, 100) + '...',
        tokens: resultado.tokens,
        timestamp: resultado.timestamp
      });

      return resultado;

    } catch (error) {
      console.error('❌ Erro Claude:', error.message);
      return {
        status: 'erro',
        erro: error.message,
        tipo_erro: error.type
      };
    }
  }

  /**
   * Processa requisição com IMAGEM (multimodal)
   * Claude suporta análise de imagens!
   */
  async processarComImagem(prompt, imagemBase64, mediaType = 'image/jpeg') {
    try {
      const response = await this.client.messages.create({
        model: CLAUDE_CONFIG.model,
        max_tokens: CLAUDE_CONFIG.maxTokens,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imagemBase64
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      });

      return {
        status: 'sucesso',
        resposta: response.content[0].text,
        tokens: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens
        },
        modelo: response.model,
        tipo: 'multimodal',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erro processamento imagem:', error.message);
      return {
        status: 'erro',
        erro: error.message
      };
    }
  }

  /**
   * Conversação multi-turno (mantém contexto)
   */
  async conversacao(mensagens) {
    try {
      const mensagensFormatadas = mensagens.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await this.client.messages.create({
        model: CLAUDE_CONFIG.model,
        max_tokens: CLAUDE_CONFIG.maxTokens,
        messages: mensagensFormatadas
      });

      return {
        status: 'sucesso',
        resposta: response.content[0].text,
        tokens: response.usage
      };

    } catch (error) {
      return {
        status: 'erro',
        erro: error.message
      };
    }
  }

  /**
   * Streaming de resposta (para UX melhor)
   */
  async processarComStream(prompt, onChunk) {
    try {
      const stream = await this.client.messages.stream({
        model: CLAUDE_CONFIG.model,
        max_tokens: CLAUDE_CONFIG.maxTokens,
        messages: [{ role: 'user', content: prompt }]
      });

      let respostaCompleta = '';

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && 
            chunk.delta.type === 'text_delta') {
          const texto = chunk.delta.text;
          respostaCompleta += texto;
          
          if (onChunk) {
            onChunk(texto);
          }
        }
      }

      return {
        status: 'sucesso',
        resposta: respostaCompleta
      };

    } catch (error) {
      return {
        status: 'erro',
        erro: error.message
      };
    }
  }
}

// ============================================================================
// INTEGRAÇÃO RKMMAX - CAMADA 1: SERGINHO
// ============================================================================

class SerginhoOrquestradorClaude {
  constructor() {
    this.claude = new ClaudeClient();
  }

  async analisarRequisicao(requisicao) {
    const promptAnalise = `
Você é o Serginho, orquestrador do RKMMAX.

Analise esta requisição e retorne APENAS um JSON (sem markdown):
{
  "tipo_tarefa": "codigo|academico|criativo|analise|imagem",
  "complexidade": "baixa|media|alta",
  "especialista": "tecnico|criativo|abnt|multimodal",
  "tempo_estimado": "rapido|medio|longo",
  "requer_abnt": true|false
}

Requisição: "${requisicao}"
`;

    const resultado = await this.claude.processarTexto(promptAnalise, {
      maxTokens: 500
    });

    if (resultado.status === 'sucesso') {
      try {
        let texto = resultado.resposta.trim();
        if (texto.includes('```json')) {
          texto = texto.split('```json')[1].split('```')[0];
        } else if (texto.includes('```')) {
          texto = texto.split('```')[1].split('```')[0];
        }
        
        return JSON.parse(texto.trim());
      } catch (e) {
        return {
          tipo_tarefa: 'generico',
          complexidade: 'media',
          especialista: 'tecnico',
          tempo_estimado: 'medio',
          requer_abnt: false
        };
      }
    }

    return {
      tipo_tarefa: 'generico',
      complexidade: 'media',
      especialista: 'tecnico',
      tempo_estimado: 'medio',
      requer_abnt: false
    };
  }
}

// ============================================================================
// INTEGRAÇÃO RKMMAX - CAMADA 2: ESPECIALISTAS
// ============================================================================

class EspecialistasClaudeRKMMAX {
  constructor() {
    this.claude = new ClaudeClient();
  }

  async especialistaTecnico(tarefa, contexto = {}) {
    const prompt = `
Você é um especialista técnico do RKMMAX de nível pós-doutoral.

Tarefa: ${tarefa}

${contexto.detalhes ? `Contexto: ${JSON.stringify(contexto.detalhes)}` : ''}

Forneça resposta técnica completa com:
- Código funcional e bem documentado (se aplicável)
- Explicações profundas
- Análise de complexidade
- Melhores práticas
`;

    return await this.claude.processarTexto(prompt);
  }

  async especialistaAcademico(tarefa, contexto = {}) {
    const prompt = `
Você é um especialista acadêmico do RKMMAX.

Tarefa: ${tarefa}

${contexto.requisitos_abnt ? 'IMPORTANTE: Resposta deve seguir normas ABNT.' : ''}

Crie conteúdo acadêmico de alta qualidade com:
- Fundamentação teórica sólida
- Citações e referências apropriadas
- Linguagem formal e técnica
- Estrutura lógica
`;

    return await this.claude.processarTexto(prompt);
  }

  async especialistaMultimodal(tarefa, imagemBase64, mediaType) {
    const prompt = `
Você é um especialista em análise visual do RKMMAX.

Tarefa: ${tarefa}

Analise a imagem fornecida e forneça resposta detalhada.
`;

    return await this.claude.processarComImagem(prompt, imagemBase64, mediaType);
  }
}

// ============================================================================
// INTEGRAÇÃO RKMMAX - CAMADA 4: ABNT
// ============================================================================

class ABNTClaudeIntegrado {
  constructor() {
    this.claude = new ClaudeClient();
  }

  async formatarABNT(conteudo, tipoDocumento = 'trabalho_academico') {
    const prompt = `
Você é um especialista em normas ABNT (NBR 14724, NBR 6023, NBR 10520).

Formate este conteúdo para ${tipoDocumento} seguindo rigorosamente as normas ABNT:

${conteudo}

Inclua:
1. Formatação de texto (espaçamento, margens, fonte)
2. Estrutura correta (seções, subseções)
3. Citações no formato correto
4. Referências bibliográficas conforme NBR 6023
5. Numeração adequada

Retorne o documento completo formatado.
`;

    return await this.claude.processarTexto(prompt, {
      maxTokens: 16000
    });
  }

  async validarReferencias(referencias) {
    const prompt = `
Valide e corrija estas referências bibliográficas segundo ABNT NBR 6023:

${referencias.map((ref, i) => `${i + 1}. ${ref}`).join('\n')}

Para cada referência:
- Indique se está correta
- Forneça versão corrigida se necessário
- Explique o erro (se houver)
`;

    return await this.claude.processarTexto(prompt);
  }
}

// ============================================================================
// SISTEMA RKMMAX COMPLETO COM CLAUDE
// ============================================================================

class RKMMAXClaudeSystem {
  constructor() {
    this.serginho = new SerginhoOrquestradorClaude();
    this.especialistas = new EspecialistasClaudeRKMMAX();
    this.abnt = new ABNTClaudeIntegrado();
    this.claude = new ClaudeClient();
    
    console.log('🚀 RKMMAX + Claude 4.5 Sonnet inicializado');
    console.log('✅ Suporte a texto e imagens');
  }

  async processar(requisicao, opcoes = {}) {
    try {
      console.log('🎯 Serginho analisando...');
      const analise = await this.serginho.analisarRequisicao(requisicao);
      
      if (analise && analise.tipo_tarefa) {
        console.log(`📊 Análise: ${analise.tipo_tarefa} | ${analise.complexidade}`);
      } else {
        console.log('tipo_tarefa não encontrado');
      }

      let resultado;

      if (opcoes.imagem) {
        resultado = await this.especialistas.especialistaMultimodal(
          requisicao,
          opcoes.imagemBase64,
          opcoes.mediaType
        );
      } else if (analise && analise.especialista === 'tecnico') {
        resultado = await this.especialistas.especialistaTecnico(
          requisicao,
          { analise }
        );
      } else if (analise && (analise.especialista === 'abnt' || analise.requer_abnt)) {
        resultado = await this.especialistas.especialistaAcademico(
          requisicao,
          { requisitos_abnt: true }
        );
      } else {
        resultado = await this.claude.processarTexto(requisicao);
      }

      if (opcoes.formatoABNT || (analise && analise.requer_abnt)) {
        console.log('📄 Aplicando formatação ABNT...');
        const abntResultado = await this.abnt.formatarABNT(resultado.resposta);
        resultado.versao_abnt = abntResultado.resposta;
      }

      return {
        status: 'sucesso',
        analise_serginho: analise,
        resultado: resultado,
        sistema: 'RKMMAX + Claude 4.5 Sonnet',
        suporte_imagem: true
      };

    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      return {
        status: 'erro',
        erro: error.message
      };
    }
  }

  async processarComStream(requisicao, onChunk) {
    const analise = await this.serginho.analisarRequisicao(requisicao);
    
    return await this.claude.processarComStream(
      requisicao,
      onChunk
    );
  }

  async processarImagem(prompt, imagemBase64, mediaType = 'image/jpeg') {
    return await this.claude.processarComImagem(prompt, imagemBase64, mediaType);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ClaudeClient,
  SerginhoOrquestradorClaude,
  EspecialistasClaudeRKMMAX,
  ABNTClaudeIntegrado,
  RKMMAXClaudeSystem
};

export default RKMMAXClaudeSystem;
