import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || "429683C4C977415CAAFCCE10F7D57E11";
const INSTANCE = process.env.EVOLUTION_INSTANCE || "sunushop";

// Anti-spam mémoire
const lastReplyAt = new Map<string, number>();
const REPLY_COOLDOWN_MS = 60000;

function extractText(message: any): string {
  if (!message) return "";
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    ""
  );
}

function jidToNumber(jid: string): string {
  return String(jid || "")
    .replace("@s.whatsapp.net", "")
    .replace(/@lid$/, "")
    .replace(/\D/g, "");
}

async function sendText(number: string, text: string) {
  const url = EVOLUTION_URL + "/message/sendText/" + INSTANCE;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: EVOLUTION_KEY,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ number, text }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("[auto-reply] send failed", res.status, data);
    return null;
  }
  return data;
}

function buildReply(name: string, incoming: string): string {
  const lower = incoming.toLowerCase().trim();
  const site = "www.sunu-shop.org";

  if (lower.includes("prix") || lower.includes("tarif")) {
    return "Bonjour " + name + " ! Pour les tarifs SunuShop, precisez le produit ou visitez https://" + site;
  }
  if (lower.includes("bonjour") || lower.includes("salut") || lower.includes("hi")) {
    return "Bonjour " + name + " ! Bienvenue sur SunuShop (" + site + "). Comment pouvons-nous vous aider ?";
  }
  if (lower.includes("commande") || lower.includes("order")) {
    return "Bonjour " + name + " ! Pour suivre une commande, indiquez le numero. Consultez https://" + site + "/suivi";
  }
  if (lower.includes("catalogue")) {
    return "Bonjour " + name + " ! Découvrez notre catalogue sur https://" + site + "/catalogue";
  }
  if (lower.includes("contact") || lower.includes("adresse")) {
    return "Bonjour " + name + " ! Contact: +221 78 014 30 70 | Site: https://" + site;
  }

  return "Bonjour " + name + " ! Message bien recu sur SunuShop (" + site + "). Un conseiller vous repondra bientot.";
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "whatsapp-webhook" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = String(body.event || "");
    const data = body.data ?? {};

    // === DEBUG: Vue d'ensemble ===
    console.log("[webhook] 📨 keys=", Object.keys(body));
    console.log("[webhook] 🏷️ event=", event);
    console.log("[webhook] 📦 instance=", body.instance);

    // === DEBUG: Payload complet (dev uniquement) ===
    console.log("[webhook] 📄 FULL=", JSON.stringify(body, null, 2));

    // === DEBUG: Structure ciblée ===
    if (event.includes("upsert") || event === "MESSAGES_UPSERT") {
      console.log("[webhook] 🔍 UPSERT:", {
        fromMe: data.key?.fromMe,
        remoteJid: data.key?.remoteJid,
        pushName: data.pushName,
        messageType: data.messageType,
        messageKeys: data.message ? Object.keys(data.message) : [],
        text:
          data.message?.conversation ||
          data.message?.extendedTextMessage?.text ||
          null,
      });
    }

    if (event.includes("update") || event === "MESSAGES_UPDATE") {
      console.log("[webhook] 🔄 UPDATE:", {
        keyId: data.keyId,
        remoteJid: data.remoteJid,
        fromMe: data.fromMe,
        status: data.status,
      });
    }

    if (event.includes("send") || event === "SEND_MESSAGE") {
      console.log("[webhook] 📤 SEND:", {
        to: data.key?.remoteJid,
        fromMe: data.key?.fromMe,
        status: data.status,
        messageType: data.messageType,
      });
    }

    if (event.includes("connection") || event === "CONNECTION_UPDATE") {
      console.log("[webhook] 🔌 CONNECTION:", {
        state: data.state,
        info: data.info,
      });
    }

    // === TRAITEMENT ===
    if (event === "messages.upsert" || event === "MESSAGES_UPSERT") {
      const key = data.key || {};
      const fromMe = Boolean(key.fromMe);
      const remoteJid = String(key.remoteJid || "");

      if (remoteJid.endsWith("@g.us")) {
        return NextResponse.json({ received: true, skipped: "group" });
      }

      const text = extractText(data.message);
      const name = data.pushName || "Client";
      const number = jidToNumber(remoteJid);

      if (!fromMe && text && number) {
        console.log("[IN]", name, number, text);

        const now = Date.now();
        const last = lastReplyAt.get(number) || 0;
        if (now - last >= REPLY_COOLDOWN_MS) {
          lastReplyAt.set(number, now);
          const reply = buildReply(name, text);
          await sendText(number, reply);
          console.log("[AUTO-REPLY]", number, reply);
        } else {
          console.log("[AUTO-REPLY] cooldown", number);
        }
      } else if (fromMe) {
        console.log("[OUT]", number, text);
      }
    }

    if (event === "messages.update" || event === "MESSAGES_UPDATE") {
      console.log("[STATUS]", data.status, data.remoteJid || data.keyId);
    }

    if (event === "send.message" || event === "SEND_MESSAGE") {
      console.log("[SEND]", data.status, data.key?.remoteJid);
    }

    if (event === "connection.update" || event === "CONNECTION_UPDATE") {
      console.log("[CONN]", data.state || data);
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[webhook] ❌ ERROR:", e);
    return NextResponse.json({ received: false }, { status: 200 });
  }
}
