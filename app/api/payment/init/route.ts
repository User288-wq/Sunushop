import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, phoneNumber, method, orderId, description } = await req.json();

    if (!amount || !phoneNumber || !method) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Simuler un paiement (à remplacer par une vraie intégration)
    const transactionId = `${method.toUpperCase()}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        transactionId,
        reference: `${method.toUpperCase()}_REF_${Date.now()}`,
        paymentUrl: `https://sandbox.${method}.com/pay/${Date.now()}`,
        message: `Paiement ${method} initié (sandbox)`,
        status: 'pending',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
