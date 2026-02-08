// src/middleware/ownerBypass.js
// Middleware para aplicar bypass de permissões para o Owner

import { isOwner } from '../config/roles.js';

/**
 * Aplica bypass completo de limites e permissões para o Owner
 * @param {Object} user - Objeto do usuário
 * @returns {Object} - Configurações de acesso
 */
export function applyOwnerBypass(user) {
  if (isOwner(user)) {
    return {
      // Acesso
      canAccessAllAgents: true,
      hasFullAccess: true,
      
      // Limites
      messageLimit: Infinity,
      tokenLimit: Infinity,
      
      // Custos
      costMultiplier: 0,
      isFree: true,
      
      // Bypass
      bypassRateLimit: true,
      bypassPaywall: true,
      
      // Features especiais
      debugMode: true,
      canSimulateUsers: true,
      adminPanel: true,
      userManagement: true,
      
      // Badge
      badge: '👑',
      badgeText: 'DONO',
      badgeColor: '#FFD700'
    };
  }

  // Retorna configurações padrão para usuários normais
  return null;
}

/**
 * Middleware de rate limit - Owner bypass
 * @param {Object} user - Objeto do usuário
 * @returns {boolean} - true se deve fazer bypass
 */
export function bypassRateLimit(user) {
  return isOwner(user);
}

/**
 * Middleware de paywall - Owner bypass
 * @param {Object} user - Objeto do usuário
 * @returns {boolean} - true se deve fazer bypass
 */
export function bypassPaywall(user) {
  return isOwner(user);
}

/**
 * Middleware de custo - Owner não paga
 * @param {Object} user - Objeto do usuário
 * @param {number} cost - Custo original
 * @returns {number} - Custo final
 */
export function applyCostMultiplier(user, cost) {
  if (isOwner(user)) {
    return 0;
  }
  return cost;
}

/**
 * Log de ações do Owner
 * @param {Object} user - Objeto do usuário
 * @param {string} action - Ação realizada
 * @param {Object} details - Detalhes da ação
 */
export function logOwnerAction(user, action, details = {}) {
  if (isOwner(user)) {
    const timestamp = new Date().toISOString();
    console.log('👑 OWNER ACTION:', {
      timestamp,
      user: user.email,
      action,
      details
    });
    
    // TODO: Salvar no Supabase em uma tabela de logs
    // await supabase.from('owner_logs').insert({
    //   timestamp,
    //   user_id: user.id,
    //   action,
    //   details
    // });
  }
}

export default applyOwnerBypass;
