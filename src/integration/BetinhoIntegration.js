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

  // Configura Serginho
  setSerginho(serginhoInstance) {
    this.serginho = serginhoInstance;
    console.log('✅ Serginho conectado ao Betinho');
  }

  getSerginho() {
    return this.serginho;
  }

  // Registra especialistas
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

  // Configura GitHub
  setGitHub(githubInstance) {
    this.github = githubInstance;
    console.log('✅ GitHub conectado ao Betinho');
  }

  getGitHub() {
    return this.github;
  }

  // Verifica se tudo está conectado
  isFullyConnected() {
    return {
      serginho: !!this.serginho,
      especialistas: this.especialistas.size > 0,
      github: !!this.github
    };
  }

  // Status da integração
  getStatus() {
    const status = this.isFullyConnected();
    return {
      ...status,
      especialistasCount: this.especialistas.size,
      especialistasList: Array.from(this.especialistas.keys())
    };
  }
}

// Exporta instância única (singleton)
export const betinhoIntegration = new BetinhoIntegration();
export default BetinhoIntegration;