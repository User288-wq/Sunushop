import { NextRequest, NextResponse } from 'next/server';
import { pushService } from '@/lib/push/push-service';

export async function POST(req: NextRequest) {
  try {
    const { subscription, endpoint } = await req.json();

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription requise' },
        { status: 400 }
      );
    }

    // Sauvegarder la subscription
    pushService.saveSubscription(subscription);

    return NextResponse.json({
      success: true,
      message: 'Abonnement enregistré',
      count: pushService.getSubscriptions().length,
    });
  } catch (error: any) {
    console.error('❌ Erreur enregistrement push:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint requis' },
        { status: 400 }
      );
    }

    pushService.removeSubscription(endpoint);

    return NextResponse.json({
      success: true,
      message: 'Désabonnement réussi',
    });
  } catch (error: any) {
    console.error('❌ Erreur désabonnement push:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
