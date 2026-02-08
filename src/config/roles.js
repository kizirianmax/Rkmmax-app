// src/config/roles.js
// Sistema de Roles e Permissões (RBAC)

export const ROLES = {
  OWNER: {
    name: 'Dono',
    level: 999,
    badge: '👑',
    color: '#FFD700',
    permissions: {
      fullAccess: true,
      unlimitedMessages: true,
      unlimitedTokens: true,
      allAgents: true,
      allPlans: true,
      bypassPaywall: true,
      bypassRateLimits: true,
      adminPanel: true,
      userManagement: true,
      systemConfig: true,
      viewAnalytics: true,
      debugMode: true,
      canSimulateUsers: true,
      freeAccess: true
    }
  },
  ADMIN: {
    name: 'Admin',
    level: 100,
    badge: '🔧',
    color: '#FF6B6B',
    permissions: {
      userManagement: true,
      viewAnalytics: true,
      allAgents: true,
      messageLimit: 1000
    }
  },
  PREMIUM: {
    name: 'Premium',
    level: 50,
    badge: '⭐',
    color: '#4ECDC4',
    permissions: {
      allAgents: true,
      messageLimit: 100
    }
  },
  BASIC: {
    name: 'Básico',
    level: 10,
    badge: '🟢',
    color: '#95E1D3',
    permissions: {
      serginhoOnly: true,
      messageLimit: 10
    }
  }
};

/**
 * Verifica se o usuário é o Owner
 * @param {Object} user - Objeto do usuário
 * @returns {boolean}
 */
export function isOwner(user) {
  if (!user) return false;
  return user?.email === 'robertokizirianmax@gmail.com' || 
         user?.role === 'OWNER' ||
         user?.user_metadata?.role === 'OWNER';
}

/**
 * Verifica se o usuário tem uma permissão específica
 * @param {Object} user - Objeto do usuário
 * @param {string} permission - Nome da permissão
 * @returns {boolean}
 */
export function hasPermission(user, permission) {
  // Owner sempre tem todas as permissões
  if (isOwner(user)) return true;
  
  // Pega o role do usuário
  const userRole = user?.role || user?.user_metadata?.role || 'BASIC';
  const roleConfig = ROLES[userRole] || ROLES.BASIC;
  
  return roleConfig.permissions[permission] === true;
}

/**
 * Retorna as permissões completas do usuário
 * @param {Object} user - Objeto do usuário
 * @returns {Object}
 */
export function getUserPermissions(user) {
  if (isOwner(user)) {
    return ROLES.OWNER.permissions;
  }
  
  const userRole = user?.role || user?.user_metadata?.role || 'BASIC';
  const roleConfig = ROLES[userRole] || ROLES.BASIC;
  
  return roleConfig.permissions;
}

/**
 * Retorna o badge e cor do role do usuário
 * @param {Object} user - Objeto do usuário
 * @returns {Object}
 */
export function getUserBadge(user) {
  if (isOwner(user)) {
    return {
      badge: ROLES.OWNER.badge,
      color: ROLES.OWNER.color,
      name: ROLES.OWNER.name
    };
  }
  
  const userRole = user?.role || user?.user_metadata?.role || 'BASIC';
  const roleConfig = ROLES[userRole] || ROLES.BASIC;
  
  return {
    badge: roleConfig.badge,
    color: roleConfig.color,
    name: roleConfig.name
  };
}

/**
 * Retorna o limite de mensagens do usuário
 * @param {Object} user - Objeto do usuário
 * @returns {number}
 */
export function getMessageLimit(user) {
  if (isOwner(user)) return Infinity;
  
  const permissions = getUserPermissions(user);
  return permissions.messageLimit || 10;
}

/**
 * Verifica se o usuário pode acessar um agente específico
 * @param {Object} user - Objeto do usuário
 * @param {string} agentId - ID do agente
 * @returns {boolean}
 */
export function canAccessAgent(user, agentId) {
  // Owner pode acessar todos
  if (isOwner(user)) return true;
  
  const permissions = getUserPermissions(user);
  
  // Se tem acesso a todos os agentes
  if (permissions.allAgents) return true;
  
  // Se é básico, só pode acessar Serginho
  if (permissions.serginhoOnly && agentId === 'serginho') return true;
  
  return false;
}

export default ROLES;
