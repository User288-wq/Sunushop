"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  unit: string;
  isActive: boolean;
}

export default function VendrePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");

  const categories = [
    { id: "tous", label: "Toutes" },
    { id: "mode", label: "👗 Mode" },
    { id: "electronique", label: "💻 Électronique" },
    { id: "cosmetiques", label: "💄 Cosmétiques" },
    { id: "chaussures", label: "👟 Chaussures" },
    { id: "alimentation", label: "🍲 Alimentation" },
    { id: "maison", label: "🏠 Maison & Déco" },
    { id: "sport", label: "🏋️ Sport" },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        const activeProducts = data.products.filter((p: Product) => p.isActive !== false);
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== "tous") {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.sellerName?.toLowerCase().includes(term)
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">🛍️ Vendre</h1>
            <p className="text-gray-600 dark:text-gray-400">{filteredProducts.length} produit(s) disponible(s)</p>
          </div>
          <Link href="/vendeur/produits/ajouter" className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            ➕ Publier un produit
          </Link>
        </div>

        <div className="card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Rechercher un produit, un vendeur..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Produit non trouvé</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {searchTerm ? "Aucun produit ne correspond à votre recherche." : "Aucun produit disponible pour le moment."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("tous"); }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Réinitialiser
              </button>
              <Link href="/vendeur/produits/ajouter" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                ➕ Publier un produit
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/produit/${product.id}`} className="card p-4 hover:shadow-lg transition">
                <img
                  src={product.images?.[0] || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">{product.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.sellerName} • {product.category}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">{product.price.toLocaleString()} FCFA</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
