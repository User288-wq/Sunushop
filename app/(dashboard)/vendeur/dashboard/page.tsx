"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VendeurDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    whatsappStatus: "inconnu",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les statistiques du vendeur (à adapter avec votre sellerId)
        const sellerId = "sunushop_officiel";
        const [statsRes, productsRes, ordersRes] = await Promise.all([
          fetch(`/api/products?action=stats&sellerId=${sellerId}`),
          fetch(`/api/products?sellerId=${sellerId}`),
          fetch("/api/orders"),
        ]);

        const statsData = await statsRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        setStats({
          totalProducts: productsData.products?.length || 0,
          totalOrders: ordersData.count || 0,
          totalRevenue: statsData.stats?.totalValue || 0,
          whatsappStatus: "connecté", // À connecter à l'API WhatsApp
        });
      } catch (error) {
        console.error("Erreur chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          📊 Tableau de bord vendeur
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6 text-center">
            <p className="text-sm text-gray-500">Produits</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-sm text-gray-500">Commandes</p>
            <p className="text-2xl font-bold text-green-600">{stats.totalOrders}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-sm text-gray-500">Revenus</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalRevenue.toLocaleString()} FCFA
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-sm text-gray-500">WhatsApp</p>
            <p className={`text-2xl font-bold ${stats.whatsappStatus === "connecté" ? "text-green-600" : "text-red-600"}`}>
              {stats.whatsappStatus}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/vendeur/produits" className="card p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">📦 Mes produits</h3>
            <p className="text-gray-500">Gérer votre catalogue</p>
          </Link>
          <Link href="/vendeur/produits/ajouter" className="card p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">➕ Ajouter un produit</h3>
            <p className="text-gray-500">Publier un nouveau produit</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
