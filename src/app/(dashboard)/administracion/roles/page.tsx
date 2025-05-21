import { Metadata } from "next";
import RolList from "@/components/administracion/rol-list";

export const metadata: Metadata = {
  title: "Gestión de Roles | Administración",
  description: "Administre los roles y permisos del sistema",
};

export default function RolesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Roles</h1>
        <p className="text-muted-foreground">
          Administre los roles y defina los permisos asociados para controlar el
          acceso al sistema
        </p>
      </div>
      <RolList />
    </div>
  );
}
