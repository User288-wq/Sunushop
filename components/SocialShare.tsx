"use client";

import { useState } from "react";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string;
  productUrl: string;
  category?: string;
}

export default function SocialShare({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "facebook",
    "instagram",
    "whatsapp",
  ]);

  const handleShare = async (platform?: string) => {
    setLoading(true);
    setResults(null);

    const platforms = platform ? [platform] : selectedPlatforms;

    try {
      const res = await fetch("/api/social/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            title: product.title,
            description: product.description || "Découvrez ce produit sur SunuShop !",
            price: product.price,
            imageUrl: product.imageUrl,
            productUrl: product.productUrl,
            category: product.category || "Général",
          },
          platforms,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResults(data);
      } else {
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const openShareLink = (url: string) => {
    window.open(url, "_blank");
  };

  const platformIcons: Record<string, string> = {
    facebook: "📘",
    instagram: "📸",
    whatsapp: "💬",
    twitter: "🐦",
  };

  const platformColors: Record<string, string> = {
    facebook: "bg-blue-600 hover:bg-blue-700",
    instagram: "bg-pink-600 hover:bg-pink-700",
    whatsapp: "bg-green-600 hover:bg-green-700",
    twitter: "bg-sky-600 hover:bg-sky-700",
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📱 Partager sur les réseaux</h3>

      {/* Sélection des plateformes */}
      <div className="flex gap-3 flex-wrap mb-4">
        {["facebook", "instagram", "whatsapp", "twitter"].map((platform) => (
          <button
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={`px-3 py-1 rounded-full text-sm transition ${
              selectedPlatforms.includes(platform)
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {platformIcons[platform]} {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>
        ))}
      </div>

      {/* Boutons de partage */}
      <div className="flex gap-3 flex-wrap mb-4">
        <button
          onClick={() => handleShare()}
          disabled={loading || selectedPlatforms.length === 0}
          className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 ${
            (loading || selectedPlatforms.length === 0) && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "⏳ Partage..." : "📤 Partager maintenant"}
        </button>

        {results?.links && (
          <>
            {results.links.facebook && (
              <button
                onClick={() => openShareLink(results.links.facebook)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                📘 Facebook
              </button>
            )}
            {results.links.whatsapp && (
              <button
                onClick={() => openShareLink(results.links.whatsapp)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                💬 WhatsApp
              </button>
            )}
            {results.links.twitter && (
              <button
                onClick={() => openShareLink(results.links.twitter)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
              >
                🐦 Twitter
              </button>
            )}
          </>
        )}
      </div>

      {/* Résultats */}
      {results && (
        <div className="space-y-3">
          {/* Facebook */}
          {results.results?.facebook && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">📘 Facebook</span>
                <span className="text-sm text-blue-600">✅ Publié</span>
              </div>
              {results.results.facebook.share_url && (
                <button
                  onClick={() => openShareLink(results.results.facebook.share_url)}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  Voir le post
                </button>
              )}
            </div>
          )}

          {/* Instagram */}
          {results.results?.instagram && (
            <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-pink-700">📸 Instagram</span>
                <span className="text-sm text-pink-600">✅ Publié</span>
              </div>
              {results.results.instagram.share_url && (
                <button
                  onClick={() => openShareLink(results.results.instagram.share_url)}
                  className="text-sm text-pink-600 hover:underline mt-1"
                >
                  Voir le post
                </button>
              )}
            </div>
          )}

          {/* État des pages */}
          {results.pages && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700">🔗 Connexions</p>
              <div className="flex gap-4 mt-1">
                <span className={`text-sm ${results.pages.facebook ? "text-green-600" : "text-red-600"}`}>
                  Facebook: {results.pages.facebook ? "✅" : "❌"}
                </span>
                <span className={`text-sm ${results.pages.instagram ? "text-green-600" : "text-red-600"}`}>
                  Instagram: {results.pages.instagram ? "✅" : "❌"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
