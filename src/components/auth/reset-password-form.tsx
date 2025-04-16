"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { CheckCircle, EyeIcon, EyeOffIcon } from "lucide-react";
import { PasswordIndicador } from "./Password-indicador";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "La contraseña es requerida" })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
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
  const { resetPassword, isLoading } = useAuthContext();
  const [error, setError] = useState<unknown | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Observar el valor de la contraseña para validación en tiempo real
  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setError(null);

      const response = await resetPassword(
        token,
        data.password,
        data.confirmPassword
      );

      if (!response.success) {
        setError(
          response.error || "Ocurrió un error al restablecer la contraseña"
        );
        return;
      }

      setIsSubmitted(true);

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/login?passwordReset=true");
      }, 3000);
    } catch (err) {
      setError(err);
      console.error("Error al restablecer contraseña:", err);
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
            Tu contraseña ha sido restablecida exitosamente. Serás redirigido a
            la página de inicio de sesión en unos segundos.
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

      {error !== null && <ErrorMessage error={error} showDetails={false} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Nueva contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading || isSubmitting}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading || isSubmitting}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              className={errors.confirmPassword ? "border-destructive" : ""}
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

        {/* Indicadores de seguridad de contraseña */}
        {password && <PasswordIndicador password={password} minLength={6} />}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isSubmitting || !isValid}
        >
          {isLoading || isSubmitting
            ? "Restableciendo..."
            : "Restablecer contraseña"}
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
