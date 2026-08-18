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
  description: "SunuShop est la marketplace sénégalaise qui connecte les vendeurs et les acheteurs.",
  keywords: "SunuShop, marketplace Sénégal, social commerce, vente en ligne, Wave, Orange Money",
  openGraph: {
    type: "website",
    title: "SunuShop - La marketplace sénégalaise",
    description: "Vendez et achetez en toute simplicité avec SunuShop.",
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
  },
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
