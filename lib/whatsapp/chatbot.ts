import OpenAI from 'openai';

// Initialiser OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Contexte du chatbot
const SYSTEM_PROMPT = `Tu es un assistant virtuel pour SunuShop, une boutique en ligne au Sénégal.
Tu es poli, professionnel et tu parles français.
Voici quelques informations importantes :
- SunuShop vend des produits variés (vêtements, accessoires, électronique)
- Les livraisons se font à Dakar et dans la région
- Les paiements acceptés : Orange Money, Wave, CinetPay, paiement à la livraison
- Le numéro de contact est +221 77 350 95 59

Règles :
- Réponds de manière courte et utile
- Si tu ne connais pas la réponse, propose de contacter le support
- Propose toujours une aide supplémentaire`;

// Historique des conversations
const conversationHistory: Record<string, { role: 'system' | 'user' | 'assistant'; content: string }[]> = {};

export async function getChatbotResponse(
  userMessage: string,
  userId: string
): Promise<string> {
  try {
    // Vérifier si la clé API est configurée
    if (!process.env.OPENAI_API_KEY) {
      return getFallbackResponse(userMessage);
    }

    // Initialiser l'historique de la conversation
    if (!conversationHistory[userId]) {
      conversationHistory[userId] = [
        { role: 'system', content: SYSTEM_PROMPT },
      ];
    }

    // Ajouter le message de l'utilisateur à l'historique
    conversationHistory[userId].push({ role: 'user', content: userMessage });

    // Garder seulement les 10 derniers messages pour éviter de dépasser la limite
    if (conversationHistory[userId].length > 11) {
      conversationHistory[userId] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory[userId].slice(-10),
      ];
    }

    // Appeler l'API OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversationHistory[userId],
      temperature: 0.7,
      max_tokens: 150,
    });

    const reply = completion.choices[0]?.message?.content || '';
    
    // Ajouter la réponse à l'historique
    conversationHistory[userId].push({ role: 'assistant', content: reply });

    return reply;
  } catch (error) {
    console.error('Erreur chatbot:', error);
    return getFallbackResponse(userMessage);
  }
}

// Réponses de fallback (sans IA)
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('combien')) {
    return '💰 Nos prix varient selon les produits. Visitez notre site https://www.sunu-shop.org pour voir tous nos prix !';
  }

  if (lowerMessage.includes('livraison') || lowerMessage.includes('delivery')) {
    return '🚚 Nous livrons à Dakar et dans la région sous 24-48h. Contactez-nous pour plus d\'infos !';
  }

  if (lowerMessage.includes('commande') || lowerMessage.includes('acheter') || lowerMessage.includes('produit')) {
    return '🛍️ Pour commander, visitez https://www.sunu-shop.org ou envoyez-nous votre liste !';
  }

  if (lowerMessage.includes('paiement') || lowerMessage.includes('payer')) {
    return '💳 Nous acceptons Orange Money, Wave, CinetPay et paiement à la livraison.';
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('téléphone') || lowerMessage.includes('appel')) {
    return '📞 Contactez-nous au +221 77 350 95 59 ou sur WhatsApp.';
  }

  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
    return '👋 Bonjour ! Bienvenue sur SunuShop. Comment puis-je vous aider aujourd\'hui ?';
  }

  if (lowerMessage.includes('merci')) {
    return '🙏 Merci à vous ! N\'hésitez pas à nous contacter si vous avez d\'autres questions.';
  }

  return '🤖 Je suis l\'assistant de SunuShop. Je peux vous aider avec les prix, les commandes, la livraison ou les paiements. Que puis-je faire pour vous ?';
}

// Fonction pour nettoyer l'historique (optionnel)
export function clearConversation(userId: string) {
  delete conversationHistory[userId];
}
