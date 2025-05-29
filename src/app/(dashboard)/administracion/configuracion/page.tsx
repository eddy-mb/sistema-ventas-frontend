import { Metadata } from "next";
import ConfiguracionForm from "@/components/administracion/configuracion-form";

export const metadata: Metadata = {
  title: "Configuración del Sistema | Administración",
  description: "Configure los parámetros del sistema",
};

export default function ConfiguracionPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
        <p className="text-muted-foreground">
          Administre los parámetros y configuraciones del sistema
        </p>
      </div>
      <ConfiguracionForm />
    </div>
  );
}
