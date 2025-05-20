import { Metadata } from "next";
import UsuarioForm from "@/components/administracion/usuario-form";

export const metadata: Metadata = {
  title: "Nuevo Usuario | Administración",
  description: "Crear un nuevo usuario en el sistema",
};

export default function NewUsuarioPage() {
  return (
    <div className="container mx-auto py-6">
      <UsuarioForm />
    </div>
  );
}
