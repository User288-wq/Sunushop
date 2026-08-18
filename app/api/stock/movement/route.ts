import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/lib/stock/stock-service';

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity, type, description, userId } = await req.json();

    if (!productId || quantity === undefined || !type || !userId) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const movement = stockService.addMovement(
      productId,
      quantity,
      type,
      description || `${type} de stock`,
      userId
    );

    if (!movement) {
      return NextResponse.json(
        { success: false, error: 'Stock insuffisant ou produit non trouvé' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, movement });
  } catch (error: any) {
    console.error('❌ Erreur mouvement stock:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
