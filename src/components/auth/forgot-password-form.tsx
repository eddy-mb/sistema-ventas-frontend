"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth-service";

// Esquema de validación para el formulario
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Debe ser un correo electrónico válido" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await authService.requestPasswordReset(data.email);

      if (!result.success) {
        setError(
          result.error || "Error al solicitar restablecimiento de contraseña"
        );
        toast.error(
          result.error || "Error al solicitar restablecimiento de contraseña"
        );
        return;
      }

      // Mostrar mensaje de éxito
      setSuccess(true);
      toast.success("Instrucciones enviadas a tu correo electrónico");
    } catch {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Si existe una cuenta con ese correo electrónico, recibirás
            instrucciones para restablecer tu contraseña. Por favor, revisa tu
            bandeja de entrada.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={loading}
              aria-invalid={errors.email ? "true" : "false"}
              className={errors.email ? "border-destructive" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Enviando..." : "Enviar instrucciones"}
          </Button>
        </form>
      )}
    </div>
  );
}
