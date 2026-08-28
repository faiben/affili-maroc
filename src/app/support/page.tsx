"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";

export default function SupportPage() {
  const { t, isAr } = useLanguage();

  const faqs = isAr
    ? [
        {
          question: "كيفاش خدام AffiliMaroc ؟",
          answer:
            "الشركات كيزيدو المنتوجات ديالهم بالعمولة. الأفيليات كيديرو روابط خاصة بهم، كيبارطاجيوها و كيربحو عمولة على كل بيعة تتصادقات.",
        },
        {
          question: "شحال كياخد الوقت باش تتصادق العمولة ؟",
          answer:
            "العمولات كيتصادقو يدويا من طرف الشركة ولا أوتوماتيكيا حسب الإعدادات. الخلاص كيتم من بعد مدة ديال 14 ل 30 يوم.",
        },
        {
          question: "كيفاش نقدر نسحب الفلوس ديالي ؟",
          answer:
            "تقدر تطلب السحب ملي الرصيد ديالك يوصل 100 درهم، عبر بنك المغرب، CIH، التجاري وفا بنك، كاش بلوس، وفاكاش، إنوي موني ولا أورنج موني.",
        },
        {
          question: "واش المنصة غير للمغرب ؟",
          answer:
            "أيه، AffiliMaroc مصممة خصيصا للسوق المغربي، بالخلاص بالدرهم و الدعم بالفرنسية و الدارجة.",
        },
      ]
    : [
        {
          question: "Comment fonctionne AffiliMaroc ?",
          answer:
            "Les entreprises ajoutent leurs produits avec une commission. Les affiliés génèrent des liens uniques, les partagent et gagnent une commission sur chaque vente validée.",
        },
        {
          question: "Quel est le délai de validation des commissions ?",
          answer:
            "Les commissions sont validées manuellement par l'entreprise ou automatiquement selon les paramètres. Le paiement intervient après un délai de 14 à 30 jours.",
        },
        {
          question: "Comment retirer mes gains ?",
          answer:
            "Vous pouvez demander un retrait dès que votre solde atteint 100 MAD vers Bank Al-Maghrib, CIH, Attijariwafa, Cash Plus, Wafacash, Inwi Money ou Orange Money.",
        },
        {
          question: "La plateforme est-elle réservée au Maroc ?",
          answer:
            "Oui, AffiliMaroc est spécialement conçue pour le marché marocain avec des paiements en MAD et un support en français et darija.",
        },
      ];

  return (
    <div className="min-h-screen flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">{t("support")}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isAr
                ? "لقا الأجوبة على الأسئلة اللي كيتسولو بزاف ولا تواصل مع الفريق ديالنا."
                : "Trouvez les réponses aux questions fréquentes ou contactez notre équipe."}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-morocco-green" />
                    {t("faq")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-morocco-green" />
                    {isAr ? "تواصل معنا" : "Contact"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-morocco-gold" />
                    <span>support@affilimaroc.ma</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-morocco-gold" />
                    <span>+212 5XX-XXXXXX</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isAr
                      ? "متوفرين من التنين للجمعة، من 9 صباحا حتى 6 عشية."
                      : "Disponible du lundi au vendredi, de 9h à 18h."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
