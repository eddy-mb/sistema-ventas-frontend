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
  // Solo intentamos obtener la sesión en el cliente
  if (typeof window !== "undefined") {
    try {
      const session = await getSession();

      // Si hay una sesión activa, añadimos el token a los headers
      if (session?.token) {
        // Usamos la API de AxiosHeaders para manipular los headers
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
  // Mostrar un mensaje al usuario
  toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");

  // Cerrar la sesión
  await signOut({ redirect: false });

  // Redirigir a la página de login
  window.location.href = "/login";
};

// Función para procesar errores de Axios
const handleAxiosError = (error: AxiosError): Promise<never> => {
  const apiError: ApiError = {
    status: error.response?.status || 500,
    message: "Ocurrió un error inesperado.",
  };

  // Intentar extraer el mensaje de error de la respuesta
  if (error.response?.data) {
    // Definimos una interfaz para los tipos de respuestas de error comunes
    interface ErrorResponse {
      detail?: string;
      message?: string;
      errors?: Record<string, string[]>;
      code?: string;
    }

    // Intentamos convertir la respuesta al formato esperado
    try {
      const errorData = error.response.data as ErrorResponse;

      if (errorData.detail) {
        apiError.message = errorData.detail;
      } else if (errorData.message) {
        apiError.message = errorData.message;
      } else if (typeof error.response.data === "string") {
        apiError.message = error.response.data;
      }

      // Extraer errores de validación si existen
      if (errorData.errors) {
        apiError.errors = errorData.errors;
      }

      // Extraer código de error si existe
      if (errorData.code) {
        apiError.code = errorData.code;
      }
    } catch (parseError) {
      // Si hay un error al procesar la respuesta, usamos el mensaje por defecto
      console.error("Error parsing API error response:", parseError);
    }
  }

  // Loguear el error para debugging (en desarrollo)
  if (process.env.NODE_ENV !== "production") {
    console.error("API Error:", apiError, error);
  }

  // Mostrar mensajes de error comunes
  switch (apiError.status) {
    case 400:
      if (!apiError.message.includes("válid")) {
        toast.error("Datos de solicitud incorrectos.");
      } else {
        toast.error(apiError.message);
      }
      break;
    case 401:
      if (!error.config?.url?.includes("login")) {
        toast.error("Sesión no válida.");
      }
      break;
    case 403:
      toast.error("No tienes permisos para realizar esta acción.");
      break;
    case 404:
      toast.error("Recurso no encontrado.");
      break;
    case 409:
      toast.error("El recurso ya existe o hay un conflicto.");
      break;
    case 422:
      toast.error("Datos de formulario inválidos.");
      break;
    case 429:
      toast.error("Demasiadas solicitudes. Intenta más tarde.");
      break;
    case 500:
    case 502:
    case 503:
      toast.error("Error en el servidor. Intenta más tarde.");
      break;
    default:
      if (apiError.message) {
        toast.error(apiError.message);
      } else {
        toast.error("Ocurrió un error inesperado.");
      }
  }

  return Promise.reject(apiError);
};

const responseErrorInterceptor = async (error: AxiosError): Promise<never> => {
  // Creamos una referencia tipada a la configuración original
  const originalConfig = error.config;

  // Si no hay configuración, rechazamos directamente
  if (!originalConfig) {
    return handleAxiosError(error);
  }

  // Verificamos si ya se ha reintentado la petición
  // Usamos un approach más seguro para verificar el header personalizado
  const hasRetried =
    originalConfig.headers &&
    (originalConfig.headers as Record<string, string>)["X-Retry-Count"] === "1";

  // Manejo de error de autenticación (token expirado)
  if (error.response?.status === 401 && !hasRetried && originalConfig.headers) {
    // Si estamos en el cliente y no es una solicitud de login
    if (
      typeof window !== "undefined" &&
      !originalConfig.url?.includes("login")
    ) {
      try {
        // Creamos una copia del config para modificarlo de forma segura
        const newConfig = { ...originalConfig } as InternalAxiosRequestConfig;

        // Creamos una copia de los headers para modificarlos
        newConfig.headers = axios.AxiosHeaders.from(originalConfig.headers);

        // Marcar que estamos reintentando para evitar loops
        newConfig.headers.set("X-Retry-Count", "1");

        // Intentar renovar la sesión
        const session = await getSession();

        // Si no hay sesión después de intentar renovarla, redirigir al login
        if (!session) {
          await handleSessionExpired();
          return Promise.reject(error);
        }

        // Si se renovó la sesión, reintentar la solicitud original con un nuevo token
        newConfig.headers.set("Authorization", `Bearer ${session.token}`);

        return axiosClient(newConfig);
      } catch (error) {
        // Si falla la renovación, registramos el error y cerramos sesión
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
  timeout: 15000, // 15 segundos de timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Aplicar interceptores al cliente principal
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

  // Aplicar los mismos interceptores sin duplicar el código
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

// Exportar función para crear configuraciones específicas por módulo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createModuleApi = <T = any>(basePath: string) => {
  return {
    get: <R = T>(url: string, config?: AxiosRequestConfig) =>
      axiosClient.get<R>(`${basePath}${url}`, config).then((res) => res.data),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: <R = T, D = Record<string, any>>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig
    ) =>
      axiosClient
        .post<R>(`${basePath}${url}`, data, config)
        .then((res) => res.data),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put: <R = T, D = Record<string, any>>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig
    ) =>
      axiosClient
        .put<R>(`${basePath}${url}`, data, config)
        .then((res) => res.data),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patch: <R = T, D = Record<string, any>>(
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

// Para usar directamente el cliente base
export default axiosClient;
