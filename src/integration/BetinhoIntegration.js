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

  // Serginho
  setSerginho(serginhoInstance) {
    this.serginho = serginhoInstance;
    console.log('✅ Serginho conectado ao Betinho');
  }

  getSerginho() {
    return this.serginho;
  }

  // Especialistas
  registerEspecialista(id, instance) {
    this.especialistas.set(id, instance);
    console.log(`✅ Especialista ${id} registrado`);
  }

  getEspecialistas() {
    return this.especialistas;
  }

  getEspecialista(id) {
    return this.especialistas.get(id);
  }

  // GitHub
  setGitHub(githubInstance) {
    this.github = githubInstance;
    console.log('✅ GitHub conectado ao Betinho');
  }

  getGitHub() {
    return this.github;
  }

  // Inicialização completa
  initializeAll(config = {}) {
    if (config.serginho) this.setSerginho(config.serginho);
    if (config.github) this.setGitHub(config.github);
    
    if (config.especialistas) {
      Object.entries(config.especialistas).forEach(([id, instance]) => {
        this.registerEspecialista(id, instance);
      });
    }

    console.log('🎉 Betinho Integration inicializada!');
    return this;
  }
}

export const betinhoIntegration = new BetinhoIntegration();
export default betinhoIntegration;