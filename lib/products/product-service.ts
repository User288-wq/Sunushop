// ============================================================
// 📦 SERVICE DE GESTION DES PRODUITS
// ============================================================

export interface Product {
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
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Catégories disponibles
export const categories: ProductCategory[] = [
  { id: "mode", name: "Mode", icon: "👗", color: "#ec4899" },
  { id: "electronique", name: "Électronique", icon: "💻", color: "#3b82f6" },
  { id: "cosmetiques", name: "Cosmétiques", icon: "💄", color: "#f472b6" },
  { id: "chaussures", name: "Chaussures", icon: "👟", color: "#f59e0b" },
  { id: "alimentation", name: "Alimentation", icon: "🍲", color: "#22c55e" },
  { id: "maison", name: "Maison & Déco", icon: "🏠", color: "#8b5cf6" },
  { id: "sport", name: "Sport", icon: "🏋️", color: "#ef4444" },
  { id: "livres", name: "Livres", icon: "📚", color: "#f97316" },
  { id: "bijoux", name: "Bijoux", icon: "💎", color: "#f43f5e" },
  { id: "mobilier", name: "Mobilier", icon: "🪑", color: "#14b8a6" },
  { id: "informatique", name: "Informatique", icon: "🖥️", color: "#6366f1" },
  { id: "audio", name: "Audio & Photo", icon: "📷", color: "#8b5cf6" },
];

// Stockage en mémoire (à remplacer par Firestore)
let products: Product[] = [];
let nextId = 1;

class ProductService {
  // ============================================================
  // CRUD Produits
  // ============================================================

  createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const product: Product = {
      ...data,
      id: `PROD-${String(nextId++).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: data.isActive ?? true,
    };
    products.push(product);
    console.log(`📦 Produit créé: ${product.title} par ${product.sellerName}`);
    return product;
  }

  getProduct(id: string): Product | null {
    return products.find(p => p.id === id) || null;
  }

  getProductsBySeller(sellerId: string): Product[] {
    return products.filter(p => p.sellerId === sellerId);
  }

  getAllProducts(): Product[] {
    return products;
  }

  updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'sellerId' | 'createdAt'>>): Product | null {
    const product = products.find(p => p.id === id);
    if (!product) return null;
    Object.assign(product, data, { updatedAt: new Date() });
    console.log(`📦 Produit mis à jour: ${product.title}`);
    return product;
  }

  deleteProduct(id: string): boolean {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    console.log(`📦 Produit supprimé: ${id}`);
    return true;
  }

  // ============================================================
  // Recherche et filtres
  // ============================================================

  searchProducts(query: string, category?: string): Product[] {
    let result = products;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (category) {
      result = result.filter(p => p.category === category);
    }
    return result;
  }

  // ============================================================
  // Utilitaires
  // ============================================================

  getCategories(): ProductCategory[] {
    return categories;
  }

  getCategoryById(id: string): ProductCategory | undefined {
    return categories.find(c => c.id === id);
  }

  // ============================================================
  // Statistiques
  // ============================================================

  getStats(sellerId?: string): {
    total: number;
    outOfStock: number;
    lowStock: number;
    totalValue: number;
  } {
    const sellerProducts = sellerId ? this.getProductsBySeller(sellerId) : products;
    return {
      total: sellerProducts.length,
      outOfStock: sellerProducts.filter(p => p.stock <= 0).length,
      lowStock: sellerProducts.filter(p => p.stock > 0 && p.stock <= 5).length,
      totalValue: sellerProducts.reduce((sum, p) => sum + (p.price * p.stock), 0),
    };
  }
}

export const productService = new ProductService();
