// src/services/auth-service.ts
import { createModuleApi, ApiError } from "@/lib/axios";
import { Session } from "next-auth";

// Tipos para el usuario autenticado
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  rol: string;
  token: string;
  permissions?: string[];
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  message?: string;
}

// Respuesta del login
export interface LoginResponse {
  access_token: string;
  token_type: string;
  id: string;
  email: string;
  name: string;
  rol: string;
  permissions?: string[];
}

// Datos para el registro
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Datos para cambio de contraseña
export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Clase de servicio de autenticación
class AuthService {
  private api;

  constructor() {
    // Utilizamos el helper createModuleApi para las rutas de autenticación
    this.api = createModuleApi<LoginResponse>("/auth");
  }

  // Método para hacer login
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      return await this.api.post<LoginResponse>("/login", { email, password });
    } catch (error) {
      // Convertimos cualquier error a ApiError para un manejo consistente
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error en la autenticación");
    }
  }

  // Método para registrar un nuevo usuario
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      return await this.api.post<RegisterResponse>("/register", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error en el registro");
    }
  }

  // Método para cambiar la contraseña
  async changePassword(
    data: ChangePasswordData
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.api.post<{ success: boolean; message: string }>(
        "/change-password",
        data
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al cambiar la contraseña");
    }
  }

  // Método para solicitar restablecimiento de contraseña
  async requestPasswordReset(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.api.post<{ success: boolean; message: string }>(
        "/forgot-password",
        { email }
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          "Error al solicitar el restablecimiento de contraseña"
      );
    }
  }

  // Método para restablecer contraseña con token
  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.api.post<{ success: boolean; message: string }>(
        "/reset-password",
        {
          token,
          password,
          confirmPassword,
        }
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al restablecer la contraseña");
    }
  }

  // Método para cerrar sesión en el backend (invalida el token)
  async logout(): Promise<{ success: boolean }> {
    try {
      return await this.api.post<{ success: boolean }>("/logout");
    } catch {
      // Si hay un error al cerrar sesión en el backend, aún así consideramos
      // que la sesión se cerró correctamente en el cliente
      return { success: true };
    }
  }

  // Método para verificar si el usuario tiene un permiso específico
  hasPermission(session: Session | null, permission: string): boolean {
    if (!session || !session.user || !session.user.permissions) {
      return false;
    }

    return session.user.permissions.includes(permission);
  }

  // Método para verificar si el usuario tiene un rol específico
  hasRole(session: Session | null, role: string): boolean {
    if (!session || !session.user) {
      return false;
    }

    return session.user.rol === role;
  }

  // Método para obtener el perfil del usuario
  async getProfile(): Promise<AuthUser> {
    try {
      return await this.api.get<AuthUser>("/profile");
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al obtener el perfil del usuario"
      );
    }
  }

  // Método para actualizar el perfil del usuario
  async updateProfile(
    data: Partial<Omit<AuthUser, "id" | "token" | "rol" | "permissions">>
  ): Promise<AuthUser> {
    try {
      return await this.api.put<AuthUser>("/profile", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al actualizar el perfil del usuario"
      );
    }
  }
}

// Exportamos una instancia única del servicio
export const authService = new AuthService();
