import { NextRequest, NextResponse } from 'next/server';
import { commissionService } from '@/lib/commission/commission-service';

// ============================================================
// GET - Récupérer les commissions
// ============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const status = searchParams.get('status');
    const action = searchParams.get('action');

    // Stats
    if (action === 'stats') {
      const stats = commissionService.getStats(sellerId || undefined);
      return NextResponse.json({ success: true, stats });
    }

    // Commissions d'un vendeur
    if (sellerId) {
      const commissions = commissionService.getSellerCommissions(sellerId);
      return NextResponse.json({ success: true, commissions, count: commissions.length });
    }

    // Toutes les commissions (admin)
    const commissions = commissionService.getAllCommissions();
    return NextResponse.json({ success: true, commissions, count: commissions.length });
  } catch (error: any) {
    console.error('❌ Erreur commissions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST - Créer une commission
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const { sellerId, sellerName, orderId, orderAmount, isPremium, description } = await req.json();

    if (!sellerId || !orderId || !orderAmount) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const commission = commissionService.createCommission(
      sellerId,
      sellerName || `Vendeur ${sellerId}`,
      orderId,
      orderAmount,
      isPremium || false,
      description
    );

    return NextResponse.json({ success: true, commission });
  } catch (error: any) {
    console.error('❌ Erreur création commission:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT - Mettre à jour une commission
// ============================================================

export async function PUT(req: NextRequest) {
  try {
    const { commissionId, status } = await req.json();

    if (!commissionId || !status) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const commission = commissionService.updateStatus(commissionId, status);

    if (!commission) {
      return NextResponse.json(
        { success: false, error: 'Commission non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, commission });
  } catch (error: any) {
    console.error('❌ Erreur mise à jour commission:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
