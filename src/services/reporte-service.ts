// src/services/reporte-service.ts
import { createModuleApi, ApiError } from "@/lib/axios";

// Tipos de reportes
export type TipoReporte =
  | "ventas_periodo"
  | "ventas_agente"
  | "productos_vendidos"
  | "clientes_frecuentes"
  | "ventas_categoria"
  | "rentabilidad"
  | "cancelaciones"
  | "personalizado";

// Interfaces para cada tipo de reporte
export interface ReporteVentasPeriodo {
  periodo: string;
  cantidadVentas: number;
  montoTotal: number;
  impuestos: number;
  descuentos: number;
  variacionPorcentual?: number;
}

export interface ReporteVentasAgente {
  idAgente: string;
  nombreAgente: string;
  cantidadVentas: number;
  montoTotal: number;
  ticketPromedio: number;
  tasaConversion: number;
}

export interface ReporteProductosVendidos {
  idProducto: string;
  nombreProducto: string;
  categoria: string;
  cantidadVendida: number;
  montoTotal: number;
  margenPromedio: number;
  tendencia: "creciente" | "decreciente" | "estable";
}

export interface ReporteClientesFrecuentes {
  idCliente: string;
  nombreCliente: string;
  cantidadCompras: number;
  montoTotal: number;
  fechaUltimaCompra: string;
  categoria: "premium" | "frecuente" | "ocasional" | "nuevo";
  lifetimeValue: number;
}

// Interfaz para filtros de reportes
export interface ReporteFilter {
  fechaInicio: string;
  fechaFin: string;
  idAgente?: string;
  idCategoria?: string;
  idProducto?: string;
  idCliente?: string;
  agruparPor?: "dia" | "semana" | "mes" | "trimestre" | "anio";
  limite?: number;
}

// Interfaz para plantilla de reporte personalizado
export interface PlantillaReporte {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoReporte;
  configuracion: unknown;
  fechaCreacion: string;
  idCreador: string;
}

// Interfaz para generación de reporte programado
export interface ReporteProgramado {
  id: string;
  idPlantilla: string;
  frecuencia: "diaria" | "semanal" | "mensual" | "trimestral";
  diaSemana?: number;
  diaMes?: number;
  horaEjecucion: string;
  destinatarios: string[];
  estado: "activo" | "pausado";
  ultimaEjecucion?: string;
}

// Interfaz para KPIs del dashboard
export interface DashboardKPIs {
  ventasTotales: number;
  clientesNuevos: number;
  ventasPendientes: number;
  tasaConversion: number;
  comparativoAnterior: {
    ventasTotales: number;
    clientesNuevos: number;
    ventasPendientes: number;
    tasaConversion: number;
  };
}

/**
 * Servicio para gestionar reportes
 */
class ReporteService {
  private api;
  private plantillasApi;
  private programacionApi;

  constructor() {
    this.api = createModuleApi("/reportes");
    this.plantillasApi = createModuleApi<PlantillaReporte>(
      "/reportes/plantillas"
    );
    this.programacionApi = createModuleApi<ReporteProgramado>(
      "/reportes/programacion"
    );
  }

  /**
   * Genera un reporte de ventas por período
   */
  async getReporteVentasPeriodo(
    filtros: ReporteFilter
  ): Promise<ReporteVentasPeriodo[]> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.api.get<ReporteVentasPeriodo[]>(
        `/ventas-periodo?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al generar reporte de ventas por período"
      );
    }
  }

  /**
   * Genera un reporte de ventas por agente
   */
  async getReporteVentasAgente(
    filtros: ReporteFilter
  ): Promise<ReporteVentasAgente[]> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.api.get<ReporteVentasAgente[]>(
        `/ventas-agente?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al generar reporte de ventas por agente"
      );
    }
  }

  /**
   * Genera un reporte de productos más vendidos
   */
  async getReporteProductosVendidos(
    filtros: ReporteFilter
  ): Promise<ReporteProductosVendidos[]> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.api.get<ReporteProductosVendidos[]>(
        `/productos-vendidos?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al generar reporte de productos más vendidos"
      );
    }
  }

  /**
   * Genera un reporte de clientes frecuentes
   */
  async getReporteClientesFrecuentes(
    filtros: ReporteFilter
  ): Promise<ReporteClientesFrecuentes[]> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.api.get<ReporteClientesFrecuentes[]>(
        `/clientes-frecuentes?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al generar reporte de clientes frecuentes"
      );
    }
  }

  /**
   * Exporta un reporte a un formato específico
   */
  async exportarReporte(
    tipoReporte: TipoReporte,
    filtros: ReporteFilter,
    formato: "pdf" | "excel" | "csv"
  ): Promise<{ url: string }> {
    try {
      const params = new URLSearchParams();

      // Añadimos los filtros
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      // Añadimos el formato
      params.append("formato", formato);

      return await this.api.get<{ url: string }>(
        `/${tipoReporte}/exportar?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al exportar reporte en formato ${formato}`
      );
    }
  }

  /**
   * Obtiene los KPIs principales del dashboard
   */
  async getKPIs(
    periodo: "dia" | "semana" | "mes" | "anio"
  ): Promise<DashboardKPIs> {
    try {
      return await this.api.get<DashboardKPIs>(`/kpis?periodo=${periodo}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener KPIs");
    }
  }

  /**
   * Obtiene todas las plantillas de reportes
   */
  async getPlantillas(): Promise<PlantillaReporte[]> {
    try {
      return await this.plantillasApi.get<PlantillaReporte[]>("");
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al obtener plantillas de reportes"
      );
    }
  }

  /**
   * Obtiene una plantilla de reporte por su ID
   */
  async getPlantillaById(id: string): Promise<PlantillaReporte> {
    try {
      return await this.plantillasApi.get<PlantillaReporte>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al obtener la plantilla de reporte con ID ${id}`
      );
    }
  }

  /**
   * Crea una nueva plantilla de reporte
   */
  async createPlantilla(
    data: Omit<PlantillaReporte, "id" | "fechaCreacion" | "idCreador">
  ): Promise<PlantillaReporte> {
    try {
      return await this.plantillasApi.post<PlantillaReporte>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al crear la plantilla de reporte"
      );
    }
  }

  /**
   * Actualiza una plantilla de reporte existente
   */
  async updatePlantilla(
    id: string,
    data: Partial<Omit<PlantillaReporte, "id" | "fechaCreacion" | "idCreador">>
  ): Promise<PlantillaReporte> {
    try {
      return await this.plantillasApi.put<PlantillaReporte>(`/${id}`, data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al actualizar la plantilla de reporte con ID ${id}`
      );
    }
  }

  /**
   * Elimina una plantilla de reporte
   */
  async deletePlantilla(id: string): Promise<void> {
    try {
      await this.plantillasApi.delete(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al eliminar la plantilla de reporte con ID ${id}`
      );
    }
  }

  /**
   * Ejecuta un reporte desde una plantilla
   */
  async ejecutarPlantilla(
    idPlantilla: string,
    filtrosAdicionales?: unknown
  ): Promise<unknown> {
    try {
      return await this.plantillasApi.post<unknown>(
        `/${idPlantilla}/ejecutar`,
        filtrosAdicionales || {}
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al ejecutar la plantilla de reporte ${idPlantilla}`
      );
    }
  }

  /**
   * Obtiene todos los reportes programados
   */
  async getReportesProgramados(): Promise<ReporteProgramado[]> {
    try {
      return await this.programacionApi.get<ReporteProgramado[]>("");
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al obtener reportes programados"
      );
    }
  }

  /**
   * Programa la ejecución de un reporte
   */
  async programarReporte(
    data: Omit<ReporteProgramado, "id" | "ultimaEjecucion">
  ): Promise<ReporteProgramado> {
    try {
      return await this.programacionApi.post<ReporteProgramado>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al programar el reporte");
    }
  }

  /**
   * Actualiza un reporte programado
   */
  async updateReporteProgramado(
    id: string,
    data: Partial<Omit<ReporteProgramado, "id" | "ultimaEjecucion">>
  ): Promise<ReporteProgramado> {
    try {
      return await this.programacionApi.put<ReporteProgramado>(`/${id}`, data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el reporte programado ${id}`
      );
    }
  }

  /**
   * Elimina un reporte programado
   */
  async deleteReporteProgramado(id: string): Promise<void> {
    try {
      await this.programacionApi.delete(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al eliminar el reporte programado ${id}`
      );
    }
  }

  /**
   * Pausa o activa un reporte programado
   */
  async toggleReporteProgramado(
    id: string,
    estado: "activo" | "pausado"
  ): Promise<ReporteProgramado> {
    try {
      return await this.programacionApi.patch<ReporteProgramado>(
        `/${id}/estado`,
        { estado }
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al cambiar el estado del reporte programado ${id}`
      );
    }
  }

  /**
   * Ejecuta inmediatamente un reporte programado
   */
  async ejecutarReporteProgramado(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.programacionApi.post<{
        success: boolean;
        message: string;
      }>(`/${id}/ejecutar`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al ejecutar el reporte programado ${id}`
      );
    }
  }
}

// Exportamos una instancia única del servicio
export const reporteService = new ReporteService();
