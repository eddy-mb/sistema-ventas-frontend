"use client";

import { useSidebarContext } from "@/context/siderbar-context";
import { Separator } from "@radix-ui/react-separator";
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb,
} from "../ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import { SearchForm } from "./search-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ModeToggle } from "./modeToggle";

function DynamicBreadcrumb() {
  const { activeItem } = useSidebarContext();

  const isSingleItem = activeItem.section === activeItem.item;

  return (
    <div className="mr-auto hidden lg:block">
      <Breadcrumb>
        <BreadcrumbList>
          {isSingleItem ? (
            <BreadcrumbItem>
              <BreadcrumbPage>{activeItem.section}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem className="hidden md:block">
                {activeItem.section}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{activeItem.item}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

function AvatarCustom() {
  // const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarImage src="/" alt="Usuario" />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent>
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
        </PopoverContent>
      </Popover>
    </>
  );
}

function Notifications() {
  return (
    <>
      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-destructive" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
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
        </PopoverContent>
      </Popover>
    </>
  );
}

export default function Header() {
  return (
    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <DynamicBreadcrumb />
      <div className="mr-auto">
        <SearchForm />
      </div>
      <ModeToggle />
      <Notifications />
      <AvatarCustom />
    </header>
  );
}
