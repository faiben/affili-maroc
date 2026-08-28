import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { AffiliateDashboard } from "@/components/affiliate-dashboard";

export default async function AffiliateDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.AFFILIATE) {
    redirect("/auth/connexion");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      affiliate: true,
      affiliateLinks: {
        include: {
          product: {
    include: { enterprise: { include: { enterprise: { select: { companyName: true } } } } },
          },
          clicks: true,
          conversions: true,
        },
      },
      conversions: {
        orderBy: { createdAt: "desc" },
        include: { product: true },
      },
      commissions: {
        orderBy: { createdAt: "desc" },
      },
      withdrawals: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user || !user.affiliate) {
    redirect("/auth/connexion");
  }

  const availableProducts = await prisma.product.findMany({
    where: { isActive: true, isApproved: true },
    include: { enterprise: { include: { enterprise: { select: { companyName: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <LanguageProvider>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <AffiliateDashboard user={user} availableProducts={availableProducts} />
        </main>
        <Footer />
      </LanguageProvider>
    </div>
  );
}
