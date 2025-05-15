import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login - Sistema de Ventas Ama Wara",
  description: "Inicia sesión en el sistema de ventas Ama Wara",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Sección izquierda - Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.png"
              alt="Amawara Logo"
              width={180}
              height={50}
              priority
            />
          </div>

          {/* Contenido del formulario */}
          <div className="bg-card rounded-lg shadow-sm border p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>

      {/* Sección derecha - Imagen */}
      <div className="hidden md:block md:w-1/2 bg-primary p-8">
        <div className="h-full w-full bg-[url('/login-bg.jpg')] bg-cover bg-center rounded-lg flex items-center justify-center">
          <div className="text-white p-8 bg-black/30 rounded-lg max-w-lg text-center">
            <h1 className="text-3xl font-bold mb-4">Ama Wara Tours</h1>
            <p className="text-lg">
              Sistema de Gestión de Ventas y Reservas para servicios turísticos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
