"use client";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  useEffect(() => {
    toast.success("Prueba de Toast");
    console.log("Hola");
  }, []);

  return <div>Pagina de Dashboard</div>;
}
