"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
}

export default function VendeurProduitsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, outOfStock: 0, lowStock: 0, totalValue: 0 });
  const [sellerId, setSellerId] = useState("");

  const fetchProducts = async () => {
    if (!sellerId) {
      setLoading(false);
      return;
    }

    try {
      const [productsRes, statsRes] = await Promise.all([
        fetch(`/api/products?sellerId=${sellerId}`),
        fetch(`/api/products?action=stats&sellerId=${sellerId}`),
      ]);

      const productsData = await productsRes.json();
      const statsData = await statsRes.json();

      if (productsData.success) {
        setProducts(productsData.products);
      }
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchProducts();
      const interval = setInterval(fetchProducts, 30000);
      return () => clearInterval(interval);
    }
  }, [sellerId]);

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📦 Mes produits</h1>
            <p className="text-gray-600 dark:text-gray-400">Gérez votre catalogue de produits</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <input
              type="text"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              placeholder="ID Vendeur (ex: seller_001)"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={() => router.push("/vendeur/produits/ajouter")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ➕ Ajouter
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {sellerId && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Rupture</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Stock faible</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Valeur totale</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalValue.toLocaleString()} FCFA</p>
            </div>
          </div>
        )}

        {!sellerId && (
          <div className="card p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Entrez votre ID vendeur pour voir vos produits</p>
          </div>
        )}

        {sellerId && products.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Aucun produit trouvé</p>
            <Link href="/vendeur/produits/ajouter" className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              ➕ Ajouter votre premier produit
            </Link>
          </div>
        )}

        {/* Liste des produits */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card p-4">
                <img
                  src={product.images[0] || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{product.title}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-green-600">{product.price.toLocaleString()} FCFA</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock} {product.unit}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.isActive ? "✅ Actif" : "❌ Inactif"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleProductStatus(product.id, product.isActive)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                      >
                        {product.isActive ? "Désactiver" : "Activer"}
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
