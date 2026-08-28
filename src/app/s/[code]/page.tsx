import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShareOffer } from "@/components/share-offer";

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

  return (
    <ShareOffer
      product={product}
      affiliateName={affiliate.name}
      shareUrl={shareUrl}
      buyUrl={buyUrl}
    />
  );
}
