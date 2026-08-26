"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  whatsappStatus: string;
  recentOrders: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    {
      title: "WhatsApp",
      value: stats?.whatsappStatus || "inconnu",
      icon: "💬",
      color: stats?.whatsappStatus === "open" ? "text-green-600" : "text-red-600",
    },
    {
      title: "Commandes",
      value: stats?.totalOrders || 0,
      icon: "📦",
      color: "text-blue-600",
    },
    {
      title: "Revenus",
      value: `${(stats?.totalRevenue || 0).toLocaleString()} FCFA`,
      icon: "💰",
      color: "text-green-600",
    },
    {
      title: "En attente",
      value: stats?.pendingOrders || 0,
      icon: "⏳",
      color: "text-yellow-600",
    },
  ];

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              📊 Tableau de bord
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Vue d'ensemble de votre activité
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            🔄 Rafraîchir
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className="card p-6 animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">⚡ Actions rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: "/vendre", label: "📤 Vendre", color: "bg-green-100" },
              { href: "/whatsapp", label: "💬 WhatsApp", color: "bg-blue-100" },
              { href: "/stock/dashboard", label: "📦 Stock", color: "bg-yellow-100" },
              { href: "/livreur/dashboard", label: "🚚 Livraison", color: "bg-orange-100" },
            ].map((link, index) => (
              <Link key={index} href={link.href} className={`card p-4 text-center hover:shadow-lg transition ${link.color}`}>
                <p className="font-medium">{link.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📋 Commandes récentes</h2>
          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-2">
              {stats.recentOrders.map((order, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">#{order.id}</span>
                  <span>{order.client?.name || "Client"}</span>
                  <span className="text-green-600 font-bold">{order.total?.toLocaleString()} FCFA</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${order.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {order.status === "pending" ? "⏳ En attente" : "✅ Traitée"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Aucune commande récente</p>
          )}
        </div>
      </div>
    </div>
  );
}
