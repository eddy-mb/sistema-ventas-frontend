//  TODO: no se esta implementando
import { createModuleApi, ApiError } from "@/lib/axios";

// Tipos de acciones que se pueden auditar
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

// Módulos del sistema
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

// Interfaz para los datos de auditoría
export interface AuditData {
  action: AuditAction;
  module: AuditModule;
  details: string;
  entityId?: string;
}

// Interfaz para respuestas de auditoría
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
 * Servicio para registrar acciones de auditoría en el sistema
 */
class AuditService {
  private api;

  constructor() {
    // Utilizamos el helper createModuleApi para las rutas de auditoría
    this.api = createModuleApi<AuditLogResponse>("/admin/auditoria");
  }

  /**
   * Registra una acción en el log de auditoría
   */
  async logAction(data: AuditData): Promise<boolean> {
    try {
      await this.api.post("", data);
      return true;
    } catch (error) {
      console.error("Error al registrar auditoría:", error);
      return false;
    }
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
   * Registra una acción de login
   */
  async logLogin(userId: string): Promise<boolean> {
    return this.logAction({
      action: "login",
      module: "auth",
      details: "Inicio de sesión",
      entityId: userId,
    });
  }

  /**
   * Registra una acción de logout
   */
  async logLogout(userId: string): Promise<boolean> {
    return this.logAction({
      action: "logout",
      module: "auth",
      details: "Cierre de sesión",
      entityId: userId,
    });
  }

  /**
   * Registra una acción de creación
   */
  async logCreate(
    module: AuditModule,
    entityId: string,
    entityName: string
  ): Promise<boolean> {
    return this.logAction({
      action: "create",
      module,
      details: `Creación de ${entityName}`,
      entityId,
    });
  }

  /**
   * Registra una acción de actualización
   */
  async logUpdate(
    module: AuditModule,
    entityId: string,
    entityName: string
  ): Promise<boolean> {
    return this.logAction({
      action: "update",
      module,
      details: `Actualización de ${entityName}`,
      entityId,
    });
  }

  /**
   * Registra una acción de eliminación
   */
  async logDelete(
    module: AuditModule,
    entityId: string,
    entityName: string
  ): Promise<boolean> {
    return this.logAction({
      action: "delete",
      module,
      details: `Eliminación de ${entityName}`,
      entityId,
    });
  }

  /**
   * Registra una acción de visualización
   */
  async logView(
    module: AuditModule,
    entityId: string,
    entityName: string
  ): Promise<boolean> {
    return this.logAction({
      action: "view",
      module,
      details: `Visualización de ${entityName}`,
      entityId,
    });
  }

  /**
   * Registra una acción de exportación
   */
  async logExport(module: AuditModule, details: string): Promise<boolean> {
    return this.logAction({
      action: "export",
      module,
      details,
    });
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
