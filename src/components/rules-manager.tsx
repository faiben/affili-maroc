"use client";

import { useState, useEffect } from "react";
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
import { Trash2, Plus, Shield } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Skeleton } from "@/components/ui/skeleton";

type Rule = {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  _count?: { agreements: number };
};

export function RulesManager() {
  const { t } = useLanguage();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchRules() {
    try {
      const res = await fetch("/api/rules");
      if (res.ok) setRules(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRules();
  }, []);

  async function createRule() {
    if (!title.trim() || content.trim().length < 10) {
      toast.error(t("fillAllFields"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || t("errGeneric"));
        return;
      }

      toast.success(t("ruleCreated"));
      setTitle("");
      setContent("");
      setDialogOpen(false);
      fetchRules();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteRule(id: string) {
    const res = await fetch(`/api/rules/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error(t("errGeneric"));
      return;
    }
    toast.success(t("ruleDeleted"));
    fetchRules();
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" /> {t("rules")}
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {t("addRule")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addRule")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{t("ruleTitle")}</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("ruleTitlePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("ruleContent")}</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("ruleContentPlaceholder")}
                  rows={5}
                />
              </div>
              <Button
                className="w-full"
                onClick={createRule}
                disabled={submitting}
              >
                {submitting ? t("loading") : t("createRule")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {rules.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("noRules")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold">{rule.title}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                    {rule.content}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:text-destructive"
                  onClick={() => deleteRule(rule.id)}
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
