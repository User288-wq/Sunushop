'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AjouterProduit() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ titre: '', prix: '', description: '', videoURL: '', photo: '' });

  if (authLoading) return <div className="text-center py-20">Chargement...</div>;
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'produits'), {
        boutiqueId: user.uid,
        titre: form.titre,
        description: form.description,
        prix: parseInt(form.prix),
        videoURL: form.videoURL || null,
        photos: [form.photo],
        stock: 1,
        disponible: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert('Produit ajouté avec succès !');
      router.push('/vendeur/produits');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Ajouter un produit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Titre" required className="w-full border rounded-lg px-3 py-2" value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} />
        <input type="number" placeholder="Prix (FCFA)" required className="w-full border rounded-lg px-3 py-2" value={form.prix} onChange={e => setForm({...form, prix: e.target.value})} />
        <textarea placeholder="Description" rows={4} className="w-full border rounded-lg px-3 py-2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <input type="url" placeholder="URL vidéo TikTok (optionnel)" className="w-full border rounded-lg px-3 py-2" value={form.videoURL} onChange={e => setForm({...form, videoURL: e.target.value})} />
        <input type="url" placeholder="URL photo" className="w-full border rounded-lg px-3 py-2" value={form.photo} onChange={e => setForm({...form, photo: e.target.value})} />
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold">{loading ? 'Ajout...' : 'Publier'}</button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4"><Link href="/vendeur/produits">← Retour à mes produits</Link></p>
    </div>
  );
}
