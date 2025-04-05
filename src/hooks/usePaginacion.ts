// src/hooks/usePaginatedQuery.ts
import { useState, useEffect, useCallback } from "react";
import { ApiError as AxiosApiError } from "@/lib/axios";

// Extendemos ApiError para que sea compatible con Error nativo
interface ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  [key: string]: unknown; // Otros parámetros como filters, sort, etc.
}

interface PaginatedQueryState<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PaginatedQueryOptions {
  enabled?: boolean;
  onSuccess?: (data: PaginatedResponse<unknown>) => void;
  onError?: (error: ApiError) => void;
  initialPage?: number;
  initialLimit?: number;
}

/**
 * Hook para realizar peticiones GET paginadas
 * @param queryFn Función que realiza la petición a la API
 * @param params Parámetros de paginación y filtros
 * @param options Opciones adicionales
 */
export function usePaginatedQuery<T>(
  queryFn: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  params: Omit<PaginationParams, "page" | "limit"> = {},
  options: PaginatedQueryOptions = {}
) {
  const {
    enabled = true,
    onSuccess,
    onError,
    initialPage = 1,
    initialLimit = 10,
  } = options;

  const [queryParams, setQueryParams] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit,
    ...params,
  });

  const [state, setState] = useState<PaginatedQueryState<T>>({
    data: [],
    isLoading: enabled,
    error: null,
    isError: false,
    pagination: {
      page: initialPage,
      limit: initialLimit,
      total: 0,
      totalPages: 0,
    },
  });

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      isError: false,
    }));

    try {
      const response = await queryFn(queryParams);

      const total = response.total;
      const totalPages = Math.ceil(total / queryParams.limit);

      setState({
        data: response.data,
        isLoading: false,
        error: null,
        isError: false,
        pagination: {
          page: queryParams.page,
          limit: queryParams.limit,
          total,
          totalPages,
        },
      });

      onSuccess?.(response);
    } catch (err) {
      // Convertir el error en un objeto de tipo ApiError compatible con Error
      const axiosError = err as AxiosApiError;
      const error = new Error(
        axiosError.message || "Error desconocido"
      ) as ApiError;
      error.status = axiosError.status;
      error.errors = axiosError.errors;
      error.code = axiosError.code;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error,
        isError: true,
      }));
      onError?.(error);
    }
  }, [queryFn, queryParams, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setPage = useCallback((page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1, // Resetear a la primera página al cambiar el límite
      limit,
    }));
  }, []);

  const setFilters = useCallback((filters: Record<string, unknown>) => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1, // Resetear a la primera página al cambiar los filtros
      ...filters,
    }));
  }, []);

  return {
    ...state,
    setPage,
    setLimit,
    setFilters,
    refetch: fetchData,
  };
}
