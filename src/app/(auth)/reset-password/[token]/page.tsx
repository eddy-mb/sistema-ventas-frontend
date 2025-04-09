import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Restablecer contraseña | Ama Wara Tour",
  description: "Restablecer contraseña en el Sistema de Ventas Ama Wara Tour",
};

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  // Verificar si el usuario ya está autenticado
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <ResetPasswordForm token={params.token} />;
}
