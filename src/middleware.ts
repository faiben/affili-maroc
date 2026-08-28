import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const protectedRoutes = [
  { prefix: "/tableau-de-bord/entreprise", role: "ENTERPRISE" },
  { prefix: "/tableau-de-bord/affilie", role: "AFFILIATE" },
  { prefix: "/admin", role: "ADMIN" },
];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;

  const matched = protectedRoutes.find((route) =>
    nextUrl.pathname.startsWith(route.prefix)
  );

  if (matched) {
    if (!user) {
      const login = new URL("/auth/connexion", nextUrl);
      login.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(login);
    }
    if (user.role !== matched.role) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
