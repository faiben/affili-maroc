"use client";

import * as React from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

const STORAGE_KEY = "affili-cookie-consent";

export function CookieConsentBanner() {
  const { isAr } = useLanguage();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const choose = (value: "accepted" | "refused") => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-4 z-50 sm:max-w-md">
      <div className="rounded-lg border bg-card text-card-foreground shadow-lg p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-morocco-green/10 p-2 shrink-0">
            <Cookie className="h-5 w-5 text-morocco-green" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-1">
                {isAr
                  ? "الموقع كيستعمل الكوكيز"
                  : "Ce site utilise des cookies"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isAr
                  ? "كنستعملو الكوكيز باش نضمنو الخدمة ونحسّنوها حسب القانون 09-08. تقدر تقبل ولا ترفض."
                  : "Nous utilisons des cookies pour assurer et améliorer le fonctionnement du site, conformément à la Loi 09-08. Vous pouvez accepter ou refuser."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => choose("accepted")}>
                {isAr ? "اقبل" : "Accepter"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => choose("refused")}
              >
                {isAr ? "رفض" : "Refuser"}
              </Button>
              <Link
                href="/cookies"
                className="text-sm text-morocco-green underline self-center"
              >
                {isAr ? "سياسة الكوكيز" : "Politique de cookies"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
