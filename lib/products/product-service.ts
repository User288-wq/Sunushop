// lib/products/product-service.ts
import { getDb } from '@/lib/firebase-admin';

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

function cleanData(data: any): any {
  const clean: any = {};
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      clean[key] = data[key];
    }
  }
  return clean;
}

class ProductService {
  private get collection() {
    return getDb().collection('products');
  }

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const product = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: data.isActive ?? true,
    };
    
    // Nettoyer les données (supprimer undefined)
    const cleanProduct = cleanData(product);
    
    const docRef = await this.collection.add(cleanProduct);
    return { ...cleanProduct, id: docRef.id } as Product;
  }

  async getProduct(id: string): Promise<Product | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Product;
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    const snapshot = await this.collection.where('sellerId', '==', sellerId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }

  async getAllProducts(): Promise<Product[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }

  async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'sellerId' | 'createdAt'>>): Promise<Product | null> {
    const cleanData = cleanData({ ...data, updatedAt: new Date() });
    await this.collection.doc(id).update(cleanData);
    return this.getProduct(id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch {
      return false;
    }
  }

  async searchProducts(query: string, category?: string): Promise<Product[]> {
    let products = await this.getAllProducts();
    if (query) {
      const q = query.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (category) {
      products = products.filter(p => p.category === category);
    }
    return products;
  }

  async getStats(sellerId?: string): Promise<{ total: number; outOfStock: number; lowStock: number; totalValue: number }> {
    const products = sellerId ? await this.getProductsBySeller(sellerId) : await this.getAllProducts();
    return {
      total: products.length,
      outOfStock: products.filter(p => p.stock <= 0).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    };
  }
}

export const productService = new ProductService();
