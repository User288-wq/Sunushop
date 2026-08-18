"use client";

interface Commande {
  id: string;
  client: string;
  telephone: string;
  adresse: string;
  produits: string[];
  total: number;
  status: "en_attente" | "en_cours" | "livré" | "annulé";
  created_at: string;
  livraison?: {
    lat: number;
    lng: number;
  };
}

interface OrderCardProps {
  commande: Commande;
  onUpdateStatus: (id: string, status: string) => void;
}

export default function OrderCard({ commande, onUpdateStatus }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_attente": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "en_cours": return "bg-blue-100 text-blue-700 border-blue-300";
      case "livré": return "bg-green-100 text-green-700 border-green-300";
      case "annulé": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_attente": return "⏳ En attente";
      case "en_cours": return "🚚 En cours";
      case "livré": return "✅ Livré";
      case "annulé": return "❌ Annulé";
      default: return status;
    }
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-white">{commande.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commande.status)}`}>
              {getStatusLabel(commande.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{commande.client}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{commande.adresse}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-600">{commande.total.toLocaleString()} FCFA</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(commande.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {commande.status !== "livré" && commande.status !== "annulé" && (
        <div className="mt-3 flex gap-2">
          {commande.status === "en_attente" && (
            <button
              onClick={() => onUpdateStatus(commande.id, "en_cours")}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              🚚 Prendre en charge
            </button>
          )}
          {commande.status === "en_cours" && (
            <button
              onClick={() => onUpdateStatus(commande.id, "livré")}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
            >
              ✅ Marquer livré
            </button>
          )}
        </div>
      )}
    </div>
  );
}
