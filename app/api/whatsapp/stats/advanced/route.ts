import { NextResponse } from 'next/server';

const EVOLUTION_URL = process.env.EVOLUTION_URL || process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_KEY = process.env.EVOLUTION_KEY || process.env.EVOLUTION_API_KEY || "429683C4C977415CAAFCCE10F7D57E11";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "sunushop";

export async function GET() {
  try {
    console.log("📊 Stats avancées - Récupération...");

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

    // Récupérer les messages (essayer plusieurs endpoints si nécessaire)
    let messages = [];
    try {
      const messagesUrl = `${EVOLUTION_URL}/chat/messages/${EVOLUTION_INSTANCE}?limit=500`;
      const messagesRes = await fetch(messagesUrl, {
        headers: { apikey: EVOLUTION_KEY },
        cache: "no-store"
      });
      if (messagesRes.ok) {
        messages = await messagesRes.json();
      }
    } catch (error) {
      console.log("⚠️ Messages non disponibles");
    }

    // Récupérer les contacts
    let contacts = [];
    try {
      const contactsUrl = `${EVOLUTION_URL}/chat/contacts/${EVOLUTION_INSTANCE}`;
      const contactsRes = await fetch(contactsUrl, {
        headers: { apikey: EVOLUTION_KEY },
        cache: "no-store"
      });
      if (contactsRes.ok) {
        contacts = await contactsRes.json();
      }
    } catch (error) {
      console.log("⚠️ Contacts non disponibles");
    }

    // Statistiques avancées
    const totalMessages = instance._count?.Message || 0;
    const totalContacts = instance._count?.Contact || 0;
    const totalChats = instance._count?.Chat || 0;

    // Messages par jour (30 jours)
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const messagesByDay30 = last30Days.map(date => {
      const count = messages.filter((msg: any) => {
        const ts = msg.messageTimestamp || msg.timestamp;
        if (!ts) return false;
        const msgDate = new Date(ts * 1000).toISOString().split('T')[0];
        return msgDate === date;
      }).length;
      return { date, count };
    });

    // Messages par jour de la semaine
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const messagesByDayOfWeek = Array.from({ length: 7 }, (_, i) => ({
      day: dayNames[i],
      count: 0
    }));

    messages.forEach((msg: any) => {
      const ts = msg.messageTimestamp || msg.timestamp;
      if (ts) {
        const day = new Date(ts * 1000).getDay();
        messagesByDayOfWeek[day].count++;
      }
    });

    // Messages par heure (24h)
    const messagesByHour = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0
    }));

    messages.forEach((msg: any) => {
      const ts = msg.messageTimestamp || msg.timestamp;
      if (ts) {
        const hour = new Date(ts * 1000).getHours();
        messagesByHour[hour].count++;
      }
    });

    // Répartition des messages (envoyés vs reçus)
    let sentCount = 0;
    let receivedCount = 0;
    messages.forEach((msg: any) => {
      if (msg.key?.fromMe || msg.fromMe) {
        sentCount++;
      } else {
        receivedCount++;
      }
    });

    // Top 5 contacts
    const contactMap = new Map<string, number>();
    messages.forEach((msg: any) => {
      const jid = msg.key?.remoteJid || msg.remoteJid || msg.from;
      if (jid && !jid.includes('@g.us')) {
        contactMap.set(jid, (contactMap.get(jid) || 0) + 1);
      }
    });

    const topContacts = Array.from(contactMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([jid, count]) => ({
        jid: jid.replace('@s.whatsapp.net', ''),
        name: contacts.find((c: any) => c.jid === jid)?.pushName || jid.replace('@s.whatsapp.net', ''),
        count
      }));

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
          sentCount,
          receivedCount,
        },
        charts: {
          messagesByDay: messagesByDay30,
          messagesByDayOfWeek,
          messagesByHour,
          topContacts,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur stats avancées:", error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
