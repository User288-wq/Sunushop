"use client";

import { useEffect, useState } from "react";

interface Commission {
  id: string;
  sellerId: string;
  sellerName: string;
  orderId: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: "pending" | "processing" | "paid" | "cancelled";
  createdAt: string;
  paidAt?: string;
  description?: string;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  paid: number;
  totalAmount: number;
}

export default function CommissionDashboard() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Récupérer les statistiques
      const statsRes = await fetch(`/api/commission?action=stats${sellerId ? `&sellerId=${sellerId}` : ""}`);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Récupérer les commissions
      const commRes = await fetch(`/api/commission${sellerId ? `?sellerId=${sellerId}` : ""}`);
      const commData = await commRes.json();
      if (commData.success) {
        setCommissions(commData.commissions);
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

  const updateStatus = async (commissionId: string, status: string) => {
    try {
      const res = await fetch("/api/commission", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionId, status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "paid":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳ En attente";
      case "processing":
        return "🔄 En cours";
      case "paid":
        return "✅ Payée";
      case "cancelled":
        return "❌ Annulée";
      default:
        return status;
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
            <h1 className="text-3xl font-bold text-gray-800">💰 Commissions</h1>
            <p className="text-gray-600 mt-1">Gestion des commissions des vendeurs</p>
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
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">En cours</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Payées</p>
              <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-sm text-gray-500">Total (FCFA)</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Liste des commissions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 Liste des commissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Vendeur</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Commande</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Montant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Commission</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Taux</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Aucune commission
                    </td>
                  </tr>
                ) : (
                  commissions.map((comm) => (
                    <tr key={comm.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-sm text-gray-600">{comm.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{comm.sellerName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{comm.orderId}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {comm.orderAmount.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-green-600">
                        {comm.commissionAmount.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {Math.round(comm.commissionRate * 100)}%
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(comm.status)}`}>
                          {getStatusLabel(comm.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {comm.status === "pending" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateStatus(comm.id, "processing")}
                              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                            >
                              Traiter
                            </button>
                            <button
                              onClick={() => updateStatus(comm.id, "paid")}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                            >
                              Payer
                            </button>
                          </div>
                        )}
                        {comm.status === "processing" && (
                          <button
                            onClick={() => updateStatus(comm.id, "paid")}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                          >
                            Payer
                          </button>
                        )}
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
