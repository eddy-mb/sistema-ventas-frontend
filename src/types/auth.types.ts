// Interfaz para representar la respuesta de login
export interface LoginResponse {
  access_token: string;
  usuario: Usuario;
}

export interface Usuario {
  id: string;
  nombreUsuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  roles: string[];
  permisos: string[];
}

// Interfaz para representar el usuario autenticado
export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  roles: string[];
  permisos?: string[];
  accessToken: string;
}

// Interfaz para las credenciales de login
export interface LoginCredentials {
  nombreUsuario: string;
  contrasena: string;
}

// Interfaz para datos de registro
export interface RegisterData {
  nombre: string;
  apellidos: string;
  email: string;
  nombreUsuario: string;
  contrasena: string;
}

// Interfaz genérica para respuestas de autenticación
export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
