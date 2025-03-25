"use client";

import { useAuthContext } from "@/context/auth-context";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

interface ProtectedProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: ReactNode;
}

export function Protected({
  children,
  requiredPermission,
  requiredRole,
  fallback,
}: ProtectedProps) {
  const { hasPermission, hasRole, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    redirect("/login");
    return null;
  }

  // Verificar permisos si se especifica
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-12">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          <h2 className="text-lg font-semibold mb-2">Acceso denegado</h2>
          <p>
            No tiene permisos para acceder a esta sección. Se requiere el
            permiso: <strong>{requiredPermission}</strong>
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  // Verificar rol si se especifica
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-12">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          <h2 className="text-lg font-semibold mb-2">Acceso denegado</h2>
          <p>
            No tiene el rol necesario para acceder a esta sección. Se requiere
            el rol: <strong>{requiredRole}</strong>
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  // Si pasa todas las verificaciones, mostrar el contenido
  return <>{children}</>;
}
