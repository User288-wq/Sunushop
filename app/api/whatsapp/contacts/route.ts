import { NextResponse } from 'next/server';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'sunushop';

export async function GET() {
  try {
    // Utiliser le endpoint fetchInstances pour récupérer les infos
    const response = await fetch(
      `${EVOLUTION_API_URL}/instance/fetchInstances`,
      {
        headers: {
          apikey: EVOLUTION_API_KEY,
          'ngrok-skip-browser-warning': 'true',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const instances = await response.json();
    const instance = instances.find((i: any) => i.name === EVOLUTION_INSTANCE);

    // Construire une liste de contacts à partir des données disponibles
    const contacts = instance?._count?.Contact > 0 ? [
      {
        jid: instance.ownerJid || 'unknown@s.whatsapp.net',
        name: instance.profileName || 'Sunushop',
        pushName: instance.profileName || 'Sunushop',
      }
    ] : [];

    return NextResponse.json({
      success: true,
      contacts,
      count: contacts.length,
    });
  } catch (error: any) {
    console.error('Erreur contacts:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
