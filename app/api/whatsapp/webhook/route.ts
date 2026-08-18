import { NextRequest, NextResponse } from 'next/server';
import { saveWhatsAppMessage } from '@/lib/whatsapp/messages';
import { findAutoReply } from '@/lib/whatsapp/auto-reply';
import { getChatbotResponse } from '@/lib/whatsapp/chatbot';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'sunushop';
const USE_CHATBOT = process.env.USE_CHATBOT === 'true';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'whatsapp-webhook',
    status: 'active',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('[Webhook] 📨 Message reçu:', JSON.stringify(body, null, 2));

    const jid = body?.data?.key?.remoteJid || body?.remoteJid || '';
    if (typeof jid === 'string' && jid.endsWith('@g.us')) {
      console.log('[Webhook] 📨 Message de groupe ignoré');
      return NextResponse.json({ received: true, skipped: 'group' });
    }

    const event = String(body?.event || body?.type || '');
    const data = body?.data || body;

    if (event.includes('MESSAGES_UPSERT') || event.includes('messages.upsert')) {
      const text =
        data?.message?.conversation ??
        data?.message?.extendedTextMessage?.text ??
        data?.message?.imageMessage?.caption ??
        null;

      const fromMe = Boolean(data?.key?.fromMe);
      const senderJid = data?.key?.remoteJid || '';
      const messageId = data?.key?.id || '';
      const messageType = data?.messageType || 'conversation';

      console.log('[Webhook] 📨 Message:', {
        from: senderJid,
        fromMe,
        text: text?.slice(0, 100),
        event,
        messageId,
      });

      // Sauvegarder le message
      if (text && senderJid) {
        await saveWhatsAppMessage({
          senderJid,
          text: text,
          fromMe,
          messageType,
          messageId,
          status: fromMe ? 'sent' : 'delivered',
          timestamp: new Date(),
        });
      }

      // 🤖 RÉPONSE AUTOMATIQUE - uniquement pour les messages entrants
      if (!fromMe && text) {
        let reply: string | null = null;

        // 1. Essayer d'abord les règles prédéfinies
        reply = findAutoReply(text);
        console.log('[Webhook] 🤖 Règle trouvée:', reply ? 'Oui' : 'Non');

        // 2. Si pas de règle, utiliser le chatbot IA
        if (!reply && USE_CHATBOT) {
          console.log('[Webhook] 🤖 Utilisation du chatbot IA...');
          const userId = senderJid.replace('@s.whatsapp.net', '');
          reply = await getChatbotResponse(text, userId);
          console.log('[Webhook] 🤖 Réponse IA:', reply);
        }

        // 3. Si toujours pas de réponse, utiliser le fallback
        if (!reply) {
          reply = "🤖 Je suis l'assistant de SunuShop. Je peux vous aider avec les prix, les commandes, la livraison ou les paiements. Que puis-je faire pour vous ?";
        }

        // Envoyer la réponse
        if (reply) {
          try {
            const response = await fetch(
              `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
              {
                method: 'POST',
                headers: {
                  apikey: EVOLUTION_API_KEY,
                  'Content-Type': 'application/json',
                  'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                  number: senderJid.replace('@s.whatsapp.net', ''),
                  text: reply,
                }),
              }
            );

            if (response.ok) {
              const result = await response.json();
              console.log('[Webhook] 🤖 Réponse envoyée avec succès:', result);
            } else {
              console.error('[Webhook] ❌ Erreur envoi réponse:', response.status);
            }
          } catch (error) {
            console.error('[Webhook] ❌ Erreur réseau:', error);
          }
        }
      }

    } else if (event.includes('MESSAGES_UPDATE') || event.includes('messages.update')) {
      console.log('[Webhook] 📨 Mise à jour message:', {
        status: data?.status,
        jid: data?.key?.remoteJid,
      });

    } else if (event.includes('CONNECTION_UPDATE')) {
      console.log('[Webhook] 📨 Connexion mise à jour:', {
        state: data?.state,
        instance: data?.instance,
      });

    } else {
      console.log('[Webhook] 📨 Événement non géré:', event);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('[Webhook] ❌ Erreur:', error?.message || error);
    return NextResponse.json(
      { received: false, error: 'handler_error' },
      { status: 200 }
    );
  }
}
