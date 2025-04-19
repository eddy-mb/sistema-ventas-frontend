/**
 * Definición de roles del sistema
 * Estos roles deben coincidir exactamente con los del backend
 */
export const ROLES = {
  ADMIN: "admin",
  COUNTER: "counter",
  GERENTE: "gerente",
  GESTOR_DE_PAQUETES: "gestor de paquetes",
};

/**
 * Definición de permisos del sistema
 * Estos códigos deben coincidir exactamente con los del backend
 */
export const PERMISOS = {
  // Auth
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_MANAGE_ROLES: "user:manage_roles",
  ROLE_CREATE: "role:create",
  ROLE_READ: "role:read",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  ROLE_MANAGE_PERMISSIONS: "role:manage_permissions",
  PERMISSION_READ: "permission:read",

  // Clientes
  CLIENTE_CREATE: "cliente:create",
  CLIENTE_READ: "cliente:read",
  CLIENTE_UPDATE: "cliente:update",
  CLIENTE_DELETE: "cliente:delete",

  // Productos
  PRODUCTO_CREATE: "producto:create",
  PRODUCTO_READ: "producto:read",
  PRODUCTO_UPDATE: "producto:update",
  PRODUCTO_DELETE: "producto:delete",
  CATEGORIA_MANAGE: "categoria:manage",
  PROVEEDOR_MANAGE: "proveedor:manage",
  PRECIO_MANAGE: "precio:manage",

  // Ventas
  VENTA_CREATE: "venta:create",
  VENTA_READ: "venta:read",
  VENTA_UPDATE: "venta:update",
  VENTA_CANCEL: "venta:cancel",
  COTIZACION_MANAGE: "cotizacion:manage",
  RESERVA_MANAGE: "reserva:manage",

  // Reportes
  REPORTE_VENTAS: "reporte:ventas",
  REPORTE_CLIENTES: "reporte:clientes",
  REPORTE_PRODUCTOS: "reporte:productos",
  REPORTE_CUSTOM: "reporte:custom",

  // System
  SYSTEM_CONFIG: "system:config",
  SYSTEM_AUDIT: "system:audit",
};
