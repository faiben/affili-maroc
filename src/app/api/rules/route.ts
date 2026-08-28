import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";

const ruleSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const rules = await prisma.enterpriseRule.findMany({
      where:
        session.user.role === UserRole.ENTERPRISE
          ? { enterpriseId: session.user.id }
          : {},
      include: {
        agreements: {
          where: { affiliateId: session.user.id },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const withAgreement = rules.map(({ agreements, ...rule }) => ({
      ...rule,
      agreedByMe: agreements.length > 0,
    }));

    return NextResponse.json(withAgreement);
  } catch (error) {
    console.error("Rules fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.ENTERPRISE) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ruleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const rule = await prisma.enterpriseRule.create({
      data: {
        ...parsed.data,
        enterpriseId: session.user.id,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("Rule creation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
