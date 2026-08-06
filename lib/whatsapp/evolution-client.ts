const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'sunushop';

export type SendResult = {
  ok: boolean;
  data?: any;
  error?: string;
  code?: string;
};

export async function sendEvolutionMessage(
  to: string,
  text: string
): Promise<SendResult> {
  try {
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
      return {
        ok: false,
        error: 'Impossible de vérifier le statut',
        code: 'STATUS_ERROR',
      };
    }

    const status = await statusRes.json();
    if (status.instance?.state !== 'open') {
      return {
        ok: false,
        error: `WhatsApp non connecté (state: ${status.instance?.state || 'inconnu'})`,
        code: 'NOT_CONNECTED',
      };
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
        body: JSON.stringify({ number, text }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message = data?.response?.message || data?.message || 'Erreur inconnue';
      
      if (message.includes('Connection Closed')) {
        return { ok: false, error: 'Session WhatsApp fermée', code: 'CONNECTION_CLOSED' };
      }
      if (message.includes('exists') && message.includes('false')) {
        return { ok: false, error: 'Numéro WhatsApp invalide', code: 'INVALID_NUMBER' };
      }
      
      return { ok: false, error: message, code: 'SEND_ERROR' };
    }

    return { ok: true, data };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || 'Erreur réseau',
      code: 'NETWORK_ERROR',
    };
  }
}

export async function getWhatsAppStatus() {
  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/instance/connectionState/${EVOLUTION_INSTANCE}`,
      {
        headers: {
          apikey: EVOLUTION_API_KEY,
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
    
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function getWhatsAppNumbers(numbers: string[]) {
  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/chat/whatsappNumbers/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          apikey: EVOLUTION_API_KEY,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ numbers }),
      }
    );
    
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
