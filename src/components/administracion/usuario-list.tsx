"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  RefreshCw,
  KeyRound,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

import { adminService } from "@/services/admin-service";
import { Usuario, UsuarioFilter, Rol } from "@/types/admin.types";
import { formatDate } from "@/lib/utils";
import { CustomPagination } from "../common/CustomPagination";

// Componente principal para la lista de usuarios
export default function UsuarioList() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
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

  // Estado para el diálogo de restablecimiento de contraseña
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    newPassword: string;
  }>({
    open: false,
    userId: "",
    userName: "",
    newPassword: "",
  });

  // Filtros
  const [filters, setFilters] = useState<UsuarioFilter>({
    pagina: 1,
    limite: 10,
  });

  // Tiempo de espera antes de hacer la busqueda
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [debouncedSearch] = useDebounce(searchInput, 1000); // 1 segundo de espera

  useEffect(() => {
    handleFilterChange("search", debouncedSearch);
  }, [debouncedSearch]);

  // Cargar los roles para el filtro
  const loadRoles = useCallback(async () => {
    try {
      const rolesData = await adminService.getRoles();
      setRoles(rolesData);
    } catch {
      toast.error("No se pudieron cargar los roles");
    }
  }, []);

  // Cargar usuarios con filtros
  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const { data, total } = await adminService.getUsuarios(filters);
      setUsuarios(data);
      setTotal(total);
    } catch {
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadRoles();
    loadUsuarios();
  }, [loadRoles, loadUsuarios]);

  // Cambiar el estado de un usuario
  const handleChangeStatus = useCallback(
    async (id: string, estado: "activo" | "inactivo") => {
      try {
        setLoadingAction(id);
        await adminService.changeUsuarioStatus(id, estado);
        toast.success(
          `Usuario ${
            estado === "activo" ? "activado" : "desactivado"
          } exitosamente`
        );
        loadUsuarios(); // Recargar usuarios
      } catch {
        toast.error("No se pudo cambiar el estado del usuario");
      } finally {
        setLoadingAction(null);
      }
    },
    [loadUsuarios]
  );

  // Generar una contraseña aleatoria
  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
    let password = "";

    // Asegurar al menos una mayúscula
    password += chars.charAt(Math.floor(Math.random() * 26));

    // Asegurar al menos una minúscula
    password += chars.charAt(26 + Math.floor(Math.random() * 26));

    // Asegurar al menos un número
    password += chars.charAt(52 + Math.floor(Math.random() * 10));

    // Asegurar al menos un carácter especial
    password += chars.charAt(62 + Math.floor(Math.random() * 6));

    // Añadir caracteres adicionales hasta llegar a 10
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Mezclar los caracteres
    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  };

  // Abrir diálogo para restablecer contraseña
  const openResetPasswordDialog = (userId: string, userName: string) => {
    setResetPasswordDialog({
      open: true,
      userId,
      userName,
      newPassword: generateRandomPassword(),
    });
  };

  // Restablecer contraseña
  const handleResetPassword = async () => {
    try {
      setLoadingAction(resetPasswordDialog.userId);

      // Aquí implementamos la llamada para restablecer la contraseña directamente
      // En lugar de enviar un correo, establecemos la nueva contraseña
      await adminService.resetPassword(resetPasswordDialog.userId, {
        nuevaContrasena: resetPasswordDialog.newPassword,
      });

      toast.success("Contraseña restablecida correctamente");
      setResetPasswordDialog((prev) => ({ ...prev, open: false }));
    } catch {
      toast.error("No se pudo restablecer la contraseña del usuario");
    } finally {
      setLoadingAction(null);
    }
  };

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

  // Aplicar filtros
  const handleFilterChange = (
    key: string,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      pagina: 1, // Resetear a la primera página al cambiar filtros
    }));
  };

  // Manejar cambio de página
  const handlePageChange = (pagina: number) => {
    setFilters((prev) => ({
      ...prev,
      pagina,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuario o nombre..."
              className="pl-8 w-[200px] sm:w-[300px]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Estado</p>
                <Select
                  value={filters.estado || ""}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "estado",
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="activo">Activos</SelectItem>
                    <SelectItem value="inactivo">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Rol</p>
                <Select
                  value={filters.rol || ""}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "rol",
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {roles.map((rol) => (
                      <SelectItem key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button onClick={() => router.push("/administracion/usuarios/crear")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Tabla de usuarios */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Último Acceso</TableHead>
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
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-10 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : usuarios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron usuarios con los filtros seleccionados
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nombreUsuario}</TableCell>
                  <TableCell>
                    {usuario.nombre} {usuario.apellidos}
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {usuario.roles.map((rol) => (
                        <Badge key={rol.id} variant="outline">
                          {rol.nombre}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        usuario.estado === "activo" ? "success" : "secondary"
                      }
                    >
                      {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {usuario.ultimoAcceso
                      ? formatDate(usuario.ultimoAcceso)
                      : "Nunca"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {loadingAction === usuario.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/administracion/usuarios/${usuario.id}`
                            )
                          }
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {usuario.estado === "activo" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              showConfirmDialog(
                                "Desactivar usuario",
                                "¿Está seguro que desea desactivar este usuario? El usuario no podrá acceder al sistema mientras esté desactivado.",
                                async () =>
                                  await handleChangeStatus(
                                    usuario.id,
                                    "inactivo"
                                  )
                              )
                            }
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Desactivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              showConfirmDialog(
                                "Activar usuario",
                                "¿Está seguro que desea activar este usuario? El usuario podrá acceder al sistema nuevamente.",
                                async () =>
                                  await handleChangeStatus(usuario.id, "activo")
                              )
                            }
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            openResetPasswordDialog(
                              usuario.id,
                              usuario.nombreUsuario
                            )
                          }
                        >
                          <KeyRound className="mr-2 h-4 w-4" />
                          Restablecer contraseña
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {total > 0 && (
        // <div className="flex justify-center mt-4">
        //   <Pagination
        //     currentPage={filters.pagina || 1}
        //     totalPages={Math.ceil(total / (filters.limite || 10))}
        //     onPageChange={handlePageChange}
        //   />
        // </div>
        <CustomPagination
          total={total}
          pagina={filters.pagina}
          limite={filters.limite}
          cambiarPagina={handlePageChange}
          cambiarLimite={(limite: number) =>
            handleFilterChange("limite", limite)
          }
        />
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

      {/* Diálogo de restablecimiento de contraseña */}
      <Dialog
        open={resetPasswordDialog.open}
        onOpenChange={(open) =>
          setResetPasswordDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restablecer contraseña</DialogTitle>
            <DialogDescription>
              Establezca una nueva contraseña para el usuario{" "}
              <strong>{resetPasswordDialog.userName}</strong>. Se ha generado
              automáticamente una contraseña segura, pero puede modificarla
              antes de guardar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input
                id="newPassword"
                type="text"
                value={resetPasswordDialog.newPassword}
                onChange={(e) =>
                  setResetPasswordDialog((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
              <p className="text-sm text-muted-foreground">
                La contraseña debe tener al menos 8 caracteres, incluir
                mayúsculas, minúsculas y números.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setResetPasswordDialog((prev) => ({ ...prev, open: false }))
              }
            >
              Cancelar
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={loadingAction === resetPasswordDialog.userId}
            >
              {loadingAction === resetPasswordDialog.userId ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Restableciendo...
                </>
              ) : (
                "Restablecer contraseña"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
