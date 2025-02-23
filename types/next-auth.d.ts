// types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

// Extend the session and user objects
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      name?: string;
      email?: string;
      image?: string; // Ensure the image property exists
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    picture?: string; // Add the picture property for Google Profile
  }
}

// Extend JWT token to include accessToken
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    picture?: string; // Ensure picture is included
  }
}
