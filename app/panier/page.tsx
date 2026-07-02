'use client';
import { useCart } from '../../hooks/useCart';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function PanierPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const total = getTotal();
  const fraisLivraison = total > 5000 ? 0 : 1000;
  const totalFinal = total + fraisLivraison;

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-6">Ajoutez des produits depuis la page d'accueil</p>
        <Link href="/" className="bg-green-600 text-white px-6 py-2 rounded-lg inline-block">Découvrir les produits</Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mon panier ({items.length} articles)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.produitId} className="flex gap-4 bg-white p-4 rounded-lg shadow">
              <img src={item.photo || 'https://placehold.co/100x100'} alt={item.titre} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.titre}</h3>
                <p className="text-green-600 font-bold">{item.prix.toLocaleString()} FCFA</p>
                <p className="text-xs text-gray-400">{item.boutiqueNom}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.produitId, item.quantite - 1)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center">{item.quantite}</span>
                <button onClick={() => updateQuantity(item.produitId, item.quantite + 1)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-semibold">{(item.prix * item.quantite).toLocaleString()} FCFA</p>
                <button onClick={() => removeItem(item.produitId)} className="text-red-500 text-sm hover:text-red-700"><Trash2 className="w-4 h-4 inline" /> Supprimer</button>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-red-500 text-sm hover:text-red-700">Vider le panier</button>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-24">
          <h2 className="font-bold text-lg mb-4">Récapitulatif</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Sous-total</span><span>{total.toLocaleString()} FCFA</span></div>
            <div className="flex justify-between"><span>Livraison</span><span>{fraisLivraison === 0 ? 'Gratuite' : `${fraisLivraison.toLocaleString()} FCFA`}</span></div>
            {fraisLivraison > 0 && <p className="text-xs text-gray-400">Ajoutez {Math.ceil(5000 - total)} FCFA pour la livraison gratuite</p>}
            <div className="border-t pt-2 mt-2 font-bold text-lg"><div className="flex justify-between"><span>Total</span><span className="text-green-600">{totalFinal.toLocaleString()} FCFA</span></div></div>
          </div>
          <Link href="/checkout" className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold mt-6 hover:bg-green-700">📝 Passer la commande</Link>
          <p className="text-xs text-gray-400 text-center mt-4">Livraison à Dakar : 24-48h<br />Paiement sécurisé Wave / Orange Money / À la livraison</p>
        </div>
      </div>
    </main>
  );
}

