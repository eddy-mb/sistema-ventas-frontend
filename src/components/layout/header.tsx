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
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ModeToggle } from "../common/modeToggle";
import { NavbarUserMenu } from "./navbar-user-menu";

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

function Notifications() {
  return (
    <>
      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
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
    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 px-4 border-b">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <DynamicBreadcrumb />
      <ModeToggle />
      <Notifications />
      <NavbarUserMenu />
    </header>
  );
}
