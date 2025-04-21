"use client";

import { useState, useEffect } from "react";
import {
  auditService,
  AuditLogResponse,
  AuditLogFilter,
  AuditAction,
  AuditModule,
} from "@/services/audit-service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  FilterIcon,
  RefreshCwIcon,
  UserIcon,
  ClockIcon,
  MapPinIcon,
  EyeIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Función para formatear fecha en formato legible
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy HH:mm:ss", { locale: es });
};

// Función para obtener etiqueta según acción
const getActionBadge = (action: AuditAction) => {
  const actionColors: Record<AuditAction, string> = {
    login: "bg-green-100 text-green-800",
    logout: "bg-yellow-100 text-yellow-800",
    create: "bg-blue-100 text-blue-800",
    update: "bg-purple-100 text-purple-800",
    delete: "bg-red-100 text-red-800",
    view: "bg-gray-100 text-gray-800",
    export: "bg-indigo-100 text-indigo-800",
    import: "bg-teal-100 text-teal-800",
    print: "bg-pink-100 text-pink-800",
  };

  return <Badge className={actionColors[action]}>{action.toUpperCase()}</Badge>;
};

// Función para obtener etiqueta según módulo
const getModuleBadge = (module: AuditModule) => {
  return (
    <Badge variant="outline" className="font-medium">
      {module}
    </Badge>
  );
};

export default function AuditLogViewer() {
  // Estado para almacenar los logs
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para filtros
  const [filters, setFilters] = useState<AuditLogFilter>({
    page: 1,
    limit: 10,
  });

  // Estado para detalles de log seleccionado
  const [selectedLog, setSelectedLog] = useState<AuditLogResponse | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Opciones para select de acción
  const actionOptions: AuditAction[] = [
    "login",
    "logout",
    "create",
    "update",
    "delete",
    "view",
    "export",
    "import",
    "print",
  ];

  // Opciones para select de módulo
  const moduleOptions: AuditModule[] = [
    "auth",
    "clientes",
    "productos",
    "ventas",
    "reservas",
    "cotizaciones",
    "reportes",
    "usuarios",
    "roles",
    "configuracion",
  ];

  // Efecto para cargar logs al iniciar o cambiar filtros
  useEffect(() => {
    fetchLogs();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Efecto para recargar cuando cambian la página o el límite
  useEffect(() => {
    if (logs.length > 0) {
      // Solo si ya hay logs cargados (evita doble carga inicial)
      fetchLogs();
    }
  }, [filters.page, filters.limit]);

  // Función para obtener logs
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditService.getLogs(filters);
      setLogs(result.logs);
      setTotal(result.total);
    } catch (error) {
      setError("Error al cargar los registros de auditoría");
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar detalles de un log
  const loadLogDetails = async (logId: string) => {
    try {
      const logDetail = await auditService.getLogDetail(logId);
      setSelectedLog(logDetail);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Error fetching log details:", error);
    }
  };

  // Función para actualizar filtros
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFilter = (key: keyof AuditLogFilter, value: any) => {
    setFilters((prev) => ({
      ...prev,
      // Manejar el valor 'all' como undefined para mantener la compatibilidad con el backend
      [key]: value === "all" ? undefined : value,
      // Resetear página al cambiar filtros que no sean de paginación
      ...(key !== "page" && key !== "limit" ? { page: 1 } : {}),
    }));
  };

  // Función para aplicar filtros
  const applyFilters = () => {
    fetchLogs();
  };

  // Función para resetear filtros
  const resetFilters = () => {
    // Establecer todos los filtros a sus valores predeterminados
    setFilters({
      page: 1,
      limit: 10,
      action: undefined,
      module: undefined,
      startDate: undefined,
      endDate: undefined,
      userId: undefined,
      entityId: undefined,
    });

    // Recargar los datos con los filtros restablecidos
    // setTimeout(() => {
    //   fetchLogs();
    // }, 0);
  };

  // Cálculo del número total de páginas
  const totalPages = Math.ceil(total / (filters.limit || 10));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Registros de Auditoría
          </CardTitle>
          <CardDescription>
            Consulta los registros de actividad generados por el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Acción</label>
              <Select
                value={filters.action || "all"}
                onValueChange={(value) =>
                  updateFilter("action", value as AuditAction)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las acciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las acciones</SelectItem>
                  {actionOptions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Módulo</label>
              <Select
                value={filters.module || "all"}
                onValueChange={(value) =>
                  updateFilter("module", value as AuditModule)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los módulos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los módulos</SelectItem>
                  {moduleOptions.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha desde</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate
                      ? format(new Date(filters.startDate), "PP", {
                          locale: es,
                        })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      filters.startDate
                        ? new Date(filters.startDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      updateFilter("startDate", date ?? undefined)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha hasta</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate
                      ? format(new Date(filters.endDate), "PP", { locale: es })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      filters.endDate ? new Date(filters.endDate) : undefined
                    }
                    onSelect={(date) =>
                      updateFilter("endDate", date ?? undefined)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button onClick={applyFilters} disabled={loading}>
              <FilterIcon className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={resetFilters} disabled={loading}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Resetear
            </Button>
          </div>

          {/* Tabla de logs */}
          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-800 mb-4">
              {error}
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Cargando registros...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No se encontraron registros de auditoría
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <ClockIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {formatDateTime(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {log.userName}
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>{getModuleBadge(log.module)}</TableCell>
                      <TableCell
                        className="max-w-xs truncate"
                        title={log.details}
                      >
                        {log.details}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadLogDetails(log.id)}
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span className="sr-only">Ver detalles</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {!loading && logs.length > 0 && totalPages > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando{" "}
                {(filters.page || 1) * (filters.limit || 10) -
                  (filters.limit || 10) +
                  1}{" "}
                a {Math.min((filters.page || 1) * (filters.limit || 10), total)}{" "}
                de {total} registros
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        (filters.page || 1) > 1 &&
                        updateFilter(
                          "page",
                          Math.max(1, (filters.page || 1) - 1)
                        )
                      }
                      className={
                        (filters.page || 1) <= 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      (filters.page || 1) <= 3
                        ? i + 1
                        : (filters.page || 1) + i - 2;

                    if (pageNum <= 0 || pageNum > totalPages) return null;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={pageNum === (filters.page || 1)}
                          onClick={() => updateFilter("page", pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        (filters.page || 1) < totalPages &&
                        updateFilter(
                          "page",
                          Math.min(totalPages, (filters.page || 1) + 1)
                        )
                      }
                      className={
                        (filters.page || 1) >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del Registro de Auditoría</DialogTitle>
            <DialogDescription>
              Información completa del evento registrado
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ID</h4>
                  <p>{selectedLog.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Fecha y Hora
                  </h4>
                  <p>{formatDateTime(selectedLog.timestamp)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Usuario</h4>
                <p>
                  {selectedLog.userName} ({selectedLog.userEmail})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Acción</h4>
                  <p>{getActionBadge(selectedLog.action)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Módulo</h4>
                  <p>{getModuleBadge(selectedLog.module)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Dirección IP
                </h4>
                <p className="flex items-center">
                  <MapPinIcon className="mr-1 h-4 w-4 text-gray-400" />
                  {selectedLog.ipAddress}
                </p>
              </div>

              {selectedLog.entityId && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    ID de Entidad
                  </h4>
                  <p>{selectedLog.entityId}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500">Detalles</h4>
                <p className="mt-1 p-2 bg-gray-50 rounded-md">
                  {selectedLog.details}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
