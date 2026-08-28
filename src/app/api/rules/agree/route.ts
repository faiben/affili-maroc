import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";

const agreeSchema = z.object({
  ruleIds: z.array(z.string()).min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.AFFILIATE) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = agreeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const rules = await prisma.enterpriseRule.findMany({
      where: { id: { in: parsed.data.ruleIds }, isActive: true },
    });

    if (rules.length === 0) {
      return NextResponse.json(
        { error: "Règles non trouvées" },
        { status: 404 }
      );
    }

    for (const rule of rules) {
      await prisma.ruleAgreement.upsert({
        where: {
          ruleId_affiliateId: {
            ruleId: rule.id,
            affiliateId: session.user.id,
          },
        },
        update: {},
        create: {
          ruleId: rule.id,
          affiliateId: session.user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rule agreement error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
