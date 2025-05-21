import { Metadata } from "next";
import RolForm from "@/components/administracion/rol-form";

export const metadata: Metadata = {
  title: "Nuevo Rol | Administración",
  description: "Crear un nuevo rol en el sistema",
};

export default function NewRolPage() {
  return (
    <div className="container mx-auto py-6">
      <RolForm />
    </div>
  );
}
