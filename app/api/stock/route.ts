import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/lib/stock/stock-service';

// ============================================================
// GET - Récupérer les stocks
// ============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const action = searchParams.get('action');
    const productId = searchParams.get('productId');
    const query = searchParams.get('query');

    // Recherche
    if (query) {
      const products = stockService.searchProducts(query, sellerId || undefined);
      return NextResponse.json({ success: true, products, count: products.length });
    }

    // Alertes
    if (action === 'alerts') {
      const alerts = stockService.getAlerts(sellerId || undefined);
      return NextResponse.json({ success: true, alerts, count: alerts.length });
    }

    // Statistiques
    if (action === 'stats') {
      const stats = stockService.getStats(sellerId || undefined);
      return NextResponse.json({ success: true, stats });
    }

    // Mouvements récents
    if (action === 'movements') {
      const movements = stockService.getRecentMovements(50);
      return NextResponse.json({ success: true, movements, count: movements.length });
    }

    // Produit spécifique
    if (productId) {
      const product = stockService.getProduct(productId);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Produit non trouvé' }, { status: 404 });
      }
      const movements = stockService.getProductMovements(productId);
      return NextResponse.json({ success: true, product, movements });
    }

    // Tous les produits
    const products = sellerId
      ? stockService.getSellerProducts(sellerId)
      : stockService.getAllProducts();

    return NextResponse.json({ success: true, products, count: products.length });
  } catch (error: any) {
    console.error('❌ Erreur stock:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST - Créer un produit
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const { sellerId, productName, category, quantity, minQuantity, price, unit } = await req.json();

    if (!sellerId || !productName || quantity === undefined || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const product = stockService.createProduct(sellerId, {
      productName,
      category: category || 'Général',
      quantity,
      minQuantity: minQuantity || 5,
      price,
      unit: unit || 'pièce',
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('❌ Erreur création produit:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT - Mettre à jour un produit
// ============================================================

export async function PUT(req: NextRequest) {
  try {
    const { productId, ...data } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'ID produit requis' },
        { status: 400 }
      );
    }

    const product = stockService.updateProduct(productId, data);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('❌ Erreur mise à jour produit:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE - Supprimer un produit
// ============================================================

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'ID produit requis' },
        { status: 400 }
      );
    }

    const result = stockService.deleteProduct(productId);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Produit supprimé' });
  } catch (error: any) {
    console.error('❌ Erreur suppression produit:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
