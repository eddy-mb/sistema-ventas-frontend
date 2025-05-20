import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea una fecha ISO en formato legible
 * @param date Fecha ISO o string
 * @param formatStr Formato deseado (por defecto: dd/MM/yyyy HH:mm)
 * @returns Fecha formateada
 */
export function formatDate(date: string | Date, formatStr = "dd/MM/yyyy HH:mm") {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return String(date);
  }
}
