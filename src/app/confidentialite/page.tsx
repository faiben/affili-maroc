"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const content = {
  fr: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 28 août 2026",
    intro:
      "Conformément à la Loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et au Règlement Général sur la Protection des Données (RGPD), ainsi qu'aux délibérations de la Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP), la présente politique décrit comment AffiliMaroc collecte, utilise et protège vos données personnelles.",
    sections: [
      {
        title: "1. Responsable du traitement",
        body: "AffiliMaroc est le responsable du traitement des données à caractère personnel collectées sur la plateforme. Toute question relative au traitement de vos données peut être adressée à l'adresse suivante : support@affilimaroc.ma",
      },
      {
        title: "2. Données collectées",
        body: "Nous collectons les données strictement nécessaires au fonctionnement de la plateforme : nom complet, adresse email, nom de la société, CIN, coordonnées bancaires ou de mobile money, informations de connexion (adresse IP, type d'appareil) et données de navigation et d'utilisation de la plateforme.",
      },
      {
        title: "3. Finalités du traitement",
        body: "Vos données sont traitées pour : la création et la gestion de votre compte, la génération et le suivi des liens d'affiliation, le calcul et le versement des commissions, la vérification de votre identité, la lutte contre la fraude et le respect de nos obligations légales, ainsi que pour l'amélioration de nos services.",
      },
      {
        title: "4. Base légale",
        body: "Le traitement de vos données repose sur votre consentement explicite, l'exécution du contrat d'affiliation qui vous lie à la plateforme, le respect de nos obligations légales et réglementaires, ainsi que notre intérêt légitime à sécuriser et améliorer nos services.",
      },
      {
        title: "5. Durée de conservation",
        body: "Vos données sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et au maximum pendant la durée légale de prescription en vigueur au Maroc. Les données relatives à vos transactions financières sont conservées conformément aux obligations comptables et fiscales.",
      },
      {
        title: "6. Destinataires et sous-traitants",
        body: "Vos données sont accessibles uniquement au personnel habilité d'AffiliMaroc et, le cas échéant, à nos sous-traitants techniques (hébergement, paiement, messagerie) qui présentent des garanties suffisantes. Elles ne sont jamais vendues à des tiers.",
      },
      {
        title: "7. Sécurité des données",
        body: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation : chiffrement, contrôle d'accès, sauvegardes régulières et sensibilisation de notre personnel.",
      },
      {
        title: "8. Vos droits",
        body: "Conformément à la Loi 09-08 et au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition sur vos données. Vous pouvez retirer votre consentement à tout moment. Pour exercer ces droits, contactez-nous à support@affilimaroc.ma. Vous disposez également du droit d'introduire une réclamation auprès de la CNDP.",
      },
      {
        title: "9. Transferts de données",
        body: "Vos données sont hébergées sur des serveurs situés au Maroc ou dans l'Union européenne. En cas de transfert hors de ces zones, celui-ci s'effectue conformément aux garanties appropriées prévues par la réglementation applicable.",
      },
      {
        title: "10. Cookies",
        body: "Notre plateforme utilise des cookies et technologies similaires pour assurer son fonctionnement et mesurer son audience. Pour en savoir plus, consultez notre Politique de cookies.",
      },
      {
        title: "11. Modifications",
        body: "La présente politique peut être actualisée à tout moment. La version applicable est celle en vigueur lors de votre utilisation de la plateforme. Nous vous informerons de toute modification substantielle.",
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 28 غشت 2026",
    intro:
      "بناء على القانون رقم 09-08 المتعلق بحماية الأشخاص الطبيعيين فيما يخص معالجة المعطيات ذات الطابع الشخصي، واللائحة العامة لحماية البيانات، ومقررات اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي، تصف هذه السياسة كيف كتجمع أفيلي ماروك، كتستعمل وكتحمي المعطيات الشخصية ديالك.",
    sections: [
      {
        title: "1. المسؤول عن المعالجة",
        body: "أفيلي ماروك هي المسؤولة عن معالجة المعطيات الشخصية اللي كيتجمعو فالبليتفورم. أي سؤال متعلق بمعالجة المعطيات ديالك تصيفطو لـ support@affilimaroc.ma",
      },
      {
        title: "2. المعطيات اللي كيتجمعو",
        body: "كنجمعو غير المعطيات الضرورية لخدمة المنصة: السمية الكاملة، الإيميل، سمية الشركة، ر.ب.و، المعلومات البنكية ولا ديال المحافظ الإلكترونية، معلومات الاتصال (IP، نوع الجهاز) ومعطيات التصفح والاستعمال.",
      },
      {
        title: "3. أغراض المعالجة",
        body: "المعطيات ديالك كتستعمل لـ: الخلق والإدارة ديال الكمبو ديالك، التسيغ والمتابعة ديال روابط الأفلييشن، حساب وصرف العمولات، التحقق من الهوية، مكافحة الغش واحترام الالتزامات القانونية، وكذلك تحسين الخدمات ديالنا.",
      },
      {
        title: "4. الأساس القانوني",
        body: "معالجة المعطيات كتعتمد على الموافقة الصريحة ديالك، وتنفيذ عقد الأفلييشن، واحترام الالتزامات القانونية والتنظيمية، والمصلحة المشروعة ديالنا فحماية وتحسين الخدمات.",
      },
      {
        title: "5. مدة الحفظ",
        body: "المعطيات كتحفظ غير للمدة اللازمة للأغراض اللي تجمعات من أجلها، وحد أقصى للمدة القانونية ديال التقادم. المعطيات المتعلقة بالمعاملات المالية كتحفظ حسب الالتزامات المحاسبية والجبائية.",
      },
      {
        title: "6. المستفيدون والمتعهدون",
        body: "المعطيات كيكونو متاحين غير للموظفين المؤهلين ديال أفيلي ماروك، ومتى اقتضى الأمر، للمتعهدين التقنيين (الاستضافة، الدفع، البريد) اللي عندهم ضمانات كافية. المعطيات ماكيتعابوش حتى لطرف ثالث.",
      },
      {
        title: "7. أمن المعطيات",
        body: "كنطبّقو إجراءات تقنية وتنظيمية مناسبة لحماية المعطيات من أي ولوج غير مصرح به، ضياع، تغيير ولا كشف: التشفير، التحكم فالمسار، النسخ الاحتياطي المنتظم وتوعية الموظفين.",
      },
      {
        title: "8. الحقوق ديالك",
        body: "بناء على القانون 09-08 واللائحة العامة، عندك الحق فالمعاينة، التصحيح، الحذف، التحديد، النقل والاعتراض على المعطيات. تقدر تسحب الموافقة فأي وقت. باش تمارس هاد الحقوق، تصيفط لنا على support@affilimaroc.ma. وعندك الحق فتقديم شكاية للجنة الوطنية لمراقبة حماية المعطيات.",
      },
      {
        title: "9. نقل المعطيات",
        body: "المعطيات كتستضاف فخوادم فالمغرب ولا فالاقتصاد الأوروبي. فحالة النقل لبرا، كيتم بالضمانات المناسبة اللي كتفرضها القوانين المعمول بها.",
      },
      {
        title: "10. الكوكيز",
        body: "البليتفورم كتستعمل الكوكيز وتقنيات مشابهة باش تضمن الخدمة وكتحسب الجمهور. باش تعرف أكثر، شوف سياسة الكوكيز ديالنا.",
      },
      {
        title: "11. التعديلات",
        body: "هاد السياسة يمكن تتحدث فأي وقت. النسخة المعمول بها هي اللي سارية وقت الاستعمال. غادي نعرفوك بأي تعديل مهم.",
      },
    ],
  },
};

export default function ConfidentialitePage() {
  const { isAr } = useLanguage();
  const c = isAr ? content.ar : content.fr;

  return (
    <div className="min-h-screen flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center rounded-full bg-morocco-green/10 p-3 mb-4">
              <Shield className="h-8 w-8 text-morocco-green" />
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
