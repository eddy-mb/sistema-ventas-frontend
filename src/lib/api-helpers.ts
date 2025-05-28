/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "./api";

/**
 * Normaliza una respuesta paginada de la API
 * @param response Respuesta de la API
 * @returns Objeto normalizado con datos y total
 */
export function normalizePaginatedResponse<T>(response: any): {
  data: T[];
  total: number;
} {
  if (!response || typeof response !== "object") {
    return { data: [], total: 0 };
  }

  return {
    data: Array.isArray(response.data) ? response.data : [],
    total: response.total || response.data?.length || 0,
  };
}

/**
 * Normaliza una respuesta de array de la API
 * @param response Respuesta de la API
 * @returns Array normalizado
 */
export function normalizeResponse<T>(response: any): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (response?.data && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

/**
 * Construye una cadena de parámetros URL a partir de un objeto
 * @param params Objeto de parámetros
 * @returns Cadena de parámetros URL
 */
export function buildUrlParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(`${key}[]`, item));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

/**
 * Maneja errores de servicios API de manera uniforme
 * @param error Error capturado
 * @param defaultMessage Mensaje por defecto
 * @returns Respuesta de error estandarizada
 */
export function handleServiceError(
  error: any,
  defaultMessage = "Error en la operación"
): {
  success: false;
  error: string;
} {
  if (error instanceof ApiError) {
    // Si es un error de nuestra API con mensaje personalizado
    return {
      success: false,
      error: error.message || defaultMessage,
    };
  }

  // Para otros tipos de errores
  return {
    success: false,
    error: error?.message || defaultMessage,
  };
}
