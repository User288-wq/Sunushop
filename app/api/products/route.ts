import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/products/product-service';

// ============================================================
// GET - Récupérer les produits
// ============================================================

export async function GET(req: NextRequest) {
  console.log("📤 [API GET] Début de la récupération des produits");

  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const productId = searchParams.get('id');
    const action = searchParams.get('action');

    // Catégories
    if (action === 'categories') {
      console.log("📋 [API GET] Récupération des catégories");
      return NextResponse.json({
        success: true,
        categories: productService.getCategories(),
      });
    }

    // Statistiques
    if (action === 'stats' && sellerId) {
      console.log(`📊 [API GET] Statistiques pour ${sellerId}`);
      const stats = productService.getStats(sellerId);
      return NextResponse.json({ success: true, stats });
    }

    // Produit spécifique
    if (productId) {
      console.log(`🔍 [API GET] Recherche du produit ${productId}`);
      const product = productService.getProduct(productId);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Produit non trouvé' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    // Recherche
    let products = productService.getAllProducts();
    console.log(`📦 [API GET] Total produits: ${products.length}`);

    if (sellerId) {
      products = productService.getProductsBySeller(sellerId);
      console.log(`📦 [API GET] Produits pour ${sellerId}: ${products.length}`);
    }
    if (query) {
      products = productService.searchProducts(query, category || undefined);
      console.log(`🔍 [API GET] Résultats de recherche: ${products.length}`);
    } else if (category) {
      products = products.filter(p => p.category === category);
      console.log(`📂 [API GET] Produits dans la catégorie ${category}: ${products.length}`);
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error: any) {
    console.error("❌ [API GET] Erreur:", error.message);
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
  console.log("📤 [API POST] Début de la création d'un produit");

  try {
    const data = await req.json();
    console.log("📦 [API POST] Données reçues:", JSON.stringify(data, null, 2));

    const required = ['sellerId', 'sellerName', 'title', 'description', 'price', 'category', 'stock'];
    for (const field of required) {
      if (!data[field] && data[field] !== 0) {
        console.log(`❌ [API POST] Champ manquant: ${field}`);
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

    console.log(`✅ [API POST] Produit créé avec succès: ${product.id} - ${product.title}`);
    console.log("📦 [API POST] Produit:", JSON.stringify(product, null, 2));

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error("❌ [API POST] Erreur:", error.message);
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
