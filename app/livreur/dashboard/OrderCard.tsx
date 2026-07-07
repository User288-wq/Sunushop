'use client';
import type { Commande } from './page';

interface OrderCardProps {
  commande: Commande;
  onAction?: () => void;
  actionLabel: string;
  actionColor: string;
}

export default function OrderCard({ commande, onAction, actionLabel, actionColor }: OrderCardProps) {
  const statutLabels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'En cours de livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  };

  const paymentLabels: Record<string, string> = {
    wave: 'Wave',
    orange_money: 'Orange Money',
    livraison: 'Paiement à la livraison',
  };

  const date = commande.createdAt?.toDate ? new Date(commande.createdAt.toDate()).toLocaleString() : 'Date inconnue';

  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-mono text-sm text-gray-500">#{commande.numero}</p>
          <p className="font-semibold">{commande.client?.nom}</p>
          <p className="text-sm text-gray-600">{commande.client?.adresseLivraison}</p>
          <p className="text-xs text-gray-400 mt-1">📞 {commande.client?.telephone}</p>
          <p className="text-xs text-gray-400">🕒 {date}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-600">{commande.total?.toLocaleString()} FCFA</p>
          <p className="text-xs text-gray-500">{paymentLabels[commande.paiement?.methode] || commande.paiement?.methode}</p>
          <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${
            commande.statut === 'delivered' ? 'bg-green-100 text-green-700' :
            commande.statut === 'shipped' ? 'bg-blue-100 text-blue-700' :
            commande.statut === 'confirmed' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {statutLabels[commande.statut] || commande.statut}
          </p>
          {commande.livraison?.livreurNom && (
            <p className="text-xs text-gray-400 mt-1">Livreur : {commande.livraison.livreurNom}</p>
          )}
        </div>
      </div>
      <div className="mt-3 pt-2 border-t text-sm">
        {commande.produits?.map((p, i) => (
          <div key={i} className="flex justify-between">
            <span>{p.quantite}x {p.titre}</span>
            <span>{(p.quantite * p.prixUnitaire).toLocaleString()} FCFA</span>
          </div>
        ))}
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className={`mt-3 w-full text-white py-2 rounded-lg text-sm font-semibold ${actionColor}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

