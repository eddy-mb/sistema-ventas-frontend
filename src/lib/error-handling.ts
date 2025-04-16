/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "./axios";

/**
 * Tipos de errores de autenticación que pueden ocurrir
 */
export enum AuthErrorType {
  // Errores de credenciales
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",

  // Errores de registro
  EMAIL_EXISTS = "EMAIL_EXISTS",
  USERNAME_EXISTS = "USERNAME_EXISTS",
  PASSWORD_TOO_WEAK = "PASSWORD_TOO_WEAK",

  // Errores de restablecimiento de contraseña
  INVALID_RESET_TOKEN = "INVALID_RESET_TOKEN",
  EXPIRED_RESET_TOKEN = "EXPIRED_RESET_TOKEN",
  PASSWORDS_DONT_MATCH = "PASSWORDS_DONT_MATCH",

  // Errores de red y servidor
  NETWORK_ERROR = "NETWORK_ERROR",
  SERVER_ERROR = "SERVER_ERROR",

  // Error genérico
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Información específica para cada tipo de error
 */
export const AUTH_ERROR_INFO: Record<
  AuthErrorType,
  {
    title: string;
    message: string;
    action?: string;
  }
> = {
  [AuthErrorType.INVALID_CREDENTIALS]: {
    title: "Credenciales incorrectas",
    message: "El correo electrónico o la contraseña ingresados no son válidos.",
    action: "Por favor, verifique sus credenciales e intente nuevamente.",
  },
  [AuthErrorType.ACCOUNT_LOCKED]: {
    title: "Cuenta bloqueada",
    message:
      "Su cuenta ha sido bloqueada temporalmente por múltiples intentos fallidos de inicio de sesión.",
    action: "Por favor, intente nuevamente más tarde o contacte a soporte.",
  },
  [AuthErrorType.ACCOUNT_DISABLED]: {
    title: "Cuenta desactivada",
    message: "Su cuenta ha sido desactivada.",
    action: "Por favor, contacte a un administrador para reactivar su cuenta.",
  },
  [AuthErrorType.EMAIL_EXISTS]: {
    title: "Email ya registrado",
    message: "Ya existe una cuenta con este correo electrónico.",
    action: "Por favor, utilice otro correo o recupere su contraseña.",
  },
  [AuthErrorType.USERNAME_EXISTS]: {
    title: "Nombre de usuario no disponible",
    message: "Este nombre de usuario ya está en uso.",
    action: "Por favor, elija otro nombre de usuario.",
  },
  [AuthErrorType.PASSWORD_TOO_WEAK]: {
    title: "Contraseña insegura",
    message:
      "La contraseña proporcionada no cumple con los requisitos de seguridad.",
    action:
      "Use una combinación de letras, números y símbolos con al menos 8 caracteres.",
  },
  [AuthErrorType.INVALID_RESET_TOKEN]: {
    title: "Enlace inválido",
    message: "El enlace de restablecimiento de contraseña no es válido.",
    action: "Por favor, solicite un nuevo enlace de restablecimiento.",
  },
  [AuthErrorType.EXPIRED_RESET_TOKEN]: {
    title: "Enlace expirado",
    message: "El enlace de restablecimiento de contraseña ha expirado.",
    action: "Por favor, solicite un nuevo enlace de restablecimiento.",
  },
  [AuthErrorType.PASSWORDS_DONT_MATCH]: {
    title: "Contraseñas no coinciden",
    message: "Las contraseñas ingresadas no coinciden.",
    action: "Por favor, asegúrese de que las contraseñas coincidan.",
  },
  [AuthErrorType.NETWORK_ERROR]: {
    title: "Error de conexión",
    message: "No se pudo conectar con el servidor.",
    action: "Por favor, verifique su conexión a internet e intente nuevamente.",
  },
  [AuthErrorType.SERVER_ERROR]: {
    title: "Error del servidor",
    message: "Ocurrió un error en el servidor.",
    action: "Por favor, intente nuevamente más tarde.",
  },
  [AuthErrorType.UNKNOWN_ERROR]: {
    title: "Error inesperado",
    message: "Ha ocurrido un error inesperado.",
    action: "Por favor, intente nuevamente o contacte a soporte técnico.",
  },
};

/**
 * Lista de errores que deben ser mapeados como credenciales incorrectas
 */
const CREDENTIAL_ERROR_PATTERNS = [
  "credencial",
  "credenciales",
  "incorrecta",
  "inválida",
  "credentialssignin",
  "signin",
  "wrong password",
  "contraseña incorrecta",
  "email no encontrado",
  "usuario no encontrado",
  "user not found",
];

/**
 * Determina el tipo de error de autenticación basado en el error recibido
 */
export function getAuthErrorType(error: unknown): AuthErrorType {
  // Caso especial para NextAuth: errores de credenciales
  if (
    typeof error === "string" &&
    error.toLowerCase() === "credentialssignin"
  ) {
    return AuthErrorType.INVALID_CREDENTIALS;
  }

  // Si no hay error, devolvemos UNKNOWN_ERROR
  if (!error) return AuthErrorType.UNKNOWN_ERROR;

  // Si es una cadena, intentamos detectar patrones comunes
  if (typeof error === "string") {
    const lowerError = error.toLowerCase();

    // Verificar primero patrones de credenciales incorrectas
    if (
      CREDENTIAL_ERROR_PATTERNS.some((pattern) => lowerError.includes(pattern))
    ) {
      return AuthErrorType.INVALID_CREDENTIALS;
    }

    if (lowerError.includes("bloqueado")) return AuthErrorType.ACCOUNT_LOCKED;
    if (lowerError.includes("inactivo")) return AuthErrorType.ACCOUNT_DISABLED;
    if (lowerError.includes("password") || lowerError.includes("contraseña"))
      return AuthErrorType.PASSWORD_TOO_WEAK;
    if (lowerError.includes("email") || lowerError.includes("correo"))
      return AuthErrorType.EMAIL_EXISTS;
    if (lowerError.includes("conexión") || lowerError.includes("network"))
      return AuthErrorType.NETWORK_ERROR;
    if (lowerError.includes("servidor") || lowerError.includes("server"))
      return AuthErrorType.SERVER_ERROR;
    if (lowerError.includes("token")) {
      if (lowerError.includes("expirado"))
        return AuthErrorType.EXPIRED_RESET_TOKEN;
      return AuthErrorType.INVALID_RESET_TOKEN;
    }
  }

  // Si es un ApiError
  if (error instanceof ApiError) {
    // Determinar el tipo de error basado en el código de estado y mensajes
    const { status, message, code } = error;
    const lowerMessage = message.toLowerCase();

    // Verificar primero patrones de credenciales incorrectas
    if (
      CREDENTIAL_ERROR_PATTERNS.some((pattern) =>
        lowerMessage.includes(pattern)
      )
    ) {
      return AuthErrorType.INVALID_CREDENTIALS;
    }

    // Errores de credenciales
    if (status === 401) {
      if (lowerMessage.includes("bloqueado"))
        return AuthErrorType.ACCOUNT_LOCKED;
      if (lowerMessage.includes("inactivo"))
        return AuthErrorType.ACCOUNT_DISABLED;
      return AuthErrorType.INVALID_CREDENTIALS;
    }

    // Errores de registro
    if (status === 400) {
      if (lowerMessage.includes("correo") || lowerMessage.includes("email"))
        return AuthErrorType.EMAIL_EXISTS;
      if (lowerMessage.includes("usuario") || lowerMessage.includes("username"))
        return AuthErrorType.USERNAME_EXISTS;
      if (
        lowerMessage.includes("contraseña") ||
        lowerMessage.includes("password")
      )
        return AuthErrorType.PASSWORD_TOO_WEAK;
      if (lowerMessage.includes("no coinciden"))
        return AuthErrorType.PASSWORDS_DONT_MATCH;
    }

    // Errores de token
    if (status === 400 || status === 404) {
      if (lowerMessage.includes("token") && lowerMessage.includes("expirado"))
        return AuthErrorType.EXPIRED_RESET_TOKEN;
      if (lowerMessage.includes("token") && lowerMessage.includes("inválido"))
        return AuthErrorType.INVALID_RESET_TOKEN;
    }

    // Errores de servidor
    if (status !== undefined && status >= 500)
      return AuthErrorType.SERVER_ERROR;

    // Por el código personalizado (si el backend lo proporciona)
    if (code) {
      switch (code) {
        case "INVALID_CREDENTIALS":
          return AuthErrorType.INVALID_CREDENTIALS;
        case "ACCOUNT_LOCKED":
          return AuthErrorType.ACCOUNT_LOCKED;
        case "EMAIL_EXISTS":
          return AuthErrorType.EMAIL_EXISTS;
        case "TOKEN_EXPIRED":
          return AuthErrorType.EXPIRED_RESET_TOKEN;
        // Agregar más mapeos según sea necesario
      }
    }
  }

  // Si es un Error estándar
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Verificar primero patrones de credenciales incorrectas
    if (
      CREDENTIAL_ERROR_PATTERNS.some((pattern) =>
        errorMessage.includes(pattern)
      )
    ) {
      return AuthErrorType.INVALID_CREDENTIALS;
    }

    // Errores de red
    if (
      errorMessage.includes("network") ||
      errorMessage.includes("conexión") ||
      errorMessage.includes("connection")
    ) {
      return AuthErrorType.NETWORK_ERROR;
    }

    // Otros mensajes comunes
    if (errorMessage.includes("bloquead")) return AuthErrorType.ACCOUNT_LOCKED;
    if (errorMessage.includes("desactivad"))
      return AuthErrorType.ACCOUNT_DISABLED;
    if (
      errorMessage.includes("contraseña") ||
      errorMessage.includes("password")
    )
      return AuthErrorType.PASSWORD_TOO_WEAK;
    if (errorMessage.includes("email") || errorMessage.includes("correo"))
      return AuthErrorType.EMAIL_EXISTS;
    if (errorMessage.includes("servidor") || errorMessage.includes("server"))
      return AuthErrorType.SERVER_ERROR;
  }

  // Si es un objeto con propiedades esperadas
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, any>;

    // Verificar errores de NextAuth
    if (
      errorObj.type === "CredentialsSignin" ||
      (errorObj.error &&
        typeof errorObj.error === "string" &&
        errorObj.error.toLowerCase() === "credentialssignin")
    ) {
      return AuthErrorType.INVALID_CREDENTIALS;
    }

    // Buscar en el mensaje
    if (errorObj.message) {
      const message = String(errorObj.message).toLowerCase();

      // Verificar primero patrones de credenciales incorrectas
      if (
        CREDENTIAL_ERROR_PATTERNS.some((pattern) => message.includes(pattern))
      ) {
        return AuthErrorType.INVALID_CREDENTIALS;
      }

      if (message.includes("bloquead")) return AuthErrorType.ACCOUNT_LOCKED;
      if (message.includes("desactivad")) return AuthErrorType.ACCOUNT_DISABLED;
      if (message.includes("contraseña") || message.includes("password"))
        return AuthErrorType.PASSWORD_TOO_WEAK;
      if (message.includes("email") || message.includes("correo"))
        return AuthErrorType.EMAIL_EXISTS;
      if (message.includes("conexión") || message.includes("network"))
        return AuthErrorType.NETWORK_ERROR;
      if (message.includes("servidor") || message.includes("server"))
        return AuthErrorType.SERVER_ERROR;
    }

    // Si tiene un código conocido
    if (errorObj.code) {
      const code = String(errorObj.code);

      if (code === "ECONNABORTED" || code === "ERR_NETWORK")
        return AuthErrorType.NETWORK_ERROR;
      if (code === "ERR_BAD_REQUEST") return AuthErrorType.INVALID_CREDENTIALS;
      if (code === "ERR_SERVER") return AuthErrorType.SERVER_ERROR;
    }

    // Verificar el error "detail" (usado en nuestro backend)
    if (errorObj.detail) {
      const detail = String(errorObj.detail).toLowerCase();

      if (
        CREDENTIAL_ERROR_PATTERNS.some((pattern) => detail.includes(pattern))
      ) {
        return AuthErrorType.INVALID_CREDENTIALS;
      }
    }
  }

  // Cualquier otro error no identificado
  return AuthErrorType.UNKNOWN_ERROR;
}

/**
 * Obtiene información detallada de un error de autenticación
 */
export function getAuthErrorInfo(error: unknown) {
  try {
    const errorType = getAuthErrorType(error);
    return AUTH_ERROR_INFO[errorType];
  } catch (e) {
    // Si ocurre algún error al intentar procesar el error, devolvemos el mensaje genérico
    console.error("Error al procesar el error:", e);
    return AUTH_ERROR_INFO[AuthErrorType.UNKNOWN_ERROR];
  }
}

/**
 * Extrae un mensaje legible de un error
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "Ocurrió un error desconocido";

  if (typeof error === "string") return error;

  if (error instanceof ApiError) return error.message;

  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, any>;

    // Comprobar propiedades comunes de error
    if (errorObj.message) return String(errorObj.message);
    if (errorObj.error)
      return typeof errorObj.error === "string"
        ? errorObj.error
        : "Ocurrió un error";
    if (errorObj.detail) return String(errorObj.detail);
  }

  return "Ocurrió un error desconocido";
}

/**
 * Obtiene un mensaje útil según el código HTTP
 */
export function getHttpStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return "La solicitud es incorrecta. Por favor, verifique los datos ingresados.";
    case 401:
      return "No está autorizado para realizar esta acción. Verifique sus credenciales.";
    case 403:
      return "No tiene permisos para acceder a este recurso.";
    case 404:
      return "El recurso solicitado no fue encontrado.";
    case 409:
      return "Hay un conflicto con el estado actual del recurso.";
    case 422:
      return "Los datos proporcionados no son válidos. Verifique la información.";
    case 429:
      return "Demasiadas solicitudes. Por favor, inténtelo más tarde.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Error en el servidor. Por favor, inténtelo más tarde.";
    default:
      return "Ha ocurrido un error inesperado.";
  }
}

/**
 * Extrae mensajes útiles de errores de validación
 */
export function getValidationErrors(
  errors?: Record<string, string[]>
): string[] {
  if (!errors) return [];

  return Object.entries(errors).flatMap(([field, messages]) => {
    // Convertir formato de campo de snake_case o camelCase a texto legible
    const readableField = field
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .trim();

    return messages.map((message) => `${readableField}: ${message}`);
  });
}
