"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon, LogOutIcon, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function NavbarUserMenu() {
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      setShowConfirmDialog(false);
    }
  };

  // Si estamos cargando la sesión, mostrar un Avatar con carga
  if (isLoading) {
    return (
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full"
        disabled
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <Loader2 className="h-4 w-4 animate-spin" />
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  // Obtener las iniciales del usuario para el avatar
  const getInitials = () => {
    if (!user?.nombre) return "U";

    // Dividir el nombre completo y obtener las iniciales
    const nameParts = user.nombre.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
            aria-label="Menu de usuario"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.nombre || "Usuario"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/perfil" className="flex items-center cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Mi perfil</span>
            </Link>
          </DropdownMenuItem>
          {user?.roles?.includes("Administrador") && (
            <DropdownMenuItem asChild>
              <Link
                href="/administracion/usuarios"
                className="flex items-center cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Administración</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center cursor-pointer text-destructive focus:text-destructive"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOutIcon className="mr-2 h-4 w-4" />
            )}
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo de confirmación para cerrar sesión */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cerrar tu sesión actual?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cerrando sesión...
                </>
              ) : (
                "Cerrar sesión"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
