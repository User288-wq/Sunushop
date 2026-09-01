"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Seller {
  sellerId: string;
  sellerName: string;
  productCount: number;
  totalRevenue: number;
  rating?: number;
  joinedDate: string;
}

export default function VendeursPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        
        if (data.success) {
          // Grouper les produits par vendeur
          const sellerMap = new Map<string, Seller>();
          data.products.forEach((p: any) => {
            if (!sellerMap.has(p.sellerId)) {
              sellerMap.set(p.sellerId, {
                sellerId: p.sellerId,
                sellerName: p.sellerName || p.sellerId,
                productCount: 0,
                totalRevenue: 0,
                joinedDate: new Date().toISOString().split("T")[0]
              });
            }
            const seller = sellerMap.get(p.sellerId)!;
            seller.productCount++;
          });
          setSellers(Array.from(sellerMap.values()));
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          🏪 Vendeurs SunuShop
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {sellers.length} vendeurs proposent leurs produits
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <div key={seller.sellerId} className="card p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                  {seller.sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {seller.sellerName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    📦 {seller.productCount} produits
                  </p>
                  <p className="text-sm text-gray-400">
                    Membre depuis {seller.joinedDate}
                  </p>
                </div>
              </div>
              <Link
                href={`/vendre?sellerId=${seller.sellerId}`}
                className="mt-4 block text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Voir ses produits
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
