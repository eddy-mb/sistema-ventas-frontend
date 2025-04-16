import { toast } from "sonner";
import { getAuthErrorInfo, getErrorMessage } from "./error-handling";

/**
 * Muestra un error de autenticación como una notificación toast
 */
export function toastErrorAuth(error: unknown) {
  const errorInfo = getAuthErrorInfo(error);

  toast.error(errorInfo.title, {
    description: errorInfo.message,
    duration: 5000,
  });
}

/**
 * Muestra un error genérico como una notificación toast
 */
export function toastError(error: unknown) {
  toast.error("Error", {
    description: getErrorMessage(error),
    duration: 5000,
  });
}

/**
 * Muestra un mensaje de éxito como una notificación toast
 */

interface ToastProps {
  title: string;
  message?: string;
}
export function toastSuccess({
  title,
  message = "Operación exitosa",
}: ToastProps) {
  toast.success(title, {
    description: message,
    duration: 3000,
  });
}
