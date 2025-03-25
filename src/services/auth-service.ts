// src/services/auth-service.ts
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

// Clase de servicio de autenticación
class AuthService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  // Método para hacer login
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error en la autenticación");
    }

    return await response.json();
  }

  // Método para registrar un nuevo usuario
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await fetch(`${this.apiUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error en el registro");
    }

    return await response.json();
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
}

// Exportamos una instancia única del servicio
export const authService = new AuthService();
