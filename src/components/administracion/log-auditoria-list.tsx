"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LogAuditoria, LogAuditoriaFilter } from "@/types/admin.types";
import { adminService } from "@/services/admin-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Eye, Loader2, Search, SearchX } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { CustomPagination } from "../common/CustomPagination";
import { useDebounce } from "use-debounce";

// Constantes
const MODULOS = [
  "Usuarios",
  "Roles",
  "Ventas",
  "Configuración",
  "Auth",
] as const;

const ACCIONES = ["Crear", "Actualizar", "Eliminar", "Login"] as const;

const RESULTADOS: Array<"exito" | "error"> = ["exito", "error"];

// Estado inicial de filtros
const FILTROS_INICIALES: LogAuditoriaFilter = {
  pagina: 1,
  limite: 10,
  fechaInicio: undefined,
  fechaFin: undefined,
  modulo: "",
  accion: "",
  resultado: undefined,
  search: "",
};

// Interfaz para el estado de carga
interface EstadoCarga {
  cargandoLogs: boolean;
  error: string | null;
}

export const LogAuditoriaList: React.FC = () => {
  // Estado para los logs
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [estadoCarga, setEstadoCarga] = useState<EstadoCarga>({
    cargandoLogs: false,
    error: null,
  });

  // 🔧 SOLUCION: Unificar filtros y paginación en un solo estado
  const [filtros, setFiltros] = useState<LogAuditoriaFilter>(FILTROS_INICIALES);

  // Estado para dialog de detalles
  const [logSeleccionado, setLogSeleccionado] = useState<LogAuditoria | null>(
    null
  );
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  // 🔧 SOLUCION: Debounce para el campo de búsqueda
  const [searchDebounced] = useDebounce(filtros.search || "", 1000);

  // Función para normalizar filtros antes de enviar al servidor
  const normalizarFiltros = useCallback(
    (filtrosAEnviar: LogAuditoriaFilter): LogAuditoriaFilter => {
      const filtrosNormalizados: LogAuditoriaFilter = {
        ...filtrosAEnviar,
        // Limpiar valores vacíos
        modulo: filtrosAEnviar.modulo || undefined,
        accion: filtrosAEnviar.accion || undefined,
        search: filtrosAEnviar.search?.trim() || undefined,
        pagina: filtrosAEnviar.pagina || 1,
        limite: filtrosAEnviar.limite || 10,
      };

      return filtrosNormalizados;
    },
    []
  );

  // 🔧 SOLUCION: useEffect único y optimizado
  useEffect(() => {
    const ejecutarBusqueda = async () => {
      setEstadoCarga({ cargandoLogs: true, error: null });

      try {
        // Usar searchDebounced en lugar de filtros.search
        const filtrosParaBusqueda = {
          ...filtros,
          search: searchDebounced, // 🎯 Clave: usar el valor debounced
        };

        const filtrosFinales = normalizarFiltros(filtrosParaBusqueda);

        // Convertir fechas al formato esperado por el servidor
        if (filtrosFinales.fechaInicio) {
          try {
            filtrosFinales.fechaInicio = format(
              new Date(filtrosFinales.fechaInicio),
              "yyyy-MM-dd"
            );
          } catch {
            delete filtrosFinales.fechaInicio;
          }
        }

        if (filtrosFinales.fechaFin) {
          try {
            filtrosFinales.fechaFin = format(
              new Date(filtrosFinales.fechaFin),
              "yyyy-MM-dd"
            );
          } catch {
            delete filtrosFinales.fechaFin;
          }
        }

        const response = await adminService.getLogs(filtrosFinales);

        setLogs(response.data || []);
        setTotalLogs(response.total || 0);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar los registros de auditoría";

        setEstadoCarga({ cargandoLogs: false, error: errorMessage });
        toast.error(errorMessage);
        console.error("Error cargando logs:", err);
      } finally {
        setEstadoCarga((prev) => ({ ...prev, cargandoLogs: false }));
      }
    };

    ejecutarBusqueda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtros.pagina,
    filtros.limite,
    filtros.fechaInicio,
    filtros.fechaFin,
    filtros.modulo,
    filtros.accion,
    filtros.resultado,
    searchDebounced,
    normalizarFiltros,
  ]);

  // 🔧 SOLUCION: Función para actualizar filtros con mejor gestión
  const actualizarFiltro = useCallback(
    <K extends keyof LogAuditoriaFilter>(
      clave: K,
      valor: LogAuditoriaFilter[K]
    ) => {
      setFiltros((prev) => {
        const nuevosNuevos = {
          ...prev,
          [clave]: valor,
        };

        // Si cambiamos algo que no sea la página, resetear a página 1
        if (clave !== "pagina" && clave !== "limite") {
          nuevosNuevos.pagina = 1;
        }

        return nuevosNuevos;
      });
    },
    []
  );

  // 🔧 SOLUCION: Función para limpiar filtros mejorada
  const limpiarFiltros = useCallback(() => {
    setFiltros(FILTROS_INICIALES);
  }, []);

  // Función para ver detalles
  const verDetalles = useCallback((log: LogAuditoria) => {
    setLogSeleccionado(log);
    setMostrarDetalles(true);
  }, []);

  // Función para cerrar detalles
  const cerrarDetalles = useCallback(() => {
    setMostrarDetalles(false);
    setLogSeleccionado(null);
  }, []);

  // 🔧 SOLUCION: Funciones de paginación simplificadas
  const cambiarPagina = useCallback(
    (nuevaPagina: number) => {
      actualizarFiltro("pagina", nuevaPagina);
    },
    [actualizarFiltro]
  );

  const cambiarLimite = useCallback((nuevoLimite: number) => {
    setFiltros((prev) => ({
      ...prev,
      limite: nuevoLimite,
      pagina: 1, // Resetear a primera página al cambiar límite
    }));
  }, []);

  // Función para formatear fecha de manera consistente
  const formatearFecha = useCallback((fecha: string): string => {
    try {
      return format(new Date(fecha), "dd/MM/yyyy HH:mm:ss", { locale: es });
    } catch {
      return fecha; // Fallback si la fecha no es válida
    }
  }, []);

  // Función para obtener la variante del badge según el resultado
  const obtenerVarianteBadge = useCallback(
    (resultado: string): "success" | "destructive" => {
      return resultado === "exito" ? "success" : "destructive";
    },
    []
  );

  // Función para obtener el texto del badge
  const obtenerTextoBadge = useCallback((resultado: string): string => {
    return resultado === "exito" ? "Éxito" : "Error";
  }, []);

  // Verificar si hay filtros activos
  const tienesFiltrosActivos = useMemo(() => {
    return (
      filtros.fechaInicio ||
      filtros.fechaFin ||
      filtros.modulo ||
      filtros.accion ||
      filtros.resultado ||
      filtros.search
    );
  }, [filtros]);

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  return (
    <div className="space-y-4">
      <Card className="mx-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pb-4">
            <CardTitle>Registros de Auditoría</CardTitle>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                onClick={limpiarFiltros}
                disabled={!tienesFiltrosActivos}
              >
                <SearchX className="h-4 w-4" />
                Limpiar Filtros
              </Button>
            </div>
          </div>
          {/* Filtros */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda general */}
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Buscar usuario..."
                  value={filtros.search}
                  onChange={(e) => actualizarFiltro("search", e.target.value)}
                />
              </div>

              {/* Selector de fecha de inicio */}
              <div className="w-full md:w-1/3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filtros.fechaInicio ? (
                        format(new Date(filtros.fechaInicio), "dd/MM/yyyy", {
                          locale: es,
                        })
                      ) : (
                        <span>Fecha Inicio</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      locale={es}
                      mode="single"
                      selected={
                        filtros.fechaInicio
                          ? new Date(filtros.fechaInicio)
                          : undefined
                      }
                      onSelect={(date) =>
                        actualizarFiltro("fechaInicio", date?.toISOString())
                      }
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Selector de fecha de fin */}
              <div className="w-full md:w-1/3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filtros.fechaFin ? (
                        format(new Date(filtros.fechaFin), "dd/MM/yyyy", {
                          locale: es,
                        })
                      ) : (
                        <span>Fecha Fin</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      locale={es}
                      mode="single"
                      selected={
                        filtros.fechaFin
                          ? new Date(filtros.fechaFin)
                          : undefined
                      }
                      onSelect={(date) =>
                        actualizarFiltro("fechaFin", date?.toISOString())
                      }
                      disabled={(date) => {
                        if (date > new Date()) return true;
                        if (
                          filtros.fechaInicio &&
                          date < new Date(filtros.fechaInicio)
                        )
                          return true;
                        return false;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Selector de módulo */}
              <div className="w-full md:w-1/3">
                <Select
                  value={filtros.modulo || ""}
                  onValueChange={(value) =>
                    actualizarFiltro("modulo", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los módulos</SelectItem>
                    {MODULOS.map((modulo) => (
                      <SelectItem key={modulo} value={modulo}>
                        {modulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de acción */}
              <div className="w-full md:w-1/3">
                <Select
                  value={filtros.accion || ""}
                  onValueChange={(value) =>
                    actualizarFiltro("accion", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Acción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las acciones</SelectItem>
                    {ACCIONES.map((accion) => (
                      <SelectItem key={accion} value={accion}>
                        {accion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de resultado */}
              <div className="w-full md:w-1/3">
                <Select
                  value={filtros.resultado || ""}
                  onValueChange={(value) =>
                    actualizarFiltro(
                      "resultado",
                      value === "all" ? undefined : (value as "exito" | "error")
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los resultados</SelectItem>
                    {RESULTADOS.map((resultado) => (
                      <SelectItem key={resultado} value={resultado}>
                        {resultado === "exito" ? "Éxito" : "Error"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              {/* Indicador de filtros activos */}
              {tienesFiltrosActivos && (
                <div className="text-sm text-muted-foreground">
                  Filtros activos aplicados • {totalLogs} resultado
                  {totalLogs !== 1 ? "s" : ""} encontrado
                  {totalLogs !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabla de logs */}
          {estadoCarga.cargandoLogs ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Cargando registros...
              </span>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {tienesFiltrosActivos
                ? "No se encontraron registros de auditoría con los filtros aplicados."
                : "No hay registros de auditoría disponibles."}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">
                        Fecha y Hora
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Usuario
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Módulo
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Acción
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Resultado
                      </TableHead>
                      <TableHead className="text-right whitespace-nowrap">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatearFecha(log.fechaHora)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.nombreUsuario}
                        </TableCell>
                        <TableCell>{capitalize(log.modulo)}</TableCell>
                        <TableCell>{log.accion}</TableCell>
                        <TableCell>
                          <Badge variant={obtenerVarianteBadge(log.resultado)}>
                            {obtenerTextoBadge(log.resultado)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => verDetalles(log)}
                          >
                            <Eye size={16} />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Controles de paginación integrados */}
              <div className="mt-4">
                <CustomPagination
                  total={totalLogs}
                  pagina={filtros.pagina}
                  limite={filtros.limite}
                  cambiarPagina={cambiarPagina}
                  cambiarLimite={cambiarLimite}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalles */}
      <Dialog open={mostrarDetalles} onOpenChange={cerrarDetalles}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles del Registro</DialogTitle>
            <DialogDescription>
              Información completa del registro de auditoría
            </DialogDescription>
          </DialogHeader>

          {logSeleccionado && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Fecha y Hora
                  </h4>
                  <p className="text-sm">
                    {formatearFecha(logSeleccionado.fechaHora)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Usuario
                  </h4>
                  <p className="text-sm">{logSeleccionado.nombreUsuario}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Módulo
                  </h4>
                  <p className="text-sm">{logSeleccionado.modulo}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Acción
                  </h4>
                  <p className="text-sm">{logSeleccionado.accion}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    IP de Origen
                  </h4>
                  <p className="text-sm">{logSeleccionado.ipOrigen}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Resultado
                  </h4>
                  <Badge
                    variant={obtenerVarianteBadge(logSeleccionado.resultado)}
                  >
                    {obtenerTextoBadge(logSeleccionado.resultado)}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Detalles de la operación
                </h4>
                <div className="bg-muted p-4 rounded-md overflow-auto">
                  <pre className="whitespace-pre-wrap break-all text-sm">
                    {logSeleccionado.detalles ||
                      "No hay detalles adicionales disponibles."}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogAuditoriaList;
