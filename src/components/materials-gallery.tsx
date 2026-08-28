"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, FileText, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Skeleton } from "@/components/ui/skeleton";

type Material = {
  id: string;
  title: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  content: string | null;
  enterprise: { name: string; enterprise: { companyName: string } | null };
};

export function MaterialsGallery() {
  const { t } = useLanguage();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketing-materials")
      .then((res) => res.json())
      .then((data) => setMaterials(data))
      .finally(() => setLoading(false));
  }, []);

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {t("noMaterials")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {materials.map((mat) => (
        <Card key={mat.id} className="overflow-hidden">
          {mat.imageUrl && mat.type !== "TEXT" && (
            <div className="relative h-48 bg-muted">
              <Image src={mat.imageUrl} alt={mat.title} fill className="object-cover" />
            </div>
          )}
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-1">
              {mat.type === "TEXT" ? (
                <FileText className="h-4 w-4 text-blue-600" />
              ) : (
                <ImageIcon className="h-4 w-4 text-morocco-green" />
              )}
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {mat.type}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {mat.enterprise.enterprise?.companyName || mat.enterprise.name}
              </span>
            </div>
            <h4 className="font-semibold">{mat.title}</h4>
            {mat.description && (
              <p className="text-sm text-muted-foreground mt-1">{mat.description}</p>
            )}
            {mat.content && (
              <div className="mt-2 border rounded p-3 bg-muted/50 relative group">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap pr-8">
                  {mat.content}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyText(mat.content!)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
