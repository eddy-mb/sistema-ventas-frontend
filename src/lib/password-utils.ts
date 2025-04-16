/**
 * Calcula la fortaleza de una contraseña en un rango de 0 a 100
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  let strength = 0;

  // Longitud contribuye hasta un 40% de la fortaleza
  const lengthScore = Math.min(password.length / 16, 1) * 40;
  strength += lengthScore;

  // Variedad de caracteres contribuye hasta un 60%
  if (/\d/.test(password)) strength += 15; // Números
  if (/[a-z]/.test(password)) strength += 15; // Minúsculas
  if (/[A-Z]/.test(password)) strength += 15; // Mayúsculas
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15; // Caracteres especiales

  return Math.min(strength, 100);
}

/**
 * Obtiene la clase CSS para la barra de progreso de fortaleza de contraseña
 */
export function getPasswordStrengthClass(password: string): string {
  const strength = calculatePasswordStrength(password);

  if (strength < 30) return "bg-red-500";
  if (strength < 60) return "bg-yellow-500";
  if (strength < 80) return "bg-blue-500";
  return "bg-green-500";
}

/**
 * Obtiene el texto descriptivo para la fortaleza de la contraseña
 */
export function getPasswordStrengthText(password: string): string {
  const strength = calculatePasswordStrength(password);

  if (strength < 30) return "Muy débil";
  if (strength < 60) return "Débil";
  if (strength < 80) return "Moderada";
  return "Fuerte";
}

/**
 * Verifica una contraseña por longitud, números, mayúsculas y caracteres especiales
 * Retorna un objeto con los resultados de cada verificación
 */
export function validatePassword(password: string) {
  return {
    hasMinLength: password.length >= 8,
    hasNumbers: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecialChars: /[^a-zA-Z0-9]/.test(password),
    isStrong: calculatePasswordStrength(password) >= 70,
  };
}

/**
 * Componente PasswordIndicador para ser usado en formularios
 * que manejan contraseñas
 */
export function createPasswordValidationSchema(minLength = 8) {
  return {
    /**
     * Requerimientos mínimos para una contraseña válida
     */
    validation: {
      minLength,
      requireNumbers: true,
      requireUppercase: true,
      requireSpecialChars: true,
    },

    /**
     * Mensajes de error personalizados para validaciones de contraseña
     */
    errorMessages: {
      tooShort: `La contraseña debe tener al menos ${minLength} caracteres`,
      noNumbers: "La contraseña debe incluir al menos un número",
      noUppercase: "La contraseña debe incluir al menos una letra mayúscula",
      noSpecialChars:
        "La contraseña debe incluir al menos un carácter especial",
      passwordsDontMatch: "Las contraseñas no coinciden",
    },
  };
}
