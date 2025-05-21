import {
  AlertCircle,
  BarChart3,
  Calendar,
  ChartPie,
  FileText,
  LayoutDashboard,
  Package,
  PackageOpen,
  ScrollText,
  Settings,
  ShoppingCart,
  Tag,
  User,
  UserCog,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";

// Export the navigation data so it can be used in multiple components
export const navData = {
  navMain: [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Gestión de Clientes",
      icon: Users,
      submenu: [
        {
          title: "Clientes",
          href: "/clientes",
          icon: UsersRound,
        },
      ],
    },
    {
      title: "Gestión de Productos",
      icon: Package,
      submenu: [
        {
          title: "Productos",
          href: "/productos",
          icon: PackageOpen,
        },
        {
          title: "Categorías",
          href: "/productos/categorias",
          icon: Tag,
        },
      ],
    },
    {
      title: "Gestión de Ventas",
      icon: ShoppingCart,
      submenu: [
        {
          title: "Ventas",
          href: "/ventas",
          icon: ScrollText,
        },
        {
          title: "Cotizaciones",
          href: "/ventas/cotizaciones",
          icon: FileText,
        },
        {
          title: "Reservas",
          href: "/ventas/reservas",
          icon: Calendar,
        },
      ],
    },
    {
      title: "Gestión de Reportes",
      icon: BarChart3,
      submenu: [
        {
          title: "Reportes",
          href: "/reportes",
          icon: ChartPie,
        },
        {
          title: "Ventas",
          href: "/reportes/ventas",
          icon: ShoppingCart,
        },
        {
          title: "Productos",
          href: "/reportes/productos",
          icon: Package,
        },
        {
          title: "Clientes",
          href: "/reportes/clientes",
          icon: Users,
        },
        {
          title: "Agentes",
          href: "/reportes/agentes",
          icon: User,
        },
      ],
    },
    {
      title: "Gestión de Administración",
      icon: Settings,
      submenu: [
        {
          title: "Usuarios",
          href: "/administracion/usuarios",
          icon: Users,
        },
        {
          title: "Roles",
          href: "/administracion/roles",
          icon: UserCog,
        },
        {
          title: "Auditoría",
          href: "/administracion/auditoria",
          icon: AlertCircle,
        },
        {
          title: "Configuración",
          href: "/administracion/configuracion",
          icon: Wrench,
        },
      ],
    },
  ],
};
