import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import { LoginResponse } from "./types/auth";

// Extendemos los tipos predeterminados de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      rol: string[];
      permissions?: string[];
      token?: string;
      image?: string;
    };
    error?: string;
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    rol: string[];
    permissions?: string[];
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    rol: string[];
    permissions?: string[];
    token?: string;
    error?: string;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: {
    // Usamos JWT para almacenar la sesión
    strategy: "jwt",
    // Sesión válida por 30 días
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    // Transferimos los datos del usuario al token JWT
    async jwt({ token, user, account }) {
      // Si hay datos de usuario (inicio de sesión), los añadimos al token
      if (user) {
        token.id = user.id!;
        token.name = user.name!;
        token.email = user.email!;
        token.rol = user.rol;
        token.permissions = user.permissions;
        token.token = user.token; // Token de acceso de la API
      }

      // Si hay datos de provider, podríamos manejarlos aquí
      if (account) {
        // Ejemplo: si usamos OAuth providers en el futuro
      }

      return token;
    },
    // Transferimos los datos del token a la sesión
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.rol = token.rol;
        session.user.permissions = token.permissions;
        session.user.token = token.token;
      }

      return session;
    },
    // Validación adicional para rutas protegidas
    async authorized({ auth }) {
      return !!auth?.user;
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
            throw new Error(errorData.detail || "Credenciales inválidas");
          }

          const { data } = (await res.json()) as LoginResponse;

          // Transformamos la respuesta al formato esperado por NextAuth
          return {
            id: String(data.user.id),
            name: data.user.full_name,
            email: data.user.email,
            rol: data.roles,
            permissions: data.permissions || [],
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
