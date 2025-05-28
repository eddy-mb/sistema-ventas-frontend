"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { adminService } from "@/services/admin-service";
import { Permiso } from "@/types/admin.types";

// Componente para listar todos los permisos disponibles
export default function PermisoList() {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [modules, setModules] = useState<string[]>([]);

  // Cargar permisos
  const loadPermisos = useCallback(async () => {
    try {
      setLoading(true);
      const permisosData = await adminService.getPermisos();
      setPermisos(permisosData);

      // Extraer módulos únicos
      const uniqueModules = Array.from(
        new Set(permisosData.map((p) => p.modulo))
      );
      setModules(uniqueModules.sort());
    } catch {
      toast.error("No se pudieron cargar los permisos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadPermisos();
  }, [loadPermisos]);

  // Filtrar permisos
  const filteredPermisos = permisos.filter((permiso) => {
    const matchesSearch =
      permiso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permiso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permiso.accion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule =
      moduleFilter === "all" || permiso.modulo === moduleFilter;

    return matchesSearch && matchesModule;
  });

  // Formatear nombre de módulo
  const formatModuleName = (moduleName: string) => {
    return moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  };

  // Formatear nombre de acción
  const formatActionName = (action: string) => {
    const actionMap: { [key: string]: string } = {
      ver: "Ver",
      crear: "Crear",
      editar: "Editar",
      eliminar: "Eliminar",
      aprobar: "Aprobar",
      exportar: "Exportar",
      importar: "Importar",
    };

    return actionMap[action.toLowerCase()] || action;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permisos del Sistema</CardTitle>
        <CardDescription>
          Lista completa de permisos disponibles en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar permiso..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={moduleFilter}
              onValueChange={(value) => setModuleFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los módulos</SelectItem>
                {modules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {formatModuleName(module)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground self-center">
            {filteredPermisos.length} permisos encontrados
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredPermisos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No se encontraron permisos con los filtros seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermisos.map((permiso) => (
                  <TableRow key={permiso.id}>
                    <TableCell className="font-medium">
                      {permiso.nombre}
                    </TableCell>
                    <TableCell>{permiso.descripcion}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatModuleName(permiso.modulo)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          permiso.accion === "ver"
                            ? "secondary"
                            : permiso.accion === "crear"
                            ? "default"
                            : permiso.accion === "editar"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {formatActionName(permiso.accion)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
