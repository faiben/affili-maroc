import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, ConversionStatus } from "@/lib/constants";

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
    const validatedAt =
      body.status === ConversionStatus.VALIDATED ? new Date() : null;

    const conversion = await prisma.conversion.update({
      where: { id: params.id },
      data: { status: body.status, validatedAt },
    });

    if (body.status === ConversionStatus.VALIDATED) {
      const settings = await prisma.platformSettings.findUnique({
        where: { id: "settings" },
      });
      const platformFee = settings?.platformFee || 10;
      const feeAmount = (conversion.commission * platformFee) / 100;
      const netAmount = conversion.commission - feeAmount;

      await prisma.commission.upsert({
        where: { conversionId: conversion.id },
        update: {},
        create: {
          conversionId: conversion.id,
          affiliateId: conversion.affiliateId,
          enterpriseId: "",
          amount: conversion.commission,
          platformFee: feeAmount,
          netAmount,
        },
      });

      await prisma.affiliateProfile.update({
        where: { userId: conversion.affiliateId },
        data: {
          balance: { increment: netAmount },
          totalEarned: { increment: netAmount },
        },
      });
    }

    return NextResponse.json(conversion);
  } catch (error) {
    console.error("Conversion update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
