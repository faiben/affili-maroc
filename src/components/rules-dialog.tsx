"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

type PendingRule = {
  id: string;
  title: string;
  content: string;
};

type RulesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rules: PendingRule[];
  onAgreed: () => void;
};

export function RulesDialog({
  open,
  onOpenChange,
  rules,
  onAgreed,
}: RulesDialogProps) {
  const { t } = useLanguage();
  const [agreedIds, setAgreedIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  function toggle(id: string) {
    setAgreedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allAgreed = rules.length > 0 && agreedIds.size === rules.length;

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/rules/agree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleIds: Array.from(agreedIds) }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || t("errGeneric"));
        return;
      }

      toast.success(t("rulesAccepted"));
      onAgreed();
      onOpenChange(false);
      setAgreedIds(new Set());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> {t("enterpriseRules")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{t("mustAcceptRules")}</p>
        <div className="space-y-3 mt-4">
          {rules.map((rule) => (
            <div key={rule.id} className="border rounded-md p-3 space-y-2">
              <h4 className="font-semibold text-sm">{rule.title}</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {rule.content}
              </p>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <Checkbox
                  checked={agreedIds.has(rule.id)}
                  onCheckedChange={() => toggle(rule.id)}
                />
                <span className="text-sm">{t("iAcceptRule")}</span>
              </label>
            </div>
          ))}
        </div>
        <Button
          className="w-full mt-4"
          disabled={!allAgreed || submitting}
          onClick={submit}
        >
          {submitting ? t("loading") : t("agreeAndContinue")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
