import { NextRequest, NextResponse } from 'next/server';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'sunushop';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contact = searchParams.get('contact');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Utiliser le bon endpoint /chat/messages/{instanceName}
    let messagesUrl = `${EVOLUTION_API_URL}/chat/messages/${EVOLUTION_INSTANCE}`;
    
    // Ajouter les paramètres
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (contact) {
      params.append('remoteJid', contact);
    }
    messagesUrl += `?${params.toString()}`;

    console.log('[Chat] URL:', messagesUrl);

    const response = await fetch(messagesUrl, {
      headers: {
        apikey: EVOLUTION_API_KEY,
        'ngrok-skip-browser-warning': 'true',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[Chat] Erreur HTTP:', response.status);
      // Si l'endpoint n'existe pas, retourner un tableau vide
      if (response.status === 404) {
        return NextResponse.json({
          success: true,
          messages: [],
          count: 0,
          message: 'Aucun message trouvé'
        });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const messages = await response.json();

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
    });
  } catch (error: any) {
    console.error('[Chat] Erreur:', error.message);
    // Retourner un tableau vide en cas d'erreur
    return NextResponse.json({
      success: true,
      messages: [],
      count: 0,
      error: error.message
    });
  }
}
