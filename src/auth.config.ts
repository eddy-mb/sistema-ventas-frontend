import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const publicPaths = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
      ];
      const isPublic = publicPaths.some((publicPath) =>
        path.startsWith(publicPath)
      );

      const isOnDashboard =
        path === "/" ||
        (path.startsWith("/") && !isPublic && !path.startsWith("/api"));
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirige a login si no está autenticado
      } else if (
        isLoggedIn &&
        (path.startsWith("/login") || path.startsWith("/register"))
      ) {
        // Si el usuario está autenticado e intenta acceder a login/register, redirigir al dashboard
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  providers: [],
};
