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
  resultado: "exito" | "error";
}

// Interfaz para filtros de log de auditoría
export interface LogAuditoriaFilter {
  pagina: number;
  limite: number;
  fechaInicio?: string;
  fechaFin?: string;
  modulo?: string;
  accion?: string;
  resultado?: "exito" | "error";
  search?: string;
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
  usuarioCreacion?: string;
}

// Datos para actualizar un usuario
export interface UsuarioUpdateData {
  nombreUsuario?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
  roles?: string[]; // IDs de roles
  usuarioModificacion?: string;
}

// Datos para cambiar contraseña
export interface CambiarContrasenaData {
  contrasenaActual: string;
  nuevaContrasena: string;
  usuarioModificacion?: string;
}

// Datos para restablecer contraseña
export interface RestablecerContrasenaData {
  nuevaContrasena: string;
  usuarioModificacion?: string;
}

// Interfaz para filtros de búsqueda de usuarios
export interface UsuarioFilter {
  search?: string;
  estado?: "activo" | "inactivo";
  rol?: string;
  pagina: number;
  limite: number;
}
