import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | Ama Wara Tour",
  description: "Iniciar sesión en el Sistema de Ventas Ama Wara Tour",
};

export default async function LoginPage() {
  // Check if user is already logged in
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <LoginForm />;
}
