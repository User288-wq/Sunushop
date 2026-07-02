import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

export interface WhatsAppMessage {
  to: string;
  message: string;
}

export async function sendWhatsAppMessage({ to, message }: WhatsAppMessage) {
  let formattedNumber = to;
  if (!to.startsWith('+')) {
    formattedNumber = `+221${to.replace(/^0+/, '')}`;
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${formattedNumber}`,
      statusCallback: 'https://www.sunu-shop.org/api/whatsapp/status',
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
