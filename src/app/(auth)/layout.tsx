import type { Metadata } from "next";

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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sección derecha - Imagen */}
      <div className="hidden md:block md:w-1/2 bg-primary">
        <div className="h-full w-full bg-[url('/login-bg.jpg')] bg-cover bg-center flex items-center justify-center">
          <div className="text-white p-8 bg-black/30 rounded-lg max-w-lg text-center">
            <h1 className="text-3xl font-bold mb-4">Ama Wara Tours</h1>
            <p className="text-lg">
              Sistema de Gestión de Ventas y Reservas para servicios turísticos
            </p>
          </div>
        </div>
      </div>
      {/* Sección izquierda - Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        {/* Contenido del formulario */}
        {children}
      </div>
    </div>
  );
}
