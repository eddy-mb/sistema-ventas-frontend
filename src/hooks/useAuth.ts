"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { authService } from "@/services/auth-service";
import { toastErrorAuth, toastSuccess, toastError } from "@/lib/toast-utils";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toastErrorAuth(result.error);
          return {
            success: false,
            error: result.error,
          };
        }

        // Actualizar la sesión para asegurarnos de tener los datos más recientes
        await update();

        router.refresh();
        toastSuccess({
          title: "Inicio de sesión exitoso",
          message: "Bienvenido(a) al sistema de Ama Wara Tours",
        });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        };
      } finally {
        setLoading(false);
      }
    },
    [router, update]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setLoading(true);
        await authService.register({ name, email, password });
        toastSuccess({
          title: "Registro exitoso",
          message: "Ahora puedes iniciar sesión.",
        });
        return { success: true };
      } catch (error) {
        toastErrorAuth(error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Notificamos al backend sobre el cierre de sesión
      if (session?.user?.id) {
        // Intentar hacer logout en el backend, pero no bloquear si falla
        try {
          await authService.logout();
        } catch (error) {
          console.error("Error al notificar logout al backend:", error);
        }
      }

      await signOut({ redirect: false });
      toastSuccess({
        title: "Sesión cerrada",
        message: "Has cerrado sesión correctamente",
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toastError(error);
    } finally {
      setLoading(false);
    }
  }, [router, session?.user?.id]);

  // Función para solicitar restablecimiento de contraseña
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const response = await authService.requestPasswordReset(email);
      if (response.success) {
        toastSuccess({
          title: "Solicitud enviada",
          message: response.message || "Instrucciones enviadas a tu correo",
        });
      }
      return {
        success: response.success,
        message: response.message,
        error:
          response.error instanceof Error
            ? response.error.message
            : typeof response.error === "string"
            ? response.error
            : response.error
            ? "Error desconocido"
            : undefined,
      };
    } catch (error) {
      toastErrorAuth(error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para restablecer contraseña con token
  const resetPassword = useCallback(
    async (token: string, password: string, confirmPassword: string) => {
      try {
        setLoading(true);
        const response = await authService.resetPassword(
          token,
          password,
          confirmPassword
        );
        if (response.success) {
          toastSuccess({
            title: "Contraseña restablecida",
            message:
              response.message || "Contraseña restablecida correctamente",
          });
        }
        return {
          success: response.success,
          message: response.message,
          error:
            response.error instanceof Error
              ? response.error.message
              : typeof response.error === "string"
              ? response.error
              : response.error
              ? "Error desconocido"
              : undefined,
        };
      } catch (error) {
        toastErrorAuth(error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const hasPermission = useCallback(
    (permission: string) => {
      return authService.hasPermission(session, permission);
    },
    [session]
  );

  const hasRole = useCallback(
    (role: string | string[]) => {
      return authService.hasRole(session, role);
    },
    [session]
  );

  return {
    session,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || loading,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    hasPermission,
    hasRole,
  };
}
