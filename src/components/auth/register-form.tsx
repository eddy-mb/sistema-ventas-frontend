"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

// Esquema de validación para el formulario de registro
const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    apellidos: z
      .string()
      .min(3, { message: "Los apellidos deben tener al menos 3 caracteres" }),
    email: z
      .string()
      .email({ message: "Debe ser un correo electrónico válido" }),
    nombreUsuario: z
      .string()
      .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "El nombre de usuario solo puede contener letras, números y guiones bajos",
      }),
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

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      email: "",
      nombreUsuario: "",
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.register({
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        nombreUsuario: data.nombreUsuario,
        contrasena: data.contrasena,
      });

      if (!result.success) {
        setError(result.error || "Error al registrar usuario");
        toast.error(result.error || "Error al registrar usuario");
        return;
      }

      // Mostrar notificación de éxito
      toast.success("Registro exitoso");

      // Redireccionar al login con mensaje de éxito
      router.push("/login?registered=true");
    } catch {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center ">
          <Image
            src="/logo.png"
            width={140}
            height={50}
            alt="Ama Wara Tours"
            priority
          />
        </div>
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
        <CardDescription>
          Ingresa tus datos para registrarte en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  disabled={loading}
                  aria-invalid={errors.nombre ? "true" : "false"}
                  className={errors.nombre ? "border-destructive" : ""}
                  {...register("nombre")}
                />
                {errors.nombre && (
                  <p className="text-[12px] text-destructive">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  type="text"
                  disabled={loading}
                  aria-invalid={errors.apellidos ? "true" : "false"}
                  className={errors.apellidos ? "border-destructive" : ""}
                  {...register("apellidos")}
                />
                {errors.apellidos && (
                  <p className="text-[12px] text-destructive">
                    {errors.apellidos.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p className="text-[12px] text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombreUsuario">Nombre de usuario</Label>
                <Input
                  id="nombreUsuario"
                  type="text"
                  autoComplete="username"
                  disabled={loading}
                  aria-invalid={errors.nombreUsuario ? "true" : "false"}
                  className={errors.nombreUsuario ? "border-destructive" : ""}
                  {...register("nombreUsuario")}
                />
                {errors.nombreUsuario && (
                  <p className="text-[12px] text-destructive">
                    {errors.nombreUsuario.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contrasena">Contraseña</Label>
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
                      {showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"}
                    </span>
                  </Button>
                </div>
                {errors.contrasena && (
                  <p className="text-[12px] text-destructive">
                    {errors.contrasena.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarContrasena">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmarContrasena"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={loading}
                    aria-invalid={errors.confirmarContrasena ? "true" : "false"}
                    className={
                      errors.confirmarContrasena ? "border-destructive" : ""
                    }
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
            </div>
            <p className="text-xs text-muted-foreground">
              La contraseña debe tener al menos 8 caracteres, incluir
              mayúsculas, minúsculas y números.
            </p>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="max-w-sm w-full"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? "Registrando..." : "Registrarse"}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" asChild className="text-sm">
          <Link href="/login">¿Ya tienes una cuenta? Inicia sesión aquí</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
