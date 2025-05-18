import { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Restablecer Contraseña | Sistema de Ventas Amawara Tour",
  description: "Establece una nueva contraseña para tu cuenta",
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token || "";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-center">
            Restablecer contraseña
          </CardTitle>
          <CardDescription className="text-center">
            Crea una nueva contraseña para tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <Button variant="link" asChild className="text-sm">
            <Link href="/login">Volver a iniciar sesión</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
