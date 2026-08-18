import { NextRequest, NextResponse } from 'next/server';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'sunushop';

export async function POST(req: NextRequest) {
  try {
    const { to, mediaType, media, caption } = await req.json();

    if (!to) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis' },
        { status: 400 }
      );
    }

    if (!media || !mediaType) {
      return NextResponse.json(
        { error: 'Fichier et type requis' },
        { status: 400 }
      );
    }

    let number = to.replace(/\D/g, '');
    if (!number.startsWith('221')) number = '221' + number;

    // Vérifier le statut
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

    // Construire le payload selon le type de média
    let endpoint = '';
    let payload: any = { number };

    switch (mediaType) {
      case 'image':
        endpoint = '/message/sendImage';
        payload.image = media;
        if (caption) payload.caption = caption;
        break;
      case 'pdf':
        endpoint = '/message/sendDocument';
        payload.document = media;
        payload.filename = 'document.pdf';
        if (caption) payload.caption = caption;
        break;
      case 'audio':
        endpoint = '/message/sendAudio';
        payload.audio = media;
        break;
      default:
        return NextResponse.json(
          { error: 'Type de média non supporté' },
          { status: 400 }
        );
    }

    // Envoyer le média
    const response = await fetch(
      `${EVOLUTION_API_URL}${endpoint}/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          apikey: EVOLUTION_API_KEY,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(payload),
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
      message: 'Média envoyé avec succès',
      data,
    });
  } catch (error: any) {
    console.error('Erreur envoi média:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
