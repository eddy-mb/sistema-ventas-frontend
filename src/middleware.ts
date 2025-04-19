import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware personalizado para manejar la autorización y acceso a rutas
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/unauthorized",
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // API y recursos estáticos siempre son accesibles
  if (pathname.startsWith("/api") || pathname.includes("/_next")) {
    return NextResponse.next();
  }

  // Obtenemos el token con toda la información del usuario
  const token = await getToken({
    req: request,
    secret:
      process.env.AUTH_SECRET ||
      process.env.JWT_SECRET ||
      "fallback-secret-do-not-use-in-production",
  });

  // Verificar autenticación para rutas protegidas
  const isAuthenticated = !!token;

  // Redireccionar a login si no está autenticado en rutas protegidas
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si el usuario está autenticado y trata de acceder a páginas de autenticación, redireccionar al inicio
  if (
    isAuthenticated &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // RBAC - Control de acceso basado en roles
  if (isAuthenticated) {
    // Extraemos los roles del token
    const roles = Array.isArray(token.rol)
      ? token.rol
      : typeof token.rol === "string"
      ? [token.rol]
      : [];

    // Rutas que requieren rol de administrador
    if (pathname.startsWith("/administracion") && !roles.includes("admin")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Rutas que requieren rol de administrador o gerente
    if (
      pathname.startsWith("/reportes") &&
      !roles.includes("admin") &&
      !roles.includes("gerente")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher para aplicar el middleware en todas las rutas excepto recursos estáticos
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
