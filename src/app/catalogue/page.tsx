import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { CatalogContent } from "@/components/catalog-content";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isApproved: true },
      include: {
        enterprise: {
          include: { enterprise: { select: { companyName: true } } },
        },
      affiliateLinks: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <LanguageProvider>
        <Navbar />
        <main className="flex-1 bg-muted/30">
          <CatalogContent products={products} />
        </main>
        <Footer />
      </LanguageProvider>
    </div>
  );
}
