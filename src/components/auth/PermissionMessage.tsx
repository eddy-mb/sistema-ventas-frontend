"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PermissionMessageProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  className?: string;
  compact?: boolean;
}

/**
 * Componente para mostrar un mensaje cuando el usuario no tiene permiso
 * para acceder a un recurso o realizar una acción.
 */
export function PermissionMessage({
  title = "Acceso Restringido",
  message = "No tienes los permisos necesarios para acceder a esta sección.",
  icon = <ShieldAlert className="h-10 w-10 text-destructive" />,
  showHomeButton = true,
  showBackButton = true,
  className = "",
  compact = false,
}: PermissionMessageProps) {
  // Si es compact, mostramos solo una alerta simple
  if (compact) {
    return (
      <Alert variant="destructive" className={className}>
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
    );
  }

  // Versión completa con card y botones
  return (
    <Card className={`border-destructive/20 ${className}`}>
      <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{message}</p>
        
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {showBackButton && (
            <Button variant="outline" onClick={() => window.history.back()}>
              Volver atrás
            </Button>
          )}
          
          {showHomeButton && (
            <Button asChild>
              <Link href="/">Ir al inicio</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
