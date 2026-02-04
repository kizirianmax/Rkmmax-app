// src/integration/BetinhoIntegration.js
/**
 * BETINHO INTEGRATION - Camada de Integração Central
 * Conecta Betinho com Serginho, Especialistas e GitHub
 */

class BetinhoIntegration {
  constructor() {
    this.serginho = null;
    this.especialistas = new Map();
    this.github = null;
    this.initialized = false;
  }

  // Configura Serginho (orquestrador)
  setSerginho(serginhoInstance) {
    this.serginho = serginhoInstance;
    console.log('🤖 Serginho conectado ao Betinho');
  }

  getSerginho() {
    return this.serginho;
  }

  // Registra especialista
  registerEspecialista(tipo, especialistaInstance) {
    this.especialistas.set(tipo, especialistaInstance);
    console.log(`✅ Especialista ${tipo} registrado no Betinho`);
  }

  // Remove especialista
  unregisterEspecialista(tipo) {
    this.especialistas.delete(tipo);
    console.log(`❌ Especialista ${tipo} removido do Betinho`);
  }

  // Obtém especialista específico
  getEspecialista(tipo) {
    return this.especialistas.get(tipo);
  }

  // Obtém todos especialistas
  getEspecialistas() {
    return Object.fromEntries(this.especialistas);
  }

  // Lista especialistas disponíveis
  listEspecialistas() {
    return Array.from(this.especialistas.keys());
  }

  // Configura GitHub
  setGitHub(githubInstance) {
    this.github = githubInstance;
    console.log('🔗 GitHub conectado ao Betinho');
  }

  getGitHub() {
    return this.github;
  }

  // Inicializa integração completa
  async initialize(config = {}) {
    try {
      if (config.serginho) this.setSerginho(config.serginho);
      if (config.github) this.setGitHub(config.github);
      
      if (config.especialistas) {
        Object.entries(config.especialistas).forEach(([tipo, instance]) => {
          this.registerEspecialista(tipo, instance);
        });
      }

      this.initialized = true;
      console.log('🎉 Betinho Integration inicializado com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao inicializar Betinho Integration:', error);
      return { success: false, error: error.message };
    }
  }

  // Status da integração
  getStatus() {
    return {
      initialized: this.initialized,
      serginho: !!this.serginho,
      github: !!this.github,
      especialistas: this.listEspecialistas(),
      totalEspecialistas: this.especialistas.size
    };
  }

  // Reset completo
  reset() {
    this.serginho = null;
    this.especialistas.clear();
    this.github = null;
    this.initialized = false;
    console.log('🔄 Betinho Integration resetado');
  }
}

// Instância singleton
export const betinhoIntegration = new BetinhoIntegration();

// Export também a classe para testes
export default BetinhoIntegration;