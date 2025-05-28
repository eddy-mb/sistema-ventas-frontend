"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

import { adminService } from "@/services/admin-service";
import { Rol } from "@/types/admin.types";

// Esquema para rol
const rolSchema = z.object({
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" })
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Solo puede contener letras, números y espacios",
    }),
  descripcion: z
    .string()
    .min(5, { message: "La descripción debe tener al menos 5 caracteres" })
    .max(255, {
      message: "La descripción no puede exceder los 255 caracteres",
    }),
});

type RolFormValues = z.infer<typeof rolSchema>;

interface RolFormProps {
  id?: string; // Si hay ID, es edición; si no, es creación
}

export default function RolForm({ id }: RolFormProps) {
  const isEditing = !!id;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [rol, setRol] = useState<Rol | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RolFormValues>({
    resolver: zodResolver(rolSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  // Si estamos editando, cargar datos del rol
  useEffect(() => {
    if (isEditing && id) {
      const loadRol = async () => {
        try {
          setInitialLoading(true);
          const rolData = await adminService.getRolById(id);
          setRol(rolData);
          // Establecer valores en el formulario
          reset({
            nombre: rolData.nombre,
            descripcion: rolData.descripcion,
          });
        } catch {
          toast.error("No se pudo cargar la información del rol");
          router.push("/administracion/roles");
        } finally {
          setInitialLoading(false);
        }
      };

      loadRol();
    }
  }, [isEditing, id, reset, router]);

  // Enviar formulario
  const onSubmit = async (data: RolFormValues) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        // Editar rol existente
        await adminService.updateRol(id, {
          nombre: data.nombre,
          descripcion: data.descripcion,
        });
        toast.success("Rol actualizado exitosamente");
      } else {
        // Crear nuevo rol
        const permisos: string[] = []; // Inicialmente sin permisos, se asignarán después
        await adminService.createRol({
          nombre: data.nombre,
          descripcion: data.descripcion,
          permisos,
        });
        toast.success("Rol creado exitosamente");
      }

      // Redireccionar al listado de roles
      router.push("/administracion/roles");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || "Error al guardar rol");
      toast.error("No se pudo guardar el rol");
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
          onClick={() => router.push("/administracion/roles")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Rol" : "Nuevo Rol"}
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
            <CardTitle>Información del rol</CardTitle>
            <CardDescription>
              {isEditing
                ? "Actualice la información del rol"
                : "Ingrese los datos para el nuevo rol"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del rol</Label>
              <Input
                id="nombre"
                {...register("nombre")}
                aria-invalid={!!errors.nombre}
                className={errors.nombre ? "border-destructive" : ""}
                disabled={
                  loading || isSubmitting || (isEditing && rol?.esPredefinido)
                }
              />
              {errors.nombre && (
                <p className="text-sm text-destructive">
                  {errors.nombre.message}
                </p>
              )}
              {isEditing && rol?.esPredefinido && (
                <p className="text-sm text-muted-foreground">
                  Este es un rol predefinido del sistema y su nombre no puede
                  ser modificado.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                {...register("descripcion")}
                aria-invalid={!!errors.descripcion}
                className={errors.descripcion ? "border-destructive" : ""}
                disabled={loading || isSubmitting}
                rows={4}
              />
              {errors.descripcion && (
                <p className="text-sm text-destructive">
                  {errors.descripcion.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de permisos</CardTitle>
            <CardDescription>
              {isEditing
                ? "Para gestionar los permisos específicos de este rol, utilice la opción 'Gestionar permisos' después de guardar los cambios básicos."
                : "Una vez creado el rol, podrá asignar permisos específicos."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>
                {`Los permisos determinan qué acciones pueden realizar los
                usuarios con este rol en el sistema. La asignación de permisos
                se realiza de forma granular desde la sección de "Gestionar
                permisos".`}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/administracion/roles")}
            disabled={loading || isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              loading ||
              isSubmitting ||
              (isEditing && rol?.esPredefinido && !rol?.estado)
            }
          >
            {loading || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Actualizando..." : "Creando..."}
              </>
            ) : isEditing ? (
              "Actualizar Rol"
            ) : (
              "Crear Rol"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
