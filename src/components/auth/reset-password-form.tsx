"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { authService } from "@/services/auth-service";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TriangleAlertIcon,
  CheckCircle,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "La contraseña es requerida" })
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmar contraseña es requerido" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.resetPassword(
        token,
        data.password,
        data.confirmPassword
      );

      if (response.success) {
        setIsSubmitted(true);
        toast.success("Contraseña restablecida exitosamente");
      } else {
        setError(
          response.message || "Ocurrió un error al restablecer la contraseña"
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al restablecer la contraseña"
      );
      toast.error("No se pudo restablecer la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  // Si ya se restableció la contraseña, mostramos un mensaje de éxito
  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Contraseña restablecida
          </h1>
          <p className="text-sm text-muted-foreground">
            Tu contraseña ha sido actualizada correctamente
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-background/50 border rounded-lg">
          <CheckCircle className="h-12 w-12 text-primary mb-4" />
          <p className="text-center mb-4">
            Tu contraseña ha sido restablecida exitosamente. Ahora puedes
            iniciar sesión con tu nueva contraseña.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Ir al inicio de sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Restablecer contraseña
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu nueva contraseña
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
          <Label htmlFor="password">Nueva contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"}
              </span>
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Restableciendo..." : "Restablecer contraseña"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link href="/login" className="text-primary underline">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
