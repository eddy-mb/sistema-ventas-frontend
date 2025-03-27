import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth;
  const path = nextUrl.pathname;

  // Define rutas públicas y de autenticación de manera más específica
  const isAuthRoute = path === "/login" || path === "/register";

  // Rutas del dashboard más específicas
  const isDashboardRoute =
    path === "/" ||
    (path.startsWith("/") &&
      !path.startsWith("/login") &&
      !path.startsWith("/register") &&
      !path.startsWith("/api") &&
      !path.includes("."));

  // Si está en páginas de autenticación y ya está logueado, redirigir al dashboard
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl.origin));
  }

  // Si intenta acceder al dashboard sin estar logueado, redirigir al login
  if (isDashboardRoute && !isLoggedIn) {
    const redirectUrl = new URL("/login", nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.href);
    return Response.redirect(redirectUrl);
  }
});

// Configuración del middleware
export const config = {
  matcher: [
    // Skip static files and api routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
};
