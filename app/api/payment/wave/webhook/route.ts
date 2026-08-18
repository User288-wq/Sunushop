import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('💰 [Wave Webhook] Réception:', JSON.stringify(body, null, 2));

    const transactionId = body?.id || body?.transactionId;
    const status = body?.status;

    if (status === 'completed') {
      console.log(`✅ Paiement Wave ${transactionId} confirmé`);
      // Mettre à jour la commande
    } else if (status === 'failed') {
      console.log(`❌ Paiement Wave ${transactionId} échoué`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('❌ Erreur webhook Wave:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur de traitement' },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'wave-webhook',
    status: 'active',
    timestamp: new Date().toISOString(),
  });
}
