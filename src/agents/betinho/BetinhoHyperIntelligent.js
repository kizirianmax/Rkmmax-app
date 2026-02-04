// src/agents/betinho/BetinhoHyperIntelligent.js
/**
 * BETINHO - Sistema Hiper Inteligente de Automação
 * 
 * Betinho é o super automatizador da plataforma RKMMAX.
 * Ele executa tarefas completas end-to-end com validação inteligente.
 * 
 * Capacidades:
 * - Automação universal (acadêmico, dev, produtividade, criativo)
 * - Comunicação com Serginho e 54 especialistas
 * - Integração GitHub completa
 * - Validação de intenção antes de executar
 * - Regra de integridade de conteúdo
 * - Workflows infinitos e extensíveis
 */

import ContentIntegrityRules from './ContentIntegrityRules.js';
import WorkflowEngine from './WorkflowEngine.js';
import IntentValidator from './IntentValidator.js';
import AuditLogger from './AuditLogger.js';

export default class BetinhoHyperIntelligent {
  constructor(config = {}) {
    this.nome = "Betinho";
    this.emoji = "🤖";
    this.tipo = "AUTOMATION_SUPER_AGENT";
    this.versao = "1.0.0";
    
    // Core systems
    this.integrityRules = new ContentIntegrityRules();
    this.workflowEngine = new WorkflowEngine();
    this.intentValidator = new IntentValidator();
    this.auditLog = new AuditLogger();
    
    // Interfaces de comunicação (serão injetadas)
    this.serginho = config.serginho || null;
    this.especialistas = config.especialistas || null;
    this.github = config.github || null;
    
    // Estado
    this.executandoWorkflow = false;
    this.workflowAtual = null;
    this.contexto = {};
  }

  /**
   * MÉTODO PRINCIPAL: Executa tarefa completa automatizada
   * 
   * @param {Object} request - Requisição do usuário
   * @param {string} request.descricao - Descrição em linguagem natural
   * @param {Object} request.context - Contexto adicional
   * @param {string} request.usuarioId - ID do usuário
   * @returns {Promise<Object>} Resultado da execução
   */
  async executarTarefaCompleta(request) {
    const { descricao, context = {}, usuarioId } = request;
    
    try {
      // 1. SAUDAÇÃO
      const saudacao = this.saudacao();
      await this.enviarMensagem(saudacao);
      
      // 2. ANÁLISE: Entende o que o usuário quer
      const intencao = await this.analisarIntencao(descricao, context);
      
      // 3. PLANEJAMENTO: Cria plano de execução
      const plano = await this.criarPlano(intencao);
      
      // 4. CONSULTA: Busca ajuda de especialistas se necessário
      const consultasEspecialistas = await this.consultarEspecialistas(plano);
      
      // 5. VALIDAÇÃO: Mostra ao usuário o que vai fazer
      const confirmacao = await this.validarComUsuario({
        intencao,
        plano,
        consultasEspecialistas,
        usuarioId
      });
      
      if (!confirmacao.aprovado) {
        return this.tratarNaoAprovacao(confirmacao);
      }
      
      // 6. EXECUÇÃO: Roda o workflow automaticamente
      this.executandoWorkflow = true;
      this.workflowAtual = plano.workflowId;
      
      const resultado = await this.executarWorkflow(plano, confirmacao);
      
      this.executandoWorkflow = false;
      this.workflowAtual = null;
      
      // 7. AUDITORIA: Registra tudo que foi feito
      await this.auditLog.register({
        usuarioId,
        workflow: plano.workflowId,
        intencao: intencao.tipo,
        resultado: resultado.status,
        timestamp: new Date()
      });
      
      // 8. ENTREGA: Retorna resultado completo
      return this.formatarResultado(resultado);
      
    } catch (error) {
      return this.tratarErro(error, usuarioId);
    }
  }

  /**
   * Analisa a intenção do usuário
   */
  async analisarIntencao(descricao, context) {
    return await this.intentValidator.analyze(descricao, context);
  }

  /**
   * Cria plano de execução baseado na intenção
   */
  async criarPlano(intencao) {
    // Determina qual workflow usar
    const workflow = this.workflowEngine.selectWorkflow(intencao);
    
    // Cria etapas detalhadas
    const etapas = await this.workflowEngine.createSteps(workflow, intencao);
    
    // Estima tempo e recursos
    const estimativa = this.workflowEngine.estimate(etapas);
    
    return {
      workflowId: workflow.id,
      workflow: workflow.nome,
      intencao: intencao.tipo,
      etapas,
      estimativa,
      especialistasNecessarios: this.identificarEspecialistas(etapas),
      githubOperacoes: this.identificarGitHubOps(etapas)
    };
  }

  /**
   * Consulta especialistas quando necessário
   */
  async consultarEspecialistas(plano) {
    const consultas = [];
    
    for (const especialistaId of plano.especialistasNecessarios) {
      const especialista = this.especialistas?.get(especialistaId);
      
      if (especialista) {
        const pergunta = this.criarPerguntaEspecialista(plano, especialistaId);
        const resposta = await especialista.consultar(pergunta);
        
        consultas.push({
          especialista: especialistaId,
          pergunta,
          resposta,
          timestamp: new Date()
        });
      }
    }
    
    return consultas;
  }

  /**
   * Valida com usuário antes de executar
   */
  async validarComUsuario(dados) {
    const { intencao, plano, consultasEspecialistas, usuarioId } = dados;
    
    // Monta resumo do que vai fazer
    const resumo = {
      titulo: `${this.emoji} Vou ${intencao.verbo} ${intencao.objeto}`,
      descricao: intencao.descricaoCompleta,
      etapas: plano.etapas.map(e => ({
        ordem: e.ordem,
        acao: e.descricao,
        tipo: e.tipo,
        tempo: e.tempoEstimado
      })),
      tempo: plano.estimativa.tempoTotal,
      recursos: plano.estimativa.recursos,
      especialistas: consultasEspecialistas.map(c => c.especialista),
      github: plano.githubOperacoes
    };
    
    // Verifica se alguma etapa altera conteúdo (regra de integridade)
    const acoesConteudo = this.verificarAlteracoesConteudo(plano.etapas);
    
    if (acoesConteudo.length > 0) {
      resumo.avisoConteudo = {
        titulo: "⚠️ Algumas ações alteram CONTEÚDO",
        acoes: acoesConteudo,
        requerAutorizacao: true
      };
    }
    
    // Envia para interface de confirmação
    return await this.intentValidator.requestConfirmation(resumo, usuarioId);
  }

  /**
   * Executa o workflow automaticamente
   */
  async executarWorkflow(plano, confirmacao) {
    const resultado = {
      status: 'EXECUTING',
      etapasCompletadas: [],
      etapasFalhadas: [],
      artefatosGerados: [],
      githubLinks: []
    };
    
    for (const etapa of plano.etapas) {
      try {
        // Notifica progresso
        await this.notificarProgresso({
          etapa: etapa.ordem,
          total: plano.etapas.length,
          acao: etapa.descricao
        });
        
        // Executa a etapa
        const resultadoEtapa = await this.executarEtapa(etapa, confirmacao);
        
        resultado.etapasCompletadas.push({
          etapa: etapa.ordem,
          descricao: etapa.descricao,
          resultado: resultadoEtapa,
          timestamp: new Date()
        });
        
        // Se gerou artefato, adiciona ao resultado
        if (resultadoEtapa.artefato) {
          resultado.artefatosGerados.push(resultadoEtapa.artefato);
        }
        
        // Se fez operação GitHub, adiciona link
        if (resultadoEtapa.githubUrl) {
          resultado.githubLinks.push(resultadoEtapa.githubUrl);
        }
        
      } catch (error) {
        resultado.etapasFalhadas.push({
          etapa: etapa.ordem,
          descricao: etapa.descricao,
          erro: error.message,
          timestamp: new Date()
        });
        
        // Decide se continua ou aborta
        if (etapa.critico) {
          resultado.status = 'FAILED';
          break;
        }
      }
    }
    
    if (resultado.etapasFalhadas.length === 0) {
      resultado.status = 'SUCCESS';
    }
    
    return resultado;
  }

  /**
   * Executa uma etapa individual
   */
  async executarEtapa(etapa, confirmacao) {
    switch (etapa.tipo) {
      case 'GERAR_CONTEUDO':
        return await this.gerarConteudo(etapa);
        
      case 'FORMATAR':
        return await this.formatarDocumento(etapa);
        
      case 'GITHUB_OPERATION':
        return await this.executarGitHubOp(etapa);
        
      case 'CONSULTAR_ESPECIALISTA':
        return await this.consultarEspecialistaEtapa(etapa);
        
      case 'PROCESSAR_DADOS':
        return await this.processarDados(etapa);
        
      case 'CRIAR_ARQUIVO':
        return await this.criarArquivo(etapa);
        
      default:
        return await this.workflowEngine.executeStep(etapa);
    }
  }

  /**
   * Verifica se etapas alteram conteúdo (regra de integridade)
   */
  verificarAlteracoesConteudo(etapas) {
    const acoesConteudo = [];
    
    for (const etapa of etapas) {
      if (etapa.especialistaNormativo) {
        // Verifica se a ação altera conteúdo
        const alteraConteudo = !this.integrityRules.isAllowedWithoutPermission(
          etapa.especialista,
          etapa.acao
        );
        
        if (alteraConteudo) {
          acoesConteudo.push({
            etapa: etapa.ordem,
            especialista: etapa.especialista,
            acao: etapa.acao,
            descricao: etapa.descricao,
            exemplo: etapa.exemplo
          });
        }
      }
    }
    
    return acoesConteudo;
  }

  /**
   * Mensagens do Betinho
   */
  saudacao() {
    return `${this.emoji} **Oi! Sou o ${this.nome}!**\n\nSou o sistema de automação hiper inteligente da RKMMAX.\nPosso automatizar praticamente qualquer coisa:\n\n📝 Trabalhos acadêmicos completos\n💻 Projetos de código no GitHub\n📊 Relatórios e análises\n🎨 Conteúdo criativo\n📅 Cronogramas e planejamento\n🔧 E muito mais!\n\nMas não sou desses que faz às cegas. \nSempre mostro o que vou fazer e peço sua confirmação.\n\nMe conta: o que você precisa automatizar? 💪`;
  }

  mensagemExecutando() {
    return `${this.emoji} Beleza! Já tô trabalhando nisso...\n\nPode deixar comigo! Vou te atualizando conforme vou avançando. ⚙️`;
  }

  mensagemConcluido(resultado) {
    return `${this.emoji} **Prontinho!** ✅\n\n${resultado.resumo}\n\n${resultado.artefatosGerados.length > 0 ? `📦 **Artefatos gerados:**\n${resultado.artefatosGerados.map(a => `- ${a.nome} (${a.tipo})`).join('\n')}` : ''}\n\n${resultado.githubLinks.length > 0 ? `🔗 **Links GitHub:**\n${resultado.githubLinks.map(l => `- ${l}`).join('\n')}` : ''}\n\nFicou bom? Precisa de algum ajuste? 😊`;
  }

  /**
   * Helpers
   */
  identificarEspecialistas(etapas) {
    return [...new Set(
      etapas
        .filter(e => e.especialista)
        .map(e => e.especialista)
    )];
  }

  identificarGitHubOps(etapas) {
    return etapas
      .filter(e => e.tipo === 'GITHUB_OPERATION')
      .map(e => e.operacao);
  }

  criarPerguntaEspecialista(plano, especialistaId) {
    // Cria pergunta contextualizada para o especialista
    return {
      contexto: plano.intencao,
      pergunta: `Como devo proceder para ${plano.workflow}?`,
      detalhes: plano.etapas.filter(e => e.especialista === especialistaId)
    };
  }

  async enviarMensagem(mensagem) {
    // Interface para enviar mensagem ao usuário
    if (typeof window !== 'undefined' && window.betinhoUI) {
      window.betinhoUI.addMessage(mensagem);
    }
  }

  async notificarProgresso(progresso) {
    // Interface para notificar progresso em tempo real
    if (typeof window !== 'undefined' && window.betinhoUI) {
      window.betinhoUI.updateProgress(progresso);
    }
  }

  formatarResultado(resultado) {
    return {
      status: resultado.status,
      mensagem: this.mensagemConcluido(resultado),
      dados: resultado,
      timestamp: new Date()
    };
  }

  tratarNaoAprovacao(confirmacao) {
    if (confirmacao.acao === 'AJUSTAR') {
      return {
        status: 'AGUARDANDO_AJUSTES',
        mensagem: `${this.emoji} Beleza! Me diz o que quer ajustar que eu refaço o plano. 🔧`,
        feedback: confirmacao.feedback
      };
    }
    
    return {
      status: 'CANCELADO',
      mensagem: `${this.emoji} Sem problemas! Cancelei tudo. Se precisar é só chamar! 👍`
    };
  }

  tratarErro(error, usuarioId) {
    console.error('Betinho Error:', error);
    
    this.auditLog.register({
      tipo: 'ERRO',
      usuarioId,
      erro: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
    
    return {
      status: 'ERROR',
      mensagem: `${this.emoji} Ops! Tive um problema aqui...\n\n${error.message}\n\nMas não se preocupa! Vou chamar o Serginho pra me ajudar. Ou você pode tentar de novo descrevendo de forma diferente. 😅`
    };
  }

  /**
   * Métodos placeholder (serão implementados nas próximas fases)
   */
  async gerarConteudo(etapa) {
    return { status: 'success', artefato: { nome: 'conteudo.txt', tipo: 'text' } };
  }

  async formatarDocumento(etapa) {
    return { status: 'success', artefato: { nome: 'documento_formatado.pdf', tipo: 'pdf' } };
  }

  async executarGitHubOp(etapa) {
    return { status: 'success', githubUrl: 'https://github.com/user/repo' };
  }

  async consultarEspecialistaEtapa(etapa) {
    return { status: 'success', resposta: 'Orientação do especialista' };
  }

  async processarDados(etapa) {
    return { status: 'success', dados: {} };
  }

  async criarArquivo(etapa) {
    return { status: 'success', artefato: { nome: etapa.nomeArquivo, tipo: etapa.tipoArquivo } };
  }
}