import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginResponse } from "./types/auth";
import { DefaultSession } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT, getToken } from "next-auth/jwt";

// Extendemos los tipos predeterminados de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      rol: string | string[];
      permisos?: string[];
      token?: string;
      image?: string;
    } & DefaultSession["user"];
    error?: string;
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    rol: string | string[];
    permisos?: string[];
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    rol: string | string[];
    permisos?: string[];
    token?: string;
    error?: string;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  // Secret para firmar tokens
  secret: process.env.AUTH_SECRET,
  session: {
    // Usamos JWT para almacenar la sesión
    strategy: "jwt",
    // Sesión válida por 30 días
    maxAge: 30 * 24 * 60 * 60,
    // Actualizar el token JWT cada 24 horas
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    // Callback simplificado para authorized (principal lógica en middleware.ts)
    authorized() {
      return true;
    },

    // Transferimos los datos del usuario al token JWT
    async jwt({ token, user }) {
      // Si hay datos de usuario (inicio de sesión), los añadimos al token
      if (user) {
        token.id = user.id!;
        token.name = user.name!;
        token.email = user.email!;
        // Aseguramos que los roles siempre sean un array en el token
        token.rol = Array.isArray(user.rol) ? user.rol : [user.rol];
        token.permisos = user.permisos;
        token.token = user.token; // Token de acceso de la API
        console.log("JWT token roles:", token.rol);
      }

      return token;
    },

    // Transferimos los datos del token a la sesión
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        // Aseguramos que los roles siempre sean un array en la sesión
        session.user.rol = Array.isArray(token.rol) ? token.rol : [token.rol];
        session.user.permisos = token.permisos;
        session.user.token = token.token;
      }

      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!res.ok) {
            const errorData = await res.json();
            const errorMessage = errorData.detail || "Credenciales inválidas";
            console.error(`Error de autenticación: ${errorMessage}`);
            throw new Error(errorMessage);
          }

          const { data } = (await res.json()) as LoginResponse;

          // Aseguramos que los roles siempre sean un array de forma explícita
          const roles = Array.isArray(data.roles)
            ? data.roles
            : typeof data.roles === "string"
            ? [data.roles]
            : [];

          // Transformamos la respuesta al formato esperado por NextAuth
          return {
            id: String(data.user.id),
            name: data.user.full_name,
            email: data.user.email,
            rol: roles, // Usamos la variable roles que ya verificó el formato
            permisos: data.permissions || [],
            token: data.access_token, // Guardamos el token para usarlo en peticiones a la API
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login", // Redirigimos a login en caso de error
  },
});
