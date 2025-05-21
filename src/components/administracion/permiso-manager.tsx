"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/admin-service";
import { Rol, Permiso } from "@/types/admin.types";

interface PermisoManagerProps {
  rolId: string;
}

// Estructura para agrupar permisos por módulo
interface ModuloPermiso {
  modulo: string;
  title: string;
  permisos: Permiso[];
}

// Tipo para la matriz de permisos
interface PermisoMatriz {
  [key: string]: {
    [key: string]: boolean;
  };
}

export default function PermisoManager({ rolId }: PermisoManagerProps) {
  const router = useRouter();
  const [rol, setRol] = useState<Rol | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modulosPermisos, setModulosPermisos] = useState<ModuloPermiso[]>([]);
  const [selectedPermisos, setSelectedPermisos] = useState<Set<string>>(
    new Set()
  );
  const [activeTab, setActiveTab] = useState<string>("matriz");

  // Cargar rol y permisos
  const loadRolAndPermisos = useCallback(async () => {
    try {
      setLoading(true);
      // Cargar rol
      const rolData = await adminService.getRolById(rolId);
      setRol(rolData);

      // Establecer permisos seleccionados del rol
      const permisoIds = rolData.permisos.map((p) => p.id);
      setSelectedPermisos(new Set(permisoIds));

      // Cargar todos los permisos
      const todosPermisos = await adminService.getPermisos();

      // Agrupar permisos por módulo
      const modulos: { [key: string]: ModuloPermiso } = {};

      // Definir títulos legibles para los módulos
      const moduloTitles: { [key: string]: string } = {
        administracion: "Administración y Seguridad",
        clientes: "Gestión de Clientes",
        catalogo: "Catálogo de Productos",
        ventas: "Ventas y Reservas",
        reportes: "Reportes",
      };

      todosPermisos.forEach((permiso) => {
        if (!modulos[permiso.modulo]) {
          modulos[permiso.modulo] = {
            modulo: permiso.modulo,
            title:
              moduloTitles[permiso.modulo] ||
              permiso.modulo.charAt(0).toUpperCase() + permiso.modulo.slice(1),
            permisos: [],
          };
        }
        modulos[permiso.modulo].permisos.push(permiso);
      });

      // Convertir a array y ordenar por nombre de módulo
      const modulosOrdenados = Object.values(modulos).sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      setModulosPermisos(modulosOrdenados);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("No se pudo cargar la información del rol y permisos");
      setError("Error al cargar datos. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [rolId]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadRolAndPermisos();
  }, [loadRolAndPermisos]);

  // Manejar cambio en selección de permiso
  const handlePermisoToggle = (permisoId: string) => {
    const newSelectedPermisos = new Set(selectedPermisos);

    if (newSelectedPermisos.has(permisoId)) {
      newSelectedPermisos.delete(permisoId);
    } else {
      newSelectedPermisos.add(permisoId);
    }

    setSelectedPermisos(newSelectedPermisos);
  };

  // Guardar permisos
  const handleSavePermisos = async () => {
    try {
      setSaving(true);
      setError(null);

      const permisosArray = Array.from(selectedPermisos);

      await adminService.updateRol(rolId, {
        permisos: permisosArray,
      });

      toast.success("Permisos actualizados exitosamente");

      // Recargar datos para mantener sincronización
      await loadRolAndPermisos();
    } catch (error) {
      console.error("Error al guardar permisos:", error);
      setError("No se pudieron guardar los permisos. Intente nuevamente.");
      toast.error("Error al guardar permisos");
    } finally {
      setSaving(false);
    }
  };

  // Seleccionar todos los permisos de un módulo
  const selectAllModulePermisos = (modulo: string) => {
    const modPermisos = modulosPermisos.find((m) => m.modulo === modulo);
    if (!modPermisos) return;

    const newSelectedPermisos = new Set(selectedPermisos);

    modPermisos.permisos.forEach((permiso) => {
      newSelectedPermisos.add(permiso.id);
    });

    setSelectedPermisos(newSelectedPermisos);
  };

  // Deseleccionar todos los permisos de un módulo
  const deselectAllModulePermisos = (modulo: string) => {
    const modPermisos = modulosPermisos.find((m) => m.modulo === modulo);
    if (!modPermisos) return;

    const newSelectedPermisos = new Set(selectedPermisos);

    modPermisos.permisos.forEach((permiso) => {
      newSelectedPermisos.delete(permiso.id);
    });

    setSelectedPermisos(newSelectedPermisos);
  };

  // Verificar si todos los permisos de un módulo están seleccionados
  // const areAllModulePermisosSelected = (modulo: string) => {
  //   const modPermisos = modulosPermisos.find((m) => m.modulo === modulo);
  //   if (!modPermisos) return false;

  //   return modPermisos.permisos.every((permiso) =>
  //     selectedPermisos.has(permiso.id)
  //   );
  // };

  // Verificar si algunos permisos de un módulo están seleccionados
  // const areSomeModulePermisosSelected = (modulo: string) => {
  //   const modPermisos = modulosPermisos.find((m) => m.modulo === modulo);
  //   if (!modPermisos) return false;

  //   return (
  //     modPermisos.permisos.some((permiso) =>
  //       selectedPermisos.has(permiso.id)
  //     ) && !areAllModulePermisosSelected(modulo)
  //   );
  // };

  // Renderizar lista de permisos por módulo
  const renderPermisoList = () => {
    return (
      <div className="space-y-8">
        {modulosPermisos.map((modulo) => (
          <Card key={modulo.modulo}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{modulo.title}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectAllModulePermisos(modulo.modulo)}
                  >
                    Seleccionar todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deselectAllModulePermisos(modulo.modulo)}
                  >
                    Deseleccionar todos
                  </Button>
                </div>
              </div>
              <CardDescription>
                Permisos disponibles para el módulo de{" "}
                {modulo.title.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modulo.permisos.map((permiso) => (
                  <div key={permiso.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={permiso.id}
                      checked={selectedPermisos.has(permiso.id)}
                      onCheckedChange={() => handlePermisoToggle(permiso.id)}
                    />
                    <div className="grid gap-1">
                      <Label
                        htmlFor={permiso.id}
                        className="font-medium cursor-pointer"
                      >
                        {permiso.descripcion}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {permiso.nombre} ({permiso.accion})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Crear matriz de permisos para visualización tabular
  const createPermisoMatrix = (): PermisoMatriz => {
    const matrix: PermisoMatriz = {};

    // Roles predefinidos
    const roles = [
      "Administrador",
      "Supervisor",
      "Counter",
      "Gestor de paquetes",
    ];

    // Acciones comunes
    const acciones = ["Ver", "Crear", "Editar", "Eliminar"];

    // Definir permisos para cada rol y módulo
    const modules = [
      "Administración",
      "Clientes",
      "Catálogo",
      "Ventas",
      "Reportes",
    ];

    roles.forEach((role) => {
      matrix[role] = {};

      modules.forEach((modulo) => {
        acciones.forEach((accion) => {
          const key = `${modulo}-${accion}`;

          // Asignar permisos según la matriz de la especificación
          if (role === "Administrador") {
            matrix[role][key] = true; // Admin tiene todos los permisos
          } else if (role === "Supervisor") {
            matrix[role][key] = accion !== "Eliminar" || modulo === "Ventas";
          } else if (role === "Counter") {
            matrix[role][key] =
              (modulo === "Clientes" && accion !== "Eliminar") ||
              (modulo === "Ventas" &&
                (accion === "Ver" ||
                  accion === "Crear" ||
                  accion === "Editar")) ||
              (modulo === "Catálogo" && accion === "Ver") ||
              (modulo === "Reportes" && accion === "Ver");
          } else if (role === "Gestor de paquetes") {
            matrix[role][key] =
              modulo === "Catálogo" ||
              (modulo === "Clientes" && accion === "Ver") ||
              (modulo === "Ventas" && accion === "Ver") ||
              (modulo === "Reportes" &&
                accion === "Ver" &&
                key.includes("Productos"));
          }
        });
      });
    });

    return matrix;
  };

  // Renderizar matriz de permisos
  const renderPermisoMatrix = () => {
    const matrix = createPermisoMatrix();
    const roles = [
      "Administrador",
      "Supervisor",
      "Counter",
      "Gestor de paquetes",
    ];
    const modules = [
      "Administración",
      "Clientes",
      "Catálogo",
      "Ventas",
      "Reportes",
    ];
    const acciones = ["Ver", "Crear", "Editar", "Eliminar"];

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground bg-muted"
                rowSpan={2}
              >
                Módulo/Funcionalidad
              </th>
              {roles.map((role) => (
                <th
                  key={role}
                  className="px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted"
                  colSpan={4}
                >
                  {role}
                </th>
              ))}
            </tr>
            <tr>
              {roles.map((role) =>
                acciones.map((accion) => (
                  <th
                    key={`${role}-${accion}`}
                    className="px-2 py-2 text-center text-xs font-medium text-muted-foreground bg-muted"
                  >
                    {accion}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {modules.map((modulo) => (
              <tr key={modulo} className="hover:bg-muted/50">
                <td className="px-4 py-3 text-sm font-medium">{modulo}</td>
                {roles.map((role) =>
                  acciones.map((accion) => {
                    const key = `${modulo}-${accion}`;
                    const isPermitted = matrix[role][key] || false;

                    return (
                      <td
                        key={`${role}-${key}`}
                        className="px-2 py-2 text-center"
                      >
                        {isPermitted ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                            ✗
                          </span>
                        )}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/administracion/roles")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5" />
              Gestionar Permisos
            </h1>
            {rol && (
              <p className="text-muted-foreground">
                Rol: <span className="font-medium">{rol.nombre}</span> -
                <span className="ml-1">{rol.descripcion}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {rol?.esPredefinido && (
            <Badge variant="outline" className="mr-2">
              Rol predefinido
            </Badge>
          )}
          <Button
            onClick={handleSavePermisos}
            disabled={saving || rol?.esPredefinido}
          >
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {rol?.esPredefinido && (
        <Alert>
          <AlertDescription>
            Este es un rol predefinido del sistema y sus permisos no pueden ser
            modificados. La matriz de permisos muestra la configuración estándar
            para los roles del sistema.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="matriz">Matriz de Permisos</TabsTrigger>
          <TabsTrigger value="detalle" disabled={rol?.esPredefinido}>
            Permisos Detallados
          </TabsTrigger>
        </TabsList>
        <TabsContent value="matriz" className="mt-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Matriz de Permisos Predefinidos</CardTitle>
              <CardDescription>
                Visualización de los permisos asignados a cada rol del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                <p>
                  Esta matriz muestra la configuración estándar de permisos para
                  los roles predefinidos del sistema.
                </p>
              </div>
              {renderPermisoMatrix()}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="detalle" className="mt-6">
          {renderPermisoList()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
