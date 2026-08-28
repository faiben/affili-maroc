import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { EnterpriseDashboard } from "@/components/enterprise-dashboard";

export default async function EnterpriseDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.ENTERPRISE) {
    redirect("/auth/connexion");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      enterprise: true,
      products: {
        orderBy: { createdAt: "desc" },
        include: {
          affiliateLinks: {
            include: {
              affiliate: true,
              clicks: true,
              conversions: true,
            },
          },
        },
      },
      conversions: {
        orderBy: { createdAt: "desc" },
        include: {
          product: true,
          affiliate: true,
        },
      },
      withdrawals: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user || !user.enterprise) {
    redirect("/auth/connexion");
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <LanguageProvider>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <EnterpriseDashboard user={user} />
        </main>
        <Footer />
      </LanguageProvider>
    </div>
  );
}
