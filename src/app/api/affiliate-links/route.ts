import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";

const linkSchema = z.object({
  productId: z.string(),
  code: z.string().min(4),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== UserRole.AFFILIATE) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = linkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { productId, code } = parsed.data;

    const existing = await prisma.affiliateLink.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ce code est déjà utilisé" },
        { status: 409 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    const enterpriseUserId = product.enterpriseId;

    const pendingRules = await prisma.enterpriseRule.findMany({
      where: {
        enterpriseId: enterpriseUserId,
        isActive: true,
        agreements: { none: { affiliateId: session.user.id } },
      },
    });

    if (pendingRules.length > 0) {
      return NextResponse.json(
        {
          error: "RULES_PENDING",
          message:
            "Vous devez accepter les règles de l'entreprise avant de générer un lien.",
          rules: pendingRules.map((r) => ({
            id: r.id,
            title: r.title,
            content: r.content,
          })),
        },
        { status: 403 }
      );
    }

    const link = await prisma.affiliateLink.create({
      data: {
        productId,
        affiliateId: session.user.id,
        code,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Link creation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
