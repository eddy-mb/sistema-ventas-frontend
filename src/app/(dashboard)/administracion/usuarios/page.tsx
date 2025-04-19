"use client";

import { useState } from "react";
import { Protected } from "@/components/auth/protected";
import { ROLES, PERMISOS } from "@/constants/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Search, RefreshCw } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";

// Lista ficticia de usuarios para demostración
const mockUsers = [
  {
    id: "1",
    nombreUsuario: "admin",
    nombre: "Administrador",
    apellidos: "Sistema",
    email: "admin@amawaratour.com",
    estado: "activo",
    roles: ["admin"],
    ultimoAcceso: "2023-05-15 14:30:22",
  },
  {
    id: "2",
    nombreUsuario: "jperez",
    nombre: "Juan",
    apellidos: "Pérez",
    email: "jperez@amawaratour.com",
    estado: "activo",
    roles: ["vendedor"],
    ultimoAcceso: "2023-05-14 09:15:45",
  },
  {
    id: "3",
    nombreUsuario: "mlopez",
    nombre: "María",
    apellidos: "López",
    email: "mlopez@amawaratour.com",
    estado: "inactivo",
    roles: ["supervisor"],
    ultimoAcceso: "2023-05-10 16:22:10",
  },
  {
    id: "4",
    nombreUsuario: "pgarcia",
    nombre: "Pedro",
    apellidos: "García",
    email: "pgarcia@amawaratour.com",
    estado: "activo",
    roles: ["vendedor"],
    ultimoAcceso: "2023-05-14 11:45:30",
  },
];

export default function UsuariosPage() {
  const { renderIfHasAccess } = usePermissions();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar usuarios según búsqueda
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.nombreUsuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.apellidos.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulación de recarga de datos
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Protected requiredPermission={PERMISOS.USER_MANAGE_ROLES}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Administración de Usuarios
            </h1>
            <p className="text-muted-foreground">
              Gestiona los usuarios del sistema y sus permisos
            </p>
          </div>

          {renderIfHasAccess(
            <Button asChild>
              <Link href="/administracion/usuarios/crear">
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Link>
            </Button>,
            PERMISOS.USER_CREATE,
            ROLES.ADMIN
          )}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Usuarios del Sistema</CardTitle>
            <CardDescription>
              Lista de usuarios registrados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último acceso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.nombreUsuario}
                        </TableCell>
                        <TableCell>
                          {user.nombre} {user.apellidos}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.roles.map((rol) => (
                            <Badge
                              key={rol}
                              variant="outline"
                              className="mr-1 capitalize"
                            >
                              {rol}
                            </Badge>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.estado === "activo" ? "default" : "secondary"
                            }
                            className="capitalize"
                          >
                            {user.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.ultimoAcceso}
                        </TableCell>
                        <TableCell>
                          {renderIfHasAccess(
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                href={`/administracion/usuarios/${user.id}`}
                              >
                                Editar
                              </Link>
                            </Button>,
                            PERMISOS.USER_UPDATE,
                            ROLES.ADMIN
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
