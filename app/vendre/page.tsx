"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendrePage() {
  const router = useRouter();
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null as File | null,
    imagePreview: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct({ ...product, image: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // 1. Upload de l'image (simulé)
      let imageUrl = "https://via.placeholder.com/400x400/22c55e/ffffff?text=Produit";
      
      // 2. Créer le produit via l'API
      const response = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: "seller_001",
          productName: product.title,
          category: product.category,
          quantity: 10,
          minQuantity: 5,
          price: parseInt(product.price),
          unit: "pièce",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la publication");
      }

      setSuccess(true);
      setProduct({ title: "", description: "", price: "", category: "", image: null, imagePreview: "" });
      
      // Rediriger vers la page du produit après 2 secondes
      setTimeout(() => {
        router.push(`/produit/${data.product.id}`);
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Mode", "Électronique", "Cosmétiques", "Chaussures", "Alimentation", "Maison", "Autres"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">🏪 Vendre un produit</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Publiez votre produit sur SunuShop</p>

          {error && (
            <div className="p-4 mb-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="p-4 mb-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400">
              ✅ Produit publié avec succès ! Redirection en cours...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                📷 Photo du produit
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {product.imagePreview ? (
                    <img src={product.imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-gray-400">📸</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre du produit *
              </label>
              <input
                type="text"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                placeholder="Ex: Sac à dos tendance"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Décrivez votre produit..."
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white resize-none"
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                placeholder="15000"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie *
              </label>
              <select
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "⏳ Publication..." : "📤 Publier le produit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
