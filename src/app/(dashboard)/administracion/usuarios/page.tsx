import { Metadata } from "next";
import UsuarioList from "@/components/administracion/usuario-list";

export const metadata: Metadata = {
  title: "Gestión de Usuarios | Administración",
  description: "Administre los usuarios del sistema",
};

export default function UsuariosPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          Administre los usuarios del sistema y sus permisos
        </p>
      </div>
      <UsuarioList />
    </div>
  );
}
