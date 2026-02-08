// src/utils/checkAccess.js
// Utilitário para verificar acesso e permissões

import { isOwner, hasPermission, getUserPermissions, getMessageLimit } from '../config/roles.js';

/**
 * Verifica se o usuário pode acessar um recurso
 * @param {Object} user - Objeto do usuário
 * @param {string} feature - Nome do recurso/feature
 * @returns {Object} - { allowed, unlimited, reason, details }
 */
export function checkAccess(user, feature) {
  // Se não há usuário, nega acesso
  if (!user) {
    return {
      allowed: false,
      unlimited: false,
      reason: 'NO_USER',
      details: 'Usuário não autenticado'
    };
  }

  // Owner tem acesso total e ilimitado
  if (isOwner(user)) {
    return {
      allowed: true,
      unlimited: true,
      reason: 'OWNER_FULL_ACCESS',
      details: 'Dono tem acesso total e ilimitado'
    };
  }

  // Verifica permissão específica
  const hasAccess = hasPermission(user, feature);
  
  if (hasAccess) {
    return {
      allowed: true,
      unlimited: false,
      reason: 'USER_HAS_PERMISSION',
      details: `Usuário tem permissão para ${feature}`
    };
  }

  return {
    allowed: false,
    unlimited: false,
    reason: 'NO_PERMISSION',
    details: `Usuário não tem permissão para ${feature}`
  };
}

/**
 * Verifica limites de uso do usuário
 * @param {Object} user - Objeto do usuário
 * @returns {Object} - { messageLimit, tokenLimit, costMultiplier, bypassLimits }
 */
export function checkLimits(user) {
  // Owner não tem limites
  if (isOwner(user)) {
    return {
      messageLimit: Infinity,
      tokenLimit: Infinity,
      costMultiplier: 0,
      bypassLimits: true,
      isFree: true
    };
  }

  // Usuários normais têm limites baseados no plano
  const permissions = getUserPermissions(user);
  const messageLimit = getMessageLimit(user);

  return {
    messageLimit,
    tokenLimit: messageLimit * 1000, // Aproximadamente 1000 tokens por mensagem
    costMultiplier: 1,
    bypassLimits: false,
    isFree: false
  };
}

/**
 * Verifica se o usuário pode acessar um agente
 * @param {Object} user - Objeto do usuário
 * @param {string} agentId - ID do agente
 * @returns {Object}
 */
export function checkAgentAccess(user, agentId) {
  if (!user) {
    return {
      allowed: false,
      reason: 'NO_USER'
    };
  }

  if (isOwner(user)) {
    return {
      allowed: true,
      reason: 'OWNER_ACCESS'
    };
  }

  const permissions = getUserPermissions(user);

  // Acesso total a todos os agentes
  if (permissions.allAgents) {
    return {
      allowed: true,
      reason: 'ALL_AGENTS_PERMISSION'
    };
  }

  // Apenas Serginho para usuários básicos
  if (permissions.serginhoOnly && agentId === 'serginho') {
    return {
      allowed: true,
      reason: 'SERGINHO_ONLY'
    };
  }

  return {
    allowed: false,
    reason: 'NO_AGENT_PERMISSION'
  };
}

/**
 * Verifica se o usuário pode acessar o painel admin
 * @param {Object} user - Objeto do usuário
 * @returns {boolean}
 */
export function canAccessAdmin(user) {
  return isOwner(user) || hasPermission(user, 'adminPanel');
}

/**
 * Verifica se o usuário pode simular outros usuários
 * @param {Object} user - Objeto do usuário
 * @returns {boolean}
 */
export function canSimulateUsers(user) {
  return isOwner(user) || hasPermission(user, 'canSimulateUsers');
}

/**
 * Aplica bypass de limites para owner
 * @param {Object} user - Objeto do usuário
 * @returns {Object}
 */
export function applyOwnerBypass(user) {
  if (isOwner(user)) {
    return {
      canAccessAllAgents: true,
      messageLimit: Infinity,
      tokenLimit: Infinity,
      costMultiplier: 0,
      bypassRateLimit: true,
      bypassPaywall: true,
      isFree: true,
      debugMode: true,
      canSimulateUsers: true
    };
  }

  // Retorna limites normais para outros usuários
  const limits = checkLimits(user);
  const permissions = getUserPermissions(user);

  return {
    canAccessAllAgents: permissions.allAgents || false,
    messageLimit: limits.messageLimit,
    tokenLimit: limits.tokenLimit,
    costMultiplier: limits.costMultiplier,
    bypassRateLimit: false,
    bypassPaywall: false,
    isFree: false,
    debugMode: false,
    canSimulateUsers: false
  };
}

export default checkAccess;
