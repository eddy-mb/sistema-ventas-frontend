"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Custom hook para manejar la autenticación en toda la aplicación
 * Proporciona funcionalidades como cerrar sesión, verificar roles y permisos
 */
export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  /**
   * Cierra la sesión del usuario y muestra notificación de éxito
   */
  const logout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Sesión cerrada correctamente");
      router.push("/login?logout=true");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = (role: string | string[]): boolean => {
    if (!session?.user?.roles) return false;

    if (Array.isArray(role)) {
      return role.some((r) => session.user.roles.includes(r));
    }

    return session.user.roles.includes(role);
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const hasPermission = (permission: string | string[]): boolean => {
    if (!session?.user?.permisos) return false;

    if (Array.isArray(permission)) {
      return permission.some((p) => session.user.permisos.includes(p));
    }

    return session.user.permisos.includes(permission);
  };

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    user: session?.user,
    logout,
    hasRole,
    hasPermission,
    updateSession: update,
  };
}

export default useAuth;
