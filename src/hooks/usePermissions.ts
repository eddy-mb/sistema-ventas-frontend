"use client";

import { useAuthContext } from "@/context/auth-context";

export function usePermissions() {
  const { hasPermission, hasRole, isAuthenticated } = useAuthContext();
  
  // Función para verificar si un elemento debería mostrarse
  const canAccess = (permission?: string, role?: string | string[]): boolean => {
    if (!isAuthenticated) return false;
    if (!permission && !role) return true;
    
    const hasRequiredPermission = !permission || hasPermission(permission);
    const hasRequiredRole = !role || hasRole(role);
    
    return hasRequiredPermission && hasRequiredRole;
  };
  
  // Función para renderizar condicionalmente un componente
  const renderIfHasAccess = (
    element: React.ReactNode, 
    permission?: string, 
    role?: string | string[]
  ): React.ReactNode | null => {
    return canAccess(permission, role) ? element : null;
  };
  
  return {
    canAccess,
    renderIfHasAccess,
    hasPermission,
    hasRole,
    isAuthenticated
  };
}
