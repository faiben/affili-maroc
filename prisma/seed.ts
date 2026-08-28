import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  UserRole,
  UserStatus,
  CommissionType,
  ConversionStatus,
  WithdrawalMethod,
  WithdrawalStatus,
  ApplicationStatus,
  DisputeStatus,
} from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  await prisma.platformSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      platformFee: 10,
      minWithdrawal: 100,
      cookieDays: 30,
      payoutDelayDays: 14,
      autoValidate: false,
    },
  });

  const password = await bcrypt.hash("demo1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@affilimaroc.ma" },
    update: {},
    create: {
      email: "admin@affilimaroc.ma",
      name: "Admin AffiliMaroc",
      password,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      phone: "+212600000000",
      cin: "AA000000",
    },
  });

  const entreprise = await prisma.user.upsert({
    where: { email: "entreprise@demo.ma" },
    update: {},
    create: {
      email: "entreprise@demo.ma",
      name: "Khadija Bennani",
      password,
      role: UserRole.ENTERPRISE,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      phone: "+212612345678",
      cin: "AB123456",
      enterprise: {
        create: {
          companyName: "Boutique Maroc Élégance",
          description: "Boutique en ligne de caftans et accessoires traditionnels marocains.",
          website: "https://maroc-elegance.ma",
          city: "Casablanca",
          ice: "001234567000089",
          rc: "123456",
          balance: 15000,
        },
      },
    },
  });

  const affiliate = await prisma.user.upsert({
    where: { email: "affilie@demo.ma" },
    update: {},
    create: {
      email: "affilie@demo.ma",
      name: "Youssef Alami",
      password,
      role: UserRole.AFFILIATE,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      phone: "+212698765432",
      cin: "CD654321",
      affiliate: {
        create: {
          bio: "Influenceur lifestyle et mode au Maroc. Je partage les meilleures adresses et bons plans.",
          socialInsta: "@youssef_lifestyle",
          socialTiktok: "@youssef_lifestyle",
          balance: 1250,
          totalEarned: 4500,
        },
      },
    },
  });

  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: "prod_caftan_001" },
      update: {},
      create: {
        id: "prod_caftan_001",
        enterpriseId: entreprise.id,
        name: "Caftan Royal Rouge",
        description: "Caftan marocain haute couture brodé à la main.",
        price: 1200,
        imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80",
        url: "https://maroc-elegance.ma/produits/caftan-royal-rouge",
        category: "Mode & Beauté",
        commissionType: CommissionType.PERCENTAGE,
        commissionValue: 15,
        cookieDays: 30,
        isActive: true,
        isApproved: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_babouche_002" },
      update: {},
      create: {
        id: "prod_babouche_002",
        enterpriseId: entreprise.id,
        name: "Babouches Cuir Traditionnelles",
        description: "Babouches confortables en cuir véritable, faites main à Marrakech.",
        price: 250,
        imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
        url: "https://maroc-elegance.ma/produits/babouches-cuir",
        category: "Mode & Beauté",
        commissionType: CommissionType.FIXED,
        commissionValue: 25,
        cookieDays: 30,
        isActive: true,
        isApproved: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_argan_003" },
      update: {},
      create: {
        id: "prod_argan_003",
        enterpriseId: entreprise.id,
        name: "Huile d'Argan Bio 100ml",
        description: "Huile d'argan bio du Souss, pressée à froid.",
        price: 180,
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
        url: "https://maroc-elegance.ma/produits/huile-argan-bio",
        category: "Santé & Bien-être",
        commissionType: CommissionType.PERCENTAGE,
        commissionValue: 20,
        cookieDays: 30,
        isActive: true,
        isApproved: true,
      },
    }),
  ]);

  const link = await prisma.affiliateLink.upsert({
    where: { code: "YUSSEF10" },
    update: {},
    create: {
      productId: products[0].id,
      affiliateId: affiliate.id,
      code: "YUSSEF10",
      isActive: true,
    },
  });

  await prisma.click.createMany({
    data: Array.from({ length: 120 }).map(() => ({
      affiliateLinkId: link.id,
      country: "MA",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    })),
  });

  const conversion = await prisma.conversion.upsert({
    where: { id: "conv_001" },
    update: {},
    create: {
      id: "conv_001",
      affiliateLinkId: link.id,
      productId: products[0].id,
      affiliateId: affiliate.id,
      amount: 1200,
      commission: 180,
      status: ConversionStatus.VALIDATED,
      validatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.commission.upsert({
    where: { conversionId: conversion.id },
    update: {},
    create: {
      conversionId: conversion.id,
      affiliateId: affiliate.id,
      enterpriseId: entreprise.id,
      amount: 180,
      platformFee: 18,
      netAmount: 162,
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.withdrawal.createMany({
    data: [
      {
        userId: affiliate.id,
        amount: 500,
        method: WithdrawalMethod.CIH,
        accountInfo: "Youssef Alami - 12345678901234567890",
        status: WithdrawalStatus.PAID,
        processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: affiliate.id,
        amount: 300,
        method: WithdrawalMethod.ORANGE_MONEY,
        accountInfo: "+212698765432",
        status: WithdrawalStatus.PENDING,
      },
    ],
  });

  await prisma.affiliateApplication.createMany({
    data: [
      {
        enterpriseId: entreprise.id,
        affiliateId: affiliate.id,
        productId: products[0].id,
        message: "Je souhaite promouvoir votre caftan sur Instagram.",
        status: ApplicationStatus.APPROVED,
      },
    ],
  });

  await prisma.dispute.createMany({
    data: [
      {
        openerId: affiliate.id,
        targetId: entreprise.id,
        conversionId: conversion.id,
        reason: "La commission n'a pas été versée dans les délais.",
        status: DisputeStatus.OPEN,
      },
    ],
  });

  console.log("Seed completed successfully");
  console.log({ adminEmail: admin.email, entrepriseEmail: entreprise.email, affiliateEmail: affiliate.email, password: "demo1234" });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
