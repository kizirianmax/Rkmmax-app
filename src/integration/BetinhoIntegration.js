// src/integration/BetinhoIntegration.js
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
    console.log(`✅ Especialista ${id} registrado`);
  }

  getEspecialistas() {
    return this.especialistas;
  }

  setGitHub(githubInstance) {
    this.github = githubInstance;
    console.log('✅ GitHub conectado ao Betinho');
  }

  getGitHub() {
    return this.github;
  }
}

export const betinhoIntegration = new BetinhoIntegration();
