import { Metadata } from "next";
import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Acceso No Autorizado | Sistema de Ventas Amawara Tour",
  description: "No tienes permiso para acceder a esta página",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="flex flex-col items-center max-w-md mx-auto text-center">
        <div className="p-4 rounded-full bg-amber-100 mb-6">
          <ShieldAlertIcon className="h-12 w-12 text-amber-600" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
          Acceso No Autorizado
        </h1>
        
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          No tienes los permisos necesarios para acceder a esta página. 
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild variant="default">
            <Link href="/">
              Volver al inicio
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/login">
              Iniciar sesión con otra cuenta
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
