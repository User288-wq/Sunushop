"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    whatsapp: "chargement...",
    orders: 0,
    revenue: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer le statut WhatsApp
    fetch("/api/whatsapp/status")
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({
          ...prev,
          whatsapp: data.status || "inconnu"
        }));
      })
      .catch(() => setStats(prev => ({ ...prev, whatsapp: "erreur" })));

    // Récupérer les statistiques (simulées pour l'instant)
    // À connecter à une vraie API plus tard
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        orders: 24,
        revenue: 87500,
        products: 12,
      }));
      setLoading(false);
    }, 500);
  }, []);

  const statsCards = [
    {
      title: "WhatsApp",
      value: stats.whatsapp,
      icon: "💬",
      color: stats.whatsapp === "open" ? "text-green-600" : "text-red-600",
    },
    {
      title: "Commandes",
      value: stats.orders,
      icon: "📦",
      color: "text-blue-600",
    },
    {
      title: "Revenus",
      value: `${stats.revenue.toLocaleString()} FCFA`,
      icon: "💰",
      color: "text-green-600",
    },
    {
      title: "Produits",
      value: stats.products,
      icon: "📦",
      color: "text-purple-600",
    },
  ];

  const quickLinks = [
    { href: "/vendre", label: "📤 Vendre un produit", color: "bg-green-100" },
    { href: "/whatsapp", label: "💬 WhatsApp", color: "bg-blue-100" },
    { href: "/stock/dashboard", label: "📦 Stock", color: "bg-yellow-100" },
    { href: "/livreur/dashboard", label: "🚚 Livraison", color: "bg-orange-100" },
    { href: "/analytics", label: "📊 Analytics", color: "bg-purple-100" },
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              📊 Tableau de bord
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Vue d'ensemble de votre activité SunuShop
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔄 Rafraîchir
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className="card p-6 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Liens rapides */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            ⚡ Actions rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`card p-4 text-center hover:shadow-lg transition ${link.color} dark:bg-opacity-20`}
              >
                <p className="font-medium text-gray-800 dark:text-white">
                  {link.label}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Activité récente (placeholder) */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            📋 Activité récente
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Aucune activité récente pour le moment.
          </p>
        </div>
      </div>
    </div>
  );
}
