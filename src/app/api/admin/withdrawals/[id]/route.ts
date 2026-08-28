import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, WithdrawalStatus } from "@/lib/constants";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const withdrawal = await prisma.withdrawal.update({
      where: { id: params.id },
      data: {
        status: body.status,
        processedAt: body.status === WithdrawalStatus.PAID ? new Date() : null,
      },
    });

    return NextResponse.json(withdrawal);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
