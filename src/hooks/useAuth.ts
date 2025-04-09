"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth-service";
import { auditService } from "@/services/audit-service";
import { toast } from "sonner";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Registrar inicio de sesión cuando cambia el estado de autenticación
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      // Solo registramos la primera vez que se autentica (no en cada renderizado)
      const lastLoginTime = sessionStorage.getItem('lastLoginTime');
      const currentTime = new Date().getTime();
      
      // Solo registrar si no hay login previo o si han pasado al menos 5 minutos
      if (!lastLoginTime || (currentTime - parseInt(lastLoginTime)) > 5 * 60 * 1000) {
        auditService.logLogin(session.user.id).catch(console.error);
        sessionStorage.setItem('lastLoginTime', currentTime.toString());
      }
    }
  }, [status, session?.user?.id]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Error de autenticación: " + result.error);
        return {
          success: false,
          error: result.error
        };
      }

      // Actualizar la sesión para asegurarnos de tener los datos más recientes
      await update();
      
      router.refresh();
      toast.success("Inicio de sesión exitoso");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    } finally {
      setLoading(false);
    }
  }, [router, update]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      await authService.register({ name, email, password });
      toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
      return { success: true };
    } catch (error) {
      toast.error("Error en el registro: " + (error instanceof Error ? error.message : "Error desconocido"));
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Registrar cierre de sesión antes de cerrar la sesión
      if (session?.user?.id) {
        // Intentar hacer logout en el backend, pero no bloquear si falla
        try {
          await auditService.logLogout(session.user.id);
          await authService.logout();
        } catch (error) {
          console.error("Error al registrar logout en backend:", error);
        }
      }

      await signOut({ redirect: false });
      sessionStorage.removeItem('lastLoginTime');
      toast.info("Sesión cerrada correctamente");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Hubo un problema al cerrar la sesión");
    } finally {
      setLoading(false);
    }
  }, [router, session?.user?.id]);

  const hasPermission = useCallback((permission: string) => {
    return authService.hasPermission(session, permission);
  }, [session]);

  const hasRole = useCallback((role: string) => {
    return authService.hasRole(session, role);
  }, [session]);

  return {
    session,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || loading,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
  };
}
