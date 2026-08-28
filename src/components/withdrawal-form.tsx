"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/language-provider";
import { WITHDRAWAL_METHODS } from "@/lib/constants";
import { toast } from "sonner";

export function WithdrawalForm({ balance }: { balance: number }) {
  const { t, isAr } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<string>(WITHDRAWAL_METHODS[0].value);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get("amount") as string);

    if (amount < 100) {
      toast.error(`${t("minWithdrawal")}: 100 MAD`);
      setIsLoading(false);
      return;
    }

    if (amount > balance) {
      toast.error(t("insufficientBalance"));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          method,
          accountInfo: formData.get("accountInfo"),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || t("errGeneric"));
        return;
      }

      toast.success(t("withdrawalRequested"));
      router.refresh();
    } catch {
      toast.error(t("serverError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="space-y-2">
        <Label>{t("withdrawalMethod")}</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WITHDRAWAL_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {isAr ? m.labelAr : m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">{t("amount")} (MAD)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="100"
          max={balance}
          step="0.01"
          required
        />
        <p className="text-xs text-muted-foreground">
          {t("minWithdrawal")}: 100 MAD
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="accountInfo">{t("accountInfo")}</Label>
        <Input
          id="accountInfo"
          name="accountInfo"
          placeholder={t("ribOrPhone")}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "..." : t("withdraw")}
      </Button>
    </form>
  );
}
