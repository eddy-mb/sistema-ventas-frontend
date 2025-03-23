"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href: string;
  current: boolean;
};

const pathToLabel: Record<string, string> = {
  "": "Dashboard",
  clientes: "Clientes",
  crear: "Crear",
  editar: "Editar",
  productos: "Productos",
  categorias: "Categorías",
  ventas: "Ventas",
  cotizaciones: "Cotizaciones",
  reservas: "Reservas",
  reportes: "Reportes",
  administracion: "Administración",
  usuarios: "Usuarios",
  roles: "Roles",
  auditoria: "Auditoría",
  configuracion: "Configuración",
  agentes: "Agentes",
};

export function Breadcrumb() {
  const pathname = usePathname();

  // Omitir la representación de la ruta de navegación en el panel principal
  if (pathname === "/") {
    return <h1 className="text-xl font-semibold">Dashboard</h1>;
  }

  // Crear elementos de ruta de navegación a partir de la ruta
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/", current: false },
  ];

  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Omitir segmentos numéricos (probablemente identificadores) pero conservar la ruta
    if (/^\d+$/.test(segment)) {
      return;
    }

    const isLast = index === pathSegments.length - 1;

    // Comprobar si el segmento anterior era numérico (para páginas de edición con ID)
    const prevSegment = index > 0 ? pathSegments[index - 1] : null;
    let label = pathToLabel[segment] || segment;

    // Si estamos en una página de identificación, ajuste la etiqueta
    if (prevSegment && /^\d+$/.test(prevSegment)) {
      if (segment === "editar") {
        label = `Editar ${pathToLabel[pathSegments[index - 2]] || ""}`.trim();
      } else {
        label = `Detalle ${pathToLabel[pathSegments[index - 2]] || ""}`.trim();
      }
    }

    breadcrumbItems.push({
      label,
      href: currentPath,
      current: isLast,
    });
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            )}

            {item.current ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {index === 0 ? <Home className="h-4 w-4" /> : item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
