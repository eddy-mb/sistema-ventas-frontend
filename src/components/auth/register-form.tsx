"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { PasswordIndicador } from "./Password-indicador";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "El nombre es requerido" })
      .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    email: z
      .string()
      .min(1, { message: "El email es requerido" })
      .email({ message: "Email inválido" }),
    password: z
      .string()
      .min(1, { message: "La contraseña es requerida" })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z.string().min(1, { message: "Confirme su contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, isLoading: authLoading } = useAuthContext();
  const [error, setError] = useState<unknown | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Observar el valor de la contraseña para validación en tiempo real
  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);

      const result = await registerUser(data.name, data.email, data.password);

      if (!result.success) {
        setError(result.error || "Error al registrar usuario");
        return;
      }

      // Redirigir a la página de inicio de sesión
      router.push("/login?registered=true");
    } catch (err) {
      setError(err);
      console.error("Register error:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crear una cuenta
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingrese sus datos para registrarse en el sistema
        </p>
      </div>

      {error !== null && <ErrorMessage error={error} showDetails={false} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            placeholder="Juan Pérez"
            disabled={authLoading || isSubmitting}
            aria-invalid={errors.name ? "true" : "false"}
            className={errors.name ? "border-destructive" : ""}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@amawaratour.com"
            autoComplete="email"
            disabled={authLoading || isSubmitting}
            aria-invalid={errors.email ? "true" : "false"}
            className={errors.email ? "border-destructive" : ""}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={authLoading || isSubmitting}
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
              disabled={authLoading || isSubmitting}
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
                  ? "Ocultar confirmación"
                  : "Mostrar confirmación"}
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
        {password && <PasswordIndicador password={password} />}

        <Button
          type="submit"
          className="w-full"
          disabled={authLoading || isSubmitting || !isValid}
        >
          {authLoading || isSubmitting ? "Registrando..." : "Registrarse"}
        </Button>
      </form>

      <div className="text-center text-sm">
        ¿Ya tiene una cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
