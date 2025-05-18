import { createApi } from "@/lib/api";
import { buildUrlParams, normalizeResponse, normalizePaginatedResponse } from "@/lib/api-helpers";
import {
  Rol,
  Permiso,
  LogAuditoria,
  ParametroSistema,
  UsuarioFilter,
  UsuarioCreateData,
  UsuarioUpdateData,
  CambiarContrasenaData,
} from "@/types/admin.types";
import { Usuario } from "@/types/auth.types";

// Clase para el servicio de administración
class AdminService {
  private usuarioApi;
  private rolApi;
  private permisoApi;
  private auditoriaApi;
  private configuracionApi;

  constructor() {
    this.usuarioApi = createApi<Usuario>("/usuarios");
    this.rolApi = createApi<Rol>("/roles");
    this.permisoApi = createApi<Permiso>("/permisos");
    this.auditoriaApi = createApi<LogAuditoria>("/auditoria");
    this.configuracionApi = createApi<ParametroSistema>("/configuracion");
  }

  // GESTIÓN DE USUARIOS

  /**
   * Obtiene la lista de usuarios con filtros opcionales
   */
  async getUsuarios(
    filters: UsuarioFilter = {}
  ): Promise<{ data: Usuario[]; total: number }> {
    try {
      const params = buildUrlParams(filters);
      const response = await this.usuarioApi.get<any>(`?${params}`);
      return normalizePaginatedResponse<Usuario>(response);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por su ID
   */
  async getUsuarioById(id: string): Promise<Usuario> {
    try {
      return await this.usuarioApi.get<Usuario>(`/${id}`);
    } catch (error) {
      console.error(`Error al obtener el usuario con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async createUsuario(data: UsuarioCreateData): Promise<Usuario> {
    try {
      return await this.usuarioApi.post<Usuario>("", data);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   */
  async updateUsuario(id: string, data: UsuarioUpdateData): Promise<Usuario> {
    try {
      return await this.usuarioApi.put<Usuario>(`/${id}`, data);
    } catch (error) {
      console.error(`Error al actualizar el usuario con ID ${id}:`, error);
      throw error;
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
      const endpoint = estado === "activo" ? `/${id}/activate` : `/${id}/deactivate`;
      return await this.usuarioApi.patch<Usuario>(endpoint, {});
    } catch (error) {
      console.error(`Error al cambiar el estado del usuario con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cambia la contraseña de un usuario
   */
  async changePassword(
    id: string,
    data: CambiarContrasenaData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.usuarioApi.patch<any>(`/${id}/change-password`, data);
      return {
        success: true,
        message: response.message || "Contraseña cambiada exitosamente",
      };
    } catch (error) {
      console.error(`Error al cambiar la contraseña del usuario con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Restablece la contraseña de un usuario
   */
  async resetPassword(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.usuarioApi.patch<any>(`/${id}/reset-password`, {});
      return {
        success: true,
        message: response.message || "Contraseña restablecida exitosamente",
      };
    } catch (error) {
      console.error(`Error al restablecer la contraseña del usuario con ID ${id}:`, error);
      throw error;
    }
  }

  // GESTIÓN DE ROLES

  /**
   * Obtiene todos los roles
   */
  async getRoles(): Promise<Rol[]> {
    try {
      const response = await this.rolApi.get<any>("");
      return normalizeResponse<Rol>(response);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
      throw error;
    }
  }

  /**
   * Obtiene un rol por su ID
   */
  async getRolById(id: string): Promise<Rol> {
    try {
      return await this.rolApi.get<Rol>(`/${id}`);
    } catch (error) {
      console.error(`Error al obtener el rol con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo rol
   */
  async createRol(data: {
    nombre: string;
    descripcion: string;
    permisos: string[];
  }): Promise<Rol> {
    try {
      return await this.rolApi.post<Rol>("", data);
    } catch (error) {
      console.error("Error al crear el rol:", error);
      throw error;
    }
  }

  /**
   * Actualiza un rol existente
   */
  async updateRol(
    id: string,
    data: {
      nombre?: string;
      descripcion?: string;
      estado?: boolean;
      permisos?: string[];
    }
  ): Promise<Rol> {
    try {
      return await this.rolApi.put<Rol>(`/${id}`, data);
    } catch (error) {
      console.error(`Error al actualizar el rol con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cambia el estado de un rol
   */
  async changeRolStatus(id: string, estado: boolean): Promise<Rol> {
    try {
      const endpoint = estado ? `/${id}/activate` : `/${id}/deactivate`;
      return await this.rolApi.patch<Rol>(endpoint, {});
    } catch (error) {
      console.error(`Error al cambiar el estado del rol con ID ${id}:`, error);
      throw error;
    }
  }

  // GESTIÓN DE PERMISOS

  /**
   * Obtiene todos los permisos
   */
  async getPermisos(): Promise<Permiso[]> {
    try {
      const response = await this.permisoApi.get<any>("");
      return normalizeResponse<Permiso>(response);
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
      throw error;
    }
  }

  /**
   * Obtiene permisos por módulo
   */
  async getPermisosByModulo(modulo: string): Promise<Permiso[]> {
    try {
      const response = await this.permisoApi.get<any>(`?modulo=${modulo}`);
      return normalizeResponse<Permiso>(response);
    } catch (error) {
      console.error(`Error al obtener los permisos del módulo ${modulo}:`, error);
      throw error;
    }
  }

  // GESTIÓN DE AUDITORÍA

  /**
   * Obtiene logs de auditoría con filtros
   */
  async getLogs(
    filters: {
      fechaInicio?: string;
      fechaFin?: string;
      usuario?: string;
      accion?: string;
      modulo?: string;
      resultado?: "éxito" | "error";
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ data: LogAuditoria[]; total: number }> {
    try {
      const params = buildUrlParams(filters);
      const response = await this.auditoriaApi.get<any>(`?${params}`);
      return normalizePaginatedResponse<LogAuditoria>(response);
    } catch (error) {
      console.error("Error al obtener los logs de auditoría:", error);
      throw error;
    }
  }

  // GESTIÓN DE CONFIGURACIÓN

  /**
   * Obtiene todos los parámetros del sistema
   */
  async getParametros(): Promise<ParametroSistema[]> {
    try {
      const response = await this.configuracionApi.get<any>("");
      return normalizeResponse<ParametroSistema>(response);
    } catch (error) {
      console.error("Error al obtener los parámetros del sistema:", error);
      throw error;
    }
  }

  /**
   * Obtiene parámetros por categoría
   */
  async getParametrosByCategoria(
    categoria: string
  ): Promise<ParametroSistema[]> {
    try {
      const response = await this.configuracionApi.get<any>(`?categoria=${categoria}`);
      return normalizeResponse<ParametroSistema>(response);
    } catch (error) {
      console.error(`Error al obtener los parámetros de la categoría ${categoria}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza un parámetro del sistema
   */
  async updateParametro(id: string, valor: string): Promise<ParametroSistema> {
    try {
      return await this.configuracionApi.put<ParametroSistema>(`/${id}`, { valor });
    } catch (error) {
      console.error(`Error al actualizar el parámetro con ID ${id}:`, error);
      throw error;
    }
  }
}

// Exportamos una instancia única del servicio
export const adminService = new AdminService();
