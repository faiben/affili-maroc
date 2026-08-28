import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  isActive: z.boolean().optional(),
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

    const rule = await prisma.enterpriseRule.findUnique({
      where: { id: params.id },
    });

    if (!rule || rule.enterpriseId !== session.user.id) {
      return NextResponse.json({ error: "Règle non trouvée" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const updated = await prisma.enterpriseRule.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Rule update error:", error);
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

    const rule = await prisma.enterpriseRule.findUnique({
      where: { id: params.id },
    });

    if (!rule || rule.enterpriseId !== session.user.id) {
      return NextResponse.json({ error: "Règle non trouvée" }, { status: 404 });
    }

    await prisma.enterpriseRule.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rule delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
