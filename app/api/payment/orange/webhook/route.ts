import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📱 [Orange Webhook] Réception:', JSON.stringify(body, null, 2));

    // Extraire les données
    const transactionId = body?.id || body?.transactionId || body?.reference;
    const status = body?.status || body?.state;
    const amount = body?.amount;
    const phoneNumber = body?.phoneNumber;

    // Vérifier le statut du paiement
    if (status === 'completed' || status === 'SUCCESS') {
      console.log(`✅ Paiement Orange Money ${transactionId} confirmé`);
      // Ici, mettre à jour la commande dans Firestore
    } else if (status === 'failed' || status === 'ERROR') {
      console.log(`❌ Paiement Orange Money ${transactionId} échoué`);
      // Ici, notifier l'échec
    }

    // Toujours retourner 200 pour éviter les retries agressifs
    return NextResponse.json({
      success: true,
      received: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Erreur webhook Orange:', error);
    // Toujours 200 pour éviter les retries
    return NextResponse.json(
      { success: false, error: 'Erreur de traitement' },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'orange-money-webhook',
    status: 'active',
    timestamp: new Date().toISOString(),
  });
}
