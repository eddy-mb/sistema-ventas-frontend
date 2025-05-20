/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

// Clase para errores de API
export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

// Creamos una instancia base de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token de autenticación automáticamente
api.interceptors.request.use(
  async (config) => {
    // Solo en el cliente y cuando estamos autenticados
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag para evitar múltiples redirecciones
let isRedirecting = false;

// Interceptor para manejar errores de manera uniforme
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Si recibimos un 401 (Unauthorized) o 403 (Forbidden), el token ha expirado
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Prevenimos redirecciones múltiples si hay varias peticiones fallando
      if (!isRedirecting && typeof window !== "undefined") {
        isRedirecting = true;

        // Cerrar sesión y redirigir al login
        await signOut({ redirect: false });
        window.location.href = "/login?expired=true";
      }
    }
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const message = data?.message || "Error en la solicitud";
      const errors = data?.errors || {};

      throw new ApiError(message, status, errors);
    } else if (error.request) {
      throw new ApiError("No se recibió respuesta del servidor");
    } else {
      throw new ApiError(error.message || "Error al realizar la solicitud");
    }
  }
);

// Interface para los métodos de API
export interface ApiClient<T = any> {
  get<R = T>(url?: string, config?: AxiosRequestConfig): Promise<R>;
  post<R = T>(
    url?: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>;
  put<R = T>(url?: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
  patch<R = T>(
    url?: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>;
  delete<R = T>(url?: string, config?: AxiosRequestConfig): Promise<R>;
}

// Helper function para crear APIs específicas para cada módulo
export function createApi<T = any>(path: string): ApiClient<T> {
  return {
    get: <R = T>(url = "", config = {}) =>
      api.get<any, R>(`${path}${url}`, config),

    post: <R = T>(url = "", data = {}, config = {}) =>
      api.post<any, R>(`${path}${url}`, data, config),

    put: <R = T>(url = "", data = {}, config = {}) =>
      api.put<any, R>(`${path}${url}`, data, config),

    patch: <R = T>(url = "", data = {}, config = {}) =>
      api.patch<any, R>(`${path}${url}`, data, config),

    delete: <R = T>(url = "", config = {}) =>
      api.delete<any, R>(`${path}${url}`, config),
  };
}

export default api;
