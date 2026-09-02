// lib/products/product-service.ts - Version mémoire (sans Firebase)
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
}

export const categories = [
  { id: "mode", name: "Mode", icon: "👗" },
  { id: "electronique", name: "Électronique", icon: "💻" },
  { id: "cosmetiques", name: "Cosmétiques", icon: "💄" },
  { id: "chaussures", name: "Chaussures", icon: "👟" },
  { id: "alimentation", name: "Alimentation", icon: "🍲" },
  { id: "maison", name: "Maison & Déco", icon: "🏠" },
  { id: "sport", name: "Sport", icon: "🏋️" },
  { id: "livres", name: "Livres", icon: "📚" },
  { id: "bijoux", name: "Bijoux", icon: "💎" },
  { id: "mobilier", name: "Mobilier", icon: "🪑" },
  { id: "informatique", name: "Informatique", icon: "🖥️" },
];

let products: Product[] = [];
let nextId = 1;

class ProductService {
  createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const product: Product = {
      ...data,
      id: `PROD-${String(nextId++).padStart(3, "0")}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: data.isActive ?? true,
    };
    products.push(product);
    console.log(`📦 Produit créé: ${product.title}`);
    return product;
  }

  getProduct(id: string): Product | null {
    return products.find((p) => p.id === id) || null;
  }

  getProductsBySeller(sellerId: string): Product[] {
    return products.filter((p) => p.sellerId === sellerId);
  }

  getAllProducts(): Product[] {
    return products;
  }

  updateProduct(id: string, data: Partial<Omit<Product, "id" | "sellerId" | "createdAt">>): Product | null {
    const product = products.find((p) => p.id === id);
    if (!product) return null;
    Object.assign(product, data, { updatedAt: new Date() });
    return product;
  }

  deleteProduct(id: string): boolean {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  }

  searchProducts(query: string, category?: string): Product[] {
    let result = products;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category) {
      result = result.filter((p) => p.category === category);
    }
    return result;
  }

  getStats(sellerId?: string): { total: number; outOfStock: number; lowStock: number; totalValue: number } {
    const sellerProducts = sellerId ? this.getProductsBySeller(sellerId) : products;
    return {
      total: sellerProducts.length,
      outOfStock: sellerProducts.filter((p) => p.stock <= 0).length,
      lowStock: sellerProducts.filter((p) => p.stock > 0 && p.stock <= 5).length,
      totalValue: sellerProducts.reduce((sum, p) => sum + p.price * p.stock, 0),
    };
  }
}

export const productService = new ProductService();
