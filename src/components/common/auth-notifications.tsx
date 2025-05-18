"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

/**
 * Componente que maneja las notificaciones toast basadas en parámetros de URL
 */
export function AuthNotifications() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Notificaciones relacionadas con autenticación
    const registered = searchParams.get("registered") === "true";
    const emailVerified = searchParams.get("emailVerified") === "true";
    const passwordReset = searchParams.get("passwordReset") === "true";
    const logout = searchParams.get("logout") === "true";
    const authError = searchParams.get("error");

    // Mostrar notificaciones basadas en los parámetros de la URL
    if (registered) {
      toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
    } else if (emailVerified) {
      toast.success("Tu correo ha sido verificado correctamente.");
    } else if (passwordReset) {
      toast.success("Tu contraseña ha sido restablecida correctamente.");
    } else if (logout) {
      toast.info("Has cerrado sesión correctamente.");
    } else if (authError) {
      // Manejar diferentes tipos de errores de autenticación
      switch (authError) {
        case "CredentialsSignin":
          toast.error("Credenciales inválidas. Por favor, verifica tus datos.");
          break;
        case "SessionRequired":
          toast.error("Debes iniciar sesión para acceder a esta página.");
          break;
        default:
          toast.error("Error de autenticación. Por favor, intenta de nuevo.");
      }
    }

    // Limpiar los parámetros de la URL para evitar notificaciones duplicadas en recargas
    if (registered || emailVerified || passwordReset || logout || authError) {
      // Crear una nueva URL sin los parámetros de notificación
      const params = new URLSearchParams(searchParams);
      params.delete("registered");
      params.delete("emailVerified");
      params.delete("passwordReset");
      params.delete("logout");
      params.delete("error");

      // Si hay otros parámetros, mantenerlos; si no, eliminar completamente la cadena de consulta
      const newUrl = params.size > 0 
        ? `${pathname}?${params.toString()}` 
        : pathname;

      // Reemplazar la URL actual sin causar una recarga de página
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return <Toaster position="top-right" closeButton richColors />;
}
