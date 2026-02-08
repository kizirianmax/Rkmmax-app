// src/middleware/authMiddleware.js
// Middleware para verificar autenticação e aplicar permissões

import { isOwner, hasPermission } from '../config/roles.js';
import { applyOwnerBypass } from './ownerBypass.js';

/**
 * Verifica se o usuário está autenticado
 * @param {Object} user - Objeto do usuário
 * @returns {boolean}
 */
export function isAuthenticated(user) {
  return user !== null && user !== undefined;
}

/**
 * Middleware de proteção de rota
 * @param {Object} user - Objeto do usuário
 * @param {string} requiredPermission - Permissão necessária
 * @returns {Object} - { allowed, reason }
 */
export function protectRoute(user, requiredPermission = null) {
  // Verifica autenticação
  if (!isAuthenticated(user)) {
    return {
      allowed: false,
      reason: 'NOT_AUTHENTICATED',
      redirectTo: '/login'
    };
  }

  // Owner sempre passa
  if (isOwner(user)) {
    return {
      allowed: true,
      reason: 'OWNER_ACCESS'
    };
  }

  // Se não requer permissão específica, apenas autenticação
  if (!requiredPermission) {
    return {
      allowed: true,
      reason: 'AUTHENTICATED'
    };
  }

  // Verifica permissão específica
  if (hasPermission(user, requiredPermission)) {
    return {
      allowed: true,
      reason: 'HAS_PERMISSION'
    };
  }

  return {
    allowed: false,
    reason: 'NO_PERMISSION',
    redirectTo: '/'
  };
}

/**
 * Aplica configurações de acesso ao usuário
 * @param {Object} user - Objeto do usuário
 * @returns {Object} - Configurações completas do usuário
 */
export function applyAccessConfig(user) {
  if (!user) return null;

  // Aplica bypass para owner
  const ownerConfig = applyOwnerBypass(user);
  if (ownerConfig) {
    return {
      ...user,
      accessConfig: ownerConfig
    };
  }

  // Configuração padrão para usuários normais
  return {
    ...user,
    accessConfig: {
      canAccessAllAgents: false,
      hasFullAccess: false,
      messageLimit: 10,
      tokenLimit: 10000,
      costMultiplier: 1,
      isFree: false,
      bypassRateLimit: false,
      bypassPaywall: false,
      debugMode: false,
      canSimulateUsers: false
    }
  };
}

/**
 * Verifica se a rota requer owner
 * @param {string} path - Caminho da rota
 * @returns {boolean}
 */
export function requiresOwner(path) {
  const ownerPaths = [
    '/owner-dashboard',
    '/owner',
    '/user-management',
    '/system-config'
  ];
  
  return ownerPaths.some(ownerPath => path.startsWith(ownerPath));
}

/**
 * Verifica se a rota requer admin
 * @param {string} path - Caminho da rota
 * @returns {boolean}
 */
export function requiresAdmin(path) {
  const adminPaths = [
    '/admin',
    '/analytics',
    '/user-management'
  ];
  
  return adminPaths.some(adminPath => path.startsWith(adminPath));
}

export default {
  isAuthenticated,
  protectRoute,
  applyAccessConfig,
  requiresOwner,
  requiresAdmin
};
