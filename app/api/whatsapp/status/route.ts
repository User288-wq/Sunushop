import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const messageSid = body.get('MessageSid');
    const messageStatus = body.get('MessageStatus');

    console.log(`📨 Statut du message ${messageSid} : ${messageStatus}`);

    // Ici tu pourras mettre à jour Firestore plus tard
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
