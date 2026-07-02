'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function VendeurDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ ventes: 0, commandes: 0, produits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        // Nombre de produits
        const produitsSnap = await getDocs(query(collection(db, 'produits'), where('boutiqueId', '==', user.uid)));
        // Commandes
        const commandesSnap = await getDocs(query(collection(db, 'commandes'), where('vendeurId', '==', user.uid)));
        const commandesLivrees = commandesSnap.docs.filter(doc => doc.data().statut === 'delivered').reduce((sum, doc) => sum + (doc.data().total || 0), 0);
        setStats({
          ventes: commandesLivrees,
          commandes: commandesSnap.size,
          produits: produitsSnap.size,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) return <div>Chargement des statistiques...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Chiffre d'affaires</p>
          <p className="text-2xl font-bold">{stats.ventes.toLocaleString()} FCFA</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Commandes</p>
          <p className="text-2xl font-bold">{stats.commandes}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Produits</p>
          <p className="text-2xl font-bold">{stats.produits}</p>
        </div>
      </div>
    </div>
  );
}
