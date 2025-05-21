import { Metadata } from "next";
import RolForm from "@/components/administracion/rol-form";

export const metadata: Metadata = {
  title: "Editar Rol | Administración",
  description: "Editar un rol existente en el sistema",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRolPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-6">
      <RolForm id={id} />
    </div>
  );
}
