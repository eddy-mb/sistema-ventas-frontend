"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuthContext } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { CheckCircle } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El email es requerido" })
    .email({ message: "Email inválido" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const { requestPasswordReset, isLoading } = useAuthContext();
  const [error, setError] = useState<unknown | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setError(null);

      const response = await requestPasswordReset(data.email);

      if (!response.success) {
        setError(response.error || "Ocurrió un error al procesar tu solicitud");
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err);
      console.error("Error al solicitar recuperación:", err);
    }
  };

  // Si ya se envió el correo, mostramos un mensaje de éxito
  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Correo enviado
          </h1>
          <p className="text-sm text-muted-foreground">
            Hemos enviado las instrucciones para recuperar tu contraseña
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-background/50 border rounded-lg">
          <CheckCircle className="h-12 w-12 text-primary mb-4" />
          <p className="text-center mb-4">
            Revisa tu bandeja de entrada y sigue las instrucciones que te hemos
            enviado para restablecer tu contraseña.
          </p>
          <p className="text-center text-sm text-muted-foreground mb-4">
            Si no recibes el correo en unos minutos, verifica tu carpeta de spam
            o intenta nuevamente.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Recuperar contraseña
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo electrónico para recibir instrucciones
        </p>
      </div>

      {error !== null && <ErrorMessage error={error} showDetails={false} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@amawaratour.com"
            autoComplete="email"
            disabled={isLoading || isSubmitting}
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
          disabled={isLoading || isSubmitting || !isValid}
        >
          {isLoading || isSubmitting ? "Enviando..." : "Enviar instrucciones"}
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
