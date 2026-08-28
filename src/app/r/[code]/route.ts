import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const link = await prisma.affiliateLink.findUnique({
    where: { code: params.code },
    include: { product: true },
  });

  if (!link || !link.isActive) {
    return NextResponse.json({ error: "Lien invalide" }, { status: 404 });
  }

  await prisma.click.create({
    data: {
      affiliateLinkId: link.id,
      country: "MA",
      userAgent: request.headers.get("user-agent") || undefined,
      referrer: request.headers.get("referer") || undefined,
    },
  });

  const cookieStore = cookies();
  cookieStore.set(`affili_${link.code}`, link.id, {
    maxAge: link.product.cookieDays * 24 * 60 * 60,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return NextResponse.redirect(link.product.url);
}
