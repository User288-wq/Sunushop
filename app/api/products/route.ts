// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { productService, categories } from '@/lib/products/product-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const productId = searchParams.get('id');
    const action = searchParams.get('action');

    if (action === 'categories') {
      return NextResponse.json({ success: true, categories });
    }
    if (action === 'stats' && sellerId) {
      const stats = await productService.getStats(sellerId);
      return NextResponse.json({ success: true, stats });
    }
    if (productId) {
      const product = await productService.getProduct(productId);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Produit non trouvé' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    let products = await productService.getAllProducts();
    if (sellerId) {
      products = await productService.getProductsBySeller(sellerId);
    }
    if (query) {
      products = await productService.searchProducts(query, category || undefined);
    } else if (category) {
      products = products.filter(p => p.category === category);
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // === DEBUG : on regarde exactement ce qui arrive ===
    const rawBody = await req.text();
    console.log('===== RAW BODY =====');
    console.log(rawBody);
    console.log('===== END RAW BODY =====');

    if (!rawBody || rawBody.trim() === '') {
      return NextResponse.json({ error: 'Body vide' }, { status: 400 });
    }

    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseError: any) {
      return NextResponse.json({
        error: 'JSON invalide',
        details: parseError.message,
        rawBodyReceived: rawBody.substring(0, 200) // on renvoie les 200 premiers caractères
      }, { status: 400 });
    }

    // Validation basique
    const required = ['sellerId', 'sellerName', 'title', 'price', 'category', 'stock'];
    for (const field of required) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        return NextResponse.json({ error: `Champ manquant: ${field}` }, { status: 400 });
      }
    }

    const product = await productService.createProduct({
      sellerId: data.sellerId,
      sellerName: data.sellerName,
      title: data.title,
      description: data.description || '',
      price: Number(data.price),
      category: data.category,
      images: Array.isArray(data.images) ? data.images : [],
      stock: Number(data.stock),
      unit: data.unit || 'pièce',
      discount: data.discount ? Number(data.discount) : 0,
      tags: Array.isArray(data.tags) ? data.tags : [],
      isActive: data.isActive !== false,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
