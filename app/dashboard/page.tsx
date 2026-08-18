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
} from "recharts";
import { useWhatsApp } from "@/context/WhatsAppContext";

type AdvancedStats = {
  instance: {
    name: string;
    status: string;
    profileName: string;
    ownerJid: string;
  };
  stats: {
    totalMessages: number;
    totalContacts: number;
    totalChats: number;
    sentCount: number;
    receivedCount: number;
  };
  charts: {
    messagesByDay: { date: string; count: number }[];
    messagesByDayOfWeek: { day: string; count: number }[];
    messagesByHour: { hour: number; count: number }[];
    topContacts: { jid: string; name: string; count: number }[];
  };
};

const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function DashboardPage() {
  const { unreadCount, isConnected } = useWhatsApp();
  const [stats, setStats] = useState<AdvancedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'contacts'>('overview');

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/whatsapp/stats/advanced");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || "Erreur");
      }
    } catch (error) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const formatHour = (hour: number) => {
    return `${hour}h`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg max-w-md mx-auto">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
          <button
            onClick={fetchStats}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { instance, stats: data, charts } = stats;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📊 Tableau de bord</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Statistiques avancées et activité WhatsApp</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Statut :</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }`}>
                {isConnected ? "✅ Connecté" : "❌ Déconnecté"}
              </span>
            </div>
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              🔄 Rafraîchir
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'overview', label: '📊 Vue d\'ensemble' },
            { key: 'charts', label: '📈 Graphiques' },
            { key: 'contacts', label: '👥 Top contacts' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="card p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Messages</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{data.totalMessages}</p>
              </div>
              <div className="card p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Contacts</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{data.totalContacts}</p>
              </div>
              <div className="card p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Conversations</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{data.totalChats}</p>
              </div>
              <div className="card p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Envoyés</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.sentCount}</p>
              </div>
              <div className="card p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Reçus</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.receivedCount}</p>
              </div>
            </div>

            {/* Graphique de tendance */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📈 Évolution des messages (30 jours)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.messagesByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} messages`, 'Messages']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: '#22c55e', r: 3 }}
                      activeDot={{ r: 6 }}
                      name="Messages"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Répartition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📊 Messages par jour</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.messagesByDayOfWeek}
                        dataKey="count"
                        nameKey="day"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {charts.messagesByDayOfWeek.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} messages`, 'Messages']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">⏰ Heures de pointe</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.messagesByHour}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="hour" tickFormatter={formatHour} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} messages`, 'Messages']} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Messages" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Graphiques */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📈 Évolution des messages (30 jours)</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.messagesByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} messages`, 'Messages']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', r: 4 }}
                      activeDot={{ r: 8 }}
                      name="Messages"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📊 Répartition par jour</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.messagesByDayOfWeek}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} messages`, 'Messages']} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Messages" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">⏰ Activité horaire</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.messagesByHour}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="hour" tickFormatter={formatHour} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} messages`, 'Messages']} />
                      <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Messages" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top contacts */}
        {activeTab === 'contacts' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">👥 Top 5 contacts</h2>
            {charts.topContacts.length > 0 ? (
              <div className="space-y-3">
                {charts.topContacts.map((contact, index) => (
                  <div
                    key={contact.jid}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{contact.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.jid}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                          style={{
                            width: `${Math.min((contact.count / (charts.topContacts[0]?.count || 1)) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <span className="font-bold text-gray-800 dark:text-white">{contact.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Aucun contact avec des messages
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
