"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/language-provider";
import { CATEGORIES, CommissionType } from "@/lib/constants";
import { toast } from "sonner";

export function ProductForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [commissionType, setCommissionType] = useState<string>(
    CommissionType.PERCENTAGE
  );
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("invalidImageType"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("imageTooLarge"));
      return;
    }

    setIsUploading(true);

    try {
      const localPreview = URL.createObjectURL(file);
      setImagePreview(localPreview);

      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || t("uploadError"));
        setImagePreview(null);
        return;
      }

      setImageUrl(data.url);
      toast.success(t("imageUploaded"));
    } catch {
      toast.error(t("uploadError"));
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  }

  function clearImage() {
    setImageUrl("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          price: parseFloat(formData.get("price") as string),
          imageUrl: imageUrl || null,
          url: formData.get("url"),
          category: formData.get("category"),
          commissionType,
          commissionValue: parseFloat(formData.get("commissionValue") as string),
          cookieDays: parseInt(formData.get("cookieDays") as string),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || t("addProductError"));
        return;
      }

      toast.success(t("productAdded"));
      router.refresh();
      (e.target as HTMLFormElement).reset();
      clearImage();
    } catch {
      toast.error(t("serverError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("productName")}</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea id="description" name="description" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{t("priceMad")}</Label>
          <Input id="price" name="price" type="number" min="0" step="0.01" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">{t("category")}</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">{t("productImage")}</Label>
        <Input
          id="image"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {isUploading && (
          <p className="text-sm text-muted-foreground">{t("uploading")}...</p>
        )}
        {imagePreview && (
          <div className="relative mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-md border">
            <Image
              src={imagePreview}
              alt={t("productImagePreview")}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-1 top-1 rounded-full bg-destructive px-2 py-0.5 text-xs text-white"
            >
              {t("remove")}
            </button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">{t("productUrl")}</Label>
        <Input id="url" name="url" type="url" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("commissionType")}</Label>
          <Select value={commissionType} onValueChange={setCommissionType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CommissionType.PERCENTAGE}>
                {t("percentage")}
              </SelectItem>
              <SelectItem value={CommissionType.FIXED}>
                {t("fixedAmount")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="commissionValue">{t("commissionValue")}</Label>
          <Input
            id="commissionValue"
            name="commissionValue"
            type="number"
            min="0"
            step={commissionType === CommissionType.PERCENTAGE ? "0.1" : "0.01"}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cookieDays">{t("cookieDuration")} ({t("days")})</Label>
        <Input
          id="cookieDays"
          name="cookieDays"
          type="number"
          min="30"
          defaultValue="30"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
        {isLoading ? "..." : t("addProduct")}
      </Button>
    </form>
  );
}
