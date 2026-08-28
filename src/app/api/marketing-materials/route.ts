import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";

const materialSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["BANNER", "IMAGE", "TEXT"]),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  content: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (session.user.role === UserRole.ENTERPRISE) {
      const materials = await prisma.marketingMaterial.findMany({
        where: { enterpriseId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(materials);
    }

    if (session.user.role === UserRole.AFFILIATE) {
      const materials = await prisma.marketingMaterial.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          enterprise: {
            select: { name: true, enterprise: { select: { companyName: true } } },
          },
        },
      });
      return NextResponse.json(materials);
    }

    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  } catch (error) {
    console.error("Materials fetch error:", error);
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
    const parsed = materialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.type !== "TEXT" && !data.imageUrl) {
      return NextResponse.json(
        { error: "L'image est requise pour les bannières et images" },
        { status: 400 }
      );
    }

    if (data.type === "TEXT" && !data.content) {
      return NextResponse.json(
        { error: "Le contenu textuel est requis" },
        { status: 400 }
      );
    }

    const material = await prisma.marketingMaterial.create({
      data: {
        ...data,
        enterpriseId: session.user.id,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("Material creation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
