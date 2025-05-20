import { Metadata } from "next";
import UsuarioForm from "@/components/administracion/usuario-form";
import React from "react";

export const metadata: Metadata = {
  title: "Editar Usuario | Administración",
  description: "Editar información del usuario",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUsuarioPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-6">
      <UsuarioForm id={id} />
    </div>
  );
}
