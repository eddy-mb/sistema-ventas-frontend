"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { adminService } from "@/services/admin-service";
import { ParametroSistema } from "@/types/admin.types";

export default function ConfiguracionForm() {
  // Estados básicos
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parametros, setParametros] = useState<ParametroSistema[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [needsRestart, setNeedsRestart] = useState<boolean>(false);

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver: zodResolver(
      z.record(
        z.string(),
        z.string().min(1, { message: "El valor es requerido" })
      )
    ),
  });

  // Carga inicial de datos - solo una vez
  useEffect(() => {
    async function loadParametros() {
      try {
        setLoading(true);
        const params = await adminService.getParametros();
        setParametros(params);

        // Extraer categorías únicas
        const uniqueCategories = [...new Set(params.map((p) => p.categoria))];
        setCategorias(uniqueCategories);

        // Establecer la primera categoría como activa
        if (uniqueCategories.length > 0) {
          setActiveTab(uniqueCategories[0]);
        }

        // Preparar valores iniciales del formulario
        const defaultValues: Record<string, string> = {};
        params.forEach((param) => {
          defaultValues[param.id] = param.valor;
        });

        reset(defaultValues);
      } catch {
        toast.error("Error al cargar la configuración");
        setError("No se pudieron cargar los parámetros del sistema");
      } finally {
        setLoading(false);
      }
    }

    loadParametros();
  }, [reset]);

  // Manejar envío del formulario
  const onSubmit = async (data: Record<string, string>) => {
    try {
      setSaving(true);
      setError(null);
      setNeedsRestart(false);

      // Identificar parámetros modificados
      const paramsChanged = parametros.filter(
        (param) => param.valor !== data[param.id]
      );

      // Si no hay cambios, mostrar mensaje y salir
      if (paramsChanged.length === 0) {
        toast.info("No se detectaron cambios en la configuración");
        setSaving(false);
        return;
      }

      // Verificar si algún parámetro requiere reinicio
      const requiresRestart = paramsChanged.some(
        (param) => param.requiereReinicio
      );

      // Guardar cada parámetro modificado secuencialmente
      for (const param of paramsChanged) {
        await adminService.updateParametro(param.id, data[param.id]);
      }

      // Actualizar el estado interno
      setParametros(
        parametros.map((param) => ({
          ...param,
          valor: data[param.id], // Actualizar valores en el estado
        }))
      );

      // Mostrar mensajes de éxito
      toast.success(`Configuración actualizada correctamente`);
      setNeedsRestart(requiresRestart);

      if (requiresRestart) {
        toast.warning("Algunos cambios requieren reiniciar el sistema");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || "Error al guardar la configuración");
      toast.error("No se pudo actualizar la configuración");
    } finally {
      setSaving(false);
    }
  };

  // Renderizar campos según tipo de dato
  const renderField = (param: ParametroSistema) => {
    const fieldId = param.id;

    switch (param.tipoDato) {
      case "booleano":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={fieldId}
              checked={param.valor === "true"}
              onCheckedChange={(checked) =>
                setValue(fieldId, checked ? "true" : "false")
              }
              disabled={saving}
            />
            <Label htmlFor={fieldId}>
              {param.valor === "true" ? "Activado" : "Desactivado"}
            </Label>
          </div>
        );

      case "número":
        return (
          <Input
            id={fieldId}
            type="number"
            {...register(fieldId)}
            className={errors[fieldId] ? "border-destructive" : ""}
            disabled={saving}
          />
        );

      default: // texto
        return (
          <Input
            id={fieldId}
            {...register(fieldId)}
            className={errors[fieldId] ? "border-destructive" : ""}
            disabled={saving}
          />
        );
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="loading">
          <TabsList>
            <TabsTrigger value="loading">
              <Skeleton className="h-4 w-20" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="loading" className="mt-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Filtrar parámetros por categoría activa
  const parametrosFiltrados = parametros.filter(
    (p) => p.categoria === activeTab
  );

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {needsRestart && (
        <Alert>
          <RefreshCw className="h-4 w-4 mr-2" />
          <AlertDescription>
            Algunos parámetros modificados requieren reiniciar el sistema para
            aplicarse completamente.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            {categorias.map((categoria) => (
              <TabsTrigger key={categoria} value={categoria}>
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  Configuración de{" "}
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </CardTitle>
                <CardDescription>
                  Administre los parámetros relacionados con {activeTab}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {parametrosFiltrados.map((param) => (
                  <div key={param.id} className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor={param.id}>{param.descripcion}</Label>
                      {param.requiereReinicio && (
                        <span className="text-xs text-amber-500 flex items-center">
                          <RefreshCw className="h-3 w-3 mr-1" /> Requiere
                          reinicio
                        </span>
                      )}
                    </div>
                    {renderField(param)}
                    {errors[param.id] && (
                      <p className="text-sm text-destructive">
                        {errors[param.id]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
