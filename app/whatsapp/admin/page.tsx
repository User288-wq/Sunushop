"use client";

import { useState, useEffect } from "react";

type AutoReplyRule = {
  id: string;
  keywords: string[];
  response: string;
  enabled: boolean;
  matchType: "exact" | "contains" | "startsWith";
};

export default function WhatsAppAdminPage() {
  const [rules, setRules] = useState<AutoReplyRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyword, setNewKeyword] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [newMatchType, setNewMatchType] = useState<"exact" | "contains" | "startsWith">("contains");

  const fetchRules = async () => {
    try {
      const res = await fetch("/api/whatsapp/admin/rules");
      const data = await res.json();
      if (data.success) {
        setRules(data.rules);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const addRule = async () => {
    if (!newKeyword || !newResponse) return;

    try {
      const res = await fetch("/api/whatsapp/admin/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: newKeyword.split(",").map(k => k.trim()),
          response: newResponse,
          matchType: newMatchType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewKeyword("");
        setNewResponse("");
        fetchRules();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const toggleRule = async (id: string) => {
    try {
      await fetch(`/api/whatsapp/admin/rules/${id}/toggle`, {
        method: "PUT",
      });
      fetchRules();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const deleteRule = async (id: string) => {
    try {
      await fetch(`/api/whatsapp/admin/rules/${id}`, {
        method: "DELETE",
      });
      fetchRules();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 Réponses automatiques</h1>
        <p className="text-gray-600 mb-6">Gérez les réponses automatiques pour WhatsApp</p>

        {/* Formulaire d'ajout */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">➕ Ajouter une règle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mots-clés</label>
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="bonjour, salut, hello"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Séparés par des virgules</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de correspondance</label>
              <select
                value={newMatchType}
                onChange={(e) => setNewMatchType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="contains">Contient</option>
                <option value="exact">Exact</option>
                <option value="startsWith">Commence par</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Réponse</label>
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Votre réponse automatique..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button
            onClick={addRule}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            ➕ Ajouter la règle
          </button>
        </div>

        {/* Liste des règles */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 Règles actuelles</h2>
          {rules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune règle configurée</p>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-lg border ${
                    rule.enabled ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {rule.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                          {rule.matchType}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{rule.response}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                          rule.enabled
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-400 text-white hover:bg-gray-500"
                        }`}
                      >
                        {rule.enabled ? "Actif" : "Inactif"}
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
