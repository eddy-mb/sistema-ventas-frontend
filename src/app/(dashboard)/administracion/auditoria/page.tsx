import { Metadata } from "next";
import AuditLogViewer from "@/components/admin/audit-log-viewer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Registros de Auditoría | Sistema de Ventas",
  description: "Visualización de registros de auditoría del sistema",
};

export default function AuditPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registros de Auditoría</h1>
          <p className="text-muted-foreground">
            Consulta los eventos y actividades registrados por el sistema
          </p>
        </div>
        <ServerIcon className="h-10 w-10 text-primary opacity-80" />
      </div>
      
      <div className="space-y-6">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Acerca de la Auditoría</CardTitle>
            <CardDescription>
              Información importante sobre los registros de auditoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                Los registros de auditoría son generados automáticamente por el sistema 
                para documentar las acciones realizadas por los usuarios. Estos registros 
                son importantes para mantener la seguridad y trazabilidad de las operaciones.
              </p>
              <p>
                Todos los eventos son capturados y registrados por el backend de manera 
                automática. Esta página permite consultar estos eventos pero no tiene 
                la capacidad de generar registros manualmente o modificar los existentes.
              </p>
              <p>
                Los registros incluyen información como la fecha y hora, el usuario que 
                realizó la acción, el tipo de acción, y detalles específicos de la operación.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <AuditLogViewer />
      </div>
    </div>
  );
}
