import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Registro | Ama Wara Tour",
  description: "Registro en el Sistema de Ventas Ama Wara Tour",
};

export default async function RegisterPage() {
  // Check if user is already logged in
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <RegisterForm />;
}
