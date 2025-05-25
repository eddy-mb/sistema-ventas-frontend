import { Metadata } from "next";
import LogAuditoriaList from "@/components/administracion/log-auditoria-list";

export const metadata: Metadata = {
  title: "Auditoría del Sistema | Administración",
  description: "Gestión y seguimiento de actividades en el sistema",
};

export default function AuditoriaPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Auditoría del Sistema</h1>
        <p className="text-muted-foreground">
          Consulta y analiza el historial de actividades realizadas en el
          sistema. Utiliza los filtros para encontrar registros específicos.
        </p>
      </div>
      <LogAuditoriaList />
    </div>
  );
}
