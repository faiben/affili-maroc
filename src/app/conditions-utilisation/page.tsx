"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const content = {
  fr: {
    title: "Conditions générales d'utilisation",
    updated: "Dernière mise à jour : 28 août 2026",
    intro:
      "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme AffiliMaroc. En vous inscrivant et en utilisant la plateforme, vous acceptez sans réserve les présentes conditions. Veuillez les lire attentivement.",
    sections: [
      {
        title: "1. Objet",
        body: "AffiliMaroc est une plateforme d'affiliation marketing qui met en relation des entreprises (Annonceurs) et des affiliés (Éditeurs) afin de promouvoir des produits et services contre rémunération à la commission.",
      },
      {
        title: "2. Acceptation des conditions",
        body: "La création d'un compte et l'utilisation de la plateforme impliquent l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la plateforme.",
      },
      {
        title: "3. Création de compte",
        body: "Vous devez disposer de la capacité juridique pour contracter et fournir des informations exactes, à jour et complètes lors de votre inscription. Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités réalisées depuis votre compte.",
      },
      {
        title: "4. Obligations des entreprises",
        body: "Les entreprises s'engagent à fournir des informations véridiques sur leurs produits, à respecter la législation en vigueur (notamment la Loi 09-08 sur la protection des données), à valider avec diligence les conversions déclarées et à payer les commissions dues aux affiliés.",
      },
      {
        title: "5. Obligations des affiliés",
        body: "Les affiliés s'engagent à promouvoir les produits conformément aux règles définies par l'entreprise, à ne pas adopter de pratiques frauduleuses (leads invalides, auto-référencement abusif, spam) et à respecter les règles de bonne conduite sur les canaux de promotion.",
      },
      {
        title: "6. Commissions et paiements",
        body: "Les commissions sont calculées selon les paramètres définis par l'entreprise (pourcentage ou montant fixe). Une conversion est considérée comme valide selon les conditions de suivi appliquées, notamment la durée de validité du cookie. Les paiements sont effectués après validation selon les modalités de retrait disponibles sur la plateforme.",
      },
      {
        title: "7. Propriété intellectuelle",
        body: "Le contenu de la plateforme (logo, textes, interface) est protégé par le droit de la propriété intellectuelle. Les supports marketing mis à disposition des affiliés peuvent être utilisés dans le cadre strict de la promotion des produits concernés.",
      },
      {
        title: "8. Responsabilité",
        body: "La plateforme est fournie « en l'état ». AffiliMaroc ne saurait être tenue responsable des dommages indirects résultant de l'utilisation de la plateforme. Chaque partie demeure responsable du contenu qu'elle publie et des conséquences de ses actions.",
      },
      {
        title: "9. Suspension et résiliation",
        body: "AffiliMaroc se réserve le droit de suspendre ou de résilier tout compte en cas de manquement aux présentes conditions, de fraude constatée ou de comportement préjudiciable à la plateforme ou à ses utilisateurs.",
      },
      {
        title: "10. Données personnelles",
        body: "Le traitement des données personnelles est régi par notre Politique de confidentialité, conforme à la Loi 09-08 et au RGPD.",
      },
      {
        title: "11. Droit applicable et litiges",
        body: "Les présentes CGU sont soumises au droit marocain. En cas de litige, les parties s'efforceront de trouver une solution amiable avant toute action judiciaire. À défaut, le litige sera porté devant les tribunaux compétents de Casablanca.",
      },
    ],
  },
  ar: {
    title: "الشروط العامة للاستعمال",
    updated: "آخر تحديث: 28 غشت 2026",
    intro:
      "هاد الشروط العامة للاستعمال كتحكم الولوج والاستعمال ديال بليتفورم أفيلي ماروك. فالتسجيل والاستعمال ديال المنصة، كتقبل بلا شرط هاد الشروط. أرجوك قرى بينا.",
    sections: [
      {
        title: "1. الهدف",
        body: "أفيلي ماروك هي منصة أفلييشن كتربط الشركات (المعلنين) والأفلييات (الناشرين) باش يروّجو المنتوجات والخدمات مقابل عمولة.",
      },
      {
        title: "2. قبول الشروط",
        body: "خلق الكمبو والاستعمال ديال المنصة كيعني القبول الكامل ديال هاد الشروط. إلا ماكنتيش موافق، ما خصكش تستعمل المنصة.",
      },
      {
        title: "3. خلق الكمبو",
        body: "لازم تكون عندك القدرة القانونية على التعاقد وتقدم معلومات دقيقة، حديثة وكاملة فالتسجيل. نتا مسؤول على سرية المعلومات ديال الدخول وعلى كل العمليات اللي كيتدارو من الكمبو ديالك.",
      },
      {
        title: "4. التزامات الشركات",
        body: "الشركات كيتلزمو بجمع معلومات حقيقية على المنتوجات، واحترام القوانين المعمول بها (خاصة القانون 09-08)، والموافقة بدقة على التحويلات، ودفع العمولات المستحقة للأفلييات.",
      },
      {
        title: "5. التزامات الأفلييات",
        body: "الأفلييات كيتلزمو بترويج المنتوجات حسب القواعد اللي كتحدد الشركة، وعدم استعمال أساليب احتيالية (روابط كيدية، ترويج ذاتي، سبام)، واحترام قواعد السلوك الجيد فقنوات الترويج.",
      },
      {
        title: "6. العمولات والدفعات",
        body: "العمولات كتحسب حسب الإعدادات اللي كتحدد الشركة (نسبة ولا مبلغ ثابت). التحويل كيتعتابر صحيح حسب شروط التتبع المطبقة، خاصة مدة صلاحية الكوكي. الدفعات كيتمو بعد الموافقة حسب طرق السحب المتاحة فالمنصة.",
      },
      {
        title: "7. الملكية الفكرية",
        body: "المحتوى ديال المنصة (اللوڭو، النصوص، الواجهة) محمي بقانون الملكية الفكرية. وسائل التسويق اللي كتقدم للأفلييات يمكن استعمالها غير فإطار الترويج للمنتوجات المعنية.",
      },
      {
        title: "8. المسؤولية",
        body: "المنصة كتقدم « كما هي ». أفيلي ماروك ما كتكونش مسؤولة على الأضرار غير المباشرة الناتجة على الاستعمال. كل طرف مسؤول على المحتوى اللي كينشر والعواقب ديال أفعاله.",
      },
      {
        title: "9. التعليق والإنهاء",
        body: "أفيلي ماروك كتحتفظ بحق تعليق ولا إلغاء أي كمبو فحالة الإخلال بهاد الشروط، ولا الغش المثبت، ولا السلوك الضار بالمنصة ولا بالمستعملين.",
      },
      {
        title: "10. المعطيات الشخصية",
        body: "معالجة المعطيات الشخصية كتخضع لسياسة الخصوصية ديالنا، اللي كتوافق القانون 09-08 واللائحة العامة لحماية البيانات.",
      },
      {
        title: "11. القانون المطبق والمنازعات",
        body: "هاد الشروط كتخضع للقانون المغربي. فحالة نزاع، الأطراف غادي يحاولو يلقاو حل ودي قبل أي إجراء قضائي. إلا ما نجحوش، النزاع كيتعرض على المحاكم المختصة فمدينة الدار البيضاء.",
      },
    ],
  },
};

export default function ConditionsPage() {
  const { isAr } = useLanguage();
  const c = isAr ? content.ar : content.fr;

  return (
    <div className="min-h-screen flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center rounded-full bg-morocco-green/10 p-3 mb-4">
              <FileText className="h-8 w-8 text-morocco-green" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
            <p className="text-sm text-muted-foreground">{c.updated}</p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">{c.intro}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {c.sections.map((section, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg text-morocco-green">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">
                  {section.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
