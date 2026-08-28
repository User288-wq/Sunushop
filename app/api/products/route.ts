import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/products/product-service';

// ============================================================
// GET - Récupérer les produits
// ============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const productId = searchParams.get('id');
    const action = searchParams.get('action');

    // Catégories
    if (action === 'categories') {
      return NextResponse.json({
        success: true,
        categories: productService.getCategories(),
      });
    }

    // Statistiques
    if (action === 'stats' && sellerId) {
      const stats = productService.getStats(sellerId);
      return NextResponse.json({ success: true, stats });
    }

    // Produit spécifique
    if (productId) {
      const product = productService.getProduct(productId);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Produit non trouvé' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    // Recherche
    let products = productService.getAllProducts();
    if (sellerId) {
      products = productService.getProductsBySeller(sellerId);
    }
    if (query) {
      products = productService.searchProducts(query, category || undefined);
    } else if (category) {
      products = products.filter(p => p.category === category);
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST - Créer un produit
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const required = ['sellerId', 'sellerName', 'title', 'description', 'price', 'category', 'stock'];
    for (const field of required) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { error: `Champ manquant: ${field}` },
          { status: 400 }
        );
      }
    }

    const product = productService.createProduct({
      sellerId: data.sellerId,
      sellerName: data.sellerName,
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      images: data.images || [],
      stock: parseInt(data.stock),
      unit: data.unit || 'pièce',
      discount: data.discount ? parseFloat(data.discount) : undefined,
      tags: data.tags || [],
      weight: data.weight ? parseFloat(data.weight) : undefined,
      dimensions: data.dimensions,
      isActive: data.isActive !== false,
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT - Mettre à jour un produit
// ============================================================

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'ID produit requis' },
        { status: 400 }
      );
    }

    const product = productService.updateProduct(id, updates);
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID produit requis' },
        { status: 400 }
      );
    }

    const result = productService.deleteProduct(id);
    if (!result) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
