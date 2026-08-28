import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, ...profileData } = body;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, phone },
    });

    if (session.user.role === UserRole.ENTERPRISE) {
      await prisma.enterpriseProfile.update({
        where: { userId: session.user.id },
        data: profileData,
      });
    } else if (session.user.role === UserRole.AFFILIATE) {
      await prisma.affiliateProfile.update({
        where: { userId: session.user.id },
        data: profileData,
      });
    }

    return NextResponse.json({ message: "Profil mis à jour" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
