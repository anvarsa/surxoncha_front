import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EDITOR_ROLES = ["editor", "administrator"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  // Tizimga kirmagan foydalanuvchi — himoyalangan sahifalarga kira olmaydi.
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Editor-only bo'lim.
  if (pathname.startsWith("/dashboard/editor") && !EDITOR_ROLES.includes(token.role as string)) {
    return NextResponse.redirect(new URL("/dashboard?error=forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/submit/:path*"],
};
