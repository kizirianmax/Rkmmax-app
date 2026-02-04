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

  setSerginho(serginhoInstance) {
    this.serginho = serginhoInstance;
    console.log('✅ Serginho conectado ao Betinho');
  }

  getSerginho() {
    return this.serginho;
  }

  registerEspecialista(id, instance) {
    this.especialistas.set(id, instance);
    console.log(`✅ Especialista ${id} registrado no Betinho`);
  }

  getEspecialistas() {
    return this.especialistas;
  }

  getEspecialista(id) {
    return this.especialistas.get(id);
  }

  setGitHub(githubInstance) {
    this.github = githubInstance;
    console.log('✅ GitHub conectado ao Betinho');
  }

  getGitHub() {
    return this.github;
  }

  listEspecialistas() {
    return Array.from(this.especialistas.keys());
  }

  isReady() {
    return {
      serginho: !!this.serginho,
      especialistas: this.especialistas.size,
      github: !!this.github
    };
  }
}

export const betinhoIntegration = new BetinhoIntegration();