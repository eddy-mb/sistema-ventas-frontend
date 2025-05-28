/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "../api";

/**
 * Maneja errores de servicios de forma consistente
 */
export function handleServiceError(
  error: unknown,
  defaultMessage = "Error desconocido"
): { success: false; error: string } {
  return {
    success: false,
    error:
      error instanceof ApiError
        ? error.message
        : error instanceof Error
        ? error.message
        : defaultMessage,
  };
}

/**
 * Construye una cadena de parámetros URL a partir de un objeto de filtros
 */
export function buildUrlParams(filters: Record<string, any>): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });

  return params.toString();
}

/**
 * Normaliza una respuesta de API a un array del tipo especificado
 */
export function normalizeResponse<T>(response: any): T[] {
  const data = response.data || response || [];
  return Array.isArray(data) ? data : [];
}

/**
 * Normaliza una respuesta paginada de API
 */
export function normalizePaginatedResponse<T>(response: any): {
  data: T[];
  total: number;
} {
  const data = response.data || response || [];
  const total = response.total || (Array.isArray(data) ? data.length : 0);

  return { data, total };
}
