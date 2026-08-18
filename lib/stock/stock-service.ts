// ============================================================
// 📦 GESTION DES STOCKS
// ============================================================

export interface ProductStock {
  id: string;
  sellerId: string;
  productName: string;
  category: string;
  quantity: number;
  minQuantity: number; // Seuil d'alerte
  price: number;
  unit: string; // pièce, kg, litre, etc.
  createdAt: Date;
  updatedAt: Date;
  lastRestock?: Date;
}

export interface StockAlert {
  productId: string;
  productName: string;
  currentQuantity: number;
  minQuantity: number;
  sellerId: string;
  type: 'low' | 'critical' | 'out';
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  quantity: number; // Positif = entrée, Négatif = sortie
  type: 'restock' | 'sale' | 'adjustment' | 'return' | 'damaged';
  description: string;
  date: Date;
  userId: string;
}

// Stock en mémoire (remplacer par Firestore)
let stocks: ProductStock[] = [];
let movements: StockMovement[] = [];

class StockService {
  // ============================================================
  // CRUD Produits
  // ============================================================

  createProduct(sellerId: string, productData: Omit<ProductStock, 'id' | 'sellerId' | 'createdAt' | 'updatedAt'>): ProductStock {
    const product: ProductStock = {
      id: `STK-${Date.now()}`,
      sellerId,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    stocks.push(product);
    console.log(`📦 Produit créé: ${product.productName} (${product.quantity} ${product.unit})`);

    return product;
  }

  getProduct(id: string): ProductStock | null {
    return stocks.find(p => p.id === id) || null;
  }

  getSellerProducts(sellerId: string): ProductStock[] {
    return stocks.filter(p => p.sellerId === sellerId);
  }

  getAllProducts(): ProductStock[] {
    return stocks;
  }

  updateProduct(id: string, data: Partial<Omit<ProductStock, 'id' | 'sellerId' | 'createdAt'>>): ProductStock | null {
    const product = stocks.find(p => p.id === id);
    if (!product) return null;

    Object.assign(product, data);
    product.updatedAt = new Date();

    console.log(`📦 Produit mis à jour: ${product.productName}`);
    return product;
  }

  deleteProduct(id: string): boolean {
    const index = stocks.findIndex(p => p.id === id);
    if (index === -1) return false;

    stocks.splice(index, 1);
    console.log(`📦 Produit supprimé: ${id}`);
    return true;
  }

  // ============================================================
  // Mouvements de stock
  // ============================================================

  addMovement(productId: string, quantity: number, type: StockMovement['type'], description: string, userId: string): StockMovement | null {
    const product = stocks.find(p => p.id === productId);
    if (!product) return null;

    // Vérifier si on a assez de stock pour une sortie
    if (quantity < 0 && product.quantity + quantity < 0) {
      console.log(`❌ Stock insuffisant pour ${product.productName}`);
      return null;
    }

    // Mettre à jour la quantité
    product.quantity += quantity;
    product.updatedAt = new Date();

    // Créer le mouvement
    const movement: StockMovement = {
      id: `MOV-${Date.now()}`,
      productId,
      productName: product.productName,
      quantity,
      type,
      description,
      date: new Date(),
      userId,
    };

    movements.push(movement);
    console.log(`📦 Mouvement: ${quantity > 0 ? '+' : ''}${quantity} ${product.unit} de ${product.productName}`);

    // Vérifier les alertes
    this.checkAlerts(product);

    return movement;
  }

  // ============================================================
  // Alertes de stock
  // ============================================================

  getAlerts(sellerId?: string): StockAlert[] {
    const alerts: StockAlert[] = [];
    const products = sellerId ? this.getSellerProducts(sellerId) : stocks;

    for (const product of products) {
      if (product.quantity <= 0) {
        alerts.push({
          productId: product.id,
          productName: product.productName,
          currentQuantity: product.quantity,
          minQuantity: product.minQuantity,
          sellerId: product.sellerId,
          type: 'out',
        });
      } else if (product.quantity <= product.minQuantity) {
        alerts.push({
          productId: product.id,
          productName: product.productName,
          currentQuantity: product.quantity,
          minQuantity: product.minQuantity,
          sellerId: product.sellerId,
          type: product.quantity <= product.minQuantity / 2 ? 'critical' : 'low',
        });
      }
    }

    return alerts;
  }

  private checkAlerts(product: ProductStock): void {
    const alerts = this.getAlerts(product.sellerId);
    const alert = alerts.find(a => a.productId === product.id);

    if (alert) {
      console.log(`⚠️ ALERTE STOCK: ${product.productName} (${product.quantity} ${product.unit})`);
    }
  }

  // ============================================================
  // Statistiques
  // ============================================================

  getStats(sellerId?: string): {
    totalProducts: number;
    totalValue: number;
    lowStock: number;
    outOfStock: number;
  } {
    const products = sellerId ? this.getSellerProducts(sellerId) : stocks;

    return {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.quantity * p.price), 0),
      lowStock: products.filter(p => p.quantity > 0 && p.quantity <= p.minQuantity).length,
      outOfStock: products.filter(p => p.quantity <= 0).length,
    };
  }

  // ============================================================
  // Recherche
  // ============================================================

  searchProducts(query: string, sellerId?: string): ProductStock[] {
    const products = sellerId ? this.getSellerProducts(sellerId) : stocks;
    const lowerQuery = query.toLowerCase();

    return products.filter(p =>
      p.productName.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }

  // ============================================================
  // Mouvements récents
  // ============================================================

  getRecentMovements(limit: number = 50): StockMovement[] {
    return movements.slice(-limit).reverse();
  }

  getProductMovements(productId: string): StockMovement[] {
    return movements.filter(m => m.productId === productId);
  }
}

export const stockService = new StockService();
