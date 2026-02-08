/**
 * Check Access API Handler
 * Verifies user access and permissions
 */

/**
 * Roles e permissões
 */
const ROLES = {
  OWNER: {
    level: 999,
    permissions: {
      fullAccess: true,
      unlimitedMessages: true,
      allAgents: true,
      bypassPaywall: true,
      bypassRateLimits: true,
      adminPanel: true
    }
  },
  ADMIN: {
    level: 100,
    permissions: {
      userManagement: true,
      viewAnalytics: true,
      allAgents: true,
      messageLimit: 1000
    }
  },
  PREMIUM: {
    level: 50,
    permissions: {
      allAgents: true,
      messageLimit: 100
    }
  },
  BASIC: {
    level: 10,
    permissions: {
      serginhoOnly: true,
      messageLimit: 10
    }
  }
};

/**
 * Verifica se o usuário é o Owner
 */
function isOwner(email) {
  return email === 'robertokizirianmax@gmail.com';
}

/**
 * Retorna o role do usuário
 */
function getUserRole(email, userRole) {
  if (isOwner(email)) {
    return 'OWNER';
  }
  return userRole || 'BASIC';
}

export default async function checkAccessHandler(req, res) {
  // Apenas aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, role, feature, agentId } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Email é obrigatório'
      });
    }

    // Determina o role do usuário
    const userRole = getUserRole(email, role);
    const roleConfig = ROLES[userRole] || ROLES.BASIC;

    // Se é owner, retorna acesso total
    if (userRole === 'OWNER') {
      return res.status(200).json({
        allowed: true,
        unlimited: true,
        reason: 'OWNER_FULL_ACCESS',
        role: userRole,
        permissions: roleConfig.permissions,
        accessConfig: {
          canAccessAllAgents: true,
          messageLimit: Infinity,
          tokenLimit: Infinity,
          costMultiplier: 0,
          bypassRateLimit: true,
          bypassPaywall: true,
          isFree: true,
          debugMode: true
        }
      });
    }

    // Verifica acesso a feature específica
    if (feature) {
      const hasPermission = roleConfig.permissions[feature] === true;
      
      return res.status(200).json({
        allowed: hasPermission,
        unlimited: false,
        reason: hasPermission ? 'USER_HAS_PERMISSION' : 'NO_PERMISSION',
        role: userRole,
        permissions: roleConfig.permissions
      });
    }

    // Verifica acesso a agente específico
    if (agentId) {
      let canAccess = false;

      if (roleConfig.permissions.allAgents) {
        canAccess = true;
      } else if (roleConfig.permissions.serginhoOnly && agentId === 'serginho') {
        canAccess = true;
      }

      return res.status(200).json({
        allowed: canAccess,
        unlimited: false,
        reason: canAccess ? 'AGENT_ACCESS_GRANTED' : 'NO_AGENT_PERMISSION',
        role: userRole,
        agentId
      });
    }

    // Retorna permissões gerais
    return res.status(200).json({
      allowed: true,
      unlimited: false,
      role: userRole,
      permissions: roleConfig.permissions,
      messageLimit: roleConfig.permissions.messageLimit || 10
    });

  } catch (error) {
    console.error('Check Access Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
