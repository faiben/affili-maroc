"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareButtons } from "@/components/share-buttons";
import { formatCurrency } from "@/lib/format";
import { useLanguage } from "@/components/language-provider";

type ShareOfferProduct = {
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  commissionType: string;
  commissionValue: number;
  enterprise: { enterprise?: { companyName: string } | null };
};

type ShareOfferProps = {
  product: ShareOfferProduct;
  affiliateName: string;
  shareUrl: string;
  buyUrl: string;
};

export function ShareOffer({
  product,
  affiliateName,
  shareUrl,
  buyUrl,
}: ShareOfferProps) {
  const { t, isAr } = useLanguage();
  const companyName = product.enterprise.enterprise?.companyName ?? "AffiliMaroc";

  const commissionLabel =
    product.commissionType === "PERCENTAGE"
      ? `${product.commissionValue}% ${t("commission")}`
      : `${formatCurrency(product.commissionValue)} ${t("commission")}`;

  return (
    <main className="min-h-screen bg-muted/40 py-8 px-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-morocco-green">AffiliMaroc</h1>
          </Link>
          <p className="text-muted-foreground text-sm">
            {t("discoverOffer")} {affiliateName}
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
                {t("noImage")}
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
                {commissionLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-muted-foreground">{t("price")}</span>
              <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href={buyUrl}>{t("buyNow")}</Link>
            </Button>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3 text-center">
                {t("socialShareTitle")}
              </p>
              <ShareButtons url={shareUrl} title={product.name} imageUrl={product.imageUrl} />
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          {t("acceptingTerms")}
        </p>
      </div>
    </main>
  );
}
