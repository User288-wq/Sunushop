import { NextRequest, NextResponse } from 'next/server';
import { initWavePayment, initCinetPayPayment } from '@/lib/payment';

export async function POST(req: NextRequest) {
  try {
    const { method, orderId, amount, customerPhone, customerEmail, customerName } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/payment/status?commandeId=${orderId}`;
    const notifyUrl = `${baseUrl}/api/payment/webhook/cinetpay`;

    let paymentResult;
    if (method === 'wave') {
      paymentResult = await initWavePayment({
        amount,
        currency: 'XOF',
        orderId,
        customerPhone,
        customerEmail,
        customerName,
        description: `Paiement SunuShop commande ${orderId}`,
        returnUrl,
        notifyUrl,
      });
    } else if (method === 'orange_money') {
      paymentResult = await initCinetPayPayment({
        amount,
        currency: 'XOF',
        orderId,
        customerPhone,
        customerEmail,
        customerName,
        description: `Paiement SunuShop commande ${orderId}`,
        returnUrl,
        notifyUrl,
      });
    } else {
      return NextResponse.json({ error: 'Mode de paiement non supporté' }, { status: 400 });
    }

    if (paymentResult.success) {
      // Optionnel : sauvegarder paymentSessionId dans Firestore
      return NextResponse.json({ success: true, paymentUrl: paymentResult.paymentUrl });
    } else {
      return NextResponse.json({ error: paymentResult.error }, { status: 500 });
    }
  } catch (error) {
    console.error('API Payment Init Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
