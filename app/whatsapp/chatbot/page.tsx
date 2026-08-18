"use client";

import { useState, useEffect } from "react";

export default function ChatbotAdminPage() {
  const [useChatbot, setUseChatbot] = useState(false);
  const [loading, setLoading] = useState(false);

  // Vérifier l'état actuel
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/whatsapp/chatbot/status");
        const data = await res.json();
        if (data.success) {
          setUseChatbot(data.enabled);
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    checkStatus();
  }, []);

  // Basculer le chatbot
  const toggleChatbot = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp/chatbot/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !useChatbot }),
      });
      const data = await res.json();
      if (data.success) {
        setUseChatbot(data.enabled);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🤖</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Chatbot IA</h1>
              <p className="text-gray-600 dark:text-gray-400">Assistant virtuel pour WhatsApp</p>
            </div>
          </div>

          {/* État du chatbot */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${useChatbot ? "text-green-500" : "text-gray-400"}`}>
                  {useChatbot ? "🟢" : "⭕"}
                </span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    Chatbot IA {useChatbot ? "Actif" : "Inactif"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {useChatbot
                      ? "L'IA répond automatiquement aux messages"
                      : "L'IA est désactivée, seules les règles personnalisées sont utilisées"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChatbot}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                  useChatbot
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } ${loading && "opacity-50 cursor-not-allowed"}`}
              >
                {loading ? "Chargement..." : useChatbot ? "Désactiver" : "Activer"}
              </button>
            </div>
          </div>

          {/* Informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">📝 Règles prédéfinies</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Utilisées en premier. Réponses rapides pour les questions fréquentes.
              </p>
              <a
                href="/whatsapp/admin"
                className="inline-block mt-2 text-green-600 hover:text-green-700 text-sm"
              >
                Gérer les règles →
              </a>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">🧠 Intelligence Artificielle</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Utilisée si aucune règle ne correspond. Réponses plus naturelles.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                ⚠️ Nécessite une clé API OpenAI
              </p>
            </div>
          </div>

          {/* Exemple */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">💬 Exemple de conversation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-800 dark:text-white">Bonjour, combien coûte la livraison ?</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-green-600 p-3 rounded-lg">
                  <p className="text-white">🚚 Nous livrons à Dakar et dans la région sous 24-48h. Contactez-nous pour plus d'infos !</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
