"use client";

import { useEffect, useState } from "react";

interface ProductStock {
  id: string;
  sellerId: string;
  productName: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

interface StockAlert {
  productId: string;
  productName: string;
  currentQuantity: number;
  minQuantity: number;
  sellerId: string;
  type: "low" | "critical" | "out";
}

interface Stats {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  outOfStock: number;
}

export default function StockDashboard() {
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Statistiques
      const statsRes = await fetch(`/api/stock?action=stats${sellerId ? `&sellerId=${sellerId}` : ""}`);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Alertes
      const alertsRes = await fetch(`/api/stock?action=alerts${sellerId ? `&sellerId=${sellerId}` : ""}`);
      const alertsData = await alertsRes.json();
      if (alertsData.success) {
        setAlerts(alertsData.alerts);
      }

      // Produits
      const productsRes = await fetch(`/api/stock${sellerId ? `?sellerId=${sellerId}` : ""}`);
      const productsData = await productsRes.json();
      if (productsData.success) {
        setProducts(productsData.products);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [sellerId]);

  const getAlertColor = (type: string) => {
    switch (type) {
      case "out":
        return "bg-red-100 text-red-700 border-red-300";
      case "critical":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "low":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getAlertLabel = (type: string) => {
    switch (type) {
      case "out":
        return "❌ Rupture";
      case "critical":
        return "⚠️ Critique";
      case "low":
        return "⬇️ Faible";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📦 Gestion des stocks</h1>
            <p className="text-gray-600 mt-1">Suivez vos produits et alertes</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <input
              type="text"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              placeholder="ID Vendeur"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔄 Rafraîchir
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ➕ Ajouter
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Produits</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Valeur totale</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalValue.toLocaleString()} FCFA</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Stock faible</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Rupture</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
          </div>
        )}

        {/* Alertes */}
        {alerts.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Alertes stock</h2>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.productId} className={`p-3 border rounded-lg ${getAlertColor(alert.type)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{alert.productName}</span>
                      <span className="ml-2 text-sm">
                        ({alert.currentQuantity} / {alert.minQuantity} minimum)
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAlertColor(alert.type)}`}>
                      {getAlertLabel(alert.type)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {showForm && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">➕ Ajouter un produit</h2>
            <form id="stock-form" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="productName"
                placeholder="Nom du produit"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                name="category"
                placeholder="Catégorie"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                name="quantity"
                type="number"
                placeholder="Quantité"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                name="minQuantity"
                type="number"
                placeholder="Seuil d'alerte"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                name="price"
                type="number"
                placeholder="Prix (FCFA)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                name="unit"
                placeholder="Unité (pièce, kg...)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="md:col-span-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                💾 Ajouter
              </button>
            </form>
          </div>
        )}

        {/* Liste des produits */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 Liste des produits</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Produit</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Catégorie</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Quantité</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Prix</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Aucun produit
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const isLow = product.quantity <= product.minQuantity;
                    const isOut = product.quantity <= 0;
                    return (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{product.productName}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {product.quantity} {product.unit}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">
                          {product.price.toLocaleString()} FCFA
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isOut ? "bg-red-100 text-red-700" :
                            isLow ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {isOut ? "❌ Rupture" :
                             isLow ? "⬇️ Faible" :
                             "✅ Normal"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
