import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp/client';

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json();
    if (!to || !message) {
      return NextResponse.json({ error: 'Destinataire et message requis' }, { status: 400 });
    }
    const result = await sendWhatsAppMessage({ to, message });
    if (result.success) {
      return NextResponse.json({ success: true, sid: result.sid });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
