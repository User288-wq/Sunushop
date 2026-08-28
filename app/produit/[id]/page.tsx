"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  unit: string;
  discount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string || "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?id=${productId}`);
        const data = await response.json();

        if (response.ok && data.success && data.product) {
          setProduct(data.product);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Erreur chargement produit:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fonction pour ajouter au panier (simulée pour l'instant)
  const addToCart = () => {
    if (!product) return;
    alert(`🛒 ${product.title} ajouté au panier !`);
    // À connecter avec le vrai panier
  };

  // Fonction pour contacter le vendeur
  const contactSeller = () => {
    if (!product) return;
    // Ouvrir WhatsApp avec le numéro du vendeur (si disponible)
    const phone = product.sellerId?.replace("seller_", "") || "773509559";
    window.open(`https://wa.me/221${phone}?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20${encodeURIComponent(product.title)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Produit non trouvé</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/vendeur/produits"
              className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              📦 Voir mes produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galerie d'images */}
          <div className="card p-4">
            <div className="relative">
              <img
                src={images[currentImage] || product.images?.[0] || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <button
                    onClick={prevImage}
                    className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition"
                  >
                    ◀
                  </button>
                  <button
                    onClick={nextImage}
                    className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition"
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      index === currentImage ? "border-green-500" : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <img src={img} alt={`${product.title} - ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails du produit */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{product.title}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.category}</p>
              </div>
              {product.sellerName && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vendu par</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.sellerName}</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              {product.discount && product.discount > 0 ? (
                <div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {discountedPrice.toLocaleString()} FCFA
                  </span>
                  <span className="ml-3 text-sm text-gray-400 line-through">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  <span className="ml-2 inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                    -{product.discount}%
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {product.price.toLocaleString()} FCFA
                </p>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{product.description}</p>
            </div>

            {product.stock !== undefined && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Stock:</span>
                <span className={`text-sm font-medium ${product.stock > 5 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} ${product.unit || 'pièce'}(s)` : 'Rupture de stock'}
                </span>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={addToCart}
                disabled={!product.isActive || product.stock <= 0}
                className={`w-full px-4 py-3 rounded-lg text-white font-medium transition ${
                  !product.isActive || product.stock <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                🛒 {!product.isActive ? 'Produit inactif' : product.stock <= 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
              <button
                onClick={contactSeller}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                💬 Contacter le vendeur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

