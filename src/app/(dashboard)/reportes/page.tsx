"use client";

import { Protected } from "@/components/auth/protected";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/constants/auth";
import { BarChart3, Users, Package, UserRound } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <Protected requiredRole={[ROLES.ADMIN, ROLES.GERENTE]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">
          Consulta y analiza información clave del negocio
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/reportes/ventas">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Reportes de Ventas
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analiza el comportamiento de las ventas por período
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reportes/clientes">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Reportes de Clientes
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Información sobre clientes frecuentes y comportamiento
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reportes/productos">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Reportes de Productos
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Análisis de productos más vendidos y su rendimiento
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reportes/agentes">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Reportes de Agentes
                </CardTitle>
                <UserRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Desempeño de agentes de ventas y comisiones
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Protected>
  );
}
