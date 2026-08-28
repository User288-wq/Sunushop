"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  images: string[];
  description: string;
  productUrl: string;
  category: string;
  sellerName?: string;
}

const mockProducts: Product[] = [
  {
    id: "PROD-001",
    title: "Sac à dos tendance",
    price: 15000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=400&fit=crop",
    ],
    description: "Sac à dos en cuir haut de gamme. Parfait pour le travail ou les loisirs.",
    productUrl: "https://www.sunu-shop.org/produit/sac-a-dos",
    category: "Mode",
    sellerName: "Moussa Guéye",
  },
  {
    id: "PROD-002",
    title: "Chaussures de sport",
    price: 25000,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
    ],
    description: "Chaussures de sport Nike Air Max. Confort et style au quotidien.",
    productUrl: "https://www.sunu-shop.org/produit/chaussures",
    category: "Mode",
    sellerName: "Moussa Guéye",
  },
  {
    id: "PROD-003",
    title: "Ordinateur Dell XPS",
    price: 450000,
    imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    ],
    description: "Ordinateur Dell XPS 15. Performance et élégance pour les professionnels.",
    productUrl: "https://www.sunu-shop.org/produit/ordinateur",
    category: "Électronique",
    sellerName: "Moussa Guéye",
  },
];

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string || "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    const found = mockProducts.find(p => p.id === productId);
    setProduct(found || null);
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Produit non trouvé</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Le produit que vous recherchez n'existe pas.</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-4">
            <img
              src={product.images[0] || product.imageUrl}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="card p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{product.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.category}</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-4">
              {product.price.toLocaleString()} FCFA
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4">{product.description}</p>
            <div className="mt-6 flex flex-col gap-3">
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                🛒 Ajouter au panier
              </button>
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                💬 Contacter le vendeur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
