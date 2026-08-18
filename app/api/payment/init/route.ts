import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payment/payment-service';

export async function POST(req: NextRequest) {
  try {
    const { amount, phoneNumber, method, orderId, description } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 });
    }

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Numéro de téléphone requis' }, { status: 400 });
    }

    if (!method) {
      return NextResponse.json({ error: 'Méthode de paiement requise' }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json({ error: 'ID de commande requis' }, { status: 400 });
    }

    const result = await paymentService.initiatePayment({
      amount,
      phoneNumber,
      method,
      orderId,
      description: description || `Commande #${orderId}`,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Erreur de paiement' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('❌ Erreur paiement:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
