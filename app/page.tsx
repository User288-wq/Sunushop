'use client';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase/client';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import { Produit } from '../types';

export default function HomePage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, 'produits'), orderBy('createdAt', 'desc'), limit(20));
      const snap = await getDocs(q);
      setProduits(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Produit)));
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <section className="text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Vendez sur TikTok, <span className="text-green-600">SunuShop s&apos;occupe du reste</span></h1>
        <p className="text-gray-600 mb-6">Publiez, partagez le lien, recevez les paiements Wave/Orange Money, et suivez la livraison.</p>
        <Link href="/vendeur/produits/ajouter" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">  Commencer à vendre</Link>
      </section>
      <h2 className="text-2xl font-bold mb-6">Produits récents</h2>
      {loading ? <div className="text-center">Chargement...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {produits.map(p => (
            <Link key={p.id} href={`/produits/${p.id}`} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden">
              <img src={p.photos?.[0] || '/placeholder.png'} alt={p.titre} className="w-full h-40 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold truncate">{p.titre}</h3>
                <p className="text-green-600 font-bold">{p.prix.toLocaleString()} FCFA</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
