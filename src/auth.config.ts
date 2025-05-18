import Credentials from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    // Usamos JWT para almacenar la sesión
    strategy: "jwt",
    // Sesión válida por 1 días
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/(dashboard)");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login page
      } else if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.nombre = user.nombre;
        token.email = user.email;
        token.roles = user.roles;
        token.permisos = user.permisos;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.nombre = token.nombre as string;
        session.user.email = token.email as string;
        session.user.roles = token.roles as string[];
        session.user.permisos = token.permisos as string[];
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        nombreUsuario: { label: "Nombre de Usuario", type: "text" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.nombreUsuario || !credentials?.contrasena) {
            return null;
          }

          // Realizamos una petición directa a la API
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                nombreUsuario: credentials.nombreUsuario,
                contrasena: credentials.contrasena,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error respuesta:", errorData);
            return null;
          }

          const data = await response.json();

          // Formato estándar de retorno para NextAuth
          return {
            id: data.usuario.id,
            nombre: `${data.usuario.nombre} ${data.usuario.apellidos}`.trim(),
            email: data.usuario.email,
            roles: data.usuario.roles,
            permisos: data.usuario.permisos || [],
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Error en autenticación:", error);
          return null;
        }
      },
    }),
  ],
};
