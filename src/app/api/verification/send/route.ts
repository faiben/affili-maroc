import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getSmtpConfig,
  sendVerificationEmail,
  generateVerificationToken,
} from "@/lib/email";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email déjà vérifié" },
        { status: 400 }
      );
    }

    // Invalidate previous tokens
    await prisma.emailVerification.updateMany({
      where: { email: user.email, verified: false },
      data: { verified: true },
    });

    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailVerification.create({
      data: {
        email: user.email,
        token,
        expiresAt,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.AUTH_URL ||
      "http://localhost:3000";
    const verificationUrl = `${baseUrl}/api/verification/verify?token=${token}`;

    const config = getSmtpConfig();

    if (config) {
      const result = await sendVerificationEmail(
        user.email,
        user.name || user.email,
        verificationUrl,
        config
      );

      if (!result.success) {
        return NextResponse.json(
          { error: "Échec de l'envoi de l'email", details: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Email de vérification envoyé",
      });
    }

    // Demo mode: SMTP not configured
    return NextResponse.json({
      success: true,
      message:
        "SMTP non configuré (mode démo). Utilisez le lien ci-dessous.",
      demoUrl: verificationUrl,
    });
  } catch (error) {
    console.error("Send verification email error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
