import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WithdrawalMethod, WithdrawalStatus } from "@/lib/constants";

const withdrawalSchema = z.object({
  amount: z.number().min(100),
  method: z.enum([
    WithdrawalMethod.BANK_AL_MAGHRIB,
    WithdrawalMethod.CIH,
    WithdrawalMethod.ATTIJARIWAFA,
    WithdrawalMethod.CASH_PLUS,
    WithdrawalMethod.WAFACASH,
    WithdrawalMethod.INWI_MONEY,
    WithdrawalMethod.ORANGE_MONEY,
  ]),
  accountInfo: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = withdrawalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const { amount, method, accountInfo } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { affiliate: true, enterprise: true },
    });

    const balance =
      user?.affiliate?.balance || user?.enterprise?.balance || 0;

    if (amount > balance) {
      return NextResponse.json(
        { error: "Solde insuffisant" },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: session.user.id,
        amount,
        method,
        accountInfo,
        status: WithdrawalStatus.PENDING,
      },
    });

    if (user?.affiliate) {
      await prisma.affiliateProfile.update({
        where: { userId: user.id },
        data: { balance: { decrement: amount } },
      });
    } else if (user?.enterprise) {
      await prisma.enterpriseProfile.update({
        where: { userId: user.id },
        data: { balance: { decrement: amount } },
      });
    }

    return NextResponse.json(withdrawal, { status: 201 });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
