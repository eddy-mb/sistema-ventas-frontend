// src/lib/axios.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";

// Tipos para manejo de errores
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

// Configuración base del cliente
const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

// Funciones de interceptores para reutilizar
const requestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  if (typeof window !== "undefined") {
    try {
      const session = await getSession();
      if (session?.token) {
        config.headers.set("Authorization", `Bearer ${session.token}`);
      }
    } catch (error) {
      console.error("Error al obtener la sesión:", error);
    }
  }
  return config;
};

const requestErrorInterceptor = (error: AxiosError): Promise<never> => {
  return Promise.reject(error);
};

const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

// Función para manejar la expiración de la sesión
const handleSessionExpired = async () => {
  toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
  await signOut({ redirect: false });
  window.location.href = "/login";
};

// Función para procesar errores de Axios
const handleAxiosError = (error: AxiosError): Promise<never> => {
  const apiError: ApiError = {
    status: error.response?.status || 500,
    message: "Ocurrió un error inesperado.",
  };

  try {
    const errorData = error.response?.data as {
      detail?: string;
      message?: string;
      errors?: Record<string, string[]>;
      code?: string;
    };

    if (errorData?.detail) {
      apiError.message = errorData.detail;
    } else if (errorData?.message) {
      apiError.message = errorData.message;
    } else if (typeof error.response?.data === "string") {
      apiError.message = error.response.data;
    }

    if (errorData?.errors) {
      apiError.errors = errorData.errors;
    }

    if (errorData?.code) {
      apiError.code = errorData.code;
    }
  } catch (parseError) {
    console.error("Error parsing API error response:", parseError);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("API Error:", apiError, error);
  }

  const errorMessages: Record<number, string> = {
    400: "Datos de solicitud incorrectos.",
    401: "Sesión no válida.",
    403: "No tienes permisos para realizar esta acción.",
    404: "Recurso no encontrado.",
    409: "El recurso ya existe o hay un conflicto.",
    422: "Datos de formulario inválidos.",
    429: "Demasiadas solicitudes. Intenta más tarde.",
    500: "Error en el servidor. Intenta más tarde.",
    502: "Error en el servidor. Intenta más tarde.",
    503: "Error en el servidor. Intenta más tarde.",
  };

  toast.error(errorMessages[apiError.status] || apiError.message);

  return Promise.reject(apiError);
};

const responseErrorInterceptor = async (error: AxiosError): Promise<never> => {
  const originalConfig = error.config;

  if (!originalConfig) {
    return handleAxiosError(error);
  }

  const hasRetried = originalConfig.headers?.["X-Retry-Count"] === "1";

  if (error.response?.status === 401 && !hasRetried && originalConfig.headers) {
    if (
      typeof window !== "undefined" &&
      !originalConfig.url?.includes("login")
    ) {
      try {
        const newConfig = { ...originalConfig } as InternalAxiosRequestConfig;
        newConfig.headers = axios.AxiosHeaders.from(originalConfig.headers);
        newConfig.headers.set("X-Retry-Count", "1");

        const session = await getSession();

        if (!session) {
          await handleSessionExpired();
          return Promise.reject(error);
        }

        newConfig.headers.set("Authorization", `Bearer ${session.token}`);

        return axiosClient(newConfig);
      } catch (error) {
        console.error("Error al renovar la sesión:", error);
        await handleSessionExpired();
        return Promise.reject(error);
      }
    }
  }

  return handleAxiosError(error);
};

// Cliente Axios principal
const axiosClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

axiosClient.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

// Función para crear una instancia de axios con configuración específica
export const createAxiosInstance = (
  config?: AxiosRequestConfig
): AxiosInstance => {
  const instance = axios.create({
    ...axiosClient.defaults,
    ...config,
  });

  instance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  );

  instance.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor
  );

  return instance;
};

// Función para crear APIs modulares
export const createModuleApi = <T = unknown>(basePath: string) => {
  return {
    get: <R = T>(url: string, config?: AxiosRequestConfig) =>
      axiosClient.get<R>(`${basePath}${url}`, config).then((res) => res.data),

    post: <R = T, D = Record<string, unknown>>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig
    ) =>
      axiosClient
        .post<R>(`${basePath}${url}`, data, config)
        .then((res) => res.data),

    put: <R = T, D = Record<string, unknown>>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig
    ) =>
      axiosClient
        .put<R>(`${basePath}${url}`, data, config)
        .then((res) => res.data),

    patch: <R = T, D = Record<string, unknown>>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig
    ) =>
      axiosClient
        .patch<R>(`${basePath}${url}`, data, config)
        .then((res) => res.data),

    delete: <R = T>(url: string, config?: AxiosRequestConfig) =>
      axiosClient
        .delete<R>(`${basePath}${url}`, config)
        .then((res) => res.data),
  };
};

export default axiosClient;
