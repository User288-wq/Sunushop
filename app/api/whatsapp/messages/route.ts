import { NextRequest, NextResponse } from 'next/server';
import { getAllMessages } from '@/lib/whatsapp/messages';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contact = searchParams.get('contact');
    const limit = parseInt(searchParams.get('limit') || '50');

    let messages;
    if (contact) {
      const { getMessagesByContact } = await import('@/lib/whatsapp/messages');
      messages = await getMessagesByContact(contact, limit);
    } else {
      messages = await getAllMessages(limit);
    }

    return NextResponse.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
