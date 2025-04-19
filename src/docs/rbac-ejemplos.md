# Sistema de Control de Acceso Basado en Roles (RBAC)

Este documento describe la implementación del sistema de Control de Acceso Basado en Roles (RBAC) en la aplicación de Sistema de Ventas para Agencia de Turismo.

## 1. Introducción al RBAC

El Control de Acceso Basado en Roles (RBAC) es un mecanismo de seguridad que controla el acceso a recursos y funcionalidades basándose en los roles asignados a cada usuario. Este enfoque simplifica la administración de permisos al asignar usuarios a roles y asignar permisos a esos roles.

### Beneficios de nuestro sistema RBAC:

- **Simplicidad administrativa**: Gestionar permisos a nivel de rol en lugar de usuario individual.
- **Menor margen de error**: Al centralizar la lógica de autorización.
- **Principio de privilegio mínimo**: Los usuarios solo tienen acceso a lo que necesitan para su función.
- **Separación de responsabilidades**: Diferentes roles para diferentes funciones del negocio.

## 2. Estructura de Roles y Permisos

### 2.1 Roles del Sistema

Nuestra aplicación define los siguientes roles:

| Rol                  | Descripción                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `admin`              | Administrador con acceso completo al sistema                        |
| `counter`            | Personal de counter con acceso a ventas y atención a clientes       |
| `gerente`            | Gerente con acceso a reportes y funciones administrativas limitadas |
| `gestor de paquetes` | Encargado de gestionar productos turísticos y su configuración      |

### 2.2 Permisos por Módulo

Los permisos están organizados por módulos funcionales:

#### Auth (Autenticación y Autorización)

| Código                    | Nombre                      | Descripción                                 |
| ------------------------- | --------------------------- | ------------------------------------------- |
| `user:create`             | Crear usuarios              | Permite crear nuevos usuarios en el sistema |
| `user:read`               | Ver usuarios                | Permite ver información de usuarios         |
| `user:update`             | Actualizar usuarios         | Permite modificar información de usuarios   |
| `user:delete`             | Eliminar usuarios           | Permite eliminar usuarios del sistema       |
| `user:manage_roles`       | Gestionar roles de usuarios | Permite asignar y quitar roles a usuarios   |
| `role:create`             | Crear roles                 | Permite crear nuevos roles en el sistema    |
| `role:read`               | Ver roles                   | Permite ver información de roles            |
| `role:update`             | Actualizar roles            | Permite modificar información de roles      |
| `role:delete`             | Eliminar roles              | Permite eliminar roles del sistema          |
| `role:manage_permissions` | Gestionar permisos de roles | Permite asignar y quitar permisos a roles   |
| `permission:read`         | Ver permisos                | Permite ver información de permisos         |

#### Clientes

| Código           | Nombre              | Descripción                               |
| ---------------- | ------------------- | ----------------------------------------- |
| `cliente:create` | Crear clientes      | Permite crear nuevos clientes             |
| `cliente:read`   | Ver clientes        | Permite ver información de clientes       |
| `cliente:update` | Actualizar clientes | Permite modificar información de clientes |
| `cliente:delete` | Eliminar clientes   | Permite eliminar clientes                 |

#### Productos

| Código             | Nombre                | Descripción                                |
| ------------------ | --------------------- | ------------------------------------------ |
| `producto:create`  | Crear productos       | Permite crear nuevos productos             |
| `producto:read`    | Ver productos         | Permite ver información de productos       |
| `producto:update`  | Actualizar productos  | Permite modificar información de productos |
| `producto:delete`  | Eliminar productos    | Permite eliminar productos                 |
| `categoria:manage` | Gestionar categorías  | Permite gestionar categorías de productos  |
| `proveedor:manage` | Gestionar proveedores | Permite gestionar proveedores              |
| `precio:manage`    | Gestionar precios     | Permite gestionar precios y promociones    |

#### Ventas

| Código              | Nombre                 | Descripción                             |
| ------------------- | ---------------------- | --------------------------------------- |
| `venta:create`      | Crear ventas           | Permite crear nuevas ventas             |
| `venta:read`        | Ver ventas             | Permite ver información de ventas       |
| `venta:update`      | Actualizar ventas      | Permite modificar información de ventas |
| `venta:cancel`      | Cancelar ventas        | Permite cancelar ventas                 |
| `cotizacion:manage` | Gestionar cotizaciones | Permite gestionar cotizaciones          |
| `reserva:manage`    | Gestionar reservas     | Permite gestionar reservas              |

#### Reportes

| Código              | Nombre                    | Descripción                                       |
| ------------------- | ------------------------- | ------------------------------------------------- |
| `reporte:ventas`    | Ver reportes de ventas    | Permite ver reportes de ventas                    |
| `reporte:clientes`  | Ver reportes de clientes  | Permite ver reportes de clientes                  |
| `reporte:productos` | Ver reportes de productos | Permite ver reportes de productos                 |
| `reporte:custom`    | Reportes personalizados   | Permite crear y gestionar reportes personalizados |

#### System

| Código          | Nombre             | Descripción                               |
| --------------- | ------------------ | ----------------------------------------- |
| `system:config` | Configurar sistema | Permite configurar parámetros del sistema |
| `system:audit`  | Ver auditoría      | Permite ver registros de auditoría        |

### 2.3 Asignación de Permisos a Roles

#### Rol: admin

- Acceso completo a todos los permisos

#### Rol: counter

- `cliente:create`, `cliente:read`, `cliente:update`
- `producto:read`
- `venta:create`, `venta:read`, `venta:update`
- `cotizacion:manage`, `reserva:manage`
- `reporte:ventas`

#### Rol: gerente

- `cliente:read`, `cliente:update`
- `producto:read`
- `venta:read`, `venta:update`, `venta:cancel`
- `cotizacion:manage`, `reserva:manage`
- `reporte:ventas`, `reporte:clientes`, `reporte:productos`, `reporte:custom`
- `system:audit`

#### Rol: gestor de paquetes

- `producto:create`, `producto:read`, `producto:update`, `producto:delete`
- `categoria:manage`, `proveedor:manage`, `precio:manage`
- `reporte:productos`

## 3. Implementación en la Aplicación

### 3.1 Componentes del RBAC

El sistema RBAC se implementa a través de los siguientes componentes:

#### Componente `Protected`

Protege rutas y páginas completas, verificando autenticación y permisos/roles requeridos.

```tsx
// Ejemplo de uso
<Protected requiredPermission="producto:update" requiredRole="admin">
  <EditarProductoForm />
</Protected>
```

#### Componente `PermissionGuard`

Protege elementos individuales de la interfaz de usuario.

```tsx
// Ejemplo de uso
<PermissionGuard permission="venta:cancel">
  <Button variant="destructive">Cancelar Venta</Button>
</PermissionGuard>
```

#### Hook `usePermissions`

Proporciona funciones para verificar permisos y renderizado condicional.

```tsx
// Ejemplo de uso
const { canAccess, renderIfHasAccess } = usePermissions();

// Verificar acceso
if (canAccess("reporte:ventas")) {
  // Código que requiere permiso
}

// Renderizado condicional
{
  renderIfHasAccess(<Button>Generar Reporte</Button>, "reporte:ventas");
}
```

### 3.2 Middleware de Autenticación y Autorización

El middleware está implementado en `auth.config.ts` y maneja:

- Autenticación básica (verificación de inicio de sesión)
- Protección de rutas basada en roles (ej. `/administracion` solo para admin)
- Propagación de roles y permisos a través de la sesión

### 3.3 Flujo de Verificación

El sistema sigue el siguiente flujo para verificar el acceso:

1. **Middleware** verifica la autenticación y acceso básico a rutas.
2. **Componente Protected** verifica requisitos específicos para páginas.
3. **PermissionGuard y usePermissions** verifican el acceso a elementos individuales.

## 4. Ejemplos de Uso

### 4.1 Protección a nivel de página

```tsx
// src/app/(dashboard)/administracion/usuarios/page.tsx
"use client";

import { Protected } from "@/components/auth/protected";
import { PERMISOS } from "@/constants/auth";

export default function UsuariosPage() {
  return (
    <Protected requiredPermission={PERMISOS.USER_READ}>
      <h1>Administración de Usuarios</h1>
      {/* Contenido de la página */}
    </Protected>
  );
}
```

### 4.2 Protección de elementos de UI

```tsx
// Ejemplo en un componente de tabla de productos
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISOS } from "@/constants/auth";

export function ProductosTable({ productos }) {
  return (
    <Table>
      {/* Contenido de la tabla */}
      <TableCell>
        <PermissionGuard permission={PERMISOS.PRODUCTO_UPDATE}>
          <Button variant="outline" size="sm">
            Editar
          </Button>
        </PermissionGuard>

        <PermissionGuard permission={PERMISOS.PRODUCTO_DELETE}>
          <Button variant="destructive" size="sm">
            Eliminar
          </Button>
        </PermissionGuard>
      </TableCell>
    </Table>
  );
}
```

### 4.3 Uso del hook para lógica condicional

```tsx
// Ejemplo en un componente de detalles de venta
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISOS } from "@/constants/auth";

export function VentaActions({ venta }) {
  const { canAccess, renderIfHasAccess } = usePermissions();

  // Función que solo se ejecuta si tiene permiso
  const handleCancelarVenta = () => {
    if (canAccess(PERMISOS.VENTA_CANCEL)) {
      // Lógica para cancelar venta
    }
  };

  return (
    <div className="flex gap-2">
      {/* Botones básicos visibles para todos */}
      <Button variant="outline">Ver Detalles</Button>

      {/* Renderizado condicional de botones */}
      {renderIfHasAccess(
        <Button variant="default">Imprimir Factura</Button>,
        PERMISOS.VENTA_READ
      )}

      {renderIfHasAccess(
        <Button variant="destructive" onClick={handleCancelarVenta}>
          Cancelar Venta
        </Button>,
        PERMISOS.VENTA_CANCEL
      )}
    </div>
  );
}
```

### 4.4 Componente ActionButtons para acciones estándar

```tsx
// Ejemplo de uso de componente ActionButtons
import { ActionButtons } from "@/components/common/ActionButtons";
import { PERMISOS } from "@/constants/auth";

export function ClienteRow({ cliente, onView, onEdit, onDelete }) {
  return (
    <TableRow>
      <TableCell>{cliente.nombre}</TableCell>
      <TableCell>{cliente.email}</TableCell>
      <TableCell>
        <ActionButtons
          entityId={cliente.id}
          entityType="cliente"
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          additionalActions={[
            {
              label: "Crear Venta",
              onClick: () => handleCreateSale(cliente.id),
              permission: PERMISOS.VENTA_CREATE,
            },
          ]}
        />
      </TableCell>
    </TableRow>
  );
}
```

## 5. Mejores Prácticas

### 5.1 Uso Consistente de Constantes

Siempre utiliza las constantes definidas en `src/constants/auth.ts` para referencias a roles y permisos:

```tsx
// ✅ Correcto
import { PERMISOS } from "@/constants/auth";
<PermissionGuard permission={PERMISOS.VENTA_CREATE}>

// ❌ Incorrecto
<PermissionGuard permission="venta:create">
```

### 5.2 Manejo de Estados de Carga y Error

Siempre proporciona feedback visual durante verificaciones de permisos:

```tsx
// Ejemplo con manejo de carga
function ClientePage() {
  const { isLoading, hasPermission } = useAuthContext();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!hasPermission(PERMISOS.CLIENTE_READ)) {
    return <PermissionMessage />;
  }

  return <ClienteDetails />;
}
```

### 5.3 Verificación Multinivel

Implementa verificaciones tanto en el frontend como en el backend:

```tsx
// Frontend - Verificación visual
<PermissionGuard permission={PERMISOS.VENTA_CANCEL}>
  <Button onClick={cancelarVenta}>Cancelar</Button>
</PermissionGuard>;

// Backend - Verificación de seguridad
async function cancelarVenta(req, res) {
  // Verificar permisos en el servidor también
  if (!req.user.hasPermission("venta:cancel")) {
    return res.status(403).json({ error: "No autorizado" });
  }

  // Procesar la cancelación
}
```

### 5.4 Mensajes Claros al Usuario

Utiliza el componente `PermissionMessage` para mostrar mensajes informativos:

```tsx
<PermissionGuard
  permission={PERMISOS.REPORTE_VENTAS}
  fallback={
    <PermissionMessage
      message="No tienes permisos para ver reportes de ventas. Contacta a tu administrador."
      compact={true}
    />
  }
>
  <ReporteVentas />
</PermissionGuard>
```

## 6. Solución de Problemas Comunes

### 6.1 El componente Protected no redirige correctamente

**Problema**: La página no redirige aunque el usuario no tiene permisos.

**Solución**:

- Verificar que el componente esté marcado como `"use client"`
- Comprobar que los permisos están correctamente propagados en la sesión
- Verificar que no hay errores en consola relacionados con NextAuth

### 6.2 Elementos visibles para usuarios sin permisos

**Problema**: Botones o elementos aparecen para usuarios que no deberían verlos.

**Solución**:

- Asegurarse de usar `PermissionGuard` o `usePermissions` correctamente
- Verificar que los permisos del usuario se están cargando correctamente
- Comprobar que los nombres de permisos en las constantes coinciden con el backend

### 6.3 Errores de TypeScript con NextAuth

**Problema**: TypeScript marca errores en propiedades de rol y permisos.

**Solución**:

- Verificar que los tipos en `src/types/next-auth.d.ts` están correctamente definidos
- Comprobar que las propiedades de rol y permisos se están pasando correctamente en callbacks

### 6.4 Permisos no persisten después de recargar

**Problema**: El usuario pierde sus permisos al recargar la página.

**Solución**:

- Verificar que los callbacks de NextAuth (`jwt` y `session`) están propagando correctamente la información
- Comprobar el almacenamiento de sesión en el navegador

## 7. Recursos y Referencias

### 7.1 Documentación Oficial

- [NextAuth.js](https://next-auth.js.org/configuration/callbacks)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### 7.2 Archivos Clave

- `src/auth.config.ts`: Configuración principal de autenticación
- `src/middleware.ts`: Middleware para protección de rutas
- `src/constants/auth.ts`: Definición de roles y permisos
- `src/hooks/usePermissions.ts`: Hook para verificaciones de UI
