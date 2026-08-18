import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger/logger';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'sunushop';

export async function GET() {
  try {
    logger.info(`Vérification du statut WhatsApp pour ${EVOLUTION_INSTANCE}`, { instance: EVOLUTION_INSTANCE }, 'WhatsAppStatus');

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
      logger.warn(`Erreur statut WhatsApp: ${response.status}`, { status: response.status }, 'WhatsAppStatus');
      return NextResponse.json(
        { error: 'Impossible de récupérer le statut' },
        { status: 500 }
      );
    }

    const data = await response.json();
    logger.info(`Statut WhatsApp: ${data.instance?.state}`, { state: data.instance?.state }, 'WhatsAppStatus');
    
    return NextResponse.json({
      success: true,
      status: data.instance?.state || 'unknown',
      instance: data.instance?.instanceName,
      data,
    });
  } catch (error: any) {
    logger.error(`Erreur statut WhatsApp: ${error.message}`, { error: error.message, stack: error.stack }, 'WhatsAppStatus');
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
