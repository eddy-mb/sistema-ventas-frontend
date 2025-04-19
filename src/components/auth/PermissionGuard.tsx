"use client";

import React from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  role?: string | string[];
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  role,
  fallback = null
}: PermissionGuardProps) {
  const { canAccess } = usePermissions();
  
  if (canAccess(permission, role)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
