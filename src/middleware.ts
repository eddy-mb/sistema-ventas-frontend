// src/middleware.ts
import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth;
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");
  const isDashboardRoute =
    !isAuthRoute &&
    nextUrl.pathname !== "/" &&
    !nextUrl.pathname.startsWith("/_next") &&
    !nextUrl.pathname.startsWith("/api") &&
    !nextUrl.pathname.includes(".");

  // Allow public routes
  if (!isDashboardRoute && !isAuthRoute) {
    return;
  }

  // Redirect to login if not logged in and trying to access protected route
  if (!isLoggedIn && isDashboardRoute) {
    const redirectUrl = new URL("/login", nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.href);
    return Response.redirect(redirectUrl);
  }

  // Redirect to dashboard if logged in and trying to access auth routes
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL("/", nextUrl.origin));
  }
});

// Configuración del middleware para que se ejecute en estas rutas
export const config = {
  matcher: [
    // Skip static files and api routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
};
