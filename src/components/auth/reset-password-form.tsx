"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth-service";

// Esquema de validación para el formulario
const resetPasswordSchema = z
  .object({
    contrasena: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "Debe contener al menos una letra minúscula" })
      .regex(/[0-9]/, { message: "Debe contener al menos un número" }),
    confirmarContrasena: z.string(),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError("Token de restablecimiento no válido o expirado");
      toast.error("Token de restablecimiento no válido o expirado");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await authService.resetPassword(token, data.contrasena);

      if (!result.success) {
        setError(result.error || "Error al restablecer la contraseña");
        toast.error(result.error || "Error al restablecer la contraseña");
        return;
      }

      // Mostrar notificación de éxito
      toast.success("Contraseña restablecida correctamente");

      // Redireccionar al login con mensaje de éxito
      router.push("/login?passwordReset=true");
    } catch {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Si no hay token, mostrar error
  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          El enlace de restablecimiento no es válido o ha expirado. Por favor,
          solicita un nuevo enlace de restablecimiento.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contrasena">Nueva contraseña</Label>
          <div className="relative">
            <Input
              id="contrasena"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
          <p className="text-xs text-muted-foreground">
            La contraseña debe tener al menos 8 caracteres, incluir mayúsculas,
            minúsculas y números.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmarContrasena">
            Confirmar nueva contraseña
          </Label>
          <div className="relative">
            <Input
              id="confirmarContrasena"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={loading}
              aria-invalid={errors.confirmarContrasena ? "true" : "false"}
              className={errors.confirmarContrasena ? "border-destructive" : ""}
              {...register("confirmarContrasena")}
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
          {errors.confirmarContrasena && (
            <p className="text-sm text-destructive">
              {errors.confirmarContrasena.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting
            ? "Restableciendo..."
            : "Restablecer contraseña"}
        </Button>
      </form>
    </div>
  );
}
