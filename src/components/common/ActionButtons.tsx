"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye, Ban, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISOS, ROLES } from "@/constants/auth";

interface ActionButtonsProps {
  entityId: string;
  entityType: "cliente" | "producto" | "venta" | "usuario";
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDeactivate?: () => void;
  additionalActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    permission?: string;
    role?: string | string[];
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
  }>;
}

export function ActionButtons({
  entityType,
  onView,
  onEdit,
  onDelete,
  onDeactivate,
  additionalActions = [],
}: ActionButtonsProps) {
  const { renderIfHasAccess } = usePermissions();

  // Mapeo de tipos de entidad a permisos
  const permisoMap = {
    cliente: {
      view: PERMISOS.CLIENTE_READ,
      edit: PERMISOS.CLIENTE_UPDATE,
      delete: PERMISOS.CLIENTE_DELETE,
    },
    producto: {
      view: PERMISOS.PRODUCTO_READ,
      edit: PERMISOS.PRODUCTO_UPDATE,
      delete: PERMISOS.PRODUCTO_DELETE,
    },
    venta: {
      view: PERMISOS.VENTA_READ,
      edit: PERMISOS.VENTA_UPDATE,
      delete: PERMISOS.VENTA_CANCEL,
    },
    usuario: {
      view: PERMISOS.USER_MANAGE_ROLES,
      edit: PERMISOS.USER_UPDATE,
      delete: PERMISOS.USER_DELETE,
    },
  };

  const permisos = permisoMap[entityType];

  return (
    <div className="flex gap-2 items-center">
      {/* Botón de Ver - disponible para todos con permiso de ver */}
      {onView &&
        renderIfHasAccess(
          <Button
            variant="ghost"
            size="icon"
            onClick={onView}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>,
          permisos.view
        )}

      {/* Botón de Editar - solo para quienes tienen permiso de edición */}
      {onEdit &&
        renderIfHasAccess(
          <Button variant="ghost" size="icon" onClick={onEdit} title="Editar">
            <Edit className="h-4 w-4" />
          </Button>,
          permisos.edit
        )}

      {/* Botón de Eliminar - solo para administradores o usuarios con permiso específico */}
      {onDelete &&
        renderIfHasAccess(
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            title="Eliminar"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>,
          permisos.delete,
          ROLES.ADMIN
        )}

      {/* Botón de Desactivar - solo para administradores o usuarios con permiso específico */}
      {onDeactivate &&
        renderIfHasAccess(
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeactivate}
            title="Desactivar"
          >
            <Ban className="h-4 w-4" />
          </Button>,
          permisos.edit,
          ROLES.ADMIN
        )}

      {/* Acciones adicionales en un menú desplegable */}
      {additionalActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {additionalActions.map((action, index) =>
              renderIfHasAccess(
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  className={
                    action.variant === "destructive" ? "text-destructive" : ""
                  }
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </DropdownMenuItem>,
                action.permission,
                action.role
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
