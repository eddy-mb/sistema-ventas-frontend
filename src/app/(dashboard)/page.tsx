"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, DollarSign, ShoppingBasket, Users } from "lucide-react";

export default function Dashboard() {
  const { session, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Estado de autenticación:", isAuthenticated);
      console.log("Información de sesión:", session);
    }
  }, [isAuthenticated, session]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al sistema de ventas de Ama Wara Tour
        </p>
      </div>
      {isAuthenticated ? (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas Totales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% respecto al mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Nuevos Clientes
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">
                  +10.1% respecto al mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas Pendientes
                </CardTitle>
                <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  -5% respecto al mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasa de Conversión
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32.5%</div>
                <p className="text-xs text-muted-foreground">
                  +3% respecto al mes anterior
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardDescription>
                  Últimas ventas realizadas en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Paquete Lago Titicaca
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cliente: Juan Pérez | $450.00
                      </p>
                    </div>
                    <div className="ml-auto font-medium">Hace 2h</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Tour Valle de la Luna
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cliente: María López | $120.00
                      </p>
                    </div>
                    <div className="ml-auto font-medium">Hace 5h</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Paquete Salar de Uyuni
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cliente: Carlos Santos | $780.00
                      </p>
                    </div>
                    <div className="ml-auto font-medium">Ayer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productos Populares</CardTitle>
                <CardDescription>
                  Productos más vendidos este mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Salar de Uyuni 3D/2N
                      </p>
                      <p className="text-sm text-muted-foreground">
                        24 ventas este mes
                      </p>
                    </div>
                    <div className="ml-auto font-medium">$23,500</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        City Tour La Paz
                      </p>
                      <p className="text-sm text-muted-foreground">
                        18 ventas este mes
                      </p>
                    </div>
                    <div className="ml-auto font-medium">$3,240</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Tiwanaku
                      </p>
                      <p className="text-sm text-muted-foreground">
                        15 ventas este mes
                      </p>
                    </div>
                    <div className="ml-auto font-medium">$2,850</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <p>Cargando información...</p>
      )}
    </div>
  );
}
