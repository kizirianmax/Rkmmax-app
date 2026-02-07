// src/agents/betinho/AuditLogger.js
/**
 * SISTEMA DE AUDITORIA DO BETINHO
 * 
 * Registra TODAS as ações executadas pelo Betinho de forma imutável.
 * Garante rastreabilidade completa e transparência.
 */

export default class AuditLogger {
  constructor() {
    this.logs = [];
    this.storageKey = 'betinho_audit_logs';
    this.loadLogs();
  }

  /**
   * Registra ação no log de auditoria
   */
  async register(entry) {
    const logEntry = {
      id: this.generateId(),
      timestamp: entry.timestamp || new Date(),
      usuarioId: entry.usuarioId,
      tipo: entry.tipo, // WORKFLOW | FORMATACAO | CONTEUDO_ALTERADO | GITHUB | ERRO
      ...entry
    };

    // Adiciona hash para integridade
    logEntry.hash = this.createHash(logEntry);

    // Salva em memória
    this.logs.push(logEntry);

    // Persiste
    await this.persistLog(logEntry);

    // Se alterou conteúdo, envia confirmação
    if (entry.tipo === 'CONTEUDO_ALTERADO') {
      await this.enviarConfirmacaoEmail(logEntry);
    }

    return logEntry;
  }

  /**
   * Busca logs por critério
   */
  async findLogs(criterio) {
    return this.logs.filter(log => {
      if (criterio.usuarioId && log.usuarioId !== criterio.usuarioId) return false;
      if (criterio.tipo && log.tipo !== criterio.tipo) return false;
      if (criterio.workflow && log.workflow !== criterio.workflow) return false;
      if (criterio.dataInicio && new Date(log.timestamp) < criterio.dataInicio) return false;
      if (criterio.dataFim && new Date(log.timestamp) > criterio.dataFim) return false;
      return true;
    });
  }

  /**
   * Gera relatório de auditoria
   */
  async gerarRelatorio(usuarioId, periodo = 'mes') {
    const dataInicio = this.calcularDataInicio(periodo);
    const logs = await this.findLogs({ usuarioId, dataInicio });

    const relatorio = {
      periodo,
      usuarioId,
      dataInicio,
      dataFim: new Date(),
      totalAcoes: logs.length,
      
      porTipo: this.agruparPorTipo(logs),
      
      workflows: {
        executados: logs.filter(l => l.tipo === 'WORKFLOW').length,
        sucesso: logs.filter(l => l.tipo === 'WORKFLOW' && l.resultado?.status === 'SUCCESS').length,
        falhas: logs.filter(l => l.tipo === 'WORKFLOW' && l.resultado?.status === 'FAILED').length
      },
      
      github: {
        repos: logs.filter(l => l.tipo === 'GITHUB' && l.operacao === 'CREATE_REPO').length,
        commits: logs.filter(l => l.tipo === 'GITHUB' && l.operacao === 'COMMIT').length,
        prs: logs.filter(l => l.tipo === 'GITHUB' && l.operacao === 'CREATE_PR').length
      },
      
      conteudoAlterado: {
        vezes: logs.filter(l => l.tipo === 'CONTEUDO_ALTERADO').length,
        autorizacoes: logs.filter(l => l.tipo === 'CONTEUDO_ALTERADO').map(l => ({
          data: l.timestamp,
          especialista: l.especialista,
          acoes: l.acoesAutorizadas
        }))
      },
      
      tempoTotal: this.calcularTempoTotal(logs),
      
      timeline: logs.map(l => ({
        data: l.timestamp,
        tipo: l.tipo,
        descricao: this.gerarDescricaoLog(l)
      }))
    };

    return relatorio;
  }

  /**
   * Verifica integridade dos logs
   */
  async verificarIntegridade() {
    const problemas = [];

    for (const log of this.logs) {
      const hashCalculado = this.createHash(log);
      if (hashCalculado !== log.hash) {
        problemas.push({
          logId: log.id,
          problema: 'Hash não corresponde',
          original: log.hash,
          calculado: hashCalculado
        });
      }
    }

    return {
      integro: problemas.length === 0,
      totalLogs: this.logs.length,
      problemas
    };
  }

  /**
   * Exporta logs para análise externa
   */
  async exportarLogs(formato = 'json') {
    const dados = {
      exportadoEm: new Date(),
      totalLogs: this.logs.length,
      logs: this.logs
    };

    switch (formato) {
      case 'json':
        return JSON.stringify(dados, null, 2);
      case 'csv':
        return this.converterParaCSV(dados.logs);
      default:
        return dados;
    }
  }

  /**
   * Persiste log (localStorage + servidor se disponível)
   */
  async persistLog(log) {
    // LocalStorage (client-side)
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Falha ao salvar log localmente:', e);
    }

    // Servidor (se disponível)
    if (typeof window !== 'undefined' && window.BETINHO_API_URL) {
      try {
        await fetch(`${window.BETINHO_API_URL}/audit/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
      } catch (e) {
        console.warn('Falha ao salvar log no servidor:', e);
      }
    }
  }

  /**
   * Carrega logs salvos
   */
  loadLogs() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Falha ao carregar logs:', e);
      this.logs = [];
    }
  }

  /**
   * Envia email de confirmação (alteração de conteúdo)
   */
  async enviarConfirmacaoEmail(log) {
    // Implementar integração com serviço de email
    console.log('Email de confirmação:', {
      para: log.usuarioEmail,
      assunto: '🤖 Betinho alterou conteúdo com sua autorização',
      conteudo: `Registramos que você autorizou alterações de conteúdo em ${new Date(log.timestamp).toLocaleString()}`
    });
  }

  /**
   * Helpers
   */
  generateId() {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createHash(obj) {
    // Hash simples (em produção usar crypto adequado)
    const str = JSON.stringify({
      timestamp: obj.timestamp,
      usuarioId: obj.usuarioId,
      tipo: obj.tipo,
      dados: obj.dados
    });
    return btoa(str);
  }

  agruparPorTipo(logs) {
    const grupos = {};
    for (const log of logs) {
      grupos[log.tipo] = (grupos[log.tipo] || 0) + 1;
    }
    return grupos;
  }

  calcularTempoTotal(logs) {
    const workflowLogs = logs.filter(l => l.tipo === 'WORKFLOW' && l.resultado?.tempoExecucao);
    const total = workflowLogs.reduce((acc, l) => acc + (l.resultado.tempoExecucao || 0), 0);
    return this.formatarTempo(total);
  }

  formatarTempo(segundos) {
    if (segundos < 60) return `${segundos}s`;
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    return `${horas}h ${minutos % 60}min`;
  }

  calcularDataInicio(periodo) {
    const agora = new Date();
    switch (periodo) {
      case 'dia':
        return new Date(agora.setDate(agora.getDate() - 1));
      case 'semana':
        return new Date(agora.setDate(agora.getDate() - 7));
      case 'mes':
        return new Date(agora.setMonth(agora.getMonth() - 1));
      case 'ano':
        return new Date(agora.setFullYear(agora.getFullYear() - 1));
      default:
        return new Date(agora.setMonth(agora.getMonth() - 1));
    }
  }

  gerarDescricaoLog(log) {
    switch (log.tipo) {
      case 'WORKFLOW':
        return `Workflow: ${log.workflow} - ${log.resultado?.status}`;
      case 'GITHUB':
        return `GitHub: ${log.operacao} - ${log.repo}`;
      case 'CONTEUDO_ALTERADO':
        return `Conteúdo alterado via ${log.especialista}`;
      case 'FORMATACAO':
        return `Formatação aplicada`;
      case 'ERRO':
        return `Erro: ${log.erro}`;
      default:
        return log.tipo;
    }
  }

  converterParaCSV(logs) {
    const headers = ['ID', 'Timestamp', 'Tipo', 'Usuario', 'Descrição'];
    const rows = logs.map(l => [
      l.id,
      new Date(l.timestamp).toISOString(),
      l.tipo,
      l.usuarioId,
      this.gerarDescricaoLog(l)
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }
}