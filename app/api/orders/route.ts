import { NextRequest, NextResponse } from 'next/server';
import { commissionService } from '@/lib/commission/commission-service';

// Données mockées - remplacer par Firestore
let orders: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const { items, total, client, delivery } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    // Créer la commande
    const order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      client,
      delivery,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(order);

    // Créer les commissions pour chaque vendeur
    for (const item of items) {
      if (item.sellerId) {
        commissionService.createCommission(
          item.sellerId,
          `Vendeur ${item.sellerId}`,
          order.id,
          item.price * item.quantity,
          false,
          `Commission pour ${item.title}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('❌ Erreur création commande:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        return NextResponse.json(
          { error: 'Commande non trouvée' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
