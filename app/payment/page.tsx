"use client";

import { useState } from "react";

type PaymentMethod = 'wave' | 'orange_money' | 'cash_on_delivery';

export default function PaymentPage() {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('wave');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; data?: any } | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount),
          phoneNumber,
          method,
          orderId: orderId || `ORD-${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: 'Paiement initié', data: data.data });
        if (data.data?.paymentUrl) {
          window.open(data.data.paymentUrl, '_blank');
        }
      } else {
        setResult({ success: false, message: data.error || 'Erreur paiement' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Erreur réseau' });
    } finally {
      setLoading(false);
    }
  };

  const methodIcons = {
    wave: '💰',
    orange_money: '📱',
    cash_on_delivery: '🚚',
  };

  const methodLabels = {
    wave: 'Wave',
    orange_money: 'Orange Money',
    cash_on_delivery: 'Paiement à la livraison',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">💰 Paiement</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Choisissez votre méthode de paiement</p>

          <form onSubmit={handlePayment}>
            {/* Montant */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Montant (FCFA)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25000"
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Numéro de téléphone */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                📱 Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="771234567"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Exemple: 771234567</p>
            </div>

            {/* ID Commande */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                🆔 ID Commande (optionnel)
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ORD-001"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Méthode de paiement */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                💳 Méthode de paiement
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['wave', 'orange_money', 'cash_on_delivery'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`p-3 rounded-lg border-2 transition ${
                      method === m
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl">{methodIcons[m]}</div>
                    <div className="text-sm font-medium">{methodLabels[m]}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? '⏳ Traitement...' : '💳 Payer maintenant'}
            </button>
          </form>

          {result && (
            <div className={`mt-4 p-4 rounded-lg ${
              result.success ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              {result.message}
              {result.data?.transactionId && (
                <p className="text-sm mt-1">Transaction: {result.data.transactionId}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 card p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📋 Méthodes acceptées</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
              <span className="text-xl">💰</span>
              <span>Wave</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
              <span className="text-xl">📱</span>
              <span>Orange Money</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
              <span className="text-xl">🚚</span>
              <span>À la livraison</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
