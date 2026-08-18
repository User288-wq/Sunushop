import { NextResponse } from 'next/server';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'sunushop';

export async function GET() {
  try {
    console.log('[Status] URL:', EVOLUTION_API_URL);
    console.log('[Status] Key:', EVOLUTION_API_KEY ? 'Définie' : 'Manquante');
    console.log('[Status] Instance:', EVOLUTION_INSTANCE);

    const response = await fetch(
      `${EVOLUTION_API_URL}/instance/connectionState/${EVOLUTION_INSTANCE}`,
      {
        headers: {
          apikey: EVOLUTION_API_KEY,
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    if (!response.ok) {
      console.log('[Status] Response not OK:', response.status);
      return NextResponse.json(
        { error: 'Impossible de récupérer le statut' },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('[Status] Success:', data);
    return NextResponse.json({
      success: true,
      status: data.instance?.state || 'unknown',
      instance: data.instance?.instanceName,
      data,
    });
  } catch (error: any) {
    console.error('[Status] Catch error:', error?.message || error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
