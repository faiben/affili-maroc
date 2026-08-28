import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, CommissionType } from "@/lib/constants";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z
    .string()
    .refine(
      (val) =>
        val === "" ||
        val.startsWith("/uploads/") ||
        z.string().url().safeParse(val).success,
      { message: "Doit être une URL valide ou un fichier uploadé" }
    )
    .optional()
    .or(z.literal("")),
  url: z.string().url(),
  category: z.string().min(1),
  commissionType: z.enum([CommissionType.PERCENTAGE, CommissionType.FIXED]),
  commissionValue: z.number().positive(),
  cookieDays: z.number().min(30).default(30),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== UserRole.ENTERPRISE) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        imageUrl: parsed.data.imageUrl || null,
        enterpriseId: session.user.id,
        isApproved: false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isApproved: true },
      include: {
        enterprise: {
          include: { enterprise: { select: { companyName: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
