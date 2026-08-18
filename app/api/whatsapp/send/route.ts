import { NextRequest, NextResponse } from 'next/server';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'sunushop';

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json();

    console.log('[Send] URL:', EVOLUTION_API_URL);
    console.log('[Send] Key:', EVOLUTION_API_KEY ? 'Définie' : 'Manquante');
    console.log('[Send] Instance:', EVOLUTION_INSTANCE);
    console.log('[Send] To:', to);

    if (!to) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    let number = to.replace(/\D/g, '');
    if (!number.startsWith('221')) number = '221' + number;

    const statusRes = await fetch(
      `${EVOLUTION_API_URL}/instance/connectionState/${EVOLUTION_INSTANCE}`,
      {
        headers: {
          apikey: EVOLUTION_API_KEY,
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    if (!statusRes.ok) {
      return NextResponse.json(
        { error: 'Impossible de vérifier le statut' },
        { status: 500 }
      );
    }

    const status = await statusRes.json();
    if (status.instance?.state !== 'open') {
      return NextResponse.json(
        { error: `WhatsApp non connecté (state: ${status.instance?.state || 'inconnu'})` },
        { status: 503 }
      );
    }

    const response = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          apikey: EVOLUTION_API_KEY,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ number, text: message }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.response?.message || data?.message || 'Erreur inconnue' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
      data,
    });
  } catch (error: any) {
    console.error('[Send] Catch error:', error?.message || error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
