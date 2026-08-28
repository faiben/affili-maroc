"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-morocco-green mb-4">
              {t("appName")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("home")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/catalogue">{t("catalog")}</Link>
              </li>
              <li>
                <Link href="/support">{t("support")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("forEnterprises")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/inscription">{t("signUp")}</Link>
              </li>
              <li>
                <Link href="/tableau-de-bord/entreprise">{t("dashboard")}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("forAffiliates")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/inscription">{t("signUp")}</Link>
              </li>
              <li>
                <Link href="/tableau-de-bord/affilie">{t("dashboard")}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {currentYear} {t("appName")}. {t("trust")}
        </div>
      </div>
    </footer>
  );
}
