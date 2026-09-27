import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@/types/content";

const STRAPI_URL = process.env.STRAPI_URL;

interface StrapiLoginResponse {
  jwt: string;
  user: { id: number; username: string; email: string; confirmed: boolean; blocked: boolean };
}

interface StrapiAuthorProfile {
  id: number;
  username: string;
  displayName: string;
  communityRole: UserRole;
  avatar?: { url: string };
}

async function fetchAuthorProfileForUser(userId: number, jwt: string) {
  const qs = new URLSearchParams({
    "filters[user][id][$eq]": String(userId),
    "populate[avatar]": "true",
  });
  const res = await fetch(`${STRAPI_URL}/api/author-profiles?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data?.[0] as StrapiAuthorProfile) ?? null;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 kun
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email yoki username",
      credentials: {
        identifier: { label: "Email yoki username", type: "text" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: credentials.identifier,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          // Strapi 400 body: { error: { message: "Invalid identifier or password" } }
          return null;
        }

        const data = (await res.json()) as StrapiLoginResponse;
        if (data.user.blocked) return null;

        const profile = await fetchAuthorProfileForUser(data.user.id, data.jwt);

        return {
          id: String(data.user.id),
          strapiJwt: data.jwt,
          username: data.user.username,
          email: data.user.email,
          role: profile?.communityRole ?? "registered_user",
          authorProfileId: profile?.id ?? null,
          displayName: profile?.displayName ?? data.user.username,
          avatarUrl: profile?.avatar?.url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // `user` faqat login paytida keladi; keyingi so'rovlarda token'dan davom etamiz.
      if (user) {
        token.strapiJwt = user.strapiJwt;
        token.userId = Number(user.id);
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
        token.authorProfileId = user.authorProfileId;
        token.displayName = user.displayName;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      session.strapiJwt = token.strapiJwt;
      session.user = {
        ...session.user,
        id: token.userId,
        username: token.username,
        email: token.email,
        role: token.role,
        authorProfileId: token.authorProfileId,
        displayName: token.displayName,
        avatarUrl: token.avatarUrl,
      };
      return session;
    },
  },
};
