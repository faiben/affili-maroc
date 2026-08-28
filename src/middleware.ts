import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = [
  { prefix: "/tableau-de-bord/entreprise", role: "ENTERPRISE" },
  { prefix: "/tableau-de-bord/affilie", role: "AFFILIATE" },
  { prefix: "/admin", role: "ADMIN" },
];

export default auth((req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;

  const matched = protectedRoutes.find((route) =>
    nextUrl.pathname.startsWith(route.prefix)
  );

  if (matched) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/connexion", nextUrl));
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
