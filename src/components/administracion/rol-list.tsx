"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Check,
  X,
  RefreshCw,
  ShieldCheck,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

import { adminService } from "@/services/admin-service";
import { Rol } from "@/types/admin.types";
import { formatDate } from "@/lib/utils";

// Componente principal para la lista de roles
export default function RolList() {
  const router = useRouter();
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });

  // Cargar roles
  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const rolesData = await adminService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al cargar roles:", error);
      toast.error("No se pudieron cargar los roles");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // Cambiar el estado de un rol
  const handleChangeStatus = useCallback(
    async (id: string, estado: boolean) => {
      try {
        setLoadingAction(id);
        await adminService.changeRolStatus(id, estado);
        toast.success(
          `Rol ${estado ? "activado" : "desactivado"} exitosamente`
        );
        loadRoles(); // Recargar roles
      } catch (error) {
        console.error("Error al cambiar estado del rol:", error);
        toast.error("No se pudo cambiar el estado del rol");
      } finally {
        setLoadingAction(null);
      }
    },
    [loadRoles]
  );

  // Mostrar diálogo de confirmación
  const showConfirmDialog = (
    title: string,
    description: string,
    onConfirm: () => Promise<void>
  ) => {
    setConfirmDialog({
      open: true,
      title,
      description,
      onConfirm,
    });
  };

  // Filtrar roles por término de búsqueda
  const filteredRoles = roles.filter(
    (rol) =>
      rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar rol..."
              className="pl-8 w-[200px] sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={() => router.push("/administracion/roles/nuevo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Rol
        </Button>
      </div>

      {/* Tabla de roles */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Predefinido</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Permisos</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-10 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron roles
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((rol) => (
                <TableRow key={rol.id}>
                  <TableCell className="font-medium">{rol.nombre}</TableCell>
                  <TableCell>{rol.descripcion}</TableCell>
                  <TableCell>
                    {rol.esPredefinido ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={rol.estado ? "success" : "secondary"}>
                      {rol.estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {rol.permisos.length} permisos
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(rol.fechaCreacion)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {loadingAction === rol.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/administracion/roles/${rol.id}`)
                          }
                          disabled={loadingAction === rol.id}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/administracion/roles/${rol.id}/permisos`
                            )
                          }
                          disabled={loadingAction === rol.id}
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Gestionar permisos
                        </DropdownMenuItem>

                        {!rol.esPredefinido && (
                          <>
                            <DropdownMenuSeparator />
                            {rol.estado ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  showConfirmDialog(
                                    "Desactivar rol",
                                    "¿Está seguro que desea desactivar este rol? Los usuarios con este rol no podrán usar sus permisos asociados mientras esté desactivado.",
                                    async () =>
                                      await handleChangeStatus(rol.id, false)
                                  )
                                }
                                disabled={loadingAction === rol.id}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Desactivar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  showConfirmDialog(
                                    "Activar rol",
                                    "¿Está seguro que desea activar este rol? Los usuarios con este rol podrán usar sus permisos asociados.",
                                    async () =>
                                      await handleChangeStatus(rol.id, true)
                                  )
                                }
                                disabled={loadingAction === rol.id}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Activar
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Jerarquía de roles (Visualización simplificada) */}
      {!loading && filteredRoles.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Jerarquía de Roles</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Visualización de la estructura jerárquica de roles en el sistema
          </p>
          <div className="pl-5 border-l-2 border-primary/20 space-y-3">
            {/* Administrador (Nivel superior) */}
            <div className="relative">
              <div className="absolute w-5 h-0.5 bg-primary/20 -left-5 top-3"></div>
              <div className="font-medium">Administrador</div>
              <div className="pl-5 border-l-2 border-primary/20 mt-2 space-y-3">
                {/* Supervisor (Segundo nivel) */}
                <div className="relative">
                  <div className="absolute w-5 h-0.5 bg-primary/20 -left-5 top-3"></div>
                  <div className="font-medium">Supervisor</div>
                  <div className="pl-5 border-l-2 border-primary/20 mt-2 space-y-3">
                    {/* Counter (Tercer nivel) */}
                    <div className="relative">
                      <div className="absolute w-5 h-0.5 bg-primary/20 -left-5 top-3"></div>
                      <div className="font-medium">Counter</div>
                    </div>
                    {/* Gestor de paquetes (Tercer nivel) */}
                    <div className="relative">
                      <div className="absolute w-5 h-0.5 bg-primary/20 -left-5 top-3"></div>
                      <div className="font-medium">Gestor de paquetes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * La jerarquía muestra los roles predefinidos del sistema. Los roles
            personalizados no se muestran en esta visualización.
          </p>
        </Card>
      )}

      {/* Diálogo de confirmación */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog((prev) => ({ ...prev, open: false }))
              }
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                try {
                  await confirmDialog.onConfirm();
                } finally {
                  setConfirmDialog((prev) => ({ ...prev, open: false }));
                }
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
