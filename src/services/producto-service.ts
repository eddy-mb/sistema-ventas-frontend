// src/services/producto-service.ts
import { createModuleApi, ApiError } from "@/lib/axios";

// Interfaz para el producto
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  idCategoria: string;
  idProveedor: string;
  precioBase: number;
  estado: "Activo" | "Inactivo" | "Agotado";
  fechaCreacion: string;
  fechaActualizacion: string;
  imagenUrl?: string;
  duracion?: string;
  puntosDestacados?: string;
  condiciones?: string;
}

// Interfaz para categoría
export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  idCategoriaPadre?: string;
  estado: "Activo" | "Inactivo";
  orden: number;
}

// Interfaz para proveedor
export interface Proveedor {
  id: string;
  nombre: string;
  rucIdFiscal: string;
  direccion: string;
  telefono: string;
  email: string;
  personaContacto: string;
  estado: "Activo" | "Inactivo";
  notas?: string;
}

// Interfaz para temporada
export interface Temporada {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  tipo: "Alta" | "Media" | "Baja" | "Especial";
}

// Interfaz para precio
export interface Precio {
  id: string;
  idProducto: string;
  idTemporada: string;
  precio: number;
  descuento: number;
  moneda: string;
  fechaVigenciaInicio: string;
  fechaVigenciaFin: string;
  estado: "Activo" | "Inactivo";
}

// Datos para crear un producto
export interface ProductoCreateData {
  nombre: string;
  descripcion: string;
  idCategoria: string;
  idProveedor: string;
  precioBase: number;
  imagenUrl?: string;
  duracion?: string;
  puntosDestacados?: string;
  condiciones?: string;
}

// Datos para actualizar un producto
export type ProductoUpdateData = Partial<ProductoCreateData>;

// Datos para crear una categoría
export interface CategoriaCreateData {
  nombre: string;
  descripcion: string;
  idCategoriaPadre?: string;
  orden: number;
}

// Datos para actualizar una categoría
export type CategoriaUpdateData = Partial<CategoriaCreateData>;

// Datos para crear un precio
export interface PrecioCreateData {
  idTemporada: string;
  precio: number;
  descuento: number;
  moneda: string;
  fechaVigenciaInicio: string;
  fechaVigenciaFin: string;
}

// Interfaz para filtros de búsqueda de productos
export interface ProductoFilter {
  search?: string;
  categoria?: string;
  proveedor?: string;
  estado?: string;
  minPrecio?: number;
  maxPrecio?: number;
  page?: number;
  limit?: number;
}

/**
 * Servicio para gestionar productos
 */
class ProductoService {
  private productoApi;
  private categoriaApi;
  private precioApi;
  private proveedorApi;
  private temporadaApi;

  constructor() {
    this.productoApi = createModuleApi<Producto>("/productos");
    this.categoriaApi = createModuleApi<Categoria>("/productos/categorias");
    this.precioApi = createModuleApi<Precio>("/productos/precios");
    this.proveedorApi = createModuleApi<Proveedor>("/productos/proveedores");
    this.temporadaApi = createModuleApi<Temporada>("/productos/temporadas");
  }

  /**
   * Obtiene la lista de productos con filtros opcionales
   */
  async getProductos(
    filters: ProductoFilter = {}
  ): Promise<{ data: Producto[]; total: number }> {
    try {
      // Construimos los parámetros de la URL
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      return await this.productoApi.get<{ data: Producto[]; total: number }>(
        `?${params.toString()}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener los productos");
    }
  }

  /**
   * Obtiene un producto por su ID
   */
  async getProductoById(id: string): Promise<Producto> {
    try {
      return await this.productoApi.get<Producto>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener el producto con ID ${id}`
      );
    }
  }

  /**
   * Crea un nuevo producto
   */
  async createProducto(data: ProductoCreateData): Promise<Producto> {
    try {
      return await this.productoApi.post<Producto>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al crear el producto");
    }
  }

  /**
   * Actualiza un producto existente
   */
  async updateProducto(
    id: string,
    data: ProductoUpdateData
  ): Promise<Producto> {
    try {
      return await this.productoApi.put<Producto>(`/${id}`, data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el producto con ID ${id}`
      );
    }
  }

  /**
   * Cambia el estado de un producto
   */
  async changeProductoStatus(
    id: string,
    estado: "Activo" | "Inactivo" | "Agotado"
  ): Promise<Producto> {
    try {
      return await this.productoApi.patch<Producto>(`/${id}/estado`, {
        estado,
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al cambiar el estado del producto con ID ${id}`
      );
    }
  }

  /**
   * Elimina un producto
   */
  async deleteProducto(id: string): Promise<void> {
    try {
      await this.productoApi.delete(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al eliminar el producto con ID ${id}`
      );
    }
  }

  /**
   * Obtiene todas las categorías
   */
  async getCategorias(): Promise<Categoria[]> {
    try {
      return await this.categoriaApi.get<Categoria[]>("");
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener las categorías");
    }
  }

  /**
   * Obtiene una categoría por su ID
   */
  async getCategoriaById(id: string): Promise<Categoria> {
    try {
      return await this.categoriaApi.get<Categoria>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener la categoría con ID ${id}`
      );
    }
  }

  /**
   * Crea una nueva categoría
   */
  async createCategoria(data: CategoriaCreateData): Promise<Categoria> {
    try {
      return await this.categoriaApi.post<Categoria>("", data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al crear la categoría");
    }
  }

  /**
   * Actualiza una categoría existente
   */
  async updateCategoria(
    id: string,
    data: CategoriaUpdateData
  ): Promise<Categoria> {
    try {
      return await this.categoriaApi.put<Categoria>(`/${id}`, data);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar la categoría con ID ${id}`
      );
    }
  }

  /**
   * Elimina una categoría
   */
  async deleteCategoria(id: string): Promise<void> {
    try {
      await this.categoriaApi.delete(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al eliminar la categoría con ID ${id}`
      );
    }
  }

  /**
   * Obtiene los precios de un producto
   */
  async getPrecios(productoId: string): Promise<Precio[]> {
    try {
      return await this.precioApi.get<Precio[]>(
        `/productos/${productoId}/precios`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al obtener los precios del producto ${productoId}`
      );
    }
  }

  /**
   * Añade un precio a un producto
   */
  async addPrecio(productoId: string, data: PrecioCreateData): Promise<Precio> {
    try {
      return await this.precioApi.post<Precio>(
        `/productos/${productoId}/precios`,
        data
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al añadir precio al producto ${productoId}`
      );
    }
  }

  /**
   * Actualiza un precio
   */
  async updatePrecio(
    productoId: string,
    precioId: string,
    data: Partial<PrecioCreateData>
  ): Promise<Precio> {
    try {
      return await this.precioApi.put<Precio>(
        `/productos/${productoId}/precios/${precioId}`,
        data
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al actualizar el precio ${precioId}`
      );
    }
  }

  /**
   * Elimina un precio
   */
  async deletePrecio(productoId: string, precioId: string): Promise<void> {
    try {
      await this.precioApi.delete(
        `/productos/${productoId}/precios/${precioId}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al eliminar el precio ${precioId}`
      );
    }
  }

  /**
   * Obtiene todos los proveedores
   */
  async getProveedores(): Promise<Proveedor[]> {
    try {
      return await this.proveedorApi.get<Proveedor[]>("");
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener los proveedores");
    }
  }

  /**
   * Obtiene un proveedor por su ID
   */
  async getProveedorById(id: string): Promise<Proveedor> {
    try {
      return await this.proveedorApi.get<Proveedor>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener el proveedor con ID ${id}`
      );
    }
  }

  /**
   * Obtiene todas las temporadas
   */
  async getTemporadas(): Promise<Temporada[]> {
    try {
      return await this.temporadaApi.get<Temporada[]>("");
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Error al obtener las temporadas");
    }
  }

  /**
   * Obtiene una temporada por su ID
   */
  async getTemporadaById(id: string): Promise<Temporada> {
    try {
      return await this.temporadaApi.get<Temporada>(`/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || `Error al obtener la temporada con ID ${id}`
      );
    }
  }

  /**
   * Verifica la disponibilidad de un producto para fechas específicas
   */
  async checkDisponibilidad(
    productoId: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<{ disponible: boolean; cuposDisponibles: number }> {
    try {
      return await this.productoApi.get<{
        disponible: boolean;
        cuposDisponibles: number;
      }>(
        `/${productoId}/disponibilidad?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al verificar disponibilidad del producto ${productoId}`
      );
    }
  }

  /**
   * Obtiene productos más vendidos
   */
  async getProductosMasVendidos(limit: number = 5): Promise<Producto[]> {
    try {
      return await this.productoApi.get<Producto[]>(
        `/mas-vendidos?limit=${limit}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || "Error al obtener productos más vendidos"
      );
    }
  }

  /**
   * Obtiene productos relacionados con otro producto
   */
  async getProductosRelacionados(
    productoId: string,
    limit: number = 4
  ): Promise<Producto[]> {
    try {
      return await this.productoApi.get<Producto[]>(
        `/${productoId}/relacionados?limit=${limit}`
      );
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message ||
          `Error al obtener productos relacionados con ${productoId}`
      );
    }
  }
}

// Exportamos una instancia única del servicio
export const productoService = new ProductoService();
