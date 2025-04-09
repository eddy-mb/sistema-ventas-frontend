"use client";

import { useAuthContext } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon, LogOutIcon, SettingsIcon, UserCogIcon } from "lucide-react";
import Link from "next/link";

export function NavbarUserMenu() {
  const { session, isAuthenticated, logout } = useAuthContext();

  if (!isAuthenticated || !session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="outline" size="sm">
            Iniciar sesión
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Registrarse</Button>
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          aria-label="Menu de usuario"
        >
          <Avatar className="h-8 w-8">
            {session.user?.image && (
              <AvatarImage
                src={session.user.image}
                alt={session.user.name || "Avatar"}
              />
            )}
            <AvatarFallback>
              {session.user?.name
                ? session.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user?.name || "Usuario"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.email || ""}
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
        {session.user?.rol === "admin" && (
          <DropdownMenuItem asChild>
            <Link
              href="/administracion"
              className="flex items-center cursor-pointer"
            >
              <UserCogIcon className="mr-2 h-4 w-4" />
              <span>Administración</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link
            href="/configuracion"
            className="flex items-center cursor-pointer"
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
