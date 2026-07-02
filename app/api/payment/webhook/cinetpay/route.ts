import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transaction_id, cpm_trans_id, status } = body;
    if (status === 'PAID' || status === 'ACCEPTED') {
      // Mettre à jour la commande dans Firestore
      // await db.collection('commandes').doc(transaction_id).update({ paymentStatus: 'PAID' });
      console.log(`✅ Paiement confirmé pour la commande ${transaction_id}`);
    } else {
      console.log(`❌ Paiement échoué pour la commande ${transaction_id}: ${status}`);
    }
    return NextResponse.json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
