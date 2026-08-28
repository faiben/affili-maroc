"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";

const content = {
  fr: {
    title: "Politique de cookies",
    updated: "Dernière mise à jour : 28 août 2026",
    intro:
      "La présente politique décrit les cookies et technologies similaires utilisés par AffiliMaroc, conformément à la Loi n° 09-08 relative à la protection des données à caractère personnel et aux recommandations de la CNDP ainsi qu'aux dispositions du RGPD.",
    sections: [
      {
        title: "1. Qu'est-ce qu'un cookie ?",
        body: "Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de la consultation d'un site. Il permet de reconnaître votre navigateur et de conserver certaines informations pendant votre navigation.",
      },
      {
        title: "2. Les cookies que nous utilisons",
        body: "Nous utilisons des cookies strictement nécessaires au fonctionnement de la plateforme (authentification, session, sécurité), des cookies de préférences (langue, thème) et des cookies de mesure d'audience (statistiques anonymes d'utilisation).",
      },
      {
        title: "3. Cookies essentiels",
        body: "Ces cookies sont indispensables au fonctionnement du site : ils vous permettent de vous connecter, de naviguer entre les sections protégées et de bénéficier des fonctions de base (panier, génération de liens, suivi des commissions). Ils ne peuvent pas être désactivés.",
      },
      {
        title: "4. Cookies de préférences",
        body: "Ces cookies mémorisent vos choix (langue, thème sombre ou clair) afin de personnaliser votre expérience de navigation sur l'ensemble du site.",
      },
      {
        title: "5. Cookies de mesure d'audience",
        body: "Ces cookies nous permettent de comprendre comment les visiteurs utilisent la plateforme (pages visitées, durée de consultation) afin d'améliorer nos services. Les données collectées sont agrégées et anonymisées.",
      },
      {
        title: "6. Gestion de votre consentement",
        body: "Lors de votre première visite, un bandeau vous permet d'accepter ou de refuser les cookies non essentiels. Vous pouvez modifier votre choix à tout moment en supprimant les cookies de votre navigateur. Le refus des cookies non essentiels ne bloque pas l'accès au site.",
      },
      {
        title: "7. Durée de conservation",
        body: "Les cookies sont conservés pour une durée maximale de 13 mois conformément aux recommandations de la CNDP et aux lignes directrices de la CNIL.",
      },
      {
        title: "8. Droit de réclamation",
        body: "Conformément à la Loi 09-08, vous disposez d'un droit de réclamation auprès de la CNDP (cndp.ma) si vous estimez que vos droits ne sont pas respectés.",
      },
    ],
  },
  ar: {
    title: "سياسة الكوكيز",
    updated: "آخر تحديث: 28 غشت 2026",
    intro:
      "هاد السياسة كتصف الكوكيز والتقنيات المشابهة اللي كتستعملها أفيلي ماروك، بناء على القانون 09-08 المتعلق بحماية المعطيات ذات الطابع الشخصي وتوصيات اللجنة الوطنية لمراقبة حماية المعطيات واللائحة العامة لحماية البيانات.",
    sections: [
      {
        title: "1. واش هو الكوكي ؟",
        body: "الكوكي هو ملف نصي صغير كيتحط فجهازك (كمبيوتر، تليفون، طابلون) ملي كتزور موقع. كيسمح بمعرفة المتصفح ديالك والحفاظ على بعض المعلومات أثناء التصفح.",
      },
      {
        title: "2. الكوكيز اللي كيستعملو",
        body: "كنستعملو كوكيز ضرورية للتشغيل ديال المنصة (الدخول، الجلسة، الأمن)، وكوكيز ديال التفضيلات (اللغة، الموضوع)، وكوكيز ديال حساب الإحصائيات (إحصائيات مجهولة للاستعمال).",
      },
      {
        title: "3. الكوكيز الأساسية",
        body: "هاد الكوكيز ضرورية للتشغيل ديال الموقع: كيخلو ليك تدخل، وتنقل بين الأقسام المحمية، وتستفيد من الوظائف الأساسية (توليد الروابط، تتبع العمولات). مايمكنش تعطيلهم.",
      },
      {
        title: "4. كوكيز التفضيلات",
        body: "هاد الكوكيز كيذكرو اختياراتك (اللغة، الموضوع الداكن ولا الفاتح) باش يخصّصو التجربة ديالك فالموقع كامل.",
      },
      {
        title: "5. كوكيز حساب الإحصائيات",
        body: "هاد الكوكيز كيخليونا نفهمو كيفاش الزوار كيستعملو المنصة (الصفحات اللي كيتعاينو، مدة الزيارة) باش نحسّنو الخدمات. المعطيات اللي كيتجمعو كيتجمعو وكيتحيدو منهم الهوية.",
      },
      {
        title: "6. التسيير ديال الموافقة ديالك",
        body: "فالزيارة الأولى، شريط كيسمح ليك تقبل ولا ترفض الكوكيز غير الأساسية. تقدر تبدّل الاختيار فأي وقت بحذف الكوكيز من المتصفح. الرفض ما كيمنعش الولوج للموقع.",
      },
      {
        title: "7. مدة الحفظ",
        body: "الكوكيز كيتحفظو لمدة قصوى ديال 13 شهر حسب توصيات اللجنة الوطنية لمراقبة حماية المعطيات وخطوط التوجيه.",
      },
      {
        title: "8. حق الشكاية",
        body: "بناء على القانون 09-08، عندك حق الشكاية للجنة الوطنية لمراقبة حماية المعطيات (cndp.ma) إلا حسبتي بلي حقوقك ما كيتحترموش.",
      },
    ],
  },
};

export default function CookiesPage() {
  const { isAr } = useLanguage();
  const c = isAr ? content.ar : content.fr;

  return (
    <div className="min-h-screen flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center rounded-full bg-morocco-green/10 p-3 mb-4">
              <Cookie className="h-8 w-8 text-morocco-green" />
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

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isAr ? "شوف كذلك" : "Consultez aussi"}:{" "}
            <Link href="/confidentialite" className="text-morocco-green underline">
              {isAr ? "سياسة الخصوصية" : "Politique de confidentialité"}
            </Link>{" "}
            ·{" "}
            <Link href="/conditions-utilisation" className="text-morocco-green underline">
              {isAr ? "الشروط العامة" : "Conditions générales"}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
