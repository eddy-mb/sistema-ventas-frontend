"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlertIcon, XCircle, InfoIcon } from "lucide-react";
import { getAuthErrorInfo, getValidationErrors } from "@/lib/error-handling";
import { ApiError } from "@/lib/axios";

export type ErrorSeverity = "error" | "warning" | "info";

interface ErrorMessageProps {
  error: unknown;
  className?: string;
  severity?: ErrorSeverity;
  showDetails?: boolean;
}

export function ErrorMessage({
  error,
  className = "",
  severity = "error",
  showDetails = false,
}: ErrorMessageProps) {
  // Si no hay error, no mostramos nada
  if (!error) return null;

  let title: string = "";
  let message: string = "";
  let action: string | undefined = "";
  let validationErrors: string[] = [];

  // Para errores de autenticación, usamos nuestro sistema personalizado
  const authErrorInfo = getAuthErrorInfo(error);

  // Para errores de API, extraemos información adicional
  if (error instanceof ApiError && error.errors) {
    validationErrors = getValidationErrors(error.errors);
  }

  title = authErrorInfo.title;
  message = authErrorInfo.message;
  action = authErrorInfo.action;

  // Determinamos el icono según la severidad
  const IconComponent =
    severity === "error"
      ? XCircle
      : severity === "warning"
      ? TriangleAlertIcon
      : InfoIcon;

  return (
    <Alert
      variant={severity === "error" ? "destructive" : "default"}
      className={className}
    >
      <IconComponent className="h-4 w-4" />
      <AlertDescription className="space-y-2">
        <div className="font-medium">{title}</div>
        <p>{message}</p>
        {action && <p className="text-sm">{action}</p>}

        {showDetails && validationErrors.length > 0 && (
          <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
            {validationErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}

        {/* Si es un error de desarrollo y estamos en modo desarrollo, mostrar detalles técnicos */}
        {showDetails &&
          process.env.NODE_ENV === "development" &&
          error instanceof Error && (
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer">Detalles técnicos</summary>
              <pre className="mt-1 p-2 bg-black/10 rounded overflow-auto">
                {error.stack || error.message}
              </pre>
            </details>
          )}
      </AlertDescription>
    </Alert>
  );
}
