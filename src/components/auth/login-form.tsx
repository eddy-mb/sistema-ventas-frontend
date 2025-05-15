"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Esquema de validación para el formulario de login
const loginSchema = z.object({
  nombreUsuario: z
    .string()
    .min(3, { message: "El nombre de usuario es requerido" }),
  contrasena: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

// Tipo inferido del esquema de validación
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
  const authError = searchParams.get("error");

  // Configurar el formulario con react-hook-form y zod
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

  // Manejar el envío del formulario
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        redirect: false,
        nombreUsuario: data.nombreUsuario,
        contrasena: data.contrasena,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Redireccionar al usuario a la página principal o la URL de callback
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      console.error("Error de inicio de sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener el mensaje de error adecuado
  const getErrorMessage = () => {
    if (error) return error;
    if (authError === "CredentialsSignin") {
      return "Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.";
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Iniciar sesión
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      {/* Mensajes de éxito */}
      {registered && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Registro exitoso. Por favor inicia sesión con tus credenciales.
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
            Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar
            sesión.
          </AlertDescription>
        </Alert>
      )}

      {/* Mensaje de error */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombreUsuario">Usuario</Label>
          <Input
            id="nombreUsuario"
            type="text"
            placeholder="nombre_usuario"
            autoComplete="username"
            disabled={loading}
            aria-invalid={errors.nombreUsuario ? "true" : "false"}
            className={errors.nombreUsuario ? "border-destructive" : ""}
            {...register("nombreUsuario")}
          />
          {errors.nombreUsuario && (
            <p className="text-sm text-destructive">{errors.nombreUsuario.message}</p>
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
                {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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

      <div className="text-center text-sm">
        ¿No tiene una cuenta?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
