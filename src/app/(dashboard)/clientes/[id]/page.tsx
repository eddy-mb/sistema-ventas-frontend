"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCog, UserCheck, History, UserPlus } from "lucide-react";
import Link from "next/link";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISOS } from "@/constants/auth";
import { usePermissions } from "@/hooks/usePermissions";

export default function ClientePage() {
  const params = useParams();
  const clienteId = params.id as string;
  const { renderIfHasAccess } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cliente, setCliente] = useState<any>(null); // Tipo debería ser Cliente (CORREGIR MAS ADELANTE - EDDY)

  useEffect(() => {
    // Aquí deberías cargar los datos del cliente usando clienteId
    // Ejemplo simulado:
    setTimeout(() => {
      setCliente({
        id: clienteId,
        nombres: "Juan Carlos",
        apellidos: "Pérez Gómez",
        tipoDocumento: "DNI",
        numeroDocumento: "12345678",
        telefono: "555-123-4567",
        email: "juan.perez@example.com",
        direccion: "Av. Principal 123, La Paz",
        fechaNacimiento: "1985-06-15",
        nacionalidad: "Boliviana",
        estado: "activo",
        fechaRegistro: "2023-01-15",
      });
      setIsLoading(false);
    }, 500);
  }, [clienteId]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">Cargando información del cliente...</div>
    );
  }

  if (!cliente) {
    return <div className="p-8 text-center">Cliente no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/clientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Detalle de Cliente
          </h1>
        </div>

        <div className="flex space-x-2">
          {renderIfHasAccess(
            <Button variant="outline">
              <UserCheck className="mr-2 h-4 w-4" />
              Activar/Desactivar
            </Button>,
            PERMISOS.CLIENTE_UPDATE
          )}

          {renderIfHasAccess(
            <Button>
              <UserCog className="mr-2 h-4 w-4" />
              Editar Cliente
            </Button>,
            PERMISOS.CLIENTE_UPDATE
          )}
        </div>
      </div>

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="contactos">Contactos de Emergencia</TabsTrigger>

          <PermissionGuard permission={PERMISOS.VENTA_READ}>
            <TabsTrigger value="historial">Historial de Compras</TabsTrigger>
          </PermissionGuard>
        </TabsList>

        <TabsContent value="perfil" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nombre Completo</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.nombres} {cliente.apellidos}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Documento</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.tipoDocumento}: {cliente.numeroDocumento}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Fecha de Nacimiento</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.fechaNacimiento}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Nacionalidad</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.nacionalidad}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Estado</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {cliente.estado}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Fecha de Registro</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.fechaRegistro}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Teléfono</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.telefono}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{cliente.email}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium">Dirección</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.direccion}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contactos" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contactos de Emergencia</CardTitle>

              <PermissionGuard permission={PERMISOS.CLIENTE_UPDATE}>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Agregar Contacto
                </Button>
              </PermissionGuard>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No hay contactos de emergencia registrados.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="space-y-4 mt-4">
          <PermissionGuard permission={PERMISOS.VENTA_READ}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Historial de Compras</CardTitle>
                <History className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  No hay compras registradas para este cliente.
                </p>
              </CardContent>
            </Card>
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
