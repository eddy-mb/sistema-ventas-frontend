"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Bell, User, LogOut, Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/common/breadcrumb";

export function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    // In a real implementation, we would use a theme context or localStorage
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b border-border bg-background px-4 md:px-6">
      {/* Mobile menu button - Only used for mobile view to toggle sidebar */}
      <Button variant="ghost" size="icon" className="mr-2 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Breadcrumb navigation */}
      <div className="mr-auto">
        <Breadcrumb />
      </div>

      {/* Search */}
      <div className="relative hidden md:block mr-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar..."
            className="w-48 rounded-md border border-input bg-background py-2 pl-8 text-sm transition-all focus-visible:w-64 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className="mr-2"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Notifications */}
      <div className="relative mr-2">
        <Button variant="ghost" size="icon" onClick={toggleNotifications}>
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Notifications dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md border border-border bg-card shadow-lg">
            <div className="p-4">
              <h3 className="text-sm font-medium">Notificaciones</h3>
              <div className="mt-2 divide-y divide-border">
                <div className="py-3">
                  <p className="text-sm font-medium">Reserva confirmada</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    La reserva #RS-2024-001 ha sido confirmada.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hace 10 minutos
                  </p>
                </div>
                <div className="py-3">
                  <p className="text-sm font-medium">Pago pendiente</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Se requiere completar el pago para la reserva #RS-2024-002.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hace 30 minutos
                  </p>
                </div>
              </div>
              <Link
                href="/notificaciones"
                className="mt-4 block text-center text-sm text-primary hover:underline"
              >
                Ver todas las notificaciones
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={toggleUserMenu}
        >
          <User className="h-5 w-5" />
          <span className="sr-only">User menu</span>
        </Button>

        {/* User dropdown */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-border bg-card shadow-lg">
            <div className="p-2">
              <div className="border-b border-border p-2">
                <p className="font-medium">Juan Pérez</p>
                <p className="text-xs text-muted-foreground">
                  juan.perez@example.com
                </p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <div className="p-1">
                <Link
                  href="/perfil"
                  className="flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
                <button className="flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
