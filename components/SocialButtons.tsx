"use client";

import { useState } from "react";
import { socialShareService } from "@/lib/social/social-share";

interface SocialButtonsProps {
  product: {
    title: string;
    price: number;
    imageUrl: string;
    productUrl: string;
    description?: string;
  };
}

export default function SocialButtons({ product }: SocialButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const platforms = [
    { key: "tiktok", label: "TikTok", icon: "🎵", color: "bg-black" },
    { key: "whatsapp", label: "WhatsApp", icon: "💬", color: "bg-green-600" },
    { key: "twitter", label: "X", icon: "🐦", color: "bg-sky-600" },
    { key: "instagram", label: "Instagram", icon: "📸", color: "bg-pink-600" },
    { key: "facebook", label: "Facebook", icon: "📘", color: "bg-blue-700" },
  ];

  const handleShare = (platform: string) => {
    setLoading(true);

    const data = {
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      description: product.description || "",
    };

    try {
      let result;
      switch (platform) {
        case "tiktok":
          result = socialShareService.shareTikTok(data);
          break;
        case "whatsapp":
          result = socialShareService.shareWhatsApp(data);
          break;
        case "twitter":
          result = socialShareService.shareTwitter(data);
          break;
        case "instagram":
          result = socialShareService.shareInstagram(data);
          break;
        case "facebook":
          result = socialShareService.shareFacebook(data);
          break;
        default:
          return;
      }

      setResults({ ...results, [platform]: result });
    } catch (error) {
      console.error("Erreur partage:", error);
    } finally {
      setLoading(false);
    }
  };

  const shareAll = () => {
    setLoading(true);

    const data = {
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      description: product.description || "",
    };

    const allResults = socialShareService.shareAll(data);
    setResults(allResults);
    setLoading(false);
  };

  const links = socialShareService.generateAllLinks({
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
    productUrl: product.productUrl,
    description: product.description || "",
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {platforms.map(({ key, label, icon, color }) => (
          <button
            key={key}
            onClick={() => handleShare(key)}
            disabled={loading}
            className={`${color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 text-sm font-medium disabled:opacity-50`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={shareAll}
        disabled={loading}
        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
      >
        {loading ? "⏳ Partage en cours..." : "📤 Partager sur tous les réseaux"}
      </button>

      {results && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm">
          <p className="font-medium text-gray-700 dark:text-gray-300">✅ Liens générés :</p>
          <div className="space-y-1">
            {Object.entries(links).map(([platform, url]) => (
              <div key={platform} className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase w-20">{platform}</span>
                <button
                  onClick={() => window.open(url, "_blank")}
                  className="text-blue-600 dark:text-blue-400 hover:underline truncate text-xs"
                >
                  {url.slice(0, 50)}...
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(url)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  📋
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
