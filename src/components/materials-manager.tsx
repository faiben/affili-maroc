"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Megaphone, Upload, FileText, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Skeleton } from "@/components/ui/skeleton";

type Material = {
  id: string;
  title: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  content: string | null;
};

export function MaterialsManager() {
  const { t } = useLanguage();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("BANNER");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function fetchMaterials() {
    try {
      const res = await fetch("/api/marketing-materials");
      if (res.ok) setMaterials(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Upload failed");
        return;
      }

      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Image uploadée");
    } finally {
      setUploading(false);
    }
  }

  async function createMaterial() {
    if (!title.trim()) {
      toast.error(t("fillAllFields"));
      return;
    }

    const payload: Record<string, string> = {
      title: title.trim(),
      type,
    };
    if (description.trim()) payload.description = description.trim();

    if (type === "TEXT") {
      if (!textContent.trim()) {
        toast.error(t("fillAllFields"));
        return;
      }
      payload.content = textContent.trim();
    } else {
      if (!imageUrl) {
        toast.error("Veuillez télécharger une image");
        return;
      }
      payload.imageUrl = imageUrl;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/marketing-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Erreur");
        return;
      }

      toast.success(t("materialCreated"));
      resetForm();
      setDialogOpen(false);
      fetchMaterials();
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setTitle("");
    setType("BANNER");
    setDescription("");
    setImageUrl("");
    setTextContent("");
  }

  async function deleteMaterial(id: string) {
    const res = await fetch(`/api/marketing-materials/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Erreur");
      return;
    }
    toast.success(t("materialDeleted"));
    fetchMaterials();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Megaphone className="h-5 w-5" /> {t("marketingMaterials")}
        </h3>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {t("addMaterial")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("addMaterial")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{t("materialTitle")}</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("materialTitlePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("materialType")}</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANNER">{t("banner")}</SelectItem>
                    <SelectItem value="IMAGE">{t("image")}</SelectItem>
                    <SelectItem value="TEXT">{t("textContent")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("descriptionOptional")}</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {type === "TEXT" ? (
                <div className="space-y-2">
                  <Label>{t("textContent")}</Label>
                  <Textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={4}
                    placeholder={t("materialTextPlaceholder")}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>{t("uploadImage")}</Label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? t("loading") : t("uploadImage")}
                  </Button>
                  {imageUrl && (
                    <div className="relative h-32 mt-2 rounded-md overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
              <Button
                className="w-full"
                onClick={createMaterial}
                disabled={submitting}
              >
                {submitting ? t("loading") : t("createMaterial")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {materials.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("noMaterials")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((mat) => (
            <Card key={mat.id} className="overflow-hidden">
              {mat.imageUrl && mat.type !== "TEXT" && (
                <div className="relative h-36 bg-muted">
                  <Image
                    src={mat.imageUrl}
                    alt={mat.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="py-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {mat.type === "TEXT" ? (
                      <FileText className="h-4 w-4 text-blue-600" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-morocco-green" />
                    )}
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      {t(mat.type.toLowerCase() as "banner" | "image" | "textContent")}
                    </span>
                  </div>
                  <h4 className="font-semibold">{mat.title}</h4>
                  {mat.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {mat.description}
                    </p>
                  )}
                  {mat.content && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2 border rounded p-2 bg-muted/50">
                      {mat.content}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:text-destructive"
                  onClick={() => deleteMaterial(mat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
