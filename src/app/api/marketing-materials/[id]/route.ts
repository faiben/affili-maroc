import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  type: z.enum(["BANNER", "IMAGE", "TEXT"]).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  content: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.ENTERPRISE) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const material = await prisma.marketingMaterial.findUnique({
      where: { id: params.id },
    });

    if (!material || material.enterpriseId !== session.user.id) {
      return NextResponse.json(
        { error: "Support non trouvé" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const updated = await prisma.marketingMaterial.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Material update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.ENTERPRISE) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const material = await prisma.marketingMaterial.findUnique({
      where: { id: params.id },
    });

    if (!material || material.enterpriseId !== session.user.id) {
      return NextResponse.json(
        { error: "Support non trouvé" },
        { status: 404 }
      );
    }

    await prisma.marketingMaterial.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Material delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
