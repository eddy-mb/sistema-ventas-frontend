import { createModuleApi, ApiError } from "@/lib/axios";

// Tipos de acciones que pueden aparecer en la auditoría
export type AuditAction =
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "view"
  | "export"
  | "import"
  | "print";

// Módulos del sistema que pueden ser auditados
export type AuditModule =
  | "auth"
  | "clientes"
  | "productos"
  | "ventas"
  | "reservas"
  | "cotizaciones"
  | "reportes"
  | "usuarios"
  | "roles"
  | "configuracion";

// Interfaz para respuestas de auditoría desde el backend
export interface AuditLogResponse {
  id: string;
  action: AuditAction;
  module: AuditModule;
  details: string;
  entityId?: string;
  userId: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  timestamp: string;
}

// Interfaz para filtros de búsqueda de logs
export interface AuditLogFilter {
  startDate?: string;
  endDate?: string;
  action?: AuditAction;
  module?: AuditModule;
  userId?: string;
  entityId?: string;
  page?: number;
  limit?: number;
}

/**
 * Servicio para consultar los logs de auditoría generados por el backend
 */
class AuditService {
  private api;

  constructor() {
    // Utilizamos el helper createModuleApi para las rutas de auditoría
    this.api = createModuleApi<AuditLogResponse>("/admin/auditoria");
  }

  /**
   * Obtiene los logs de auditoría con filtros
   */
  async getLogs(
    filters: AuditLogFilter = {}
  ): Promise<{ logs: AuditLogResponse[]; total: number }> {
    try {
      // Convertimos los filtros a parámetros de consulta
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.api.get<{ logs: AuditLogResponse[]; total: number }>(
        `?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al obtener los logs de auditoría"
      );
    }
  }

  /**
   * Obtiene el detalle de un log específico
   */
  async getLogDetail(logId: string): Promise<AuditLogResponse> {
    try {
      return await this.api.get<AuditLogResponse>(`/${logId}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al obtener el detalle del log"
      );
    }
  }
}

// Exportamos una instancia única del servicio
export const auditService = new AuditService();
