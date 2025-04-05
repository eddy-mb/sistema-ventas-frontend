// src/services/cliente-service.ts
import { createModuleApi, ApiError } from "@/lib/axios";

// Interfaz para el cliente
export interface Cliente {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: "DNI" | "Pasaporte" | "Carnet_Extranjeria";
  numeroDocumento: string;
  direccion?: string;
  telefono: string;
  email?: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
  preferencias?: string;
  fechaRegistro: string;
  estado: "activo" | "inactivo";
}

// Datos para crear un cliente
export interface ClienteCreateData {
  nombres: string;
  apellidos: string;
  tipoDocumento: "DNI" | "Pasaporte" | "Carnet_Extranjeria";
  numeroDocumento: string;
  direccion?: string;
  telefono: string;
  email?: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
  preferencias?: string;
}

// Datos para actualizar un cliente
export type ClienteUpdateData = Partial<ClienteCreateData>;

// Interfaz para contacto de emergencia
export interface ContactoEmergencia {
  id: string;
  clienteId: string;
  nombre: string;
  relacion: string;
  telefono: string;
}

// Datos para crear contacto de emergencia
export interface ContactoEmergenciaData {
  nombre: string;
  relacion: string;
  telefono: string;
}

// Interfaz para filtros de búsqueda
export interface ClienteFilter {
  search?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  estado?: "activo" | "inactivo";
  page?: number;
  limit?: number;
}

/**
 * Servicio para gestionar clientes
 */
class ClienteService {
  private api;
  private contactosApi;

  constructor() {
    this.api = createModuleApi<Cliente>("/clientes");
    this.contactosApi = createModuleApi<ContactoEmergencia>("/clientes");
  }

  /**
   * Obtiene la lista de clientes con filtros opcionales
   */
  async getClientes(
    filters: ClienteFilter = {}
  ): Promise<{ data: Cliente[]; total: number }> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.api.get<{ data: Cliente[]; total: number }>(
        `?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener los clientes");
    }
  }

  /**
   * Obtiene un cliente por su ID
   */
  async getClienteById(id: string): Promise<Cliente> {
    try {
      return await this.api.get<Cliente>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener el cliente con ID ${id}`
      );
    }
  }

  /**
   * Crea un nuevo cliente
   */
  async createCliente(data: ClienteCreateData): Promise<Cliente> {
    try {
      return await this.api.post<Cliente>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al crear el cliente");
    }
  }

  /**
   * Actualiza un cliente existente
   */
  async updateCliente(id: string, data: ClienteUpdateData): Promise<Cliente> {
    try {
      return await this.api.put<Cliente>(`/${id}`, data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el cliente con ID ${id}`
      );
    }
  }

  /**
   * Cambia el estado de un cliente (activo/inactivo)
   */
  async changeClienteStatus(
    id: string,
    estado: "activo" | "inactivo"
  ): Promise<Cliente> {
    try {
      return await this.api.patch<Cliente>(`/${id}/estado`, { estado });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al cambiar el estado del cliente con ID ${id}`
      );
    }
  }

  /**
   * Elimina un cliente
   */
  async deleteCliente(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al eliminar el cliente con ID ${id}`
      );
    }
  }

  /**
   * Obtiene los contactos de emergencia de un cliente
   */
  async getContactosEmergencia(
    clienteId: string
  ): Promise<ContactoEmergencia[]> {
    try {
      return await this.contactosApi.get<ContactoEmergencia[]>(
        `/${clienteId}/contactos`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al obtener los contactos de emergencia del cliente ${clienteId}`
      );
    }
  }

  /**
   * Añade un contacto de emergencia a un cliente
   */
  async addContactoEmergencia(
    clienteId: string,
    data: ContactoEmergenciaData
  ): Promise<ContactoEmergencia> {
    try {
      return await this.contactosApi.post<ContactoEmergencia>(
        `/${clienteId}/contactos`,
        data
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al añadir contacto de emergencia al cliente ${clienteId}`
      );
    }
  }

  /**
   * Actualiza un contacto de emergencia
   */
  async updateContactoEmergencia(
    clienteId: string,
    contactoId: string,
    data: ContactoEmergenciaData
  ): Promise<ContactoEmergencia> {
    try {
      return await this.contactosApi.put<ContactoEmergencia>(
        `/${clienteId}/contactos/${contactoId}`,
        data
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al actualizar el contacto de emergencia ${contactoId}`
      );
    }
  }

  /**
   * Elimina un contacto de emergencia
   */
  async deleteContactoEmergencia(
    clienteId: string,
    contactoId: string
  ): Promise<void> {
    try {
      await this.contactosApi.delete(`/${clienteId}/contactos/${contactoId}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al eliminar el contacto de emergencia ${contactoId}`
      );
    }
  }

  /**
   * Busca un cliente por número de documento
   */
  async findByDocumento(
    tipoDocumento: string,
    numeroDocumento: string
  ): Promise<Cliente | null> {
    try {
      const response = await this.api.get<{ data: Cliente[]; total: number }>(
        `?tipoDocumento=${tipoDocumento}&numeroDocumento=${numeroDocumento}`
      );
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al buscar cliente por documento"
      );
    }
  }

  /**
   * Obtiene el historial de compras de un cliente
   */
  async getHistorialCompras(clienteId: string): Promise<unknown[]> {
    try {
      return await this.api.get<unknown[]>(`/${clienteId}/compras`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al obtener el historial de compras del cliente ${clienteId}`
      );
    }
  }
}

// Exportamos una instancia única del servicio
export const clienteService = new ClienteService();
