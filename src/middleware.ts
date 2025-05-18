import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicPath = publicPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  // Verificar si el usuario está tratando de acceder a una ruta protegida sin estar autenticado
  if (!isLoggedIn && !isPublicPath && !nextUrl.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Si el usuario está autenticado e intenta acceder a rutas de autenticación, redirigir al dashboard
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Control de acceso basado en roles para rutas específicas
  if (isLoggedIn) {
    const userRoles = req.auth?.user.roles || [];

    // Rutas que requieren permisos específicos
    if (
      nextUrl.pathname.startsWith("/administracion") &&
      !userRoles.includes("Administrador")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }

    // Rutas que requieren rol de supervisor o administrador
    if (
      nextUrl.pathname.startsWith("/reportes") &&
      !userRoles.includes("Administrador") &&
      !userRoles.includes("Supervisor")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return NextResponse.next(); // Continuar con la solicitud normal
});

export const config = {
  // Aplicar este middleware a todas las rutas excepto recursos estáticos
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
