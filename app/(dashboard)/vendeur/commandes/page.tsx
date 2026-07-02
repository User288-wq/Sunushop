'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Link from 'next/link';

interface Commande {
  id: string;
  numero: string;
  client: {
    nom: string;
    telephone: string;
    adresseLivraison: string;
  };
  total: number;
  statut: string;
  produits: any[];
  createdAt: any;
}

export default function MesCommandes() {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const q = query(
          collection(db, 'commandes'),
          where('vendeurId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Commande));
        setCommandes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) return <div>Chargement...</div>;

  const getStatutLabel = (statut: string) => {
    const map: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'Préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return map[statut] || statut;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes commandes</h1>
      {commandes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">Aucune commande reçue.</div>
      ) : (
        <div className="space-y-4">
          {commandes.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-sm text-gray-500">{c.numero}</p>
                  <p className="font-semibold">{c.client?.nom}</p>
                  <p className="text-sm text-gray-600">{c.client?.adresseLivraison}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{c.total?.toLocaleString()} FCFA</p>
                  <p className="text-sm capitalize">{getStatutLabel(c.statut)}</p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t text-sm">
                {c.produits?.map((p, i) => (
                  <div key={i}>{p.quantite}x {p.titre}</div>
                ))}
              </div>
              <div className="mt-3">
                <Link href={`/suivi/${c.id}`} className="text-green-600 text-sm hover:underline">
                  Voir le suivi →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
