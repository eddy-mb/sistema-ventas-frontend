/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/axios.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

// Error personalizado para las llamadas a la API
export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  code?: string;

  constructor(
    message: string,
    status?: number,
    errors?: Record<string, string[]>,
    code?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

// Función para crear una instancia de Axios con la configuración base
export function createAxiosInstance(
  config?: AxiosRequestConfig
): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });

  // Interceptor de solicitud para añadir el token de autenticación
  instance.interceptors.request.use(
    async (config) => {
      // Solo en el cliente (navegador)
      if (typeof window !== "undefined") {
        const session = await getSession();
        if (session?.user?.token) {
          config.headers.Authorization = `Bearer ${session.user.token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor de respuesta para manejar errores
  instance.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
      if (error.response) {
        // La solicitud fue realizada y el servidor respondió con un código de estado
        // que no está en el rango 2xx
        const status = error.response.status;
        const data = error.response.data as any;
        const message =
          data?.detail || data?.message || "Error en la solicitud";
        const errors = data?.errors;
        const code = data?.code;

        throw new ApiError(message, status, errors, code);
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        throw new ApiError("No se recibió respuesta del servidor", 0);
      } else {
        // Error al configurar la solicitud
        throw new ApiError(
          error.message || "Error al realizar la solicitud",
          0
        );
      }
    }
  );

  return instance;
}

// Instancia principal de Axios para la aplicación
export const api = createAxiosInstance();

// Función para crear API específicas para diferentes módulos
export function createModuleApi<T = any>(
  modulePath: string,
  config?: AxiosRequestConfig
) {
  const moduleApi = createAxiosInstance({
    ...config,
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}${modulePath}`,
  });

  return {
    get: <R = T>(url: string, config?: AxiosRequestConfig) =>
      moduleApi.get<any, R>(url, config),

    post: <R = T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      moduleApi.post<any, R>(url, data, config),

    put: <R = T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      moduleApi.put<any, R>(url, data, config),

    patch: <R = T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      moduleApi.patch<any, R>(url, data, config),

    delete: <R = T>(url: string, config?: AxiosRequestConfig) =>
      moduleApi.delete<any, R>(url, config),
  };
}
