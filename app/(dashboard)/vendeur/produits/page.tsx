'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';

interface Produit {
  id: string;
  titre: string;
  prix: number;
  photos: string[];
  description: string;
}

export default function MesProduits() {
  const { user } = useAuth();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const q = query(collection(db, 'produits'), where('boutiqueId', '==', user.uid));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Produit));
        setProduits(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce produit ?')) {
      await deleteDoc(doc(db, 'produits', id));
      setProduits(produits.filter(p => p.id !== id));
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes produits</h1>
        <Link href="/vendeur/produits/ajouter" className="bg-green-600 text-white px-4 py-2 rounded-lg">
          + Ajouter un produit
        </Link>
      </div>
      {produits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          Aucun produit. <Link href="/vendeur/produits/ajouter" className="text-green-600">Ajoutez votre premier produit</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {produits.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4">
              <img src={p.photos?.[0] || '/placeholder.png'} className="w-full h-40 object-cover rounded" />
              <h3 className="font-semibold mt-2">{p.titre}</h3>
              <p className="text-green-600">{p.prix.toLocaleString()} FCFA</p>
              <div className="flex gap-2 mt-3">
                <Link href={`/produits/${p.id}`} className="text-blue-600 text-sm">Voir</Link>
                <button onClick={() => handleDelete(p.id)} className="text-red-600 text-sm">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
