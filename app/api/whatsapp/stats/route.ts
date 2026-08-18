import { NextResponse } from 'next/server';

const EVOLUTION_URL = process.env.EVOLUTION_URL || process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_KEY = process.env.EVOLUTION_KEY || process.env.EVOLUTION_API_KEY || "429683C4C977415CAAFCCE10F7D57E11";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "sunushop";

export async function GET() {
  try {
    console.log("📊 Stats API - Récupération des statistiques...");

    // Récupérer les instances
    const instancesUrl = `${EVOLUTION_URL}/instance/fetchInstances`;
    const instancesRes = await fetch(instancesUrl, {
      headers: { apikey: EVOLUTION_KEY },
      cache: "no-store"
    });

    if (!instancesRes.ok) {
      throw new Error(`HTTP error! status: ${instancesRes.status}`);
    }

    const instances = await instancesRes.json();
    const instance = instances.find((i: any) => i.name === EVOLUTION_INSTANCE);

    if (!instance) {
      return NextResponse.json({
        success: false,
        error: "Instance non trouvée"
      }, { status: 404 });
    }

    // Récupérer les messages récents
    const messagesUrl = `${EVOLUTION_URL}/chat/messages/${EVOLUTION_INSTANCE}?limit=100`;
    const messagesRes = await fetch(messagesUrl, {
      headers: { apikey: EVOLUTION_KEY },
      cache: "no-store"
    });

    let messages = [];
    if (messagesRes.ok) {
      messages = await messagesRes.json();
    }

    // Récupérer les contacts
    const contactsUrl = `${EVOLUTION_URL}/chat/contacts/${EVOLUTION_INSTANCE}`;
    const contactsRes = await fetch(contactsUrl, {
      headers: { apikey: EVOLUTION_KEY },
      cache: "no-store"
    });

    let contacts = [];
    if (contactsRes.ok) {
      contacts = await contactsRes.json();
    }

    // Statistiques
    const totalMessages = instance._count?.Message || 0;
    const totalContacts = instance._count?.Contact || 0;
    const totalChats = instance._count?.Chat || 0;

    // Messages par jour (derniers 7 jours)
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const messagesByDay = last7Days.map(date => {
      const count = messages.filter((msg: any) => {
        const msgDate = new Date(msg.messageTimestamp * 1000).toISOString().split('T')[0];
        return msgDate === date;
      }).length;
      return { date, count };
    });

    // Messages par heure
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const messagesByHour = hours.map(hour => {
      const count = messages.filter((msg: any) => {
        const msgHour = new Date(msg.messageTimestamp * 1000).getHours();
        return msgHour === hour;
      }).length;
      return { hour, count };
    });

    return NextResponse.json({
      success: true,
      data: {
        instance: {
          name: instance.name,
          status: instance.connectionStatus,
          profileName: instance.profileName,
          ownerJid: instance.ownerJid,
        },
        stats: {
          totalMessages,
          totalContacts,
          totalChats,
          messagesByDay,
          messagesByHour,
        },
        recentMessages: messages.slice(0, 10).map((msg: any) => ({
          id: msg.key?.id,
          from: msg.key?.remoteJid,
          text: msg.message?.conversation || msg.message?.extendedTextMessage?.text || '',
          timestamp: msg.messageTimestamp,
          fromMe: msg.key?.fromMe,
        })),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur stats:", error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
