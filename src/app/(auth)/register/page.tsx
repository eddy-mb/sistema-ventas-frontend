import { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Registro | Sistema de Ventas Amawara Tour",
  description: "Crea una cuenta para acceder al sistema de ventas",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
