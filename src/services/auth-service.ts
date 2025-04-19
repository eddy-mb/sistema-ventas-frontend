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

// Respuesta genérica para operaciones de autenticación
export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError | Error | unknown;
}

// Clase de servicio de autenticación
class AuthService {
  private api;

  constructor() {
    // Utilizamos el helper createModuleApi para las rutas de autenticación
    this.api = createModuleApi<LoginResponse>("/auth");
  }

  // Método para hacer login
  async login(
    email: string,
    password: string
  ): Promise<AuthResponse<LoginResponse>> {
    try {
      const data = await this.api.post<LoginResponse>("/login", {
        email,
        password,
      });
      return {
        success: true,
        data,
        message: "Inicio de sesión exitoso",
      };
    } catch (error) {
      return {
        success: false,
        error,
        message:
          error instanceof ApiError ? error.message : "Error al iniciar sesión",
      };
    }
  }

  // Método para registrar un nuevo usuario
  async register(data: RegisterData): Promise<AuthResponse<RegisterResponse>> {
    try {
      const response = await this.api.post<RegisterResponse>("/register", data);
      return {
        success: true,
        data: response,
        message: response.message || "Registro exitoso",
      };
    } catch (error) {
      return {
        success: false,
        error,
        message:
          error instanceof ApiError ? error.message : "Error en el registro",
      };
    }
  }

  // Método para cambiar la contraseña
  async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
    try {
      const response = await this.api.post<{
        success: boolean;
        message: string;
      }>("/change-password", data);
      return {
        success: response.success,
        message: response.message || "Contraseña cambiada exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        error,
        message:
          error instanceof ApiError
            ? error.message
            : "Error al cambiar la contraseña",
      };
    }
  }

  // Método para solicitar restablecimiento de contraseña
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<{
        success: boolean;
        message: string;
      }>("/forgot-password", { email });
      return {
        success: response.success,
        message: response.message || "Instrucciones enviadas a tu correo",
      };
    } catch (error) {
      return {
        success: false,
        error,
        message:
          error instanceof ApiError
            ? error.message
            : "Error al solicitar el restablecimiento de contraseña",
      };
    }
  }

  // Método para restablecer contraseña con token
  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    try {
      const response = await this.api.post<{
        success: boolean;
        message: string;
      }>("/reset-password", {
        token,
        password,
        confirmPassword,
      });
      return {
        success: response.success,
        message: response.message || "Contraseña restablecida exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        error,
        message:
          error instanceof ApiError
            ? error.message
            : "Error al restablecer la contraseña",
      };
    }
  }

  // Método para cerrar sesión en el backend (invalida el token)
  async logout(): Promise<AuthResponse> {
    try {
      await this.api.post<{ success: boolean }>("/logout");
      return {
        success: true,
        message: "Sesión cerrada exitosamente",
      };
    } catch (error) {
      // Incluso si hay un error en el backend, consideramos el logout exitoso
      // en el cliente, pero registramos el error para diagnóstico
      console.warn("Error al cerrar sesión en el backend:", error);
      return {
        success: true,
        message: "Sesión cerrada exitosamente",
      };
    }
  }

  // Método para verificar si el usuario tiene un permiso específico
  hasPermission(session: Session | null, permission: string): boolean {
    if (!session || !session.user || !session.user.permisos) {
      return false;
    }

    return session.user.permisos.includes(permission);
  }

  // Método para verificar si el usuario tiene un rol específico
  // Acepta un rol individual o un array de roles
  hasRole(session: Session | null, role: string | string[]): boolean {
    if (!session || !session.user || !session.user.rol) {
      return false;
    }

    // Si session.user.rol es un array, verificamos la intersección
    if (Array.isArray(session.user.rol)) {
      const rolesToCheck = Array.isArray(role) ? role : [role];
      return session.user.rol.some((userRole) =>
        rolesToCheck.includes(userRole)
      );
    }

    // Si el rol es un string
    if (typeof session.user.rol === "string") {
      // Si el argumento es un array, verificamos si el rol del usuario está en el array
      if (Array.isArray(role)) {
        return role.includes(session.user.rol);
      }
      // Si el argumento es un string, comparamos directamente
      return session.user.rol === role;
    }

    return false;
  }

  // Método para obtener el perfil del usuario
  async getProfile(): Promise<AuthResponse<AuthUser>> {
    try {
      const data = await this.api.get<AuthUser>("/profile");
      return {
        success: true,
        data,
        message: "Perfil obtenido exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        error,
        message:
          error instanceof ApiError
            ? error.message
            : "Error al obtener el perfil del usuario",
      };
    }
  }

  // Método para actualizar el perfil del usuario
  async updateProfile(
    data: Partial<Omit<AuthUser, "id" | "token" | "rol" | "permissions">>
  ): Promise<AuthResponse<AuthUser>> {
    try {
      const response = await this.api.put<AuthUser>("/profile", data);
      return {
        success: true,
        data: response,
        message: "Perfil actualizado exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        error,
        message:
          error instanceof ApiError
            ? error.message
            : "Error al actualizar el perfil del usuario",
      };
    }
  }

  // Verificar si un error es de un tipo específico
  isErrorOfType(error: unknown, errorMessage: string): boolean {
    if (error instanceof ApiError) {
      return error.message.toLowerCase().includes(errorMessage.toLowerCase());
    }
    if (error instanceof Error) {
      return error.message.toLowerCase().includes(errorMessage.toLowerCase());
    }
    if (typeof error === "string") {
      return error.toLowerCase().includes(errorMessage.toLowerCase());
    }
    return false;
  }
}

// Exportamos una instancia única del servicio
export const authService = new AuthService();
