// app/api/whatsapp/send/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp/meta-client';

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json();
    if (!to || !message) {
      return NextResponse.json({ error: 'Destinataire et message requis' }, { status: 400 });
    }
    const result = await sendWhatsAppMessage(to, message);
    return NextResponse.json({
      success: true,
      messageId: result.messages?.[0]?.id
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
