"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const renderPageNumbers = () => {
    // Asegurarse de que totalPages es al menos 1
    const actualTotalPages = Math.max(1, totalPages);
    
    // Si hay pocas páginas, mostrar todas
    if (actualTotalPages <= 7) {
      return Array.from({ length: actualTotalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Button>
      ));
    }

    // Determinar rango de páginas a mostrar
    const firstPage = 1;
    const lastPage = actualTotalPages;
    const startPage = Math.max(currentPage - siblingCount, firstPage);
    const endPage = Math.min(currentPage + siblingCount, lastPage);
    const hasLeftEllipsis = startPage > firstPage + 1;
    const hasRightEllipsis = endPage < lastPage - 1;

    const items = [];

    // Primera página
    items.push(
      <Button
        key={firstPage}
        variant={firstPage === currentPage ? "default" : "outline"}
        size="icon"
        onClick={() => onPageChange(firstPage)}
        aria-current={firstPage === currentPage ? "page" : undefined}
      >
        {firstPage}
      </Button>
    );

    // Ellipsis izquierdo
    if (hasLeftEllipsis) {
      items.push(
        <Button
          key="left-ellipsis"
          variant="outline"
          size="icon"
          disabled
          className="cursor-default"
        >
          ...
        </Button>
      );
    }

    // Páginas intermedias
    for (let page = startPage; page <= endPage; page++) {
      if (page !== firstPage && page !== lastPage) {
        items.push(
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        );
      }
    }

    // Ellipsis derecho
    if (hasRightEllipsis) {
      items.push(
        <Button
          key="right-ellipsis"
          variant="outline"
          size="icon"
          disabled
          className="cursor-default"
        >
          ...
        </Button>
      );
    }

    // Última página
    if (lastPage !== firstPage) {
      items.push(
        <Button
          key={lastPage}
          variant={lastPage === currentPage ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(lastPage)}
          aria-current={lastPage === currentPage ? "page" : undefined}
        >
          {lastPage}
        </Button>
      );
    }

    return items;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>
      {renderPageNumbers()}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Página siguiente</span>
      </Button>
    </div>
  );
}
