"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Tag,
  FileText,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: NavItem[];
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Productos",
    href: "/productos",
    icon: <Package className="h-5 w-5" />,
    submenu: [
      {
        title: "Categorías",
        href: "/productos/categorias",
        icon: <Tag className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Ventas",
    href: "/ventas",
    icon: <ShoppingCart className="h-5 w-5" />,
    submenu: [
      {
        title: "Cotizaciones",
        href: "/ventas/cotizaciones",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: "Reservas",
        href: "/ventas/reservas",
        icon: <Calendar className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Reportes",
    href: "/reportes",
    icon: <BarChart3 className="h-5 w-5" />,
    submenu: [
      {
        title: "Ventas",
        href: "/reportes/ventas",
        icon: <ShoppingCart className="h-5 w-5" />,
      },
      {
        title: "Productos",
        href: "/reportes/productos",
        icon: <Package className="h-5 w-5" />,
      },
      {
        title: "Clientes",
        href: "/reportes/clientes",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Agentes",
        href: "/reportes/agentes",
        icon: <Users className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Administración",
    href: "/administracion",
    icon: <Settings className="h-5 w-5" />,
    submenu: [
      {
        title: "Usuarios",
        href: "/administracion/usuarios",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Roles",
        href: "/administracion/roles",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Auditoría",
        href: "/administracion/auditoria",
        icon: <AlertCircle className="h-5 w-5" />,
      },
      {
        title: "Configuración",
        href: "/administracion/configuracion",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [collapsed, setCollapsed] = useState(false);

  // Expand active parent menu by default
  useState(() => {
    const newExpanded: { [key: string]: boolean } = {};
    navItems.forEach((item) => {
      if (item.submenu) {
        const isActive = item.submenu.some((subItem) =>
          pathname.startsWith(subItem.href)
        );
        if (isActive) {
          newExpanded[item.href] = true;
        }
      }
    });
    setExpanded(newExpanded);
  });

  const toggleSubmenu = (href: string) => {
    setExpanded((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex h-screen flex-shrink-0 flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 md:relative",
          collapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "w-72"
        )}
      >
        {/* Toggle button (mobile only) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 md:hidden"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center gap-2">
            {!collapsed ? (
              <span className="text-lg font-bold text-sidebar-foreground">
                Ama Wara Tour
              </span>
            ) : (
              <span className="text-xl font-bold text-sidebar-foreground">
                AW
              </span>
            )}
          </Link>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      className={cn(
                        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        collapsed && "justify-center"
                      )}
                    >
                      {item.icon}
                      {!collapsed && (
                        <>
                          <span className="ml-3 flex-1 text-left">
                            {item.title}
                          </span>
                          {expanded[item.href] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </button>
                    {expanded[item.href] && !collapsed && (
                      <div className="mt-1 space-y-1 pl-6">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              pathname === subItem.href ||
                                pathname.startsWith(subItem.href)
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                          >
                            {subItem.icon}
                            <span className="ml-3">{subItem.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href || pathname.startsWith(item.href)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center"
                    )}
                  >
                    {item.icon}
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Collapse button (desktop only) */}
        <div className="hidden md:block border-t border-sidebar-border p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="w-full bg-sidebar-accent/50 text-sidebar-foreground border-sidebar-border"
          >
            <Menu className="h-4 w-4 mr-2" />
            {!collapsed && <span>Colapsar</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
