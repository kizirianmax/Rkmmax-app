// src/integration/BetinhoIntegration.js
/**
 * INTEGRAÇÃO BETINHO ↔ SERGINHO ↔ ESPECIALISTAS
 * Conecta todos os sistemas da plataforma RKMMAX
 */

export class BetinhoIntegration {
  constructor() {
    this.serginho = null;
    this.especialistas = new Map();
    this.betinho = null;
  }

  // Registra Serginho
  registerSerginho(serginhoInstance) {
    this.serginho = serginhoInstance;
    console.log('✅ Serginho conectado ao Betinho');
  }

  // Registra Especialista
  registerEspecialista(id, especialistaInstance) {
    this.especialistas.set(id, especialistaInstance);
    console.log(`✅ Especialista ${id} conectado ao Betinho`);
  }

  // Registra Betinho
  registerBetinho(betinhoInstance) {
    this.betinho = betinhoInstance;
    
    // Injeta dependências
    this.betinho.serginho = this.serginho;
    this.betinho.especialistas = this.especialistas;
    
    console.log('✅ Betinho totalmente integrado');
  }

  // Consulta Serginho
  async consultarSerginho(pergunta) {
    if (!this.serginho) {
      throw new Error('Serginho não está conectado');
    }
    
    return await this.serginho.responder(pergunta);
  }

  // Consulta Especialista
  async consultarEspecialista(especialistaId, pergunta) {
    const especialista = this.especialistas.get(especialistaId);
    
    if (!especialista) {
      throw new Error(`Especialista ${especialistaId} não encontrado`);
    }
    
    return await especialista.consultar(pergunta);
  }

  // Lista especialistas disponíveis
  listarEspecialistas() {
    return Array.from(this.especialistas.keys());
  }

  // Status da integração
  getStatus() {
    return {
      serginho: !!this.serginho,
      betinho: !!this.betinho,
      especialistas: this.especialistas.size,
      especialistasIds: this.listarEspecialistas()
    };
  }
}

// Singleton global
export const betinhoIntegration = new BetinhoIntegration();