"use client";

import {
  calculatePasswordStrength,
  getPasswordStrengthClass,
  getPasswordStrengthText,
} from "@/lib/password-utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  minLength?: number;
}

export function PasswordIndicador({
  password,
  minLength = 8,
}: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Seguridad de la contraseña:</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs">
            Longitud mínima ({minLength} caracteres)
          </span>
          <span
            className={`text-xs ${
              password.length >= minLength ? "text-green-500" : "text-red-500"
            }`}
          >
            {password.length >= minLength ? "✓" : "✗"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs">Incluye números</span>
          <span
            className={`text-xs ${
              /\d/.test(password) ? "text-green-500" : "text-red-500"
            }`}
          >
            {/\d/.test(password) ? "✓" : "✗"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs">Incluye letras mayúsculas</span>
          <span
            className={`text-xs ${
              /[A-Z]/.test(password) ? "text-green-500" : "text-red-500"
            }`}
          >
            {/[A-Z]/.test(password) ? "✓" : "✗"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs">Incluye caracteres especiales</span>
          <span
            className={`text-xs ${
              /[^a-zA-Z0-9]/.test(password) ? "text-green-500" : "text-red-500"
            }`}
          >
            {/[^a-zA-Z0-9]/.test(password) ? "✓" : "✗"}
          </span>
        </div>
      </div>

      {/* Barra de progreso para la fortaleza de la contraseña */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getPasswordStrengthClass(password)}`}
          style={{ width: `${calculatePasswordStrength(password)}%` }}
        ></div>
      </div>
      <p className="text-xs text-right">{getPasswordStrengthText(password)}</p>
    </div>
  );
}
