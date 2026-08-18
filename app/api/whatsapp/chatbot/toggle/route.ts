import { NextRequest, NextResponse } from 'next/server';

// Variable globale pour l'état (en mémoire)
let chatbotEnabled = process.env.USE_CHATBOT === 'true';

export async function POST(req: NextRequest) {
  try {
    const { enabled } = await req.json();
    chatbotEnabled = enabled;
    
    // En production, sauvegarder dans une base de données
    process.env.USE_CHATBOT = enabled ? 'true' : 'false';

    return NextResponse.json({
      success: true,
      enabled: chatbotEnabled,
      message: `Chatbot ${enabled ? 'activé' : 'désactivé'}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors du changement de statut' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    enabled: chatbotEnabled,
  });
}
