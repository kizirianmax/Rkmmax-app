// src/hooks/useOwnerAccess.js
// Hook para verificar acesso e permissões do Owner

import { useAuth } from '../auth/AuthProvider.jsx';
import { isOwner, hasPermission, getUserPermissions, getUserBadge } from '../config/roles.js';
import { applyOwnerBypass } from '../middleware/ownerBypass.js';

/**
 * Hook para gerenciar acesso e permissões do Owner
 * @returns {Object}
 */
export function useOwnerAccess() {
  const { user } = useAuth();
  const isOwnerUser = isOwner(user);
  
  return {
    // Status do Owner
    isOwner: isOwnerUser,
    hasFullAccess: isOwnerUser,
    
    // Bypass de limites
    canBypassLimits: isOwnerUser,
    canBypassPaywall: isOwnerUser,
    canBypassRateLimit: isOwnerUser,
    
    // Features especiais
    canSimulateUsers: isOwnerUser,
    canAccessAdmin: isOwnerUser,
    debugMode: isOwnerUser,
    
    // Configuração de acesso completa
    accessConfig: isOwnerUser ? applyOwnerBypass(user) : null,
    
    // Badge
    badge: isOwnerUser ? '👑' : null,
    badgeText: isOwnerUser ? 'DONO' : null,
    
    // Permissões
    permissions: getUserPermissions(user),
    userBadge: getUserBadge(user),
    
    // Helper function
    checkPermission: (permission) => hasPermission(user, permission)
  };
}

export default useOwnerAccess;
