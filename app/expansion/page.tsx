"use client";

import { useState } from "react";
import { countries, getActiveCountries } from "@/lib/config/countries";
import Link from "next/link";

export default function ExpansionPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeCountries = getActiveCountries();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccess(true);
    setEmail("");
    setMessage("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">🌍 Expansion SunuShop</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            SunuShop arrive dans de nouveaux pays d'Afrique de l'Ouest
          </p>
        </div>

        {/* Pays disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeCountries.map((country) => (
            <div key={country.code} className="card p-6 hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">{country.flag}</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{country.name}</h3>
              <p className="text-sm text-gray-500">{country.code}</p>
              <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>📞 {country.phoneCode}</p>
                <p>💰 {country.currencySymbol}</p>
                <p>🏙️ {country.cities.slice(0, 3).join(", ")}...</p>
                <p>💳 {country.paymentMethods.join(", ")}</p>
              </div>
              <div className="mt-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  country.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {country.active ? "✅ Actif" : "⏳ Bientôt"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Prochains pays */}
        <div className="card p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🚀 Prochains pays</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {countries.filter(c => !c.active).map((country) => (
              <div key={country.code} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{country.name}</p>
                    <p className="text-xs text-gray-500">⏳ Bientôt disponible</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire d'intérêt */}
        <div className="card p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">📝 Intéressé par SunuShop ?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Laissez votre email pour être informé du lancement dans votre pays.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pays
              </label>
              <select
                value={selectedCountry || ""}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="">Sélectionnez un pays</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message (optionnel)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
              {loading ? "⏳ Envoi..." : "📝 Je suis intéressé"}
            </button>

            {success && (
              <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-green-700 animate-fade-in">
                ✅ Merci ! Vous serez informé du lancement dans votre pays.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
