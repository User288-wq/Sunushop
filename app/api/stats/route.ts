import { NextResponse } from 'next/server';
import { productService } from '@/lib/products/product-service';

export async function GET() {
  try {
    const products = productService.getAllProducts();
    
    // Statistiques globales
    const stats = {
      totalProducts: products.length,
      totalSellers: new Set(products.map(p => p.sellerId)).size,
      totalCategories: new Set(products.map(p => p.category)).size,
      averagePrice: products.reduce((sum, p) => sum + p.price, 0) / (products.length || 1),
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
      categories: {} as Record<string, number>,
      priceRange: {
        min: products.length > 0 ? Math.min(...products.map(p => p.price)) : 0,
        max: products.length > 0 ? Math.max(...products.map(p => p.price)) : 0,
      }
    };

    products.forEach(p => {
      stats.categories[p.category] = (stats.categories[p.category] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
