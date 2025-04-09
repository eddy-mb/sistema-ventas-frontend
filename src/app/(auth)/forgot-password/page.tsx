import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña | Ama Wara Tour",
  description:
    "Solicitar recuperación de contraseña en el Sistema de Ventas Ama Wara Tour",
};

export default async function ForgotPasswordPage() {
  // Verificar si el usuario ya está autenticado
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <ForgotPasswordForm />;
}
