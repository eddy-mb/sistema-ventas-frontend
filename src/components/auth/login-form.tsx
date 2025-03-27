"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z
    .string()
    .min(3, { message: "El email es requerido" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(1, { message: "La contraseña es requerida" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        const errorMessage =
          result.error === "CredentialsSignin"
            ? "Email o contraseña incorrectos. Por favor intente nuevamente."
            : result.error;

        setError(errorMessage);
        return;
      }

      // Redirect to dashboard
      router.push("/");
      router.refresh();
    } catch (error) {
      setError("Ocurrió un error. Intente de nuevo más tarde.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
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

      {error && (
        <Alert variant="destructive">
          <TriangleAlertIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@amawaratour.com"
            autoComplete="email"
            disabled={isLoading}
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
              disabled={isLoading}
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
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
