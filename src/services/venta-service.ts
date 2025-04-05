// src/services/venta-service.ts
import { createModuleApi, ApiError } from "@/lib/axios";

// Interfaz para la venta
export interface Venta {
  id: string;
  numeroFactura?: string;
  fechaVenta: string;
  idCliente: string;
  idVendedor: string;
  idCotizacion?: string;
  estado: "Pendiente" | "Procesando" | "Completada" | "Cancelada";
  subtotal: number;
  impuestos: number;
  total: number;
  estadoPago: "Pendiente" | "Parcial" | "Completado";
  observaciones?: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

// Interfaz para el detalle de venta
export interface DetalleVenta {
  id: string;
  idVenta: string;
  idProducto: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
  notas?: string;
}

// Interfaz para pago
export interface Pago {
  id: string;
  idVenta: string;
  fechaPago: string;
  metodoPago: "Efectivo" | "Tarjeta_Credito" | "Transferencia" | "Otro";
  monto: number;
  referencia?: string;
  estado: "Procesando" | "Aprobado" | "Rechazado";
  notas?: string;
}

// Interfaz para reserva
export interface Reserva {
  id: string;
  codigoReserva: string;
  idDetalleVenta: string;
  estado:
    | "Solicitada"
    | "En_Proceso"
    | "Confirmada"
    | "Completada"
    | "Cancelada";
  fechaInicioServicio: string;
  fechaFinServicio: string;
  codigoConfirmacionProveedor?: string;
  fechaConfirmacion?: string;
  notas?: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

// Interfaz para pasajero
export interface Pasajero {
  id: string;
  idReserva: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: "DNI" | "Pasaporte" | "Otro";
  numeroDocumento: string;
  fechaNacimiento: string;
  nacionalidad: string;
  email?: string;
  telefono?: string;
  necesidadesEspeciales?: string;
}

// Interfaz para cotización
export interface Cotizacion {
  id: string;
  fechaCreacion: string;
  idCliente: string;
  idVendedor: string;
  estado: "Pendiente" | "Enviada" | "Aceptada" | "Rechazada" | "Vencida";
  subtotal: number;
  impuestos: number;
  total: number;
  descuento: number;
  fechaValidez: string;
  observaciones?: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

// Datos para crear una venta
export interface VentaCreateData {
  idCliente: string;
  idCotizacion?: string;
  detalles: {
    idProducto: string;
    cantidad: number;
    precioUnitario: number;
    descuento?: number;
    notas?: string;
  }[];
  observaciones?: string;
}

// Datos para crear una cotización
export interface CotizacionCreateData {
  idCliente: string;
  detalles: {
    idProducto: string;
    cantidad: number;
    precioUnitario: number;
    descuento?: number;
    notas?: string;
  }[];
  descuento?: number;
  fechaValidez: string;
  observaciones?: string;
}

// Datos para crear un pago
export interface PagoCreateData {
  metodoPago: "Efectivo" | "Tarjeta_Credito" | "Transferencia" | "Otro";
  monto: number;
  referencia?: string;
  notas?: string;
}

// Datos para crear una reserva
export interface ReservaCreateData {
  idDetalleVenta: string;
  fechaInicioServicio: string;
  fechaFinServicio: string;
  notas?: string;
}

// Datos para crear un pasajero
export interface PasajeroCreateData {
  nombres: string;
  apellidos: string;
  tipoDocumento: "DNI" | "Pasaporte" | "Otro";
  numeroDocumento: string;
  fechaNacimiento: string;
  nacionalidad: string;
  email?: string;
  telefono?: string;
  necesidadesEspeciales?: string;
}

// Interfaz para filtros de búsqueda de ventas
export interface VentaFilter {
  fechaInicio?: string;
  fechaFin?: string;
  cliente?: string;
  vendedor?: string;
  estado?: string;
  estadoPago?: string;
  minTotal?: number;
  maxTotal?: number;
  page?: number;
  limit?: number;
}

/**
 * Servicio para gestionar ventas
 */
class VentaService {
  private ventaApi;
  private cotizacionApi;
  private reservaApi;
  private pagoApi;

  constructor() {
    this.ventaApi = createModuleApi<Venta>("/ventas");
    this.cotizacionApi = createModuleApi<Cotizacion>("/ventas/cotizaciones");
    this.reservaApi = createModuleApi<Reserva>("/ventas/reservas");
    this.pagoApi = createModuleApi<Pago>("/ventas/pagos");
  }

  /**
   * Obtiene la lista de ventas con filtros opcionales
   */
  async getVentas(
    filters: VentaFilter = {}
  ): Promise<{ data: Venta[]; total: number }> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.ventaApi.get<{ data: Venta[]; total: number }>(
        `?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener las ventas");
    }
  }

  /**
   * Obtiene una venta por su ID
   */
  async getVentaById(id: string): Promise<Venta> {
    try {
      return await this.ventaApi.get<Venta>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener la venta con ID ${id}`
      );
    }
  }

  /**
   * Crea una nueva venta
   */
  async createVenta(data: VentaCreateData): Promise<Venta> {
    try {
      return await this.ventaApi.post<Venta>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al crear la venta");
    }
  }

  /**
   * Actualiza el estado de una venta
   */
  async updateVentaStatus(
    id: string,
    estado: "Pendiente" | "Procesando" | "Completada" | "Cancelada"
  ): Promise<Venta> {
    try {
      return await this.ventaApi.patch<Venta>(`/${id}/estado`, { estado });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el estado de la venta ${id}`
      );
    }
  }

  /**
   * Cancela una venta
   */
  async cancelarVenta(id: string, motivo: string): Promise<Venta> {
    try {
      return await this.ventaApi.post<Venta>(`/${id}/cancelar`, { motivo });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || `Error al cancelar la venta ${id}`);
    }
  }

  /**
   * Obtiene los detalles de una venta
   */
  async getDetallesVenta(ventaId: string): Promise<DetalleVenta[]> {
    try {
      return await this.ventaApi.get<DetalleVenta[]>(`/${ventaId}/detalles`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al obtener los detalles de la venta ${ventaId}`
      );
    }
  }

  /**
   * Registra un pago para una venta
   */
  async registrarPago(ventaId: string, data: PagoCreateData): Promise<Pago> {
    try {
      return await this.pagoApi.post<Pago>(`/${ventaId}/pagos`, data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al registrar pago para la venta ${ventaId}`
      );
    }
  }

  /**
   * Obtiene los pagos de una venta
   */
  async getPagos(ventaId: string): Promise<Pago[]> {
    try {
      return await this.pagoApi.get<Pago[]>(`/${ventaId}/pagos`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener los pagos de la venta ${ventaId}`
      );
    }
  }

  /**
   * Anula un pago
   */
  async anularPago(
    ventaId: string,
    pagoId: string,
    motivo: string
  ): Promise<Pago> {
    try {
      return await this.pagoApi.post<Pago>(
        `/${ventaId}/pagos/${pagoId}/anular`,
        { motivo }
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || `Error al anular el pago ${pagoId}`);
    }
  }

  /**
   * Obtiene la lista de cotizaciones con filtros opcionales
   */
  async getCotizaciones(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: any = {}
  ): Promise<{ data: Cotizacion[]; total: number }> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      return await this.cotizacionApi.get<{
        data: Cotizacion[];
        total: number;
      }>(`?${params.toString()}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener las cotizaciones");
    }
  }

  /**
   * Obtiene una cotización por su ID
   */
  async getCotizacionById(id: string): Promise<Cotizacion> {
    try {
      return await this.cotizacionApi.get<Cotizacion>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener la cotización con ID ${id}`
      );
    }
  }

  /**
   * Crea una nueva cotización
   */
  async createCotizacion(data: CotizacionCreateData): Promise<Cotizacion> {
    try {
      return await this.cotizacionApi.post<Cotizacion>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al crear la cotización");
    }
  }

  /**
   * Actualiza el estado de una cotización
   */
  async updateCotizacionStatus(
    id: string,
    estado: "Pendiente" | "Enviada" | "Aceptada" | "Rechazada" | "Vencida"
  ): Promise<Cotizacion> {
    try {
      return await this.cotizacionApi.patch<Cotizacion>(`/${id}/estado`, {
        estado,
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al actualizar el estado de la cotización ${id}`
      );
    }
  }

  /**
   * Convierte una cotización en venta
   */
  async convertirCotizacionAVenta(cotizacionId: string): Promise<Venta> {
    try {
      return await this.cotizacionApi.post<Venta>(`/${cotizacionId}/convertir`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al convertir la cotización ${cotizacionId} en venta`
      );
    }
  }

  /**
   * Envía una cotización por email
   */
  async enviarCotizacionPorEmail(
    cotizacionId: string,
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.cotizacionApi.post<{
        success: boolean;
        message: string;
      }>(`/${cotizacionId}/enviar`, { email });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al enviar la cotización ${cotizacionId} por email`
      );
    }
  }

  /**
   * Obtiene las reservas de una venta
   */
  async getReservas(ventaId: string): Promise<Reserva[]> {
    try {
      return await this.reservaApi.get<Reserva[]>(
        `/ventas/${ventaId}/reservas`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al obtener las reservas de la venta ${ventaId}`
      );
    }
  }

  /**
   * Obtiene una reserva por su ID
   */
  async getReservaById(id: string): Promise<Reserva> {
    try {
      return await this.reservaApi.get<Reserva>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener la reserva con ID ${id}`
      );
    }
  }

  /**
   * Crea una nueva reserva
   */
  async createReserva(data: ReservaCreateData): Promise<Reserva> {
    try {
      return await this.reservaApi.post<Reserva>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al crear la reserva");
    }
  }

  /**
   * Actualiza el estado de una reserva
   */
  async updateReservaStatus(
    id: string,
    estado:
      | "Solicitada"
      | "En_Proceso"
      | "Confirmada"
      | "Completada"
      | "Cancelada",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datos?: any
  ): Promise<Reserva> {
    try {
      return await this.reservaApi.patch<Reserva>(`/${id}/estado`, {
        estado,
        ...datos,
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el estado de la reserva ${id}`
      );
    }
  }

  /**
   * Obtiene los pasajeros de una reserva
   */
  async getPasajeros(reservaId: string): Promise<Pasajero[]> {
    try {
      return await this.reservaApi.get<Pasajero[]>(`/${reservaId}/pasajeros`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al obtener los pasajeros de la reserva ${reservaId}`
      );
    }
  }

  /**
   * Añade un pasajero a una reserva
   */
  async addPasajero(
    reservaId: string,
    data: PasajeroCreateData
  ): Promise<Pasajero> {
    try {
      return await this.reservaApi.post<Pasajero>(
        `/${reservaId}/pasajeros`,
        data
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al añadir pasajero a la reserva ${reservaId}`
      );
    }
  }

  /**
   * Actualiza un pasajero
   */
  async updatePasajero(
    reservaId: string,
    pasajeroId: string,
    data: Partial<PasajeroCreateData>
  ): Promise<Pasajero> {
    try {
      return await this.reservaApi.put<Pasajero>(
        `/${reservaId}/pasajeros/${pasajeroId}`,
        data
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el pasajero ${pasajeroId}`
      );
    }
  }

  /**
   * Elimina un pasajero
   */
  async deletePasajero(reservaId: string, pasajeroId: string): Promise<void> {
    try {
      await this.reservaApi.delete(`/${reservaId}/pasajeros/${pasajeroId}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al eliminar el pasajero ${pasajeroId}`
      );
    }
  }

  /**
   * Genera documentos de una venta (factura, confirmación, etc.)
   */
  async generarDocumento(
    ventaId: string,
    tipo: "factura" | "boleta" | "confirmacion"
  ): Promise<{ url: string }> {
    try {
      return await this.ventaApi.post<{ url: string }>(
        `/${ventaId}/documentos`,
        { tipo }
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al generar documento ${tipo} para la venta ${ventaId}`
      );
    }
  }
}

// Exportamos una instancia única del servicio
export const ventaService = new VentaService();
