import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import "next-auth/jwt";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
});

// Añadir tipos para Next Auth
declare module "next-auth" {
  interface User {
    id: string;
    nombre: string;
    email: string;
    roles: string[];
    permisos: string[];
    accessToken: string;
  }

  interface Session {
    user: User & {
      id: string;
      nombre: string;
      email: string;
      roles: string[];
      permisos: string[];
      accessToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nombre: string;
    email: string;
    roles: string[];
    permisos: string[];
    accessToken: string;
  }
}
