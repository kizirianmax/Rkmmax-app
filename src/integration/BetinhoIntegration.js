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

  // Registra Serginho
  setSerginho(serginhoInstance) {
    this.serginho = serginhoInstance;
    console.log('✅ Serginho conectado ao Betinho');
  }

  getSerginho() {
    return this.serginho;
  }

  // Registra Especialista
  registerEspecialista(id, especialistaInstance) {
    this.especialistas.set(id, especialistaInstance);
    console.log(`✅ Especialista ${id} registrado no Betinho`);
  }

  getEspecialistas() {
    return this.especialistas;
  }

  // Registra GitHub
  setGitHub(githubInstance) {
    this.github = githubInstance;
    console.log('✅ GitHub conectado ao Betinho');
  }

  getGitHub() {
    return this.github;
  }

  // Registra todos os 54 especialistas
  registerAllEspecialistas(especialistasMap) {
    for (const [id, instance] of Object.entries(especialistasMap)) {
      this.registerEspecialista(id, instance);
    }
    console.log(`✅ ${Object.keys(especialistasMap).length} especialistas registrados`);
  }
}

export const betinhoIntegration = new BetinhoIntegration();