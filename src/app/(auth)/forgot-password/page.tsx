import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Sistema de Ventas Amawara Tour",
  description: "Solicita el restablecimiento de tu contraseña",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              width={140}
              height={50}
              alt="Ama Wara Tours"
              priority
            />
          </div>
          <CardTitle className="text-xl text-center">
            Recuperar contraseña
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tu correo electrónico y te enviaremos instrucciones para
            restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild className="text-sm">
            <Link href="/login">Volver a iniciar sesión</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
