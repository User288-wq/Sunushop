// lib/whatsapp/meta-client.ts
export async function sendWhatsAppMessage(to: string, message: string) {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error('Meta WhatsApp non configuré');
  }

  let formattedNumber = to;
  if (!to.startsWith('+')) {
    formattedNumber = `+221${to.replace(/^0+/, '')}`;
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formattedNumber,
      type: 'text',
      text: { body: message }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Erreur Meta WhatsApp:', data);
    throw new Error(data.error?.message || 'Erreur lors de l\'envoi');
  }

  return data;
}
