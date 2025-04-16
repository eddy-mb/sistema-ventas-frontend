"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthContext } from "@/context/auth-context";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { EyeIcon, EyeOffIcon, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z
    .string()
    .min(3, { message: "El email es requerido" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(1, { message: "La contraseña es requerida" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, isLoading: authLoading } = useAuthContext();
  const [error, setError] = useState<unknown | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const searchParams = useSearchParams();

  // Verificar si el usuario viene de un registro exitoso
  const registered = searchParams.get("registered") === "true";

  // Verificar si el correo fue verificado con éxito
  const emailVerified = searchParams.get("emailVerified") === "true";

  // Verificar si viene de un restablecimiento de contraseña exitoso
  const passwordReset = searchParams.get("passwordReset") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validar campos al cambiar
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);

      const result = await login(data.email, data.password);

      if (!result.success) {
        setError(result.error || "Error de autenticación");
        return;
      }
    } catch (err) {
      setError(err);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Iniciar sesión
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingrese sus credenciales para acceder al sistema
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

      {/* Mensaje de error - Modificado para evitar el error de tipo */}
      {error !== null && <ErrorMessage error={error} showDetails={false} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@amawaratour.com"
            autoComplete="email"
            disabled={authLoading}
            aria-invalid={errors.email ? "true" : "false"}
            className={errors.email ? "border-destructive" : ""}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              ¿Olvidó su contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={authLoading}
              aria-invalid={errors.password ? "true" : "false"}
              className={errors.password ? "border-destructive" : ""}
              {...register("password")}
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
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={authLoading || isSubmitting || !isValid}
        >
          {authLoading || isSubmitting
            ? "Iniciando sesión..."
            : "Iniciar sesión"}
        </Button>
      </form>

      <div className="text-center text-sm">
        ¿No tiene una cuenta?{" "}
        <Link href="/register" className="text-primary underline">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
