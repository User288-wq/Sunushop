'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/client';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import OrderCard from './OrderCard';
import { Package, RefreshCw } from 'lucide-react';

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
  paiement: {
    methode: string;
    status: string;
  };
  livraison: {
    livreurId?: string;
    livreurNom?: string;
    livreurTel?: string;
    status: string;
  };
  produits: any[];
  createdAt: any;
}

export default function LivreurDashboard() {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [livreurInfo, setLivreurInfo] = useState<{ nom: string; telephone: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchLivreurInfo = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setLivreurInfo({ nom: data.nom || 'Livreur', telephone: data.telephone || '' });
      }
    };
    fetchLivreurInfo();

    const q = query(
      collection(db, 'commandes'),
      where('statut', 'in', ['pending', 'confirmed', 'shipped'])
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Commande[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Commande);
      });
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setCommandes(data);
      setLoading(false);
    }, (error) => {
      console.error('Erreur snapshot:', error);
      toast.error('Erreur de chargement des commandes');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateOrderStatus = async (commandeId: string, newStatut: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'commandes', commandeId), {
        statut: newStatut,
        'livraison.status': newStatut,
        'livraison.livreurId': user.uid,
        'livraison.livreurNom': livreurInfo?.nom || 'Livreur',
        'livraison.livreurTel': livreurInfo?.telephone || '',
        updatedAt: new Date(),
      });
      toast.success(`Commande ${newStatut === 'shipped' ? 'prise en charge' : newStatut === 'delivered' ? 'livrée' : 'mise à jour'}`);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Chargement des commandes...</div>;
  }

  const commandesDisponibles = commandes.filter(c => c.statut === 'pending' || c.statut === 'confirmed');
  const commandesEnCours = commandes.filter(c => c.statut === 'shipped' && c.livraison?.livreurId === user?.uid);
  const autresCommandes = commandes.filter(c => c.statut === 'shipped' && c.livraison?.livreurId !== user?.uid);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📦 Commandes à livrer</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" /> Disponibles ({commandesDisponibles.length})
        </h2>
        {commandesDisponibles.length === 0 ? (
          <div className="text-gray-500">Aucune commande en attente.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commandesDisponibles.map((c) => (
              <OrderCard
                key={c.id}
                commande={c}
                onAction={() => updateOrderStatus(c.id, 'shipped')}
                actionLabel="🛵 Prendre en charge"
                actionColor="bg-blue-600 hover:bg-blue-700"
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" /> En cours ({commandesEnCours.length})
        </h2>
        {commandesEnCours.length === 0 ? (
          <div className="text-gray-500">Aucune commande en cours.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commandesEnCours.map((c) => (
              <OrderCard
                key={c.id}
                commande={c}
                onAction={() => updateOrderStatus(c.id, 'delivered')}
                actionLabel="✅ Marquer comme livrée"
                actionColor="bg-green-600 hover:bg-green-700"
              />
            ))}
          </div>
        )}
      </section>

      {autresCommandes.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-500">
            Commandes prises par d'autres livreurs ({autresCommandes.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
            {autresCommandes.map((c) => (
              <OrderCard key={c.id} commande={c} actionLabel="Déjà prise" actionColor="bg-gray-400" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
