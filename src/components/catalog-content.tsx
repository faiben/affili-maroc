"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/language-provider";
import { CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string;
  commissionType: string;
  commissionValue: number;
  enterprise: { enterprise?: { companyName: string } | null };
  affiliateLinks: { id: string }[];
};

export function CatalogContent({ products }: { products: Product[] }) {
  const { t, isAr } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12" dir={isAr ? "rtl" : "ltr"}>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{t("catalog")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez les produits et services marocains disponibles à la promotion.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">{t("noData")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="relative h-48 bg-muted">
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.enterprise.enterprise?.companyName}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description || "Aucune description"}
                </p>
                <div className="mt-auto space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("price")}
                    </span>
                    <span className="font-bold">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("commission")}
                    </span>
                    <span className="font-bold text-morocco-green">
                      {product.commissionType === "PERCENTAGE"
                        ? `${product.commissionValue}%`
                        : formatCurrency(product.commissionValue)}
                    </span>
                  </div>
                  <Button className="w-full" asChild>
                    <a
                      href={`/tableau-de-bord/affilie`}
                    >
                      {t("generateLink")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
