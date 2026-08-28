import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: {
    default: "AffiliMaroc - Plateforme d'affiliation au Maroc",
    template: "%s | AffiliMaroc",
  },
  description:
    "Plateforme d'affiliation marketing indépendante pour entreprises et influenceurs marocains. Commissions en MAD, retrait vers les banques et mobiles money marocains.",
  keywords: [
    "affiliation",
    "Maroc",
    "influenceurs",
    "marketing",
    "commission",
    "MAD",
    "entreprises marocaines",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://affilimaroc.ma",
    title: "AffiliMaroc",
    description: "La plateforme d'affiliation 100% marocaine",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${tajawal.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
