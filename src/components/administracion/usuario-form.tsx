"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { adminService } from "@/services/admin-service";
import { Rol, UsuarioCreateData, UsuarioUpdateData } from "@/types/admin.types";

// Esquema para nuevo usuario
const newUserSchema = z
  .object({
    nombreUsuario: z
      .string()
      .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Solo puede contener letras, números y guiones bajos",
      }),
    nombre: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    apellidos: z
      .string()
      .min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
    email: z
      .string()
      .email({ message: "Debe ser un correo electrónico válido" }),
    contrasena: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "Debe contener al menos una letra minúscula" })
      .regex(/[0-9]/, { message: "Debe contener al menos un número" }),
    confirmarContrasena: z.string(),
    roles: z
      .array(z.string())
      .min(1, { message: "Debe seleccionar al menos un rol" }),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

// Esquema para editar usuario
const editUserSchema = z.object({
  nombreUsuario: z
    .string()
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Solo puede contener letras, números y guiones bajos",
    }),
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  apellidos: z
    .string()
    .min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Debe ser un correo electrónico válido" }),
  roles: z
    .array(z.string())
    .min(1, { message: "Debe seleccionar al menos un rol" }),
});

type NewUserFormValues = z.infer<typeof newUserSchema>;
type EditUserFormValues = z.infer<typeof editUserSchema>;

interface UsuarioFormProps {
  id?: string; // Si hay ID, es edición; si no, es creación
}

export default function UsuarioForm({ id }: UsuarioFormProps) {
  const isEditing = !!id;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(isEditing);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewUserFormValues | EditUserFormValues>({
    resolver: zodResolver(isEditing ? editUserSchema : newUserSchema),
    defaultValues: {
      nombreUsuario: "",
      nombre: "",
      apellidos: "",
      email: "",
      ...(isEditing ? {} : { contrasena: "", confirmarContrasena: "" }),
      roles: [],
    },
  });

  // Cargar roles disponibles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await adminService.getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error al cargar roles:", error);
        toast.error("No se pudieron cargar los roles disponibles");
      }
    };

    loadRoles();
  }, []);

  // Si estamos editando, cargar datos del usuario
  useEffect(() => {
    if (isEditing && id) {
      const loadUsuario = async () => {
        try {
          setInitialLoading(true);
          const usuario = await adminService.getUsuarioById(id);
          // Extraer los IDs de los roles
          const userRoleIds = usuario.roles.map((rol) => rol.id);
          setSelectedRoles(userRoleIds);

          // Establecer valores en el formulario
          reset({
            nombreUsuario: usuario.nombreUsuario,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email,
            roles: userRoleIds,
          });
        } catch (error) {
          console.error("Error al cargar usuario:", error);
          toast.error("No se pudo cargar la información del usuario");
          router.push("/administracion/usuarios");
        } finally {
          setInitialLoading(false);
        }
      };

      loadUsuario();
    }
  }, [isEditing, id, reset, router]);

  // Manejar cambios en los roles seleccionados
  const handleRoleToggle = (roleId: string) => {
    const currentRoles = [...selectedRoles];

    if (currentRoles.includes(roleId)) {
      // Si ya está seleccionado, lo quitamos (excepto si es el último)
      if (currentRoles.length > 1) {
        setSelectedRoles(currentRoles.filter((id) => id !== roleId));
        setValue(
          "roles",
          currentRoles.filter((id) => id !== roleId),
          { shouldValidate: true }
        );
      } else {
        toast.error("Debe seleccionar al menos un rol");
      }
    } else {
      // Si no está seleccionado, lo agregamos
      setSelectedRoles([...currentRoles, roleId]);
      setValue("roles", [...currentRoles, roleId], { shouldValidate: true });
    }
  };

  // Enviar formulario
  const onSubmit = async (data: NewUserFormValues | EditUserFormValues) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        // Editar usuario existente
        const updateData: UsuarioUpdateData = {
          nombreUsuario: data.nombreUsuario,
          nombre: data.nombre,
          apellidos: data.apellidos,
          email: data.email,
          roles: data.roles,
        };

        await adminService.updateUsuario(id, updateData);
        toast.success("Usuario actualizado exitosamente");
      } else {
        // Crear nuevo usuario
        const newData = data as NewUserFormValues;
        const createData: UsuarioCreateData = {
          nombreUsuario: newData.nombreUsuario,
          contrasena: newData.contrasena,
          nombre: newData.nombre,
          apellidos: newData.apellidos,
          email: newData.email,
          roles: newData.roles,
        };

        await adminService.createUsuario(createData);
        toast.success("Usuario creado exitosamente");
      }

      // Redireccionar al listado de usuarios
      router.push("/administracion/usuarios");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error al guardar usuario:", error);

      if (error.errors) {
        // Si hay errores específicos por campo
        const errorMessage = Object.entries(error.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("; ");
        setError(errorMessage);
      } else {
        setError(error.message || "Error al guardar usuario");
      }

      toast.error("No se pudo guardar el usuario");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/administracion/usuarios")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
        </h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
            <CardDescription>
              Ingrese la información básica del usuario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreUsuario">Nombre de usuario</Label>
                <Input
                  id="nombreUsuario"
                  {...register("nombreUsuario")}
                  aria-invalid={!!errors.nombreUsuario}
                  className={errors.nombreUsuario ? "border-destructive" : ""}
                  disabled={loading || isSubmitting}
                />
                {errors.nombreUsuario && (
                  <p className="text-sm text-destructive">
                    {errors.nombreUsuario.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={loading || isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  {...register("nombre")}
                  aria-invalid={!!errors.nombre}
                  className={errors.nombre ? "border-destructive" : ""}
                  disabled={loading || isSubmitting}
                />
                {errors.nombre && (
                  <p className="text-sm text-destructive">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  {...register("apellidos")}
                  aria-invalid={!!errors.apellidos}
                  className={errors.apellidos ? "border-destructive" : ""}
                  disabled={loading || isSubmitting}
                />
                {errors.apellidos && (
                  <p className="text-sm text-destructive">
                    {errors.apellidos.message}
                  </p>
                )}
              </div>
            </div>

            {!isEditing && (
              <>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contrasena">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="contrasena"
                        type={showPassword ? "text" : "password"}
                        {...register("contrasena")}
                        aria-invalid={
                          !!(errors as { contrasena: string }).contrasena
                        }
                        className={
                          (errors as { contrasena: string }).contrasena
                            ? "border-destructive"
                            : ""
                        }
                        disabled={loading || isSubmitting}
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
                    {(errors as { contrasena: string }).contrasena && (
                      <p className="text-sm text-destructive">
                        {
                          (errors as { contrasena: { message: string } })
                            .contrasena.message
                        }
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
                        {...register("confirmarContrasena")}
                        aria-invalid={
                          !!(errors as { confirmarContrasena: string })
                            .confirmarContrasena
                        }
                        className={
                          (errors as { confirmarContrasena: string })
                            .confirmarContrasena
                            ? "border-destructive"
                            : ""
                        }
                        disabled={loading || isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                    {(errors as { confirmarContrasena: string })
                      .confirmarContrasena && (
                      <p className="text-sm text-destructive">
                        {
                          (
                            errors as {
                              confirmarContrasena: { message: string };
                            }
                          ).confirmarContrasena.message
                        }
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles y permisos</CardTitle>
            <CardDescription>
              Seleccione los roles que tendrá el usuario en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Cargando roles disponibles...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((rol) => (
                    <div key={rol.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`role-${rol.id}`}
                        checked={selectedRoles.includes(rol.id)}
                        onCheckedChange={() => handleRoleToggle(rol.id)}
                        disabled={loading || isSubmitting}
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor={`role-${rol.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {rol.nombre}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {rol.descripcion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {errors.roles && (
                <p className="text-sm text-destructive mt-2">
                  {errors.roles.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/administracion/usuarios")}
            disabled={loading || isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || isSubmitting}>
            {loading || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Actualizando..." : "Creando..."}
              </>
            ) : isEditing ? (
              "Actualizar Usuario"
            ) : (
              "Crear Usuario"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
