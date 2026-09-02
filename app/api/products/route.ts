// app/api/products/route.ts - Version mémoire
import { NextRequest, NextResponse } from "next/server";
import { productService, categories } from "@/lib/products/product-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const productId = searchParams.get("id");
    const action = searchParams.get("action");

    if (action === "categories") {
      return NextResponse.json({ success: true, categories });
    }

    if (action === "stats" && sellerId) {
      const stats = productService.getStats(sellerId);
      return NextResponse.json({ success: true, stats });
    }

    if (productId) {
      const product = productService.getProduct(productId);
      if (!product) {
        return NextResponse.json({ success: false, error: "Produit non trouvé" }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    let products = productService.getAllProducts();
    if (sellerId) {
      products = productService.getProductsBySeller(sellerId);
    }
    if (query) {
      products = productService.searchProducts(query, category || undefined);
    } else if (category) {
      products = products.filter((p) => p.category === category);
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
    const data = await req.json();
    const required = ["sellerId", "sellerName", "title", "description", "price", "category", "stock"];
    for (const field of required) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json({ error: `Champ manquant: ${field}` }, { status: 400 });
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
      unit: data.unit || "pièce",
      discount: data.discount ? parseFloat(data.discount) : undefined,
      tags: data.tags || [],
      isActive: data.isActive !== false,
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
