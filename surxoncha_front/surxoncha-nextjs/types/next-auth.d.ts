import type { UserRole } from "@/types/content";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    strapiJwt: string;
    user: {
      id: number;
      username: string;
      email: string;
      role: UserRole;
      authorProfileId: number | null;
      displayName: string;
      avatarUrl?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    strapiJwt: string;
    username: string;
    email: string;
    role: UserRole;
    authorProfileId: number | null;
    displayName: string;
    avatarUrl?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    strapiJwt: string;
    userId: number;
    username: string;
    email: string;
    role: UserRole;
    authorProfileId: number | null;
    displayName: string;
    avatarUrl?: string;
  }
}
