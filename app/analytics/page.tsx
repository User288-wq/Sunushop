"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface AnalyticsStats {
  total: number;
  byType: Record<string, number>;
  byDay: Record<string, number>;
  byHour: Record<string, number>;
  byCountry: Record<string, number>;
  topProducts: { id: string; name: string; count: number }[];
  conversionRate: number;
  averageSessionDuration: number;
  bounceRate: number;
  revenue: number;
  ordersCount: number;
  whatsappMessages: number;
}

interface AnalyticsEvent {
  type: string;
  data: any;
  timestamp: string;
  userId: string;
  sessionId: string;
}

const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${timeRange}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const typeLabels: Record<string, string> = {
    page_view: "📄 Pages",
    product_view: "🛍️ Produits",
    add_to_cart: "🛒 Panier",
    purchase: "💰 Achats",
    whatsapp_send: "📤 WhatsApp Env.",
    whatsapp_receive: "📥 WhatsApp Rec.",
    share_tiktok: "🎵 TikTok",
    share_facebook: "📘 Facebook",
    share_instagram: "📸 Instagram",
    share_whatsapp: "💬 WhatsApp",
    order_created: "📦 Commandes",
    payment_success: "✅ Paiements",
    payment_failed: "❌ Paiements éch.",
    error: "❌ Erreurs",
    user_login: "🔑 Connexions",
    user_register: "📝 Inscriptions",
    product_publish: "📢 Publications",
    whatsapp_connected: "🟢 WhatsApp ON",
    whatsapp_disconnected: "🔴 WhatsApp OFF",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  const byDayData = stats ? Object.entries(stats.byDay || {}).map(([day, count]) => ({ day, count })) : [];
  const byHourData = stats ? Object.entries(stats.byHour || {}).map(([hour, count]) => ({ hour: `${hour}h`, count })) : [];
  const byTypeData = stats ? Object.entries(stats.byType || {}).map(([type, count]) => ({ name: typeLabels[type] || type, value: count })) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📊 Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Performances et métriques en temps réel</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="1">24h</option>
              <option value="7">7 jours</option>
              <option value="14">14 jours</option>
              <option value="30">30 jours</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔄 Rafraîchir
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Total événements</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Taux conversion</p>
              <p className="text-2xl font-bold text-green-600">{stats.conversionRate}%</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Revenus</p>
              <p className="text-2xl font-bold text-blue-600">{stats.revenue.toLocaleString()} FCFA</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Commandes</p>
              <p className="text-2xl font-bold text-purple-600">{stats.ordersCount}</p>
            </div>
          </div>
        )}

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📈 Évolution</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={byDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#22c55e" fill="#86efac" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">⏰ Activité horaire</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byHourData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Répartition */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 Répartition</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {byTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🏆 Top produits</h2>
            <div className="space-y-3">
              {stats?.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-lg font-bold text-green-600">#{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.count} vues</p>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                        style={{
                          width: `${Math.min((product.count / (stats.topProducts[0]?.count || 1)) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">Aucun produit consulté</p>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp Stats */}
        {stats && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">💬 WhatsApp</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-500">Messages envoyés</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.byType?.whatsapp_send || 0}
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-500">Messages reçus</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.byType?.whatsapp_receive || 0}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-500">Total WhatsApp</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.whatsappMessages || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Derniers événements */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 Derniers événements</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Heure</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Données</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Utilisateur</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      Aucun événement
                    </td>
                  </tr>
                ) : (
                  events.map((event, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          event.type === 'error' ? 'bg-red-100 text-red-700' :
                          event.type === 'purchase' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {typeLabels[event.type] || event.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600 truncate max-w-xs">
                        {event.data ? JSON.stringify(event.data).slice(0, 80) : "-"}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-500 truncate max-w-[100px]">
                        {event.userId || event.sessionId?.slice(0, 8) || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
