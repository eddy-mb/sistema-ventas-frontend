import { createApi } from "@/lib/api";
import {
  buildUrlParams,
  normalizeResponse,
  normalizePaginatedResponse,
} from "@/lib/api-helpers";
import {
  Rol,
  Permiso,
  LogAuditoria,
  ParametroSistema,
  UsuarioFilter,
  UsuarioCreateData,
  UsuarioUpdateData,
  CambiarContrasenaData,
  RestablecerContrasenaData,
} from "@/types/admin.types";
import { Usuario } from "@/types/admin.types";

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
    filters: UsuarioFilter = {
      pagina: 1,
      limite: 10,
    }
  ): Promise<{ data: Usuario[]; total: number }> {
    try {
      const params = buildUrlParams(filters);
      const response = await this.usuarioApi.get(`?${params}`);
      return normalizePaginatedResponse<Usuario>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene un usuario por su ID
   */
  async getUsuarioById(id: string): Promise<Usuario> {
    try {
      const response = await this.usuarioApi.get<{ data: Usuario }>(`/${id}`);
      return response.data;
    } catch (error) {
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
      const endpoint =
        estado === "activo" ? `/${id}/activate` : `/${id}/deactivate`;
      return await this.usuarioApi.patch<Usuario>(endpoint, {});
    } catch (error) {
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
      const response = await this.usuarioApi.patch<{ message: string }>(
        `/${id}/change-password`,
        data
      );
      return {
        success: true,
        message: response.message || "Contraseña cambiada exitosamente",
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Restablece la contraseña de un usuario
   * @param id ID del usuario
   * @param data Datos para restablecer la contraseña (opcional)
   * @returns Información de éxito o error
   */
  async resetPassword(
    id: string,
    data?: RestablecerContrasenaData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.usuarioApi.patch<{ message: string }>(
        `/${id}/reset-password`,
        data || {}
      );

      return {
        success: true,
        message: response.message || "Contraseña restablecida exitosamente",
      };
    } catch (error) {
      throw error;
    }
  }

  // GESTIÓN DE ROLES

  /**
   * Obtiene todos los roles
   */
  async getRoles(): Promise<Rol[]> {
    try {
      const response = await this.rolApi.get("");
      return normalizeResponse<Rol>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene un rol por su ID
   */
  async getRolById(id: string): Promise<Rol> {
    try {
      const response = await this.rolApi.get<{ data: Rol }>(`/${id}`);
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }

  /**
   * Cambia el estado de un rol
   */
  async changeRolStatus(id: string, estado: boolean): Promise<Rol> {
    try {
      return await this.rolApi.patch<Rol>(`/${id}/estado`, {
        estado,
      });
    } catch (error) {
      throw error;
    }
  }

  // GESTIÓN DE PERMISOS

  /**
   * Obtiene todos los permisos
   */
  async getPermisos(): Promise<Permiso[]> {
    try {
      const response = await this.permisoApi.get("");
      return normalizeResponse<Permiso>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene permisos por módulo
   */
  async getPermisosByModulo(modulo: string): Promise<Permiso[]> {
    try {
      const response = await this.permisoApi.get(`?modulo=${modulo}`);
      return normalizeResponse<Permiso>(response);
    } catch (error) {
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
      resultado?: "Exito" | "Error";
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ data: LogAuditoria[]; total: number }> {
    try {
      const params = buildUrlParams(filters);
      const response = await this.auditoriaApi.get<{
        data: LogAuditoria[];
        total: number;
      }>(`?${params}`);
      return normalizePaginatedResponse<LogAuditoria>(response);
    } catch (error) {
      throw error;
    }
  }

  // GESTIÓN DE CONFIGURACIÓN

  /**
   * Obtiene todos los parámetros del sistema
   */
  async getParametros(): Promise<ParametroSistema[]> {
    try {
      const response = await this.configuracionApi.get("");
      return normalizeResponse<ParametroSistema>(response);
    } catch (error) {
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
      const response = await this.configuracionApi.get(
        `?categoria=${categoria}`
      );
      return normalizeResponse<ParametroSistema>(response);
    } catch (error) {
      throw error;
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
      throw error;
    }
  }
}

// Exportamos una instancia única del servicio
export const adminService = new AdminService();
