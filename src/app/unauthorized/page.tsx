"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <ShieldAlert className="h-16 w-16 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        
        <Alert variant="destructive">
          <AlertDescription>
            No tienes los permisos necesarios para acceder a esta sección.
          </AlertDescription>
        </Alert>
        
        <p className="text-muted-foreground">
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Cambiar de usuario</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
