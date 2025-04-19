"use client";

import { Protected } from "@/components/auth/protected";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/constants/auth";

export default function Page() {
  return (
    <Protected requiredRole={ROLES.ADMIN}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Administración
        </h1>
        <p className="text-muted-foreground">
          Panel de administración del sistema
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Gestión de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Administra los usuarios del sistema, sus roles y permisos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Gestión de Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configura los roles disponibles y sus permisos asociados.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Auditoría</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualiza el registro de actividades y eventos del sistema.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Protected>
  );
}
