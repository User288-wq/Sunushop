"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  sellerId?: string;
}

export default function PanierPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    const newCart = cart.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    calculateTotal(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    calculateTotal(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', '[]');
    setTotal(0);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      // Créer la commande
      const orderData = {
        items: cart,
        total: total,
        client: {
          name: "Client",
          phone: "221785387999",
        },
        delivery: {
          address: "Dakar, Sénégal",
        },
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la commande");
      }

      // Rediriger vers la page de paiement
      router.push(`/payment?orderId=${data.order.id}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Panier vide</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Votre panier est actuellement vide.</p>
            <Link href="/" className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              🛍️ Commencer les achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🛒 Mon panier</h1>
          <button
            onClick={clearCart}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 transition"
          >
            🗑️ Vider le panier
          </button>
        </div>

        {error && (
          <div className="p-4 mb-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
            ❌ {error}
          </div>
        )}

        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <img
                src={item.image || "https://via.placeholder.com/80/22c55e/ffffff?text=Produit"}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-green-600 font-bold">{item.price.toLocaleString()} FCFA</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="card p-6 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800 dark:text-white">Total</span>
            <span className="text-2xl font-bold text-green-600">{total.toLocaleString()} FCFA</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "⏳ Traitement..." : "💳 Passer la commande"}
          </button>
        </div>
      </div>
    </div>
  );
}
