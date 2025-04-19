"use client";

import { Button } from "@/components/ui/button";
import {
  Printer,
  Send,
  CheckCircle,
  XCircle,
  CreditCard,
  Receipt,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISOS } from "@/constants/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AccionesDeVentaProps {
  ventaId: string;
  estado: "Pendiente" | "Procesando" | "Completada" | "Cancelada";
  estadoPago: "Pendiente" | "Parcial" | "Completado";
  onGenerarFactura?: () => void;
  onImprimir?: () => void;
  onEnviarEmail?: () => void;
  onConfirmar?: () => void;
  onCancelar?: () => void;
  onRegistrarPago?: () => void;
}

export function AccionesVenta({
  estado,
  estadoPago,
  onGenerarFactura,
  onImprimir,
  onEnviarEmail,
  onConfirmar,
  onCancelar,
  onRegistrarPago,
}: AccionesDeVentaProps) {
  const { canAccess, renderIfHasAccess } = usePermissions();

  // Verificar si las acciones están habilitadas según el estado
  const puedeConfirmar = estado === "Pendiente";
  const puedeCancelar = estado !== "Cancelada" && estado !== "Completada";
  const puedeRegistrarPago =
    estado !== "Cancelada" && estadoPago !== "Completado";
  const puedeGenerarFactura =
    estado === "Completada" || estado === "Procesando";

  // Helper para renderizar un botón con tooltip cuando no tiene permisos
  const renderButtonWithPermissionCheck = (
    button: React.ReactNode,
    permission: string,
    disabledTooltip: string
  ) => {
    const hasPermission = canAccess(permission);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              {hasPermission ? (
                button
              ) : (
                <div className="inline-block opacity-50 cursor-not-allowed">
                  {button}
                </div>
              )}
            </span>
          </TooltipTrigger>
          {!hasPermission && (
            <TooltipContent>
              <p>{disabledTooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Botón para confirmar venta */}
      {puedeConfirmar &&
        onConfirmar &&
        renderButtonWithPermissionCheck(
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={canAccess(PERMISOS.VENTA_UPDATE) ? onConfirmar : undefined}
            disabled={!canAccess(PERMISOS.VENTA_UPDATE)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirmar
          </Button>,
          PERMISOS.VENTA_UPDATE,
          "No tienes permisos para confirmar ventas"
        )}

      {/* Botón para cancelar venta */}
      {puedeCancelar &&
        onCancelar &&
        renderButtonWithPermissionCheck(
          <Button
            size="sm"
            variant="destructive"
            onClick={canAccess(PERMISOS.VENTA_UPDATE) ? onCancelar : undefined}
            disabled={!canAccess(PERMISOS.VENTA_UPDATE)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar
          </Button>,
          PERMISOS.VENTA_UPDATE,
          "No tienes permisos para cancelar ventas"
        )}

      {/* Botón para registrar pago */}
      {puedeRegistrarPago &&
        onRegistrarPago &&
        renderIfHasAccess(
          <Button
            size="sm"
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
            onClick={onRegistrarPago}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Registrar Pago
          </Button>,
          PERMISOS.VENTA_UPDATE
        )}

      {/* Botón para generar factura */}
      {puedeGenerarFactura &&
        onGenerarFactura &&
        renderIfHasAccess(
          <Button size="sm" variant="outline" onClick={onGenerarFactura}>
            <Receipt className="mr-2 h-4 w-4" />
            Generar Factura
          </Button>,
          PERMISOS.VENTA_UPDATE
        )}

      {/* Botón para imprimir */}
      {onImprimir &&
        renderIfHasAccess(
          <Button size="sm" variant="outline" onClick={onImprimir}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>,
          PERMISOS.VENTA_READ
        )}

      {/* Botón para enviar por email */}
      {onEnviarEmail &&
        renderIfHasAccess(
          <Button size="sm" variant="outline" onClick={onEnviarEmail}>
            <Send className="mr-2 h-4 w-4" />
            Enviar Email
          </Button>,
          PERMISOS.VENTA_READ
        )}
    </div>
  );
}
