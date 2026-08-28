"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, Shield, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";

export default function HomePage() {
  const { t, isAr } = useLanguage();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: TrendingUp,
      title: t("growSales"),
      description: "Augmentez vos ventes grâce à un réseau d'affiliés motivés.",
    },
    {
      icon: Wallet,
      title: t("myEarnings"),
      description: "Gagnez des commissions sur chaque vente générée.",
    },
    {
      icon: Shield,
      title: t("trust"),
      description: "Tracking fiable, paiements sécurisés et support local.",
    },
  ];

  const steps = [
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
  ];

  const testimonials = [
    {
      name: "Khadija B.",
      role: t("enterprise"),
      text: "AffiliMaroc nous a permis d'augmenter nos ventes en ligne de 40% en 3 mois.",
    },
    {
      name: "Youssef A.",
      role: t("affiliate"),
      text: "Je touche mes commissions chaque semaine directement sur mon compte CIH.",
    },
    {
      name: "Fatima Z.",
      role: t("affiliate"),
      text: "La plateforme est simple, les liens se génèrent en un clic, et le support répond en darija.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-morocco-green/10 via-background to-morocco-gold/10 py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-morocco-gold/20 px-4 py-1.5 text-sm font-medium text-morocco-darkGreen mb-6">
                  <Star className="h-4 w-4 fill-morocco-gold text-morocco-gold" />
                  {t("moroccanAffiliation")}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  {t("heroTitle")}
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                  {t("heroSubtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/auth/inscription">
                      {t("cta")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/catalogue">{t("catalog")}</Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border">
                  <Image
                    src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80"
                    alt="Affiliation Maroc"
                    width={800}
                    height={600}
                    className="object-cover w-full h-[400px]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-2xl font-bold">+2 500 affiliés</p>
                    <p className="text-white/80">actifs dans tout le Maroc</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                {t("howItWorks")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une solution complète pour connecter les marques marocaines avec les créateurs de contenu.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="h-12 w-12 rounded-lg bg-morocco-green/10 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-morocco-green" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">
              {t("howItWorks")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.title} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-morocco-gold text-morocco-darkGreen flex items-center justify-center font-bold text-lg mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "500+", label: t("enterprise") },
                { value: "2.5k+", label: t("affiliate") },
                { value: "1M+", label: t("clicks") },
                { value: "5M MAD", label: t("myEarnings") },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-morocco-green">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">
              {t("testimonials")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-morocco-gold text-morocco-gold"
                        />
                      ))}
                    </div>
                    <p className="mb-4 text-muted-foreground">{testimonial.text}</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-morocco-green px-6 py-16 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                {t("heroTitle")}
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                Rejoignez la première plateforme d&apos;affiliation dédiée au marché marocain.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/inscription">{t("cta")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
