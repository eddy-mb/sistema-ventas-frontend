// src/services/admin-service.ts
import { createModuleApi, ApiError } from "@/lib/axios";

// Interfaz para usuario
export interface Usuario {
  id: string;
  nombreUsuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  estado: "activo" | "inactivo";
  ultimoAcceso?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  roles: Rol[];
}

// Interfaz para rol
export interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  esPredefinido: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  permisos: Permiso[];
}

// Interfaz para permiso
export interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  modulo: string;
  accion: string;
}

// Interfaz para log de auditoría
export interface LogAuditoria {
  id: string;
  fechaHora: string;
  idUsuario: string;
  nombreUsuario: string;
  accion: string;
  modulo: string;
  detalles: string;
  ipOrigen: string;
  resultado: "éxito" | "error";
}

// Interfaz para parámetro del sistema
export interface ParametroSistema {
  id: string;
  nombre: string;
  valor: string;
  tipoDato: "texto" | "número" | "booleano";
  descripcion: string;
  categoria: string;
  requiereReinicio: boolean;
  fechaModificacion: string;
  idUsuarioModificacion: string;
  nombreUsuarioModificacion: string;
}

// Datos para crear un usuario
export interface UsuarioCreateData {
  nombreUsuario: string;
  contrasena: string;
  nombre: string;
  apellidos: string;
  email: string;
  roles: string[]; // IDs de roles
}

// Datos para actualizar un usuario
export interface UsuarioUpdateData {
  nombreUsuario?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
  estado?: "activo" | "inactivo";
  roles?: string[]; // IDs de roles
}

// Datos para crear un rol
export interface RolCreateData {
  nombre: string;
  descripcion: string;
  permisos: string[]; // IDs de permisos
}

// Datos para actualizar un rol
export interface RolUpdateData {
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
  permisos?: string[]; // IDs de permisos
}

// Interfaz para filtros de búsqueda de usuarios
export interface UsuarioFilter {
  search?: string;
  estado?: "activo" | "inactivo";
  rol?: string;
  page?: number;
  limit?: number;
}

// Interfaz para filtros de búsqueda de logs
export interface LogFilter {
  fechaInicio?: string;
  fechaFin?: string;
  usuario?: string;
  accion?: string;
  modulo?: string;
  resultado?: "éxito" | "error";
  page?: number;
  limit?: number;
}

/**
 * Servicio para administración del sistema
 */
class AdminService {
  private usuarioApi;
  private rolApi;
  private permisoApi;
  private auditoriaApi;
  private configuracionApi;

  constructor() {
    this.usuarioApi = createModuleApi<Usuario>("/admin/usuarios");
    this.rolApi = createModuleApi<Rol>("/admin/roles");
    this.permisoApi = createModuleApi<Permiso>("/admin/permisos");
    this.auditoriaApi = createModuleApi<LogAuditoria>("/admin/auditoria");
    this.configuracionApi = createModuleApi<ParametroSistema>(
      "/admin/configuracion"
    );
  }

  // GESTIÓN DE USUARIOS

  /**
   * Obtiene la lista de usuarios con filtros opcionales
   */
  async getUsuarios(
    filters: UsuarioFilter = {}
  ): Promise<{ data: Usuario[]; total: number }> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.usuarioApi.get<{ data: Usuario[]; total: number }>(
        `?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener los usuarios");
    }
  }

  /**
   * Obtiene un usuario por su ID
   */
  async getUsuarioById(id: string): Promise<Usuario> {
    try {
      return await this.usuarioApi.get<Usuario>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener el usuario con ID ${id}`
      );
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async createUsuario(data: UsuarioCreateData): Promise<Usuario> {
    try {
      return await this.usuarioApi.post<Usuario>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al crear el usuario");
    }
  }

  /**
   * Actualiza un usuario existente
   */
  async updateUsuario(id: string, data: UsuarioUpdateData): Promise<Usuario> {
    try {
      return await this.usuarioApi.put<Usuario>(`/${id}`, data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el usuario con ID ${id}`
      );
    }
  }

  /**
   * Cambia el estado de un usuario (activo/inactivo)
   */
  async changeUsuarioStatus(
    id: string,
    estado: "activo" | "inactivo"
  ): Promise<Usuario> {
    try {
      return await this.usuarioApi.patch<Usuario>(`/${id}/estado`, { estado });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al cambiar el estado del usuario con ID ${id}`
      );
    }
  }

  /**
   * Restablece la contraseña de un usuario
   */
  async resetPassword(
    id: string
  ): Promise<{ success: boolean; tempPassword?: string }> {
    try {
      return await this.usuarioApi.post<{
        success: boolean;
        tempPassword?: string;
      }>(`/${id}/reset-password`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al restablecer la contraseña del usuario con ID ${id}`
      );
    }
  }

  // GESTIÓN DE ROLES

  /**
   * Obtiene todos los roles
   */
  async getRoles(): Promise<Rol[]> {
    try {
      return await this.rolApi.get<Rol[]>("");
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener los roles");
    }
  }

  /**
   * Obtiene un rol por su ID
   */
  async getRolById(id: string): Promise<Rol> {
    try {
      return await this.rolApi.get<Rol>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener el rol con ID ${id}`
      );
    }
  }

  /**
   * Crea un nuevo rol
   */
  async createRol(data: RolCreateData): Promise<Rol> {
    try {
      return await this.rolApi.post<Rol>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al crear el rol");
    }
  }

  /**
   * Actualiza un rol existente
   */
  async updateRol(id: string, data: RolUpdateData): Promise<Rol> {
    try {
      return await this.rolApi.put<Rol>(`/${id}`, data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el rol con ID ${id}`
      );
    }
  }

  /**
   * Cambia el estado de un rol (activo/inactivo)
   */
  async changeRolStatus(id: string, estado: boolean): Promise<Rol> {
    try {
      return await this.rolApi.patch<Rol>(`/${id}/estado`, { estado });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al cambiar el estado del rol con ID ${id}`
      );
    }
  }

  /**
   * Elimina un rol
   */
  async deleteRol(id: string): Promise<void> {
    try {
      await this.rolApi.delete(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al eliminar el rol con ID ${id}`
      );
    }
  }

  // GESTIÓN DE PERMISOS

  /**
   * Obtiene todos los permisos
   */
  async getPermisos(): Promise<Permiso[]> {
    try {
      return await this.permisoApi.get<Permiso[]>("");
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener los permisos");
    }
  }

  /**
   * Obtiene permisos por módulo
   */
  async getPermisosByModulo(modulo: string): Promise<Permiso[]> {
    try {
      return await this.permisoApi.get<Permiso[]>(`?modulo=${modulo}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener los permisos del módulo ${modulo}`
      );
    }
  }

  // GESTIÓN DE AUDITORÍA

  /**
   * Obtiene logs de auditoría con filtros opcionales
   */
  async getLogs(
    filters: LogFilter = {}
  ): Promise<{ data: LogAuditoria[]; total: number }> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.auditoriaApi.get<{
        data: LogAuditoria[];
        total: number;
      }>(`?${params.toString()}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al obtener los logs de auditoría"
      );
    }
  }

  /**
   * Obtiene un log de auditoría por su ID
   */
  async getLogById(id: string): Promise<LogAuditoria> {
    try {
      return await this.auditoriaApi.get<LogAuditoria>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener el log de auditoría con ID ${id}`
      );
    }
  }

  /**
   * Exporta logs de auditoría a un formato específico
   */
  async exportLogs(
    filters: LogFilter,
    formato: "pdf" | "excel" | "csv"
  ): Promise<{ url: string }> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      params.append("formato", formato);

      return await this.auditoriaApi.get<{ url: string }>(
        `/exportar?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al exportar logs de auditoría en formato ${formato}`
      );
    }
  }

  // GESTIÓN DE CONFIGURACIÓN

  /**
   * Obtiene todos los parámetros del sistema
   */
  async getParametros(): Promise<ParametroSistema[]> {
    try {
      return await this.configuracionApi.get<ParametroSistema[]>("");
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al obtener los parámetros del sistema"
      );
    }
  }

  /**
   * Obtiene parámetros por categoría
   */
  async getParametrosByCategoria(
    categoria: string
  ): Promise<ParametroSistema[]> {
    try {
      return await this.configuracionApi.get<ParametroSistema[]>(
        `?categoria=${categoria}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al obtener los parámetros de la categoría ${categoria}`
      );
    }
  }

  /**
   * Actualiza un parámetro del sistema
   */
  async updateParametro(id: string, valor: string): Promise<ParametroSistema> {
    try {
      return await this.configuracionApi.put<ParametroSistema>(`/${id}`, {
        valor,
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el parámetro con ID ${id}`
      );
    }
  }

  /**
   * Actualiza múltiples parámetros del sistema
   */
  async updateMultipleParametros(
    parametros: { id: string; valor: string }[]
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.configuracionApi.post<{
        success: boolean;
        message: string;
      }>("/batch", { parametros });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al actualizar múltiples parámetros"
      );
    }
  }

  /**
   * Restablece un parámetro a su valor predeterminado
   */
  async resetParametro(id: string): Promise<ParametroSistema> {
    try {
      return await this.configuracionApi.post<ParametroSistema>(`/${id}/reset`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al restablecer el parámetro con ID ${id}`
      );
    }
  }
}

// Exportamos una instancia única del servicio
export const adminService = new AdminService();
