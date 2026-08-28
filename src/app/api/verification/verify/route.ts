import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 400 }
      );
    }

    const verification = await prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 400 }
      );
    }

    if (verification.verified) {
      return NextResponse.json(
        { error: "Email déjà vérifié" },
        { status: 400 }
      );
    }

    if (verification.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token expiré" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { verified: true },
      }),
      prisma.user.update({
        where: { email: verification.email },
        data: { emailVerified: new Date() },
      }),
    ]);

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.AUTH_URL ||
      "http://localhost:3000";
    return NextResponse.redirect(
      `${baseUrl}/tableau-de-bord/affilie?verified=true`
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
