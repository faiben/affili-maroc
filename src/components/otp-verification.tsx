"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/components/language-provider";
import { toast } from "sonner";

export function OtpVerification({
  email,
  verified,
}: {
  email: string | null;
  verified: boolean;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoUrl, setDemoUrl] = useState<string | null>(null);

  async function sendVerificationEmail() {
    setIsLoading(true);
    setDemoUrl(null);

    try {
      const res = await fetch("/api/verification/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || t("sendError"));
        return;
      }

      if (data.demoUrl) {
        setDemoUrl(data.demoUrl);
        toast.success(t("emailDemoLink"));
      } else {
        toast.success(t("emailVerificationSent"));
      }
    } catch {
      toast.error(t("connectionError"));
    } finally {
      setIsLoading(false);
    }
  }

  if (verified || !email) {
    return (
      <Button variant="outline" disabled>
        {verified ? t("verified") : t("noEmail")}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("verifyEmail")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("emailVerification")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("emailVerificationInfo")} {email}
          </p>

          {demoUrl && (
            <div className="rounded-md bg-muted p-3 space-y-2">
              <p className="text-sm font-medium">{t("emailDemoLink")}</p>
              <a
                href={demoUrl}
                className="block text-sm break-all text-primary hover:underline"
              >
                {demoUrl}
              </a>
              <Button size="sm" asChild className="w-full">
                <a href={demoUrl}>{t("verifyEmail")}</a>
              </Button>
            </div>
          )}

          <Button
            onClick={sendVerificationEmail}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "..." : t("sendVerificationEmail")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
