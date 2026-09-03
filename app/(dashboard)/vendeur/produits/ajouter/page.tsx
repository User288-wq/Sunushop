"use client";

import { useState } from "react";

export default function AjouterProduitPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("⏳ Envoi en cours...");
    
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: "sunushop_officiel",
          sellerName: "SunuShop Officiel",
          title: title,
          description: "Test depuis la page simplifiée",
          price: parseFloat(price),
          category: "mode",
          stock: 10,
          unit: "pièce",
          isActive: true,
          images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"]
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Produit ajouté avec succès !");
        setTitle("");
        setPrice("");
      } else {
        setMessage(`❌ Erreur: ${data.error || "Erreur inconnue"}`);
      }
    } catch (error: any) {
      setMessage(`❌ Erreur: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">📤 Ajouter un produit (simplifié)</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Publier le produit
          </button>
        </form>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>📌 Testez la publication de produits</p>
        </div>
      </div>
    </div>
  );
}
