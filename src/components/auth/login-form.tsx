"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const loginSchema = z.object({
  nombreUsuario: z
    .string()
    .min(3, { message: "El nombre de usuario es requerido" }),
  contrasena: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay mensajes de redirección
  const registered = searchParams.get("registered") === "true";
  const emailVerified = searchParams.get("emailVerified") === "true";
  const passwordReset = searchParams.get("passwordReset") === "true";
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nombreUsuario: "",
      contrasena: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);

      const result = await signIn("credentials", {
        redirect: false,
        nombreUsuario: data.nombreUsuario,
        contrasena: data.contrasena,
      });

      if (result?.error) {
        // Traducir errores a mensajes amigables
        const mensaje =
          result.error === "CredentialsSignin"
            ? "Por favor, verifique sus credenciales e intente nuevamente."
            : "Por favor, intente nuevamente más tarde o contacte a soporte.";
        setError(mensaje);
        toast.error(mensaje);
        return;
      }

      toast.success("Inicio de sesión exitoso", {
        description: "Bienvenido(a) al sistema de ventas AMA WARA TOUR",
      });
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              width={140}
              height={50}
              alt="Ama Wara Tours"
              priority
            />
          </div>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mensajes de éxito */}
            {registered && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Registro exitoso. Por favor inicia sesión con tus
                  credenciales.
                </AlertDescription>
              </Alert>
            )}

            {emailVerified && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Tu correo ha sido verificado correctamente. Ya puedes iniciar
                  sesión.
                </AlertDescription>
              </Alert>
            )}

            {passwordReset && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Tu contraseña ha sido restablecida correctamente. Ya puedes
                  iniciar sesión.
                </AlertDescription>
              </Alert>
            )}

            {/* Mensaje de error */}
            {error && (
              <Alert variant="destructive" className="border-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombreUsuario">Usuario</Label>
                <Input
                  id="nombreUsuario"
                  type="text"
                  placeholder="Nombre de usuario"
                  autoComplete="username"
                  disabled={loading}
                  aria-invalid={errors.nombreUsuario ? "true" : "false"}
                  className={errors.nombreUsuario ? "border-destructive" : ""}
                  {...register("nombreUsuario")}
                />
                {errors.nombreUsuario && (
                  <p className="text-sm text-destructive">
                    {errors.nombreUsuario.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="contrasena">Contraseña</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="contrasena"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                    aria-invalid={errors.contrasena ? "true" : "false"}
                    className={errors.contrasena ? "border-destructive" : ""}
                    {...register("contrasena")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"}
                    </span>
                  </Button>
                </div>
                {errors.contrasena && (
                  <p className="text-sm text-destructive">
                    {errors.contrasena.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting
                  ? "Iniciando sesión..."
                  : "Iniciar sesión"}
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            ¿No tiene una cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Registrarse
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
