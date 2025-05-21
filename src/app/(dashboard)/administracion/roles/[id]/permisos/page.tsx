import { Metadata } from "next";
import PermisoManager from "@/components/administracion/permiso-manager";

export const metadata: Metadata = {
  title: "Gestionar Permisos | Administración",
  description: "Gestionar los permisos asignados a un rol",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function RolPermisosPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-6">
      <PermisoManager rolId={params.id} />
    </div>
  );
}
