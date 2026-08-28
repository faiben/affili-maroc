import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareButtons } from "@/components/share-buttons";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

interface SocialSharePageProps {
  params: { code: string };
}

export async function generateMetadata({ params }: SocialSharePageProps): Promise<Metadata> {
  const link = await prisma.affiliateLink.findUnique({
    where: { code: params.code },
    include: { product: { include: { enterprise: { include: { enterprise: true } } } } },
  });

  if (!link || !link.isActive) {
    return {
      title: "Lien invalide | AffiliMaroc",
    };
  }

  const { product } = link;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";
  const shareUrl = `${appUrl}/s/${link.code}`;
  const title = `${product.name} - AffiliMaroc`;
  const description = product.description
    ? `${product.description.slice(0, 155)}...`
    : `Découvrez ${product.name} sur AffiliMaroc et profitez des meilleures offres au Maroc.`;

  const imageUrl = product.imageUrl?.startsWith("/")
    ? `${appUrl}${product.imageUrl}`
    : product.imageUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: "AffiliMaroc",
      locale: "fr_MA",
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: shareUrl,
    },
  };
}

export default async function SocialSharePage({ params }: SocialSharePageProps) {
  const link = await prisma.affiliateLink.findUnique({
    where: { code: params.code },
    include: {
      product: {
        include: {
          enterprise: {
            include: { enterprise: true },
          },
        },
      },
      affiliate: true,
    },
  });

  if (!link || !link.isActive) {
    notFound();
  }

  const { product, affiliate, code } = link;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";
  const shareUrl = `${appUrl}/s/${code}`;
  const buyUrl = `/r/${code}`;
  const companyName = product.enterprise.enterprise?.companyName ?? "AffiliMaroc";

  return (
    <main className="min-h-screen bg-muted/40 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-morocco-green">AffiliMaroc</h1>
          </Link>
          <p className="text-muted-foreground text-sm">
            Découvrez cette offre recommandée par {affiliate.name}
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-muted">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Aucune image
              </div>
            )}
          </div>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{companyName}</p>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
              </div>
              <Badge variant="secondary" className="text-morocco-green whitespace-nowrap">
                {product.commissionType === "PERCENTAGE"
                  ? `${product.commissionValue}% commission`
                  : `${formatCurrency(product.commissionValue)} commission`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-muted-foreground">Prix</span>
              <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href={buyUrl}>Acheter maintenant</Link>
            </Button>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3 text-center">
                Partager sur les réseaux sociaux
              </p>
              <ShareButtons url={shareUrl} title={product.name} imageUrl={product.imageUrl} />
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          En cliquant sur le lien, vous acceptez les conditions d&apos;utilisation d&apos;AffiliMaroc.
        </p>
      </div>
    </main>
  );
}
