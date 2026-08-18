"use client";

import Link from "next/link";
import { useWhatsApp } from "@/context/WhatsAppContext";
import JsonLd from "@/components/JsonLd";

export default function HomePage() {
  const { isConnected } = useWhatsApp();

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SunuShop",
    "description": "La marketplace sénégalaise qui connecte les vendeurs et les acheteurs.",
    "url": "https://www.sunu-shop.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.sunu-shop.org/recherche?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto animate-fade-up">
              <div className="inline-block bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6 animate-float">
                <span className="text-5xl">🇸🇳</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
                La marketplace qui <br />
                <span className="gradient-text">connecte les vendeurs</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Vendez sur TikTok, Facebook et WhatsApp avec un système organisé.
                Paiements Wave, Orange Money ou à la livraison.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/preinscription"
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  🚀 Rejoindre SunuShop
                </Link>
                <Link
                  href="/vendre"
                  className="btn btn-outline text-lg px-8 py-4"
                >
                  📤 Vendre maintenant
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {isConnected ? "WhatsApp connecté" : "WhatsApp en ligne"}
                </span>
                <span>•</span>
                <span>💰 Wave & Orange Money</span>
                <span>•</span>
                <span>🚚 Livraison express</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">100+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Vendeurs actifs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">1000+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Commandes traitées</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">50M+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">FCFA de ventes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
              Pourquoi choisir SunuShop ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "📱",
                  title: "Vendez partout",
                  description: "Partagez vos produits sur TikTok, Facebook, Instagram et WhatsApp en un clic."
                },
                {
                  icon: "💰",
                  title: "Paiements locaux",
                  description: "Wave, Orange Money et paiement à la livraison. 100% adapté au Sénégal."
                },
                {
                  icon: "🚚",
                  title: "Livraison automatique",
                  description: "Suivez vos commandes en temps réel avec nos livreurs partenaires."
                },
                {
                  icon: "💬",
                  title: "WhatsApp intégré",
                  description: "Discutez directement avec vos clients. Factures, confirmation, promotions."
                },
                {
                  icon: "📊",
                  title: "Statistiques avancées",
                  description: "Suivez vos ventes, vos commissions et vos performances en temps réel."
                },
                {
                  icon: "🤖",
                  title: "IA intégrée",
                  description: "Réponses automatiques, descriptions de produits et publicités générées par IA."
                }
              ].map((feature, index) => (
                <div key={index} className="card p-6 text-center hover:scale-105 transition-transform">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à rejoindre SunuShop ?
            </h2>
            <p className="text-green-100 mb-8">
              Rejoignez la marketplace qui connecte les vendeurs et les acheteurs.
            </p>
            <Link
              href="/preinscription"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition inline-flex items-center gap-2"
            >
              🚀 Commencer maintenant
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
