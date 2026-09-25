import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./options";
import type { UserRole } from "@/types/content";

export async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

const EDITOR_ROLES: UserRole[] = ["editor", "administrator"];
const CONTRIBUTOR_ROLES: UserRole[] = ["contributor", "reporter", "editor", "administrator"];

export function isEditor(role?: UserRole | null) {
  return !!role && EDITOR_ROLES.includes(role);
}

export function canSubmitArticles(role?: UserRole | null) {
  return !!role && CONTRIBUTOR_ROLES.includes(role);
}

/** Server Component/Route uchun: sessiya bo'lmasa /login ga yo'naltiradi. */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

/** Faqat Editor/Administrator kira oladigan sahifalar uchun. */
export async function requireEditor() {
  const user = await requireUser();
  if (!isEditor(user.role)) {
    redirect("/dashboard?error=forbidden");
  }
  return user;
}
