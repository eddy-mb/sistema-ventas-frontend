// src/services/audit-service.ts
import { getSession } from "next-auth/react";

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

/**
 * Servicio para registrar acciones de auditoría en el sistema
 */
class AuditService {
  /**
   * Registra una acción en el log de auditoría
   */
  async logAction(data: AuditData) {
    const session = await getSession();

    if (!session) {
      console.warn("Intentando registrar auditoría sin una sesión activa");
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/auditoria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({
            ...data,
            userId: session.user.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al registrar la acción en auditoría");
      }

      return true;
    } catch (error) {
      console.error("Error al registrar auditoría:", error);
      return false;
    }
  }

  /**
   * Registra una acción de login
   */
  async logLogin(userId: string) {
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
  async logLogout(userId: string) {
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
  async logCreate(module: AuditModule, entityId: string, entityName: string) {
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
  async logUpdate(module: AuditModule, entityId: string, entityName: string) {
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
  async logDelete(module: AuditModule, entityId: string, entityName: string) {
    return this.logAction({
      action: "delete",
      module,
      details: `Eliminación de ${entityName}`,
      entityId,
    });
  }
}

// Exportamos una instancia única del servicio
export const auditService = new AuditService();
