import {
  AlertCircle,
  BarChart3,
  Calendar,
  ChartPie,
  FileCog,
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
      href: "/clientes",
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
      href: "/productos",
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
      href: "/ventas",
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
      href: "/reportes",
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
      href: "/administracion",
      icon: Settings,
      submenu: [
        {
          title: "administracion",
          href: "/administracion",
          icon: FileCog,
        },
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
