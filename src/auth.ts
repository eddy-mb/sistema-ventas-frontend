// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    rol: string;
    token: string;
    permissions?: string[];
  }

  interface Session {
    user: User;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    rol: string;
    token: string;
    permissions?: string[];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.email = user.email ?? "";
        token.name = user.name ?? "";
        token.rol = user.rol;
        token.token = user.token;
        token.permissions = user.permissions ?? [];
      }
      // Para permissions, que es opcional, solo asignarlo si existe
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.rol = token.rol;
        session.user.token = token.token;
        session.user.permissions = token.permissions;
        session.token = token.token;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
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
          console.log("=========================", res);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Credenciales inválidas");
          }

          const userData = await res.json();

          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            rol: userData.rol,
            token: userData.access_token,
            permissions: userData.permissions,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
  },
});
