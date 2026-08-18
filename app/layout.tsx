import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { WhatsAppProvider } from "@/context/WhatsAppContext";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SunuShop - La marketplace sénégalaise",
    template: "%s | SunuShop"
  },
  description: "SunuShop est la marketplace sénégalaise qui connecte les vendeurs et les acheteurs. Vendez sur TikTok, Facebook et WhatsApp avec paiements Wave, Orange Money.",
  keywords: [
    "SunuShop",
    "marketplace Sénégal",
    "social commerce",
    "vente en ligne",
    "Wave Sénégal",
    "Orange Money",
    "TikTok Sénégal",
    "Dakar",
    "e-commerce Afrique",
    "boutique en ligne"
  ],
  authors: [{ name: "SunuShop Team" }],
  creator: "SunuShop",
  publisher: "SunuShop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    title: "SunuShop - La marketplace sénégalaise",
    description: "Vendez et achetez en toute simplicité avec SunuShop. Paiements Wave, Orange Money et livraison express.",
    siteName: "SunuShop",
    url: "https://www.sunu-shop.org",
    images: [
      {
        url: "https://www.sunu-shop.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SunuShop - Marketplace Sénégalaise",
      },
    ],
    locale: "fr_FR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SunuShop - La marketplace sénégalaise",
    description: "Vendez et achetez en toute simplicité avec SunuShop.",
    images: ["https://www.sunu-shop.org/og-image.jpg"],
    creator: "@sunushop",
    site: "@sunushop",
  },
  alternates: {
    canonical: "https://www.sunu-shop.org",
    languages: {
      "fr": "https://www.sunu-shop.org",
      "en": "https://www.sunu-shop.org/en",
    },
  },
  verification: {
    google: "votre_code_verification_google",
    yandex: "votre_code_verification_yandex",
  },
  category: "E-commerce",
  classification: "Marketplace, Social Commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="theme-transition">
        <ThemeProvider>
          <WhatsAppProvider>
            <ParticlesBackground />
            <Navbar />
            <main className="relative z-10 min-h-screen">
              {children}
            </main>
            <ScrollToTop />
            <Footer />
            <Analytics />
            <SpeedInsights />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: "var(--card)",
                  color: "var(--text)",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-lg)",
                  border: "1px solid var(--border)",
                },
              }}
            />
          </WhatsAppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
