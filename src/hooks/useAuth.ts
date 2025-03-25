"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth-service";
import { auditService } from "@/services/audit-service";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Registrar inicio de sesión cuando cambia el estado de autenticación
  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      auditService.logLogin(session.user.id);
    }
  }, [status, session?.user.id]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.refresh();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      await authService.register({ name, email, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Registrar cierre de sesión antes de cerrar la sesión
    if (session?.user.id) {
      await auditService.logLogout(session.user.id);
    }

    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading" || loading;

  const hasPermission = (permission: string) => {
    return authService.hasPermission(session, permission);
  };

  const hasRole = (role: string) => {
    return authService.hasRole(session, role);
  };

  return {
    session,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
  };
}
