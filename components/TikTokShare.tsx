"use client";

import { useState } from "react";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string;
  productUrl: string;
}

export default function TikTokShare({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tiktok/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          productUrl: product.productUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📱 Partager sur TikTok</h3>

      <div className="flex gap-3 mb-4 flex-wrap">
        <button
          onClick={handleShare}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
        >
          {loading ? "⏳ Chargement..." : "📤 Partager sur TikTok"}
        </button>

        {result?.shareLinks && (
          <>
            <button
              onClick={() => window.open(result.shareLinks.tiktok, "_blank")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🌐 Ouvrir TikTok
            </button>
            <button
              onClick={() => window.open(result.shareLinks.whatsapp, "_blank")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              💬 WhatsApp
            </button>
          </>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          {/* Lien de partage */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">🔗 Lien de partage</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={result.shareLinks?.copy || ""}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
              <button
                onClick={() => copyToClipboard(result.shareLinks?.copy || "")}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition"
              >
                {copied ? "✅" : "📋 Copier"}
              </button>
            </div>
          </div>

          {/* Script vidéo */}
          {result.script && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">📝 Script TikTok</p>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                {result.script}
              </pre>
            </div>
          )}

          {/* Hashtags suggérés */}
          {result.hashtags && result.hashtags.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">🏷️ Hashtags suggérés</p>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tendances */}
          {result.trends && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">🔥 Tendances TikTok</p>
              <div className="flex flex-wrap gap-2">
                {result.trends.hashtags.slice(0, 5).map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
