// src/integration/BetinhoIntegration.js
/**
 * CAMADA DE INTEGRAÇÃO DO BETINHO
 * Conecta Betinho com Serginho, Especialistas e GitHub
 */

class BetinhoIntegration {
  constructor() {
    this.serginho = null;
    this.especialistas = new Map();
    this.github = null;
  }

  // Registrar Serginho
  setSerginho(serginhoInstance) {
    this.serginho = serginhoInstance;
    console.log('✅ Serginho conectado ao Betinho');
  }

  getSerginho() {
    return this.serginho;
  }

  // Registrar Especialistas
  registerEspecialista(id, especialistaInstance) {
    this.especialistas.set(id, especialistaInstance);
    console.log(`✅ Especialista ${id} registrado no Betinho`);
  }

  getEspecialista(id) {
    return this.especialistas.get(id);
  }

  getEspecialistas() {
    return this.especialistas;
  }

  // Registrar GitHub
  setGitHub(githubInstance) {
    this.github = githubInstance;
    console.log('✅ GitHub conectado ao Betinho');
  }

  getGitHub() {
    return this.github;
  }

  // Consultar especialista
  async consultarEspecialista(especialistaId, contexto) {
    const especialista = this.getEspecialista(especialistaId);
    
    if (!especialista) {
      console.warn(`⚠️ Especialista ${especialistaId} não registrado`);
      return {
        status: 'unavailable',
        mensagem: `Especialista ${especialistaId} não está disponível no momento`
      };
    }

    try {
      return await especialista.processar(contexto);
    } catch (error) {
      return {
        status: 'error',
        mensagem: `Erro ao consultar ${especialistaId}: ${error.message}`
      };
    }
  }

  // Chamar Serginho
  async chamarSerginho(contexto) {
    if (!this.serginho) {
      console.warn('⚠️ Serginho não está conectado');
      return {
        status: 'unavailable',
        mensagem: 'Serginho não está disponível no momento'
      };
    }

    try {
      return await this.serginho.processar(contexto);
    } catch (error) {
      return {
        status: 'error',
        mensagem: `Erro ao chamar Serginho: ${error.message}`
      };
    }
  }

  // Status da integração
  getStatus() {
    return {
      serginho: !!this.serginho,
      especialistas: this.especialistas.size,
      github: !!this.github
    };
  }
}

// Exporta instância singleton
export const betinhoIntegration = new BetinhoIntegration();
export default BetinhoIntegration;