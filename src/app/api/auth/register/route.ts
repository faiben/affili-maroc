import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { UserRole, UserStatus } from "@/lib/constants";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().min(10),
  cin: z.string().min(5),
  role: z.enum([UserRole.ENTERPRISE, UserRole.AFFILIATE]),
  companyName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const { email, password, name, phone, cin, role, companyName } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        cin,
        role,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
        ...(role === UserRole.ENTERPRISE && companyName
          ? {
              enterprise: {
                create: { companyName },
              },
            }
          : role === UserRole.AFFILIATE
          ? {
              affiliate: {
                create: {},
              },
            }
          : {}),
      },
    });

    return NextResponse.json(
      { message: "Compte créé", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
