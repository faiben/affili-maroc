import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/auth/connexion");
  }

  const [
    users,
    products,
    conversions,
    withdrawals,
    disputes,
    settings,
  ] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { enterprise: true, affiliate: true },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { enterprise: { include: { enterprise: { select: { companyName: true } } } } },
    }),
    prisma.conversion.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true, affiliate: true },
    }),
    prisma.withdrawal.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.dispute.findMany({
      orderBy: { createdAt: "desc" },
      include: { opener: true, target: true },
    }),
    prisma.platformSettings.findUnique({ where: { id: "settings" } }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <LanguageProvider>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <AdminDashboard
            users={users}
            products={products}
            conversions={conversions}
            withdrawals={withdrawals}
            disputes={disputes}
            settings={settings || undefined}
          />
        </main>
        <Footer />
      </LanguageProvider>
    </div>
  );
}
