/**
 * RATE LIMITER
 * Sistema de limites para Manual e Otimizado
 * Manual: mais lento, menos créditos, mais requisições
 * Otimizado: mais rápido, mais créditos, menos requisições
 */

class RateLimiter {
  constructor() {
    // Armazenar em memória (em produção usar Redis)
    this.requests = {};
    this.limits = {
      manual: {
        requestsPerDay: 100,
        requestsPerHour: 20,
        speed: 'slow', // Mais lento
        creditCost: 1, // 1 crédito por requisição
      },
      optimized: {
        requestsPerDay: 50,
        requestsPerHour: 10,
        speed: 'fast', // Mais rápido
        creditCost: 5, // 5 créditos por requisição (gasta mais rápido)
      },
    };

    // Limpar dados a cada hora
    this.cleanupInterval = setInterval(() => this.cleanup(), 3600000);
  }

  /**
   * Obter chave do usuário
   */
  getUserKey(userId) {
    return userId || 'anonymous';
  }

  /**
   * Obter chave de tempo (hora)
   */
  getHourKey() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
  }

  /**
   * Obter chave de tempo (dia)
   */
  getDayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  }

  /**
   * Verificar se pode fazer requisição
   */
  canMakeRequest(userId, mode = 'manual') {
    const userKey = this.getUserKey(userId);
    const hourKey = this.getHourKey();
    const dayKey = this.getDayKey();
    const modeConfig = this.limits[mode.toLowerCase()] || this.limits.manual;

    // Inicializar usuário se não existir
    if (!this.requests[userKey]) {
      this.requests[userKey] = {
        daily: {},
        hourly: {},
      };
    }

    // Contar requisições do dia
    const dailyCount = this.requests[userKey].daily[dayKey] || 0;
    if (dailyCount >= modeConfig.requestsPerDay) {
      return {
        allowed: false,
        reason: `Limite diário atingido (${modeConfig.requestsPerDay} requisições)`,
        limit: modeConfig.requestsPerDay,
        current: dailyCount,
        resetIn: this.getTimeUntilMidnight(),
      };
    }

    // Contar requisições da hora
    const hourlyCount = this.requests[userKey].hourly[hourKey] || 0;
    if (hourlyCount >= modeConfig.requestsPerHour) {
      return {
        allowed: false,
        reason: `Limite horário atingido (${modeConfig.requestsPerHour} requisições)`,
        limit: modeConfig.requestsPerHour,
        current: hourlyCount,
        resetIn: this.getTimeUntilNextHour(),
      };
    }

    return {
      allowed: true,
      reason: 'Requisição permitida',
      dailyRemaining: modeConfig.requestsPerDay - dailyCount - 1,
      hourlyRemaining: modeConfig.requestsPerHour - hourlyCount - 1,
    };
  }

  /**
   * Registrar requisição
   */
  recordRequest(userId, mode = 'manual') {
    const userKey = this.getUserKey(userId);
    const hourKey = this.getHourKey();
    const dayKey = this.getDayKey();

    if (!this.requests[userKey]) {
      this.requests[userKey] = {
        daily: {},
        hourly: {},
      };
    }

    // Incrementar contadores
    this.requests[userKey].daily[dayKey] = (this.requests[userKey].daily[dayKey] || 0) + 1;
    this.requests[userKey].hourly[hourKey] = (this.requests[userKey].hourly[hourKey] || 0) + 1;

    const modeConfig = this.limits[mode.toLowerCase()] || this.limits.manual;

    return {
      recorded: true,
      creditCost: modeConfig.creditCost,
      dailyUsed: this.requests[userKey].daily[dayKey],
      hourlyUsed: this.requests[userKey].hourly[hourKey],
    };
  }

  /**
   * Obter uso atual
   */
  getCurrentUsage(userId, mode = 'manual') {
    const userKey = this.getUserKey(userId);
    const hourKey = this.getHourKey();
    const dayKey = this.getDayKey();
    const modeConfig = this.limits[mode.toLowerCase()] || this.limits.manual;

    if (!this.requests[userKey]) {
      return {
        daily: 0,
        hourly: 0,
        dailyLimit: modeConfig.requestsPerDay,
        hourlyLimit: modeConfig.requestsPerHour,
        dailyRemaining: modeConfig.requestsPerDay,
        hourlyRemaining: modeConfig.requestsPerHour,
      };
    }

    const dailyUsed = this.requests[userKey].daily[dayKey] || 0;
    const hourlyUsed = this.requests[userKey].hourly[hourKey] || 0;

    return {
      daily: dailyUsed,
      hourly: hourlyUsed,
      dailyLimit: modeConfig.requestsPerDay,
      hourlyLimit: modeConfig.requestsPerHour,
      dailyRemaining: Math.max(0, modeConfig.requestsPerDay - dailyUsed),
      hourlyRemaining: Math.max(0, modeConfig.requestsPerHour - hourlyUsed),
      dailyPercentage: Math.round((dailyUsed / modeConfig.requestsPerDay) * 100),
      hourlyPercentage: Math.round((hourlyUsed / modeConfig.requestsPerHour) * 100),
    };
  }

  /**
   * Obter configuração de modo
   */
  getModeConfig(mode = 'manual') {
    return this.limits[mode.toLowerCase()] || this.limits.manual;
  }

  /**
   * Obter tempo até meia-noite
   */
  getTimeUntilMidnight() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    return `${hours}h ${minutes}m`;
  }

  /**
   * Obter tempo até próxima hora
   */
  getTimeUntilNextHour() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0, 0, 0);

    const diff = nextHour - now;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  }

  /**
   * Limpar dados antigos
   */
  cleanup() {
    const now = new Date();
    const currentDay = this.getDayKey();
    const currentHour = this.getHourKey();

    for (const userKey in this.requests) {
      // Remover dados de dias antigos
      for (const dayKey in this.requests[userKey].daily) {
        if (dayKey !== currentDay) {
          delete this.requests[userKey].daily[dayKey];
        }
      }

      // Remover dados de horas antigas
      for (const hourKey in this.requests[userKey].hourly) {
        if (hourKey !== currentHour) {
          delete this.requests[userKey].hourly[hourKey];
        }
      }

      // Remover usuário se vazio
      if (
        Object.keys(this.requests[userKey].daily).length === 0 &&
        Object.keys(this.requests[userKey].hourly).length === 0
      ) {
        delete this.requests[userKey];
      }
    }
  }

  /**
   * Reset de limites (admin only)
   */
  resetUserLimits(userId) {
    const userKey = this.getUserKey(userId);
    if (this.requests[userKey]) {
      delete this.requests[userKey];
    }
    return { reset: true };
  }

  /**
   * Destruir limiter
   */
  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

// Instância global
let limiterInstance = null;

function getLimiter() {
  if (!limiterInstance) {
    limiterInstance = new RateLimiter();
  }
  return limiterInstance;
}

module.exports = { RateLimiter, getLimiter };

