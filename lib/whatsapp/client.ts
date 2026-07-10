import twilio from 'twilio';

let clientInstance: any = null;
let fromNumber: string | undefined = process.env.TWILIO_WHATSAPP_NUMBER;

function getClient() {
  if (!clientInstance) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !accountSid.startsWith('AC')) {
      console.warn('⚠️ Twilio non configuré (Account SID manquant ou invalide)');
      return null;
    }
    if (!authToken) {
      console.warn('⚠️ Twilio non configuré (Auth Token manquant)');
      return null;
    }
    
    clientInstance = twilio(accountSid, authToken);
  }
  return clientInstance;
}

export interface WhatsAppMessage {
  to: string;
  message: string;
}

export async function sendWhatsAppMessage({ to, message }: WhatsAppMessage) {
  const client = getClient();
  if (!client) {
    console.warn('⚠️ WhatsApp non envoyé: Twilio non configuré');
    return { success: false, error: 'Twilio non configuré' };
  }

  let formattedNumber = to;
  if (!to.startsWith('+')) {
    formattedNumber = `+221${to.replace(/^0+/, '')}`;
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${formattedNumber}`,
      statusCallback: process.env.NEXT_PUBLIC_BASE_URL 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/whatsapp/status` 
        : undefined,
    });
    console.log(`✅ WhatsApp envoyé à ${to}: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('❌ Erreur WhatsApp:', error);
    return { success: false, error };
  }
}

export const templates = {
  confirmationCommande: (clientName: string, numero: string, total: number, lienSuivi: string) => `
✅ *Commande confirmée* ${clientName} !

Bonjour ${clientName},

Votre commande #${numero} d'un montant de *${total.toLocaleString()} FCFA* a bien été enregistrée.

📦 *Récapitulatif* :
➜ Montant: ${total.toLocaleString()} FCFA
➜ Livraison: 24-48h à Dakar

🔗 *Suivez votre commande ici* : ${lienSuivi}

Merci d'avoir choisi SunuShop 🇸🇳
  `,
};
