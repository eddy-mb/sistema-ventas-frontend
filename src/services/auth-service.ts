import { createApi } from "@/lib/api";
import { handleServiceError } from "@/lib/api-helpers";
import { AuthResponse, RegisterData } from "@/types/auth.types";

/**
 * Servicio de autenticación
 *
 * Este servicio maneja las funciones auxiliares de autenticación
 * que NO están directamente relacionadas con el inicio de sesión
 * (que ya está manejado por NextAuth)
 */
class AuthService {
  private api;

  constructor() {
    this.api = createApi("/auth");
  }

  /**
   * Registro de usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      await this.api.post("/register", data);
      return {
        success: true,
        message: "Registro exitoso",
      };
    } catch (error) {
      return handleServiceError(error, "Error en registro");
    }
  }

  /**
   * Solicitar restablecimiento de contraseña
   */
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      await this.api.post("/password/reset-request", { email });
      return {
        success: true,
        message: "Instrucciones enviadas a tu correo",
      };
    } catch (error) {
      return handleServiceError(error, "Error al solicitar reseteo de contraseña");
    }
  }

  /**
   * Completar el restablecimiento de contraseña
   */
  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      await this.api.post("/password/reset", { token, password });
      return {
        success: true,
        message: "Contraseña restablecida exitosamente",
      };
    } catch (error) {
      return handleServiceError(error, "Error al restablecer contraseña");
    }
  }
}

// Exportamos una instancia única del servicio
export const authService = new AuthService();
