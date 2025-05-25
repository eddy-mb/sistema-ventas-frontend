import React, { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  /**
   * Número total de registros a paginar
   */
  total: number;
  /**
   * Número de página actual (comienza en 1)
   */
  pagina: number;
  /**
   * Número de registros por página
   */
  limite: number;
  /**
   * Función para manejar el cambio de página
   */
  cambiarPagina: (pagina: number) => void;
  /**
   * Opciones para el número de elementos por página
   * Si se proporciona, se mostrará un selector para cambiar el número de elementos por página
   * @example [10, 20, 50, 100]
   */
  opcionesLimite?: number[];
  /**
   * Función para manejar el cambio de registros por página
   */
  cambiarLimite?: (limite: number) => void;
  /**
   * Número máximo de botones de página a mostrar
   * @default 2
   */
  maxBotonesPagina?: number;
  /**
   * URL base para los enlaces de paginación (si se usa enrutamiento de Next.js Link)
   * Si se proporciona, la paginación usará Next.js Link con href={`${urlBase}?page=${numeroPagina}`}
   * Si no se proporciona, se usarán manejadores onClick en su lugar
   * @example "/productos"
   */
  urlBase?: string;
  /**
   * Clase CSS personalizada para el contenedor de paginación
   */
  className?: string;
  /**
   * Mostrar el total de elementos y el rango actual
   * @default true
   */
  mostrarContador?: boolean;
  /**
   * Texto para el botón anterior en pantallas pequeñas (solo ícono)
   * @default "Anterior"
   */
  nombrePrevious?: string;
  /**
   * Texto para el botón siguiente en pantallas pequeñas (solo ícono)
   * @default "Siguiente"
   */
  nombreNext?: string;
  /**
   * Texto para la etiqueta del selector de elementos por página
   * @default "Mostrar:"
   */
  mostrarRegistrosPorPagina?: string;
}

export function CustomPagination({
  total,
  pagina,
  limite,
  cambiarPagina,
  opcionesLimite = [10, 20, 50, 100],
  cambiarLimite,
  maxBotonesPagina = 2,
  urlBase,
  className,
  mostrarContador = true,
  nombrePrevious = "Ant.",
  nombreNext = "Sig.",
  mostrarRegistrosPorPagina = "Mostrar:",
}: CustomPaginationProps) {
  // Calcular el total de páginas
  const totalPaginas = Math.max(1, Math.ceil(total / limite));

  // Asegurar que la página actual esté dentro del rango válido
  const paginaSegura = Math.max(1, Math.min(pagina, totalPaginas));

  // Calcular el rango de elementos que se están mostrando
  const primerElemento = (paginaSegura - 1) * limite + 1;
  const ultimoElemento = Math.min(paginaSegura * limite, total);

  // Generar los números de página a mostrar
  const numerosPagina = useMemo(() => {
    // Calcular el rango de números de página a mostrar
    let paginaInicio = Math.max(
      paginaSegura - Math.floor(maxBotonesPagina / 2),
      1
    );
    let paginaFin = paginaInicio + maxBotonesPagina - 1;

    if (paginaFin > totalPaginas) {
      paginaFin = totalPaginas;
      paginaInicio = Math.max(paginaFin - maxBotonesPagina + 1, 1);
    }

    const paginas: (number | string)[] = [];

    // Añadir primera página
    if (paginaInicio > 1) {
      paginas.push(1);
      // Añadir puntos suspensivos si hay un salto
      if (paginaInicio > 2) {
        paginas.push("start-ellipsis");
      }
    }

    // Añadir números de página
    for (let i = paginaInicio; i <= paginaFin; i++) {
      paginas.push(i);
    }

    // Añadir última página
    if (paginaFin < totalPaginas) {
      // Añadir puntos suspensivos si hay un salto
      if (paginaFin < totalPaginas - 1) {
        paginas.push("end-ellipsis");
      }
      paginas.push(totalPaginas);
    }

    return paginas;
  }, [paginaSegura, totalPaginas, maxBotonesPagina]);

  // Manejar cambios de página
  const manejarCambioPagina = (pagina: number) => {
    if (pagina !== paginaSegura && pagina >= 1 && pagina <= totalPaginas) {
      cambiarPagina(pagina);
    }
  };

  // Manejar cambios en el número de elementos por página
  const manejarCambioElementosPorPagina = (valor: string) => {
    if (cambiarLimite) {
      cambiarLimite(parseInt(valor, 10));
    }
  };

  if (totalPaginas <= 1 && !cambiarLimite) {
    return null; // No mostrar paginación si solo hay una página y no hay selector de elementos por página
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Selector de elementos por página */}
        {cambiarLimite && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {mostrarRegistrosPorPagina}
            </span>
            <Select
              value={limite.toString()}
              onValueChange={manejarCambioElementosPorPagina}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {opcionesLimite.map((opcion) => (
                  <SelectItem key={opcion} value={opcion.toString()}>
                    {opcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Componente de paginación */}
        <div className="flex flex-col items-center gap-2">
          {totalPaginas > 1 && (
            <Pagination>
              <PaginationContent>
                {/* Botón Anterior */}
                <PaginationItem>
                  <PaginationPrevious
                    previous={nombrePrevious}
                    onClick={() => manejarCambioPagina(paginaSegura - 1)}
                    href={
                      urlBase
                        ? `${urlBase}?page=${paginaSegura - 1}`
                        : undefined
                    }
                    className={cn(
                      paginaSegura <= 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {/* Números de Página */}
                {numerosPagina.map((numeroPagina, index) => {
                  if (typeof numeroPagina === "string") {
                    return (
                      <PaginationItem key={`${numeroPagina}-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={numeroPagina}>
                      <PaginationLink
                        isActive={numeroPagina === paginaSegura}
                        onClick={() => manejarCambioPagina(numeroPagina)}
                        href={
                          urlBase
                            ? `${urlBase}?page=${numeroPagina}`
                            : undefined
                        }
                      >
                        {numeroPagina}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {/* Botón Siguiente */}
                <PaginationItem>
                  <PaginationNext
                    next={nombreNext}
                    onClick={() => manejarCambioPagina(paginaSegura + 1)}
                    href={
                      urlBase
                        ? `${urlBase}?page=${paginaSegura + 1}`
                        : undefined
                    }
                    className={cn(
                      paginaSegura >= totalPaginas &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Información de Página */}
          {mostrarContador && total > 0 && (
            <div className="text-sm text-muted-foreground">
              Mostrando {primerElemento} a {ultimoElemento} de {total} elementos
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
