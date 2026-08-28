"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/products/product-service";

export default function AjouterProduitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState({
    sellerId: "",
    sellerName: "",
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    unit: "pièce",
    discount: "",
    tags: "",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("dimensions.")) {
      const dim = name.split(".")[1];
      setProduct(prev => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dim]: value }
      }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("📤 [FORM] Début de la soumission");
    console.log("📦 [FORM] Données:", JSON.stringify(product, null, 2));
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const required = ['sellerId', 'sellerName', 'title', 'description', 'price', 'category', 'stock'];
      for (const field of required) {
        if (!product[field as keyof typeof product]) {
          setError(`Le champ ${field} est obligatoire`);
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
          discount: product.discount ? parseFloat(product.discount) : undefined,
          tags: product.tags.split(",").map(t => t.trim()).filter(Boolean),
          weight: product.weight ? parseFloat(product.weight) : undefined,
          images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création");
      }

      setSuccess(true);
      setProduct({
        sellerId: "",
        sellerName: "",
        title: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        unit: "pièce",
        discount: "",
        tags: "",
        weight: "",
        dimensions: { length: "", width: "", height: "" },
      });
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => {
        router.push("/vendeur/produits");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📤 Ajouter un produit</h1>
            <p className="text-gray-600 dark:text-gray-400">Remplissez les informations ci-dessous pour publier votre produit</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            ← Retour
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400 animate-fade-in">
            ✅ Produit créé avec succès ! Redirection...
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Vendeur *</label>
              <input type="text" name="sellerId" value={product.sellerId} onChange={handleChange} placeholder="ex: seller_001" className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du vendeur *</label>
              <input type="text" name="sellerName" value={product.sellerName} onChange={handleChange} placeholder="ex: Moussa Diouf" className="input" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre du produit *</label>
            <input type="text" name="title" value={product.title} onChange={handleChange} placeholder="ex: Sac à dos en cuir" className="input" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
            <textarea name="description" value={product.description} onChange={handleChange} placeholder="Décrivez votre produit en détail..." rows={4} className="input resize-none" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix (FCFA) *</label>
              <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="15000" className="input" required min="0" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantité en stock *</label>
              <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="10" className="input" required min="0" step="1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie *</label>
              <select name="category" value={product.category} onChange={handleChange} className="input" required>
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unité</label>
              <input type="text" name="unit" value={product.unit} onChange={handleChange} placeholder="pièce, kg, litre..." className="input" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Réduction (%)</label>
              <input type="number" name="discount" value={product.discount} onChange={handleChange} placeholder="10" className="input" min="0" max="100" step="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poids (kg)</label>
              <input type="number" name="weight" value={product.weight} onChange={handleChange} placeholder="1.5" className="input" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (séparés par des virgules)</label>
              <input type="text" name="tags" value={product.tags} onChange={handleChange} placeholder="cadeau, mode, tendance" className="input" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longueur (cm)</label>
              <input type="number" name="dimensions.length" value={product.dimensions.length} onChange={handleChange} placeholder="30" className="input" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Largeur (cm)</label>
              <input type="number" name="dimensions.width" value={product.dimensions.width} onChange={handleChange} placeholder="20" className="input" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hauteur (cm)</label>
              <input type="number" name="dimensions.height" value={product.dimensions.height} onChange={handleChange} placeholder="10" className="input" step="0.1" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Images du produit</label>
            <div className="flex items-center gap-4">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition">📁 Choisir des images</label>
              <span className="text-sm text-gray-500">{images.length} image(s) sélectionnée(s)</span>
            </div>
            {images.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Image ${index + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium">
              {loading ? "⏳ Publication..." : "📤 Publier le produit"}
            </button>
            <button type="reset" onClick={() => { setProduct({ sellerId: "", sellerName: "", title: "", description: "", price: "", category: "", stock: "", unit: "pièce", discount: "", tags: "", weight: "", dimensions: { length: "", width: "", height: "" } }); setImages([]); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              🗑️ Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

