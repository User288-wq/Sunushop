"use client";

import { useState } from "react";
import Link from "next/link";

export default function PreInscriptionPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "vendeur",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simuler l'envoi (à connecter à une base de données)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccess(true);
    setForm({ name: "", email: "", phone: "", role: "vendeur", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 p-4 rounded-full mb-4 animate-float">
            <span className="text-5xl">🚀</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            SunuShop arrive bientôt !
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            La marketplace sénégalaise connectée à TikTok, WhatsApp et Wave.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informations */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                🎯 Pourquoi SunuShop ?
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Vendez sur TikTok, Facebook et WhatsApp en un clic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Paiements Wave, Orange Money ou à la livraison</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Suivi des commandes en temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Commission seulement 5% sur les ventes</span>
                </li>
              </ul>
            </div>

            <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <h3 className="font-semibold text-gray-800 dark:text-white">📅 Lancement prévu</h3>
              <p className="text-2xl font-bold text-green-600">Septembre 2026</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Inscrivez-vous pour être informé du lancement !
              </p>
            </div>

            {/* Ambassadeurs */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                🤝 Devenez ambassadeur
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Gagnez <span className="font-bold text-green-600">25 000 FCFA</span> par vendeur parrainé !
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                💰 Commissions réduites pour les ambassadeurs
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              📝 Pré-inscription
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Soyez parmi les premiers à rejoindre SunuShop !
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Votre nom"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="votre@email.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="77 XXX XX XX"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Je suis *
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="vendeur">👨‍💼 Vendeur</option>
                  <option value="acheteur">🛍️ Acheteur</option>
                  <option value="livreur">🚚 Livreur</option>
                  <option value="ambassadeur">🤝 Ambassadeur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Votre message..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "⏳ Envoi..." : "📝 S'inscrire"}
              </button>

              {success && (
                <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 rounded-lg text-green-700 dark:text-green-400 animate-fade-in">
                  ✅ Inscription réussie ! Vous serez informé du lancement.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            <Link href="/" className="text-green-600 hover:underline">Retour à l'accueil</Link>
            {" • "}
            <a href="https://wa.me/221773509559" className="text-green-600 hover:underline">📱 Nous contacter</a>
          </p>
        </div>
      </div>
    </div>
  );
}
